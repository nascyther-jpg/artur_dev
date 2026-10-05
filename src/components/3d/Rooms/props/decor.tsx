import { MeshStandardMaterial } from "three"

import { useCanvasTexture, type Draw } from "../../shared/canvasTexture"
import { materials } from "../../shared/materials"
import { Block } from "../../shared/primitives"

type Vec3 = [number, number, number]
interface PlacedProps {
  position?: Vec3
  rotationY?: number
}

const guitarTop = new MeshStandardMaterial({ color: "#c58b52", roughness: 0.45 })
const guitarBody = new MeshStandardMaterial({ color: "#5a3520", roughness: 0.5 })

/** Acoustic guitar leaning on a small stand, facing +Z. */
export function Guitar({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.12, -0.05]} size={[0.3, 0.03, 0.03]} material={materials.metalDark} />
      <Block position={[0, 0.3, -0.16]} size={[0.03, 0.6, 0.03]} material={materials.metalDark} rotationY={0} />
      <group position={[0, 0.05, 0]} rotation={[-0.16, 0, 0]}>
        <mesh material={guitarTop} position={[0, 0.27, 0]} scale={[0.19, 0.23, 0.05]} castShadow>
          <sphereGeometry args={[1, 18, 12]} />
        </mesh>
        <mesh material={guitarTop} position={[0, 0.52, 0]} scale={[0.15, 0.16, 0.048]} castShadow>
          <sphereGeometry args={[1, 18, 12]} />
        </mesh>
        <mesh material={guitarBody} position={[0, 0.4, -0.015]} scale={[0.19, 0.36, 0.04]}>
          <sphereGeometry args={[1, 12, 8]} />
        </mesh>
        <mesh material={materials.blackPlastic} position={[0, 0.44, 0.047]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.004, 20]} />
        </mesh>
        <Block position={[0, 0.9, 0.012]} size={[0.05, 0.56, 0.028]} material={materials.woodDark} />
        <Block position={[0, 1.24, 0.005]} size={[0.07, 0.15, 0.024]} material={materials.woodDark} />
        <Block position={[0, 0.2, 0.05]} size={[0.09, 0.012, 0.012]} material={materials.woodDark} />
      </group>
    </group>
  )
}

/** Framed artwork drawn on a canvas, facing +Z. */
export function Frame({
  position,
  rotationY = 0,
  width,
  height,
  draw,
  textureKey,
}: PlacedProps & { width: number; height: number; draw: Draw; textureKey: string }) {
  const art = useCanvasTexture(512, Math.round((512 * height) / width), draw, textureKey)
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0, 0]} size={[width + 0.05, height + 0.05, 0.03]} material={materials.metalDark} castShadow={false} />
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={art} roughness={0.85} />
      </mesh>
    </group>
  )
}

export function WallClock({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh material={materials.ceramic} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 32]} />
      </mesh>
      <Block position={[0, 0.045, 0.02]} size={[0.012, 0.09, 0.004]} material={materials.blackPlastic} castShadow={false} />
      <Block position={[0.035, -0.02, 0.022]} size={[0.07, 0.01, 0.004]} material={materials.blackPlastic} castShadow={false} />
    </group>
  )
}

export function Mug({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh material={materials.ceramic} position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.035, 0.09, 16]} />
      </mesh>
      <mesh material={materials.ceramic} position={[0.042, 0.048, 0]}>
        <torusGeometry args={[0.022, 0.006, 6, 12]} />
      </mesh>
      <mesh position={[0, 0.087, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.033, 16]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.2} />
      </mesh>
    </group>
  )
}

export function BookStack({ position, rotationY = 0, count = 3 }: PlacedProps & { count?: number }) {
  const colors = [materials.fabricBlue, materials.fabricWarm, materials.paper, materials.woodDark]
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: count }, (_, i) => (
        <Block
          key={i}
          position={[0, 0.02 + i * 0.04, 0]}
          size={[0.2 - i * 0.01, 0.038, 0.26 - i * 0.015]}
          rotationY={(i % 2 ? 1 : -1) * 0.12}
          material={colors[i % colors.length]}
        />
      ))}
    </group>
  )
}

export function Papers({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.002, 0]} size={[0.21, 0.003, 0.29]} material={materials.paper} castShadow={false} />
      <Block position={[0.04, 0.005, 0.03]} size={[0.21, 0.003, 0.29]} rotationY={0.3} material={materials.paper} castShadow={false} />
    </group>
  )
}

export function Backpack({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group rotation={[-0.25, 0, 0]}>
        <Block position={[0, 0.21, 0]} size={[0.32, 0.42, 0.18]} material={materials.fabricBlue} />
        <Block position={[0, 0.14, 0.1]} size={[0.24, 0.18, 0.05]} material={materials.fabricBlue} />
        <Block position={[0, 0.43, -0.02]} size={[0.14, 0.04, 0.03]} material={materials.blackPlastic} />
      </group>
    </group>
  )
}

/** A t-shirt left on the floor: the room is lived in. */
export function Clothes({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.012, 0]} size={[0.46, 0.025, 0.36]} material={materials.fabricWarm} />
      <Block position={[0.2, 0.01, -0.2]} size={[0.16, 0.02, 0.14]} rotationY={0.6} material={materials.fabricWarm} />
      <Block position={[-0.55, 0.01, 0.35]} size={[0.08, 0.018, 0.2]} rotationY={1.1} material={materials.fabricLight} />
    </group>
  )
}
