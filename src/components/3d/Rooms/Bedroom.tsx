import { useState } from "react"

import { InteractiveObject } from "../InteractiveObject/InteractiveObject"
import { materials } from "../shared/materials"
import { Block, Collider, FloorPlane } from "../shared/primitives"
import { useQuality } from "../shared/QualityContext"
import { drawOriginScreen, drawSkylinePoster, drawSpiralPoster } from "./art"
import { Backpack, BookStack, Clothes, Frame, Guitar, Mug, Papers, WallClock } from "./props/decor"
import { Beanbag, Bed, Bookshelf, Curtain, Desk, Nightstand, OfficeChair, Plant, Rug, Wardrobe } from "./props/furniture"
import { NarutoFigure } from "./props/NarutoFigure"
import { DeskLamp, GameController, Headphones, Keyboard, Monitor, Mouse, PcTower } from "./props/tech"

const FACING_WEST = -Math.PI / 2
const DESK_TOP = 0.78

function DeskSetup() {
  const [lampOn, setLampOn] = useState(true)
  const { extraLights } = useQuality()

  return (
    <group>
      <Desk position={[6.62, 0, -1]} rotationY={FACING_WEST} />
      <Collider x={6.62} z={-1} width={0.75} depth={1.8} />

      <InteractiveObject id="computer" position={[6.8, DESK_TOP, -1]} rotation={[0, FACING_WEST, 0]} markerOffset={[0, 0.66, 0]}>
        <Monitor draw={drawOriginScreen} textureKey="origin-screen" />
      </InteractiveObject>
      {extraLights && <pointLight position={[6.3, 1.15, -1]} color="#e9c9a0" intensity={0.7} distance={2.5} decay={2} />}
      <Keyboard position={[6.45, DESK_TOP, -1]} rotationY={FACING_WEST} />
      <Mouse position={[6.47, DESK_TOP, -0.56]} rotationY={FACING_WEST} />
      <PcTower position={[6.72, 0, -1.62]} rotationY={FACING_WEST} />

      <InteractiveObject
        id="naruto"
        position={[6.72, DESK_TOP, -0.42]}
        rotation={[0, FACING_WEST - 0.35, 0]}
        scale={1.15}
        reaction="hop"
        markerOffset={[0, 0.3, 0]}
      >
        <NarutoFigure />
      </InteractiveObject>

      <InteractiveObject
        id="desk-lamp"
        position={[6.86, DESK_TOP, -0.12]}
        rotation={[0, FACING_WEST - 0.4, 0]}
        markerOffset={[0, 0.55, 0.1]}
        onInteract={() => setLampOn((on) => !on)}
      >
        <DeskLamp on={lampOn} castLight />
      </InteractiveObject>

      <InteractiveObject id="headphones" position={[6.45, DESK_TOP + 0.005, -1.62]} rotation={[0, 0.4, 0]} reaction="wiggle" markerOffset={[0, 0.2, 0]}>
        <Headphones />
      </InteractiveObject>
      <BookStack position={[6.8, DESK_TOP, -1.74]} rotationY={0.2} />
      <Mug position={[6.33, DESK_TOP, -1.36]} />
      <Papers position={[6.42, DESK_TOP, -0.28]} rotationY={0.4} />

      <OfficeChair position={[5.72, 0, -1]} rotationY={Math.PI / 2} withHoodie />
      <Collider x={5.72} z={-1} width={0.55} depth={0.55} />
    </group>
  )
}

function SleepCorner() {
  const { extraLights } = useQuality()
  return (
    <group>
      <Bed position={[1.55, 0, -3.95]} />
      <Collider x={1.55} z={-3.95} width={1.62} depth={2.12} />
      <Nightstand position={[2.62, 0, -4.72]} />
      <Collider x={2.62} z={-4.72} width={0.47} depth={0.42} />
      <group position={[2.55, 0.5, -4.8]}>
        <mesh material={materials.ceramic} position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.16, 12]} />
        </mesh>
        <mesh material={materials.fabricLight} position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.07, 0.1, 0.13, 16, 1, true]} />
        </mesh>
        {extraLights && <pointLight position={[0, 0.22, 0.05]} color="#ffbf80" intensity={1.4} distance={3.2} decay={2} />}
      </group>

      <InteractiveObject id="controller" position={[1.95, 0.52, -3.35]} rotation={[0, 0.5, 0]} reaction="wiggle" markerOffset={[0, 0.2, 0]}>
        <GameController />
      </InteractiveObject>

      <InteractiveObject id="books" position={[5.3, 0, -4.8]} markerOffset={[0, 2.1, 0.2]}>
        <Bookshelf position={[0, 0, 0]} />
      </InteractiveObject>
      <Collider x={5.3} z={-4.8} width={2} depth={0.38} />

      <Frame position={[1.55, 1.95, -4.965]} width={1.1} height={0.62} draw={drawSkylinePoster} textureKey="poster-skyline" />
      <Clothes position={[3.3, 0, -2.4]} rotationY={0.6} />
    </group>
  )
}

/** Floor 01 bedroom: x ∈ [-3, 7], z ∈ [-5, 5]. */
export function Bedroom() {
  return (
    <group>
      <FloorPlane bounds={[-3, 7, -5, 5]} material={materials.woodFloor} />
      <Rug position={[1.6, 0.006, -0.9]} size={[3, 2.4]} />

      {/* Dimmed ceiling fixture: soft warm fill so the room reads at night. */}
      <mesh material={materials.warmBulb} position={[2, 3.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
      </mesh>
      <pointLight position={[2, 3.3, 0]} color="#ffc893" intensity={7} distance={13} decay={2} />

      <DeskSetup />
      <SleepCorner />

      <Wardrobe position={[-2.62, 0, -3.9]} rotationY={Math.PI / 2} />
      <Collider x={-2.62} z={-3.9} width={0.62} depth={1.8} />

      <Backpack position={[5.3, 0, 0.55]} rotationY={-0.6} />
      <Collider x={5.3} z={0.55} width={0.4} depth={0.35} />
      <Beanbag position={[0.2, 0.3, 3.3]} />
      <Collider x={0.2} z={3.3} width={0.95} depth={0.9} />
      <Plant position={[-2.3, 0, 4.3]} scale={0.8} />
      <Collider x={-2.3} z={4.3} width={0.45} depth={0.45} />

      <InteractiveObject id="guitar" position={[6.35, 0, 4.3]} rotation={[0, -2.2, 0]} reaction="wiggle" markerOffset={[0, 1.5, 0]}>
        <Guitar />
      </InteractiveObject>
      <Collider x={6.35} z={4.3} width={0.6} depth={0.6} />

      <Frame position={[-2.915, 1.75, -1.3]} rotationY={Math.PI / 2} width={0.6} height={0.85} draw={drawSpiralPoster} textureKey="poster-spiral" />
      <WallClock position={[-2.91, 2.25, 3.3]} rotationY={Math.PI / 2} />
      <Curtain position={[-2.5, 0.08, 4.86]} width={0.8} />
      <Curtain position={[6.55, 0.08, 4.86]} width={0.8} />
      <Block position={[4.8, 0.87, 4.93]} size={[0.3, 0.04, 0.12]} material={materials.wood} castShadow={false} />
    </group>
  )
}
