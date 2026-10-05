import { useProgress } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"

import { EYE_HEIGHT } from "@/data/building"
import { prefersReducedMotion } from "@/lib/accessibility/reducedMotion"
import { audioEngine } from "@/lib/audio/audioEngine"
import { registerCommands } from "@/lib/experience/commands"
import { experienceStore, reportLoad } from "@/lib/experience/experienceStore"
import { easeInOutCubic } from "@/lib/math/easing"

import { Building } from "./Building/Building"
import { Exterior } from "./Building/Exterior"
import { moveTo, placePlayer } from "./Camera/player"
import { PlayerController } from "./Camera/PlayerController"
import { startTour, stopTour } from "./Camera/tour"
import { Elevator } from "./Elevator/Elevator"
import { requestTravel } from "./Elevator/elevatorController"
import { FloorLighting } from "./Lighting/FloorLighting"

const LOBBY_ENTRY = new Vector3(0, EYE_HEIGHT, 3.8)

if (import.meta.env.DEV) {
  // Debug handles for manual/automated testing; stripped from production builds.
  void Promise.all([import("./Camera/player"), import("@/lib/interaction/interactionStore")]).then(
    ([{ player }, { interactionStore }]) => Object.assign(window, { __player: player, __experience: experienceStore, __interaction: interactionStore }),
  )
}

/** Exposes scene actions to the DOM UI through the command bus. */
function CommandBridge({ isTouch }: { isTouch: boolean }) {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    const requestPointerLock = () => {
      if (isTouch || document.pointerLockElement) return
      try {
        void Promise.resolve(gl.domElement.requestPointerLock()).catch(() => undefined)
      } catch {
        // Pointer lock unavailable (iframe sandbox, old browser): mouse clicks still work.
      }
    }

    const enter = () => {
      const { phase, soundOn } = experienceStore.get()
      if (phase !== "ready") return
      audioEngine.setEnabled(soundOn)
      experienceStore.set({ phase: "intro" })
      requestPointerLock()
      const look = { yaw: 0, pitch: -0.03 }
      if (prefersReducedMotion()) {
        placePlayer(LOBBY_ENTRY, look)
        experienceStore.set({ phase: "explore" })
        return
      }
      void moveTo(LOBBY_ENTRY, look, 3.8, easeInOutCubic).then(() => experienceStore.set({ phase: "explore" }))
    }

    return registerCommands({
      travelTo: (floorIndex) => void requestTravel(floorIndex),
      startTour: () => void startTour(),
      stopTour,
      enter,
      requestPointerLock,
    })
  }, [gl, isTouch])

  return null
}

/** Reports real loading milestones: GLTF progress (if any), shader compilation, first frames. */
function LoadReporter() {
  const { active, progress } = useProgress()
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const frames = useRef(0)

  useEffect(() => {
    if (active) reportLoad(0.6 + (progress / 100) * 0.15, { pt: "Carregando modelos", en: "Loading models" })
  }, [active, progress])

  useEffect(() => {
    reportLoad(0.78, { pt: "Compilando materiais", en: "Compiling materials" })
    try {
      gl.compile(scene, camera)
    } catch (error) {
      console.warn("Shader precompilation failed", error)
    }
  }, [gl, scene, camera])

  useFrame(() => {
    if (frames.current > 5) return
    frames.current++
    if (frames.current === 2) reportLoad(0.9, { pt: "Acendendo as luzes", en: "Turning on the lights" })
    if (frames.current === 5) reportLoad(1, { pt: "Pronto", en: "Ready" })
  })

  return null
}

export function Scene({ isTouch }: { isTouch: boolean }) {
  return (
    <>
      <Exterior />
      <Building />
      <Elevator />
      <FloorLighting />
      <PlayerController />
      <CommandBridge isTouch={isTouch} />
      <LoadReporter />
    </>
  )
}
