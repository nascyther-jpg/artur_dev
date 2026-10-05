import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Color, type Group, type Mesh, type PointLight } from "three"

import { ELEVATOR } from "@/data/building"
import { floors } from "@/data/floors"
import { experienceStore } from "@/lib/experience/experienceStore"
import { localized, t } from "@/lib/i18n/language"
import { ANY_FLOOR } from "@/lib/interaction/registry"
import { easeInOutSine } from "@/lib/math/easing"

import { InteractiveObject } from "../InteractiveObject/InteractiveObject"
import { FONT_SANS, useCanvasTexture } from "../shared/canvasTexture"
import { materials, unitBox } from "../shared/materials"
import { Block } from "../shared/primitives"
import { elevator, requestTravel, tickElevator } from "./elevatorController"

const { shaft, door, carCenter } = ELEVATOR
const CX = carCenter.x
const CZ = carCenter.z
const INNER = 2.3
const HEIGHT = 2.5
const FRONT_Z = shaft.maxZ - 0.1
const DOOR_HALF = (door.maxX - door.minX) / 2
const DOOR_CENTER = (door.minX + door.maxX) / 2

// Panel on the right wall: rows top→bottom, two columns.
const PANEL = { x: CX + INNER / 2 - 0.015, y: 1.3, z: FRONT_Z - 0.45 }
const buttonSlot = (index: number) => {
  const rows = Math.ceil(floors.length / 2)
  const row = rows - 1 - Math.floor(index / 2)
  const column = index % 2
  return { y: PANEL.y - 0.2 + row * 0.16, z: PANEL.z + (column === 0 ? 0.06 : -0.06) }
}

// Built once so the buttons keep stable definitions.
const BUTTON_TITLES = floors.map((floor) =>
  localized((language) => `${{ pt: "Andar", en: "Floor" }[language]} ${floor.number[language]} · ${floor.title[language]}`),
)

const unlitButton = materials.steel
const litButton = materials.warmBulb

function ButtonPanel() {
  const target = experienceStore.use((state) => state.targetFloorIndex)
  const labels = useCanvasTexture(
    128,
    256,
    (context, width, height) => {
      context.fillStyle = "#1b1c1f"
      context.fillRect(0, 0, width, height)
      context.fillStyle = "#cfcac1"
      context.font = `600 20px ${FONT_SANS}`
      context.textAlign = "center"
      floors.forEach((floor, index) => {
        const slot = buttonSlot(index)
        // Map world offsets on the panel (0.3 × 0.6 m, canvas x = world +Z) to pixels; label sits above its button.
        const u = 0.5 + (slot.z - PANEL.z) / 0.3
        const v = 0.5 - (slot.y - PANEL.y) / 0.6
        context.fillText(t(floor.number), u * width, v * height - 20)
      })
    },
    "elevator-panel",
  )

  return (
    <group>
      <mesh position={[PANEL.x, PANEL.y, PANEL.z]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 0.6]} />
        <meshStandardMaterial map={labels} roughness={0.5} metalness={0.4} />
      </mesh>
      {floors.map((floor, index) => {
        const slot = buttonSlot(index)
        return (
          <InteractiveObject
            key={floor.id}
            id={`elevator-${floor.id}`}
            title={BUTTON_TITLES[index]}
            category="navigation"
            interactionType="reaction"
            floorIndex={ANY_FLOOR}
            clickDistance={3}
            markerOffset={[-0.06, 0, 0]}
            position={[PANEL.x - 0.012, slot.y, slot.z]}
            onInteract={() => void requestTravel(index)}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} material={index === target ? litButton : unlitButton}>
              <cylinderGeometry args={[0.028, 0.028, 0.02, 20]} />
            </mesh>
          </InteractiveObject>
        )
      })}
    </group>
  )
}

/** The car: moves between floors with the camera inside, doors synced with the landing doors. */
export function Elevator() {
  const car = useRef<Group>(null)
  const light = useRef<PointLight>(null)
  const leftDoor = useRef<Mesh>(null)
  const rightDoor = useRef<Mesh>(null)
  const colors = useMemo(() => ({ base: new Color("#f4efe6"), travel: new Color() }), [])

  useFrame((_, delta) => {
    tickElevator(Math.min(delta, 0.05))
    if (car.current) car.current.position.y = elevator.carY

    const offset = easeInOutSine(elevator.doorOpen) * DOOR_HALF * 0.96
    if (leftDoor.current) leftDoor.current.position.x = DOOR_CENTER - DOOR_HALF / 2 - offset
    if (rightDoor.current) rightDoor.current.position.x = DOOR_CENTER + DOOR_HALF / 2 + offset

    const lamp = light.current
    if (!lamp) return
    const state = experienceStore.get()
    if (state.elevatorPhase === "moving") {
      const progress = Math.min(1, elevator.elapsed / elevator.duration)
      colors.travel.set(floors[state.targetFloorIndex].lighting.ambient.color)
      lamp.color.copy(colors.base).lerp(colors.travel, progress)
      lamp.intensity = 2.2 * (0.55 + 0.45 * Math.abs(Math.cos(progress * Math.PI)))
    } else {
      lamp.color.lerp(colors.base, 0.05)
      lamp.intensity = 2.2
    }
  })

  const wallY = HEIGHT / 2
  const sideDepth = INNER + 0.1
  return (
    <group ref={car}>
      <Block position={[CX, -0.03, CZ]} size={[INNER + 0.1, 0.08, INNER + 0.1]} material={materials.metalDark} />
      <Block position={[CX, HEIGHT + 0.03, CZ]} size={[INNER + 0.1, 0.06, INNER + 0.1]} material={materials.steel} />
      <mesh geometry={unitBox} material={materials.coolPanel} position={[CX, HEIGHT - 0.005, CZ]} scale={[1.1, 0.02, 1.1]} />
      <pointLight ref={light} position={[CX, HEIGHT - 0.2, CZ]} intensity={2.2} distance={4.5} decay={2} color="#f4efe6" />

      <Block position={[CX, wallY, CZ - INNER / 2 - 0.025]} size={[INNER + 0.1, HEIGHT, 0.05]} material={materials.steel} />
      <Block position={[CX - INNER / 2 - 0.025, wallY, CZ]} size={[0.05, HEIGHT, sideDepth]} material={materials.steel} />
      <Block position={[CX + INNER / 2 + 0.025, wallY, CZ]} size={[0.05, HEIGHT, sideDepth]} material={materials.steel} />
      <Block position={[CX, 0.95, CZ - INNER / 2 + 0.04]} size={[INNER - 0.3, 0.04, 0.04]} material={materials.metalDark} />

      {/* Front returns and header around the door opening. */}
      <Block
        position={[(CX - INNER / 2 + door.minX) / 2, wallY, FRONT_Z]}
        size={[door.minX - (CX - INNER / 2), HEIGHT, 0.05]}
        material={materials.steel}
      />
      <Block
        position={[(door.maxX + CX + INNER / 2) / 2, wallY, FRONT_Z]}
        size={[CX + INNER / 2 - door.maxX, HEIGHT, 0.05]}
        material={materials.steel}
      />
      <Block
        position={[DOOR_CENTER, (door.height + HEIGHT) / 2, FRONT_Z]}
        size={[door.maxX - door.minX, HEIGHT - door.height, 0.05]}
        material={materials.steel}
      />

      {[leftDoor, rightDoor].map((ref, i) => (
        <mesh
          key={i}
          ref={ref}
          geometry={unitBox}
          material={materials.metalDark}
          position={[DOOR_CENTER + (i === 0 ? -DOOR_HALF / 2 : DOOR_HALF / 2), door.height / 2, FRONT_Z - 0.05]}
          scale={[DOOR_HALF - 0.01, door.height, 0.03]}
        />
      ))}

      <ButtonPanel />
    </group>
  )
}
