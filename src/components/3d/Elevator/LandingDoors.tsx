import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import type { Mesh } from "three"

import { ELEVATOR } from "@/data/building"
import type { FloorDefinition } from "@/data/floors"
import { experienceStore } from "@/lib/experience/experienceStore"
import { t } from "@/lib/i18n/language"
import { easeInOutSine } from "@/lib/math/easing"
import { addCollider } from "@/lib/physics/colliders"

import { FONT_SANS, useCanvasTexture } from "../shared/canvasTexture"
import { materials, unitBox } from "../shared/materials"
import { Block } from "../shared/primitives"
import { elevator } from "./elevatorController"

const { door, shaft } = ELEVATOR
const WIDTH = door.maxX - door.minX
const HALF = WIDTH / 2
const CENTER = (door.minX + door.maxX) / 2

export function landingOpenness(floorIndex: number) {
  const { floorIndex: current, elevatorPhase } = experienceStore.get()
  return current === floorIndex && elevatorPhase !== "moving" ? elevator.doorOpen : 0
}

function FloorSign({ floor }: { floor: FloorDefinition }) {
  const texture = useCanvasTexture(
    512,
    192,
    (context, width, height) => {
      context.fillStyle = "#15161a"
      context.fillRect(0, 0, width, height)
      context.fillStyle = "#e9e5dc"
      context.font = `600 104px ${FONT_SANS}`
      context.textBaseline = "middle"
      context.fillText(t(floor.number), 28, height / 2 + 4)
      context.fillStyle = "#d9a066"
      context.fillRect(200, 52, 2, 88)
      context.fillStyle = "#b8b3aa"
      context.font = `500 34px ${FONT_SANS}`
      context.fillText(t(floor.title).toUpperCase(), 226, height / 2 + 2)
    },
    `sign-${floor.id}`,
  )
  return (
    <mesh position={[CENTER, door.height + 0.55, shaft.maxZ + 0.08]}>
      <planeGeometry args={[1.15, 0.43]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.45} roughness={0.6} />
    </mesh>
  )
}

/** Landing doors of one floor; they open together with the car doors when the car is here. */
export function LandingDoors({ floorIndex, floor }: { floorIndex: number; floor: FloorDefinition }) {
  const left = useRef<Mesh>(null)
  const right = useRef<Mesh>(null)

  useEffect(
    () =>
      addCollider(
        floorIndex,
        { minX: door.minX, maxX: door.maxX, minZ: shaft.maxZ - 0.1, maxZ: shaft.maxZ + 0.1 },
        () => landingOpenness(floorIndex) < 0.85,
      ),
    [floorIndex],
  )

  useFrame(() => {
    const offset = easeInOutSine(landingOpenness(floorIndex)) * HALF * 0.96
    if (left.current) left.current.position.x = CENTER - HALF / 2 - offset
    if (right.current) right.current.position.x = CENTER + HALF / 2 + offset
  })

  return (
    <group>
      {[left, right].map((ref, i) => (
        <mesh
          key={i}
          ref={ref}
          geometry={unitBox}
          material={materials.steel}
          position={[CENTER + (i === 0 ? -HALF / 2 : HALF / 2), door.height / 2, shaft.maxZ]}
          scale={[HALF - 0.01, door.height, 0.04]}
          castShadow
        />
      ))}
      <FloorSign floor={floor} />
      <Block position={[door.maxX + 0.36, 1.15, shaft.maxZ + 0.085]} size={[0.1, 0.22, 0.02]} material={materials.steel} />
      <Block position={[door.maxX + 0.36, 1.18, shaft.maxZ + 0.1]} size={[0.035, 0.035, 0.01]} material={materials.warmBulb} castShadow={false} />
    </group>
  )
}
