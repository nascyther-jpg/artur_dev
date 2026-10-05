import type { FloorDefinition } from "@/data/floors"

import { drawFloorSign } from "../Rooms/art"
import { Desk } from "../Rooms/props/furniture"
import { useCanvasTexture } from "../shared/canvasTexture"
import { materials } from "../shared/materials"
import { Block, Collider, FloorPlane } from "../shared/primitives"

function Sawhorse({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const stripes = useCanvasTexture(
    256,
    32,
    (context, width, height) => {
        context.fillStyle = "#1b1b1b"
        context.fillRect(0, 0, width, height)
        context.fillStyle = "#d8b25a"
        for (let x = -height; x < width; x += 48) {
          context.beginPath()
          context.moveTo(x, height)
          context.lineTo(x + 24, 0)
          context.lineTo(x + 48, 0)
          context.lineTo(x + 24, height)
          context.fill()
        }
      },
    "sawhorse-stripes",
  )
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.4, 0.16, 0.04]} />
        <meshStandardMaterial map={stripes} roughness={0.7} />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <Block position={[x, 0.45, 0.12]} size={[0.05, 0.95, 0.05]} rotationY={0} material={materials.metalDark} />
          <Block position={[x, 0.45, -0.12]} size={[0.05, 0.95, 0.05]} material={materials.metalDark} />
        </group>
      ))}
    </group>
  )
}

function Scaffold() {
  const poles: [number, number][] = [
    [2, -2],
    [4, -2],
    [6, -2],
    [2, -0.5],
    [4, -0.5],
    [6, -0.5],
  ]
  return (
    <group>
      {poles.map(([x, z]) => (
        <Block key={`${x}${z}`} position={[x, 1.8, z]} size={[0.06, 3.6, 0.06]} material={materials.steel} />
      ))}
      {[0.9, 2.2, 3.4].map((y) => (
        <group key={y}>
          <Block position={[4, y, -2]} size={[4.06, 0.05, 0.05]} material={materials.steel} />
          <Block position={[4, y, -0.5]} size={[4.06, 0.05, 0.05]} material={materials.steel} />
        </group>
      ))}
      <Block position={[4, 2.24, -1.25]} size={[4, 0.05, 1.4]} material={materials.wood} />
      <Collider x={4} z={-1.25} width={4.2} depth={1.7} />
    </group>
  )
}

/** Used by floors whose rooms are not built yet: sign, summary and a construction site. */
export function PlaceholderFloor({ floor }: { floor: FloorDefinition }) {
  const sign = useCanvasTexture(1600, 760, drawFloorSign(floor), `floor-sign-${floor.id}`)
  const isFuture = floor.id === "future"
  const blueprint = useCanvasTexture(
    512,
    320,
    (context, width, height) => {
      context.fillStyle = "#1f3f6b"
      context.fillRect(0, 0, width, height)
      context.strokeStyle = "rgba(220,235,255,0.7)"
      context.lineWidth = 2
      context.strokeRect(30, 30, width - 60, height - 60)
      context.strokeRect(80, 70, 160, 110)
      context.strokeRect(260, 70, 170, 180)
      context.beginPath()
      context.moveTo(80, 220)
      context.lineTo(240, 220)
      context.stroke()
    },
    "blueprint",
  )

  return (
    <group>
      {!isFuture && <FloorPlane bounds={[-7, 7, -2.5, 5]} material={materials.polishedConcrete} />}
      <mesh position={[1.4, 1.85, -4.96]}>
        <planeGeometry args={[5.2, 2.47]} />
        <meshStandardMaterial map={sign} emissiveMap={sign} emissive="#ffffff" emissiveIntensity={0.25} roughness={0.8} />
      </mesh>

      <Sawhorse position={[0.2, 0, 1.2]} rotationY={0.3} />
      <Collider x={0.2} z={1.2} width={1.4} depth={0.5} />
      <Block position={[-1.8, 0.1, 3.4]} size={[1.2, 0.14, 1]} material={materials.wood} collide />
      <Block position={[-1.8, 0.37, 3.4]} size={[1.0, 0.4, 0.8]} material={materials.fabricLight} />
      <Block position={[-1.7, 0.72, 3.3]} size={[0.6, 0.3, 0.5]} material={materials.plaster} rotationY={0.2} />

      {isFuture && (
        <>
          <Scaffold />
          <Desk position={[-1.5, 0, -1.4]} width={1.6} depth={0.9} />
          <Collider x={-1.5} z={-1.4} width={1.6} depth={0.9} />
          <mesh position={[-1.5, 0.785, -1.4]} rotation={[-Math.PI / 2, 0, 0.1]}>
            <planeGeometry args={[1.1, 0.7]} />
            <meshStandardMaterial map={blueprint} roughness={0.9} />
          </mesh>
          <pointLight position={[0, 3.2, 1]} color="#e8eef8" intensity={4} distance={10} decay={2} />
        </>
      )}
      {!isFuture && <pointLight position={[0.5, 3.2, 0]} color="#f2efe8" intensity={3.5} distance={9} decay={2} />}
    </group>
  )
}
