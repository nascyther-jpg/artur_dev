import { useEffect } from "react"
import type { Material } from "three"

import { addCollider, boxFromCenter } from "@/lib/physics/colliders"

import { useFloor } from "./FloorContext"
import { unitBox } from "./materials"

type Vec3 = [number, number, number]

/** Registers an invisible collision box (floor-local x/z center, width along X, depth along Z). */
export function useCollider(x: number, z: number, width: number, depth: number, enabled = true) {
  const { index } = useFloor()
  useEffect(() => {
    if (!enabled) return
    return addCollider(index, boxFromCenter(x, z, width, depth))
  }, [index, x, z, width, depth, enabled])
}

export function Collider({ x, z, width, depth }: { x: number; z: number; width: number; depth: number }) {
  useCollider(x, z, width, depth)
  return null
}

interface BlockProps {
  /** Center of the box. */
  position: Vec3
  size: Vec3
  material: Material
  rotationY?: number
  collide?: boolean
  castShadow?: boolean
  receiveShadow?: boolean
}

/** Box mesh built from the shared unit box; optionally collidable (axis-aligned footprint). */
export function Block({
  position,
  size,
  material,
  rotationY = 0,
  collide = false,
  castShadow = true,
  receiveShadow = true,
}: BlockProps) {
  const quarterTurn = Math.abs(Math.sin(rotationY)) > 0.7
  useCollider(
    position[0],
    position[2],
    quarterTurn ? size[2] : size[0],
    quarterTurn ? size[0] : size[2],
    collide,
  )
  return (
    <mesh
      geometry={unitBox}
      material={material}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={size}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

/** Floor finish over a rectangle [minX, maxX, minZ, maxZ], just above the slab. */
export function FloorPlane({ bounds, material }: { bounds: [number, number, number, number]; material: Material }) {
  const [minX, maxX, minZ, maxZ] = bounds
  return (
    <mesh
      material={material}
      position={[(minX + maxX) / 2, 0.003, (minZ + maxZ) / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[maxX - minX, maxZ - minZ]} />
    </mesh>
  )
}

/** Wall from (x1, z1) to (x2, z2) along one axis, sitting on the floor. Always collidable. */
export function Wall({
  from,
  to,
  height,
  thickness = 0.15,
  bottom = 0,
  material,
  collide = true,
}: {
  from: [number, number]
  to: [number, number]
  height: number
  thickness?: number
  bottom?: number
  material: Material
  collide?: boolean
}) {
  const alongX = Math.abs(to[0] - from[0]) >= Math.abs(to[1] - from[1])
  const length = alongX ? Math.abs(to[0] - from[0]) : Math.abs(to[1] - from[1])
  const x = (from[0] + to[0]) / 2
  const z = (from[1] + to[1]) / 2
  return (
    <Block
      position={[x, bottom + height / 2, z]}
      size={alongX ? [length, height, thickness] : [thickness, height, length]}
      material={material}
      collide={collide && bottom < 1.8}
    />
  )
}
