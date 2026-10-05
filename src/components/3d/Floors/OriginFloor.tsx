import { WALL_HEIGHT } from "@/data/building"

import { Bedroom } from "../Rooms/Bedroom"
import { drawPhoto } from "../Rooms/art"
import { Frame } from "../Rooms/props/decor"
import { materials } from "../shared/materials"
import { Block, Collider, FloorPlane, Wall } from "../shared/primitives"
import { useQuality } from "../shared/QualityContext"

const DOOR = { from: 0.8, to: 2.0, height: 2.1 }

function Hallway() {
  const { extraLights } = useQuality()
  return (
    <group>
      <FloorPlane bounds={[-7, -3, -2.5, 5]} material={materials.polishedConcrete} />
      <FloorPlane bounds={[-4.5, -3, -5, -2.5]} material={materials.polishedConcrete} />

      {/* Coat rack with a jacket */}
      <group position={[-6.6, 0, 3.9]}>
        <mesh material={materials.metalDark} position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
        </mesh>
        <mesh material={materials.metalDark} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.03, 16]} />
        </mesh>
        <Block position={[0.08, 1.45, 0]} size={[0.14, 0.55, 0.3]} material={materials.fabricBlue} rotationY={0.3} />
      </group>
      <Collider x={-6.6} z={3.9} width={0.45} depth={0.45} />
      <Block position={[-6.75, 0.2, 2.5]} size={[0.35, 0.4, 0.9]} material={materials.woodDark} collide />

      {/* Console table with a photo */}
      <Block position={[-3.3, 0.8, -1.5]} size={[0.36, 0.04, 1.2]} material={materials.wood} />
      <Block position={[-3.3, 0.4, -2.0]} size={[0.3, 0.78, 0.04]} material={materials.metalDark} />
      <Block position={[-3.3, 0.4, -1.0]} size={[0.3, 0.78, 0.04]} material={materials.metalDark} />
      <Collider x={-3.3} z={-1.5} width={0.4} depth={1.2} />
      <Frame position={[-3.3, 0.96, -1.3]} rotationY={-Math.PI / 2 + 0.25} width={0.2} height={0.26} draw={drawPhoto} textureKey="hall-photo" />

      <mesh material={materials.warmBulb} position={[-5, WALL_HEIGHT - 0.03, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 20]} />
      </mesh>
      <pointLight position={[-5, WALL_HEIGHT - 0.4, 1.5]} color="#ffe2bd" intensity={extraLights ? 3 : 2} distance={6} decay={2} />
    </group>
  )
}

/** Floor 01, "Origem": hallway from the elevator into the bedroom. */
export function OriginFloor() {
  return (
    <group>
      <Wall from={[-3, -5]} to={[-3, DOOR.from]} height={WALL_HEIGHT} material={materials.plaster} />
      <Wall from={[-3, DOOR.to]} to={[-3, 5]} height={WALL_HEIGHT} material={materials.plaster} />
      <Wall from={[-3, DOOR.from]} to={[-3, DOOR.to]} bottom={DOOR.height} height={WALL_HEIGHT - DOOR.height} material={materials.plaster} />
      {/* Door left open into the bedroom */}
      <Block position={[-2.38, 1.02, DOOR.to - 0.04]} size={[1.14, 2.04, 0.04]} material={materials.woodDark} collide />
      <Block position={[-1.9, 1.0, DOOR.to - 0.08]} size={[0.02, 0.02, 0.1]} material={materials.steel} castShadow={false} />
      <Hallway />
      <Bedroom />
    </group>
  )
}
