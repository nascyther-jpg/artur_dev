import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import { Raycaster, Vector2, Vector3, type PerspectiveCamera } from "three"

import { EYE_HEIGHT, floorBaseY, PLAYER_RADIUS } from "@/data/building"
import { floors } from "@/data/floors"
import { experienceStore } from "@/lib/experience/experienceStore"
import { input, readMoveIntent } from "@/lib/input/input"
import { interactFocused } from "@/lib/interaction/interact"
import { interactionStore } from "@/lib/interaction/interactionStore"
import { findInteractiveId, getInteractiveObjects } from "@/lib/interaction/registry"
import { damp, dampAngle, lerpAngle } from "@/lib/math/easing"
import { resolveCollisions } from "@/lib/physics/colliders"

import { elevator, isInsideCar } from "../Elevator/elevatorController"
import { useQuality } from "../shared/QualityContext"
import { anglesTo, player } from "./player"

const REACH = 3.2
const MOUSE_SENSITIVITY = 0.0022
const TOUCH_SENSITIVITY = 0.0055
const WALK_SPEED = 2.8
const RUN_SPEED = 4.6
const PITCH_LIMIT = 1.3
const EXTERIOR_FOCUS = new Vector3(0, 9, 0)
const SCREEN_CENTER = new Vector2(0, 0)

function useLookInput() {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    const canvas = gl.domElement
    let touchId: number | null = null
    let lastX = 0
    let lastY = 0

    const onLockChange = () => experienceStore.set({ pointerLocked: document.pointerLockElement === canvas })
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      input.lookDeltaX += event.movementX
      input.lookDeltaY += event.movementY
    }
    const onMouseDown = (event: MouseEvent) => {
      if (document.pointerLockElement === canvas && event.button === 0) interactFocused()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || touchId !== null) return
      touchId = event.pointerId
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== touchId) return
      const scale = TOUCH_SENSITIVITY / MOUSE_SENSITIVITY
      input.lookDeltaX += (event.clientX - lastX) * scale
      input.lookDeltaY += (event.clientY - lastY) * scale
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId === touchId) touchId = null
    }
    const onWheel = (event: WheelEvent) => {
      if (!interactionStore.get().active) input.wheel += event.deltaY
    }

    document.addEventListener("pointerlockchange", onLockChange)
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    canvas.addEventListener("wheel", onWheel, { passive: true })
    return () => {
      document.removeEventListener("pointerlockchange", onLockChange)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mousedown", onMouseDown)
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
      canvas.removeEventListener("wheel", onWheel)
    }
  }, [gl])
}

/** Applies user input or scripted motion to the camera, resolves collisions and picks the focused object. */
export function PlayerController() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const aspect = useThree((state) => state.size.width / state.size.height)
  const quality = useQuality()
  const raycaster = useMemo(() => {
    const instance = new Raycaster()
    instance.far = REACH
    return instance
  }, [])
  const frame = useRef(0)
  const bobPhase = useRef(0)
  const next = useMemo(() => ({ x: 0, z: 0 }), [])

  useLookInput()

  useEffect(() => {
    camera.rotation.order = "YXZ"
  }, [camera])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const experience = experienceStore.get()
    const ui = interactionStore.get()
    let moving = 0

    if (experience.phase === "loading" || experience.phase === "ready") {
      // Slow establishing shot of the building while loading / waiting for "Entrar".
      const t = state.clock.elapsedTime
      player.position.set(Math.sin(t * 0.05) * 5, 4.2 + Math.sin(t * 0.08) * 0.4, 25 + Math.cos(t * 0.05) * 1.5)
      const look = anglesTo(player.position, EXTERIOR_FOCUS)
      player.yaw = player.targetYaw = look.yaw
      player.pitch = player.targetPitch = look.pitch
    } else if (player.script) {
      const script = player.script
      script.elapsed += delta
      const progress = Math.min(1, script.elapsed / script.duration)
      const eased = script.ease(progress)
      player.position.lerpVectors(script.from, script.to, eased)
      player.yaw = player.targetYaw = lerpAngle(script.fromLook.yaw, script.toLook.yaw, eased)
      player.pitch = player.targetPitch = script.fromLook.pitch + (script.toLook.pitch - script.fromLook.pitch) * eased
      if (progress === 1) {
        player.script = null
        script.resolve()
      }
    } else {
      const canLook = experience.phase === "explore" && !ui.active
      if (canLook) {
        player.targetYaw -= input.lookDeltaX * MOUSE_SENSITIVITY
        player.targetPitch = Math.max(
          -PITCH_LIMIT,
          Math.min(PITCH_LIMIT, player.targetPitch - input.lookDeltaY * MOUSE_SENSITIVITY),
        )
      }
      player.yaw = dampAngle(player.yaw, player.targetYaw, 22, delta)
      player.pitch = damp(player.pitch, player.targetPitch, 22, delta)

      const canMove = canLook && experience.elevatorPhase === "open" && !experience.touring
      const intent = canMove ? readMoveIntent() : { x: 0, y: 0, sprint: false }
      const speed = intent.sprint ? RUN_SPEED : WALK_SPEED
      const sin = Math.sin(player.yaw)
      const cos = Math.cos(player.yaw)
      const targetX = (-sin * intent.y + cos * intent.x) * speed
      const targetZ = (-cos * intent.y - sin * intent.x) * speed
      const accelerating = Math.abs(intent.x) + Math.abs(intent.y) > 0.01
      const lambda = accelerating ? 9 : 7
      player.velocity.x = damp(player.velocity.x, targetX, lambda, delta)
      player.velocity.z = damp(player.velocity.z, targetZ, lambda, delta)

      next.x = player.position.x + player.velocity.x * delta
      next.z = player.position.z + player.velocity.z * delta
      resolveCollisions(experience.floorIndex, next, PLAYER_RADIUS)
      moving = Math.hypot(next.x - player.position.x, next.z - player.position.z) / Math.max(delta, 1e-4)
      player.position.x = next.x
      player.position.z = next.z
      player.position.y =
        (experience.elevatorPhase === "moving" ? elevator.carY : floorBaseY(experience.floorIndex)) + EYE_HEIGHT
    }
    input.lookDeltaX = 0
    input.lookDeltaY = 0

    if (input.wheel !== 0) {
      player.zoom = Math.max(0, Math.min(20, player.zoom - input.wheel * 0.02))
      input.wheel = 0
    }

    // Subtle head bob only while actually walking.
    let bob = 0
    if (quality.headBob && moving > 0.4) {
      bobPhase.current += delta * moving * 2.4
      bob = Math.sin(bobPhase.current) * 0.018
    }
    camera.position.set(player.position.x, player.position.y + bob, player.position.z)
    camera.rotation.set(player.pitch, player.yaw, 0)

    const baseFov = aspect < 0.8 ? 74 : 62
    const focusZoom = ui.active ? 8 : 0
    const targetFov = baseFov - player.zoom - focusZoom
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = damp(camera.fov, targetFov, 6, delta)
      camera.updateProjectionMatrix()
    }
    camera.updateMatrixWorld()

    if (experience.phase !== "explore") return
    frame.current++
    if (frame.current % 3 === 0) {
      raycaster.setFromCamera(SCREEN_CENTER, camera)
      const hit = raycaster.intersectObjects(getInteractiveObjects(experience.floorIndex), true)[0]
      const focusedId = hit ? findInteractiveId(hit.object) : null
      if (focusedId !== ui.focusedId) interactionStore.set({ focusedId })
    }
    if (frame.current % 6 === 0) {
      const { x, z } = player.position
      const inElevator = isInsideCar(x, z)
      const area = floors[experience.floorIndex].areas.find(
        ({ bounds: [minX, maxX, minZ, maxZ] }) => x >= minX && x <= maxX && z >= minZ && z <= maxZ,
      )
      experienceStore.set({ inElevator, area: area?.id ?? null })
    }
  })

  return null
}
