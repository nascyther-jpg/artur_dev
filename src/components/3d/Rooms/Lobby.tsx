import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"

import { WALL_HEIGHT } from "@/data/building"
import { experienceStore } from "@/lib/experience/experienceStore"
import { damp } from "@/lib/math/easing"

import { player } from "../Camera/player"
import { InteractiveObject } from "../InteractiveObject/InteractiveObject"
import { useCanvasTexture } from "../shared/canvasTexture"
import { materials } from "../shared/materials"
import { Block, Collider, FloorPlane } from "../shared/primitives"
import { useQuality } from "../shared/QualityContext"
import { drawContactScreen, drawDirectory, drawQuote, drawReceptionScreen } from "./art"
import { Bench, OfficeChair, Plant, Rug } from "./props/furniture"
import { Monitor } from "./props/tech"
import { Mug } from "./props/decor"

/** Automatic sliding doors: they open for the camera as it arrives from the street. */
function EntranceDoors() {
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const openness = useRef(0)

  useFrame((_, delta) => {
    const { phase } = experienceStore.get()
    const approaching = phase !== "explore" && player.position.z > 4.4 && player.position.z < 10
    openness.current = damp(openness.current, approaching ? 1 : 0, 4, delta)
    const offset = openness.current * 0.95
    if (left.current) left.current.position.x = -0.5 - offset
    if (right.current) right.current.position.x = 0.5 + offset
  })

  return (
    <group>
      {[left, right].map((ref, i) => (
        <group key={i} ref={ref} position={[i === 0 ? -0.5 : 0.5, 0, 5.02]}>
          <Block position={[0, 1.3, 0]} size={[0.98, 2.56, 0.02]} material={materials.glass} castShadow={false} />
          <Block position={[0, 2.6, 0]} size={[1, 0.05, 0.05]} material={materials.metalDark} />
          <Block position={[0, 0.03, 0]} size={[1, 0.05, 0.05]} material={materials.metalDark} />
          <Block position={[i === 0 ? 0.47 : -0.47, 1.3, 0]} size={[0.05, 2.56, 0.05]} material={materials.metalDark} />
          <Block position={[i === 0 ? 0.4 : -0.4, 1.1, -0.04]} size={[0.02, 0.5, 0.02]} material={materials.steel} />
        </group>
      ))}
    </group>
  )
}

function Pendant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Block position={[0, 3.3, 0]} size={[0.01, 0.9, 0.01]} material={materials.blackPlastic} castShadow={false} />
      <mesh material={materials.metalDark} position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.2, 16, 1, true]} />
      </mesh>
      <mesh material={materials.warmBulb} position={[0, 2.72, 0]}>
        <sphereGeometry args={[0.04, 10, 8]} />
      </mesh>
    </group>
  )
}

function Directory() {
  const texture = useCanvasTexture(1024, 720, drawDirectory, "directory")
  return (
    <InteractiveObject id="directory" position={[-4.4, 1.65, -3.75]} rotation={[0, Math.PI / 2, 0]} markerOffset={[0, 0.85, 0.12]}>
      <Block position={[0, 0, 0]} size={[1.9, 1.35, 0.04]} material={materials.metalDark} castShadow={false} />
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[1.82, 1.28]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.7} />
      </mesh>
    </InteractiveObject>
  )
}

function QuoteWall() {
  const texture = useCanvasTexture(2048, 560, drawQuote, "quote")
  return (
    <InteractiveObject id="quote" position={[1.5, 1.95, -4.95]} markerOffset={[0, 0.95, 0.15]}>
      <mesh>
        <planeGeometry args={[5.4, 1.48]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
    </InteractiveObject>
  )
}

function ContactKiosk() {
  const texture = useCanvasTexture(640, 460, drawContactScreen, "contact-kiosk")
  return (
    <InteractiveObject id="contact" position={[4.8, 0, 2.4]} rotation={[0, -1.27, 0]} markerOffset={[0, 1.55, 0]}>
      <Block position={[0, 0.5, 0]} size={[0.38, 1.0, 0.3]} material={materials.metalDark} />
      <group position={[0, 1.1, 0.04]} rotation={[-0.5, 0, 0]}>
        <Block position={[0, 0, 0]} size={[0.52, 0.38, 0.04]} material={materials.blackPlastic} />
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[0.48, 0.345]} />
          <meshStandardMaterial color="#000" emissive="#ffffff" emissiveMap={texture} emissiveIntensity={1} />
        </mesh>
      </group>
    </InteractiveObject>
  )
}

/** Ground floor: "Quem sou eu". */
export function Lobby() {
  const { extraLights } = useQuality()
  return (
    <group>
      <FloorPlane bounds={[-7, 7, -2.5, 5]} material={materials.polishedConcrete} />
      <FloorPlane bounds={[-4.5, 7, -5, -2.5]} material={materials.polishedConcrete} />
      <EntranceDoors />
      <Rug position={[0, 0.006, 4.25]} size={[2.2, 1.1]} color="#1a1a1c" />

      {/* Reception */}
      <Block position={[2.6, 0.525, 0.3]} size={[3, 1.05, 0.8]} material={materials.woodDark} collide />
      <Block position={[2.6, 1.075, 0.3]} size={[3.1, 0.05, 0.9]} material={materials.concrete} />
      <Block position={[2.6, 0.2, 0.705]} size={[3, 0.04, 0.01]} material={materials.steel} castShadow={false} />
      <InteractiveObject id="reception" position={[2.6, 1.1, 0.45]} markerOffset={[0, 0.66, 0]}>
        <Monitor draw={drawReceptionScreen} textureKey="reception-screen" />
      </InteractiveObject>
      <Mug position={[3.7, 1.1, 0.42]} />
      <Plant position={[1.35, 1.1, 0.3]} scale={0.35} />
      <OfficeChair position={[2.6, 0, -0.45]} />
      <Collider x={2.6} z={-0.45} width={0.55} depth={0.55} />
      {[1.6, 2.6, 3.6].map((x) => (
        <Pendant key={x} x={x} z={0.3} />
      ))}
      <pointLight position={[2.6, 2.5, 0.4]} color="#ffd29e" intensity={6} distance={8} decay={2} />
      <pointLight position={[-2.5, 3.3, 2.5]} color="#ffe6c4" intensity={5} distance={10} decay={2} />

      <QuoteWall />
      {extraLights && (
        <>
          <pointLight position={[0.2, 3.3, -4.2]} color="#ffdcb0" intensity={2.4} distance={4.5} decay={2} />
          <pointLight position={[2.9, 3.3, -4.2]} color="#ffdcb0" intensity={2.4} distance={4.5} decay={2} />
        </>
      )}
      <Directory />
      <ContactKiosk />
      <Collider x={4.8} z={2.4} width={0.45} depth={0.45} />

      <Bench position={[-6.5, 0, 1.6]} rotationY={Math.PI / 2} />
      <Collider x={-6.5} z={1.6} width={0.5} depth={2.4} />
      {(
        [
          [-6.45, 4.35],
          [6.35, 4.35],
          [6.35, -4.35],
        ] as const
      ).map(([x, z]) => (
        <group key={`${x}${z}`}>
          <Plant position={[x, 0, z]} />
          <Collider x={x} z={z} width={0.5} depth={0.5} />
        </group>
      ))}
      <Block position={[-2.4, WALL_HEIGHT / 2, 1.2]} size={[0.45, WALL_HEIGHT, 0.45]} material={materials.concrete} collide />
      <Block position={[5.3, WALL_HEIGHT / 2, -2.4]} size={[0.45, WALL_HEIGHT, 0.45]} material={materials.concrete} collide />
    </group>
  )
}
