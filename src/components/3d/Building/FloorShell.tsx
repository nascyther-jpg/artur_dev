import { useEffect, useMemo } from "react"
import { MeshStandardMaterial, type Material, type Texture } from "three"

import { ELEVATOR, SLAB_THICKNESS, WALL_HEIGHT, WALL_THICKNESS } from "@/data/building"
import type { FloorDefinition } from "@/data/floors"

import { LandingDoors } from "../Elevator/LandingDoors"
import { createCanvasTexture, seededRandom } from "../shared/canvasTexture"
import { materials } from "../shared/materials"
import { Block, Collider, Wall } from "../shared/primitives"

const OUTER_X = 7 + WALL_THICKNESS / 2
const OUTER_Z = 5 + WALL_THICKNESS / 2
const EDGE_X = 7 + WALL_THICKNESS
const EDGE_Z = 5 + WALL_THICKNESS
const SILL = 0.85
const HEAD = 2.95
const BAY = 2

/** Facade run: parapet + glazing + head band, with mullions every 2 m when detailed. */
function Facade({
  along,
  fixed,
  from,
  to,
  detailed,
  glass,
  fullHeight = false,
  opening,
}: {
  along: "x" | "z"
  fixed: number
  from: number
  to: number
  detailed: boolean
  glass: Material
  fullHeight?: boolean
  /** Gap in the glazing (entrance doors are rendered by the room). */
  opening?: [number, number]
}) {
  const length = to - from
  const middle = (from + to) / 2
  const place = (a: number, y: number): [number, number, number] =>
    along === "x" ? [a, y, fixed] : [fixed, y, a]
  const size = (l: number, h: number, t: number): [number, number, number] =>
    along === "x" ? [l, h, t] : [t, h, l]

  const glassBottom = fullHeight ? 0 : SILL
  const glassHeight = HEAD - glassBottom
  const glassRuns: [number, number][] = opening
    ? [
        [from, opening[0]],
        [opening[1], to],
      ]
    : [[from, to]]

  const mullions: number[] = []
  if (detailed) for (let a = from; a <= to + 0.001; a += BAY) mullions.push(a)
  if (detailed && opening) mullions.push(...opening)

  return (
    <group>
      {/* Collision covers the whole run: glass is a wall too. */}
      {detailed && (
        <Collider
          x={place(middle, 0)[0]}
          z={place(middle, 0)[2]}
          width={size(length, 1, 0.3)[0]}
          depth={size(length, 1, 0.3)[2]}
        />
      )}
      {!fullHeight && (
        <Block position={place(middle, SILL / 2)} size={size(length, SILL, WALL_THICKNESS)} material={materials.concrete} />
      )}
      <Block
        position={place(middle, (HEAD + WALL_HEIGHT) / 2)}
        size={size(length, WALL_HEIGHT - HEAD, WALL_THICKNESS)}
        material={materials.concrete}
      />
      {opening && (
        <Block
          position={place((opening[0] + opening[1]) / 2, (2.6 + HEAD) / 2)}
          size={size(opening[1] - opening[0], HEAD - 2.6, 0.04)}
          material={glass}
          castShadow={false}
        />
      )}
      {glassRuns.map(([a, b]) => (
        <Block
          key={a}
          position={place((a + b) / 2, glassBottom + glassHeight / 2)}
          size={size(b - a, glassHeight, 0.04)}
          material={glass}
          castShadow={false}
        />
      ))}
      {mullions.map((a) => (
        <Block
          key={`m${a}`}
          position={place(a, glassBottom + glassHeight / 2)}
          size={size(0.07, glassHeight, 0.14)}
          material={materials.metalDark}
        />
      ))}
      {detailed && !fullHeight && (
        <Block position={place(middle, SILL + 0.015)} size={size(length, 0.03, 0.3)} material={materials.metalDark} />
      )}
    </group>
  )
}

/** Warm interior glow + silhouettes, one 2 m bay per texture repeat. */
function useLitGlass(floor: FloorDefinition, index: number) {
  const result = useMemo(() => {
    const base = createCanvasTexture(
      128,
      128,
      (context, width, height) => {
        const random = seededRandom(97 + index * 13)
        const gradient = context.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, floor.lighting.windowGlow)
        gradient.addColorStop(1, "#1a1511")
        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)
        context.globalAlpha = 0.85
        context.fillStyle = "#0d0b09"
        for (let i = 0; i < 3; i++) {
          const w = 12 + random() * 30
          const h = 18 + random() * 40
          context.fillRect(random() * (width - w), height - h, w, h)
        }
        context.globalAlpha = 1
        context.fillStyle = "#08090a"
        context.fillRect(0, 0, 5, height)
      },
      true,
    )
    const make = (repeat: number) => {
      const texture: Texture = base.clone()
      texture.repeat.set(repeat, 1)
      texture.needsUpdate = true
      return new MeshStandardMaterial({
        color: "#0b0c0e",
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.35 + ((index * 37) % 5) * 0.06,
        roughness: 0.15,
        metalness: 0.4,
      })
    }
    return {
      base,
      front: make((EDGE_X * 2) / BAY),
      side: make((EDGE_Z * 2) / BAY),
      left: make((EDGE_Z - ELEVATOR.shaft.maxZ) / BAY),
    }
  }, [floor, index])

  useEffect(
    () => () => {
      result.base.dispose()
      ;[result.front, result.side, result.left].forEach((material) => {
        material.emissiveMap?.dispose()
        material.dispose()
      })
    },
    [result],
  )
  return result
}

function ElevatorCore() {
  const { shaft, door } = ELEVATOR
  return (
    <group>
      <Wall from={[shaft.maxX, shaft.minZ]} to={[shaft.maxX, shaft.maxZ]} height={WALL_HEIGHT} material={materials.concrete} />
      <Wall from={[shaft.minX, shaft.maxZ]} to={[door.minX, shaft.maxZ]} height={WALL_HEIGHT} material={materials.concrete} />
      <Wall from={[door.maxX, shaft.maxZ]} to={[shaft.maxX, shaft.maxZ]} height={WALL_HEIGHT} material={materials.concrete} />
      <Wall
        from={[door.minX, shaft.maxZ]}
        to={[door.maxX, shaft.maxZ]}
        bottom={door.height}
        height={WALL_HEIGHT - door.height}
        material={materials.concrete}
      />
      {/* Steel frame around the landing opening. */}
      <Block position={[door.minX - 0.03, door.height / 2, shaft.maxZ + 0.08]} size={[0.06, door.height, 0.04]} material={materials.steel} />
      <Block position={[door.maxX + 0.03, door.height / 2, shaft.maxZ + 0.08]} size={[0.06, door.height, 0.04]} material={materials.steel} />
      <Block
        position={[(door.minX + door.maxX) / 2, door.height + 0.03, shaft.maxZ + 0.08]}
        size={[door.maxX - door.minX + 0.12, 0.06, 0.04]}
        material={materials.steel}
      />
    </group>
  )
}

/**
 * Structure shared by every floor. `detailed` is the floor the player is on:
 * transparent glazing, mullions, elevator core and colliders. Other floors render a
 * cheap shell with lit windows so the building reads as occupied from outside.
 */
export function FloorShell({ floor, index, detailed }: { floor: FloorDefinition; index: number; detailed: boolean }) {
  const lit = useLitGlass(floor, index)
  const { shaft } = ELEVATOR
  const isGround = index === 0

  return (
    <group>
      {/* Slab with a hole for the elevator shaft. */}
      <Block
        position={[0, -SLAB_THICKNESS / 2, (shaft.maxZ + EDGE_Z) / 2]}
        size={[EDGE_X * 2, SLAB_THICKNESS, EDGE_Z - shaft.maxZ]}
        material={materials.concreteDark}
      />
      <Block
        position={[(shaft.maxX + EDGE_X) / 2, -SLAB_THICKNESS / 2, (shaft.maxZ - EDGE_Z) / 2]}
        size={[EDGE_X - shaft.maxX, SLAB_THICKNESS, EDGE_Z + shaft.maxZ]}
        material={materials.concreteDark}
      />
      <Block position={[0, -SLAB_THICKNESS / 2, EDGE_Z - 0.02]} size={[EDGE_X * 2 + 0.02, SLAB_THICKNESS + 0.02, 0.06]} material={materials.metalDark} />

      <Block position={[0, WALL_HEIGHT / 2, -OUTER_Z]} size={[EDGE_X * 2, WALL_HEIGHT, WALL_THICKNESS]} material={materials.concrete} collide />
      <Block
        position={[-OUTER_X, WALL_HEIGHT / 2, (shaft.maxZ - EDGE_Z) / 2]}
        size={[WALL_THICKNESS, WALL_HEIGHT, EDGE_Z + shaft.maxZ]}
        material={materials.concrete}
        collide
      />

      <Facade
        along="x"
        fixed={OUTER_Z}
        from={-EDGE_X}
        to={EDGE_X}
        detailed={detailed}
        glass={detailed ? materials.glass : lit.front}
        fullHeight={isGround}
        opening={isGround ? [-1, 1] : undefined}
      />
      <Facade along="z" fixed={OUTER_X} from={-EDGE_Z} to={EDGE_Z} detailed={detailed} glass={detailed ? materials.glass : lit.side} />
      <Facade along="z" fixed={-OUTER_X} from={shaft.maxZ} to={EDGE_Z} detailed={detailed} glass={detailed ? materials.glass : lit.left} />

      {detailed && (
        <>
          <ElevatorCore />
          <LandingDoors floorIndex={index} floor={floor} />
        </>
      )}
    </group>
  )
}
