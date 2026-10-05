import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { PointLight } from "three"

import { useCanvasTexture, type Draw } from "../../shared/canvasTexture"
import { materials } from "../../shared/materials"
import { Block } from "../../shared/primitives"

type Vec3 = [number, number, number]
interface PlacedProps {
  position?: Vec3
  rotationY?: number
}

/** Monitor facing +Z; the screen is a canvas drawing that glows. */
export function Monitor({
  position,
  rotationY = 0,
  draw,
  textureKey,
  width = 0.62,
  height = 0.36,
}: PlacedProps & { draw: Draw; textureKey: string; width?: number; height?: number }) {
  const screen = useCanvasTexture(1024, Math.round((1024 * height) / width), draw, textureKey)
  const centerY = 0.16 + height / 2
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.006, -0.02]} size={[0.24, 0.012, 0.17]} material={materials.metalDark} />
      <Block position={[0, 0.1, -0.06]} size={[0.045, 0.2, 0.03]} material={materials.metalDark} />
      <Block position={[0, centerY, -0.035]} size={[width + 0.03, height + 0.03, 0.03]} material={materials.blackPlastic} />
      <mesh position={[0, centerY, -0.0195]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveMap={screen} emissiveIntensity={1.1} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Keyboard({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.011, 0]} size={[0.44, 0.022, 0.14]} material={materials.blackPlastic} />
      <Block position={[0, 0.024, 0.005]} size={[0.41, 0.006, 0.11]} material={materials.greyPlastic} castShadow={false} />
    </group>
  )
}

export function Mouse({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0.02, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.3, 0.24]} />
        <meshStandardMaterial color="#1c1d20" roughness={1} />
      </mesh>
      <mesh material={materials.blackPlastic} position={[0, 0.017, 0]} scale={[0.032, 0.018, 0.055]} castShadow>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
    </group>
  )
}

export function PcTower({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.23, 0]} size={[0.2, 0.46, 0.44]} material={materials.blackPlastic} />
      <Block position={[0, 0.4, 0.221]} size={[0.012, 0.012, 0.004]} material={materials.ledGreen} castShadow={false} />
      <Block position={[0.101, 0.25, 0]} size={[0.004, 0.3, 0.3]} material={materials.metalDark} castShadow={false} />
    </group>
  )
}

export function Headphones({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh material={materials.blackPlastic} position={[0, 0, 0.012]} castShadow>
          <torusGeometry args={[0.085, 0.01, 6, 24, Math.PI]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} material={materials.greyPlastic} position={[side * 0.085, -0.01, 0.022]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.035, 16]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function GameController({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.018, 0]} size={[0.13, 0.03, 0.065]} material={materials.blackPlastic} />
      {[-1, 1].map((side) => (
        <mesh key={side} material={materials.blackPlastic} position={[side * 0.065, 0.016, 0.02]} scale={[0.035, 0.022, 0.05]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={`s${side}`} material={materials.greyPlastic} position={[side * 0.03, 0.036, 0.012]}>
          <cylinderGeometry args={[0.009, 0.009, 0.012, 10]} />
        </mesh>
      ))}
    </group>
  )
}

/** Articulated desk lamp. `on` drives the bulb and its point light. */
export function DeskLamp({ position, rotationY = 0, on, castLight }: PlacedProps & { on: boolean; castLight: boolean }) {
  const light = useRef<PointLight>(null)
  useFrame((_, delta) => {
    if (!light.current) return
    const target = on ? 3.2 : 0
    light.current.intensity += (target - light.current.intensity) * Math.min(1, delta * 10)
  })
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh material={materials.metalDark} position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.07, 0.02, 16]} />
      </mesh>
      <group position={[0, 0.02, 0]} rotation={[0.35, 0, 0]}>
        <Block position={[0, 0.17, 0]} size={[0.018, 0.34, 0.018]} material={materials.metalDark} />
        <group position={[0, 0.34, 0]} rotation={[-1.1, 0, 0]}>
          <Block position={[0, 0.13, 0]} size={[0.016, 0.26, 0.016]} material={materials.metalDark} />
          <group position={[0, 0.27, 0]} rotation={[-0.9, 0, 0]}>
            <mesh material={materials.metalDark} castShadow>
              <cylinderGeometry args={[0.035, 0.075, 0.1, 16, 1, true]} />
            </mesh>
            <mesh material={on ? materials.warmBulb : materials.ceramic} position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.025, 10, 8]} />
            </mesh>
            {castLight && <pointLight ref={light} position={[0, -0.08, 0]} color="#ffc58a" intensity={on ? 3.2 : 0} distance={3.5} decay={2} />}
          </group>
        </group>
      </group>
    </group>
  )
}
