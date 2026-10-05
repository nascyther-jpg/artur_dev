import { ELEVATOR, SLAB_THICKNESS, WALL_THICKNESS } from "@/data/building"

import { FONT_SANS, useCanvasTexture } from "../shared/canvasTexture"
import { materials } from "../shared/materials"
import { Block } from "../shared/primitives"

const EDGE_X = 7 + WALL_THICKNESS
const EDGE_Z = 5 + WALL_THICKNESS

function RoofSign() {
  const texture = useCanvasTexture(
    1024,
    256,
    (context, width, height) => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = "#f3ece0"
      context.font = `600 150px ${FONT_SANS}`
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText("ENRIQUE", width / 2 - 20, height / 2 + 6)
      context.fillStyle = "#d9a066"
      context.beginPath()
      context.arc(width / 2 + 330, height / 2 + 48, 16, 0, Math.PI * 2)
      context.fill()
    },
    "roof-sign",
  )
  return (
    <mesh position={[0, 1.55, EDGE_Z - 0.4]}>
      <planeGeometry args={[6.4, 1.6]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0.9}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/** Roof slab (sits where the next floor's slab would be), parapet and rooftop equipment. */
export function Roof({ y }: { y: number }) {
  const { shaft } = ELEVATOR
  return (
    <group position={[0, y, 0]}>
      <Block position={[0, -SLAB_THICKNESS / 2, 0]} size={[EDGE_X * 2, SLAB_THICKNESS, EDGE_Z * 2]} material={materials.concreteDark} />
      <Block position={[0, 0.45, EDGE_Z - 0.1]} size={[EDGE_X * 2, 0.9, 0.2]} material={materials.concrete} />
      <Block position={[0, 0.45, -EDGE_Z + 0.1]} size={[EDGE_X * 2, 0.9, 0.2]} material={materials.concrete} />
      <Block position={[EDGE_X - 0.1, 0.45, 0]} size={[0.2, 0.9, EDGE_Z * 2]} material={materials.concrete} />
      <Block position={[-EDGE_X + 0.1, 0.45, 0]} size={[0.2, 0.9, EDGE_Z * 2]} material={materials.concrete} />
      {/* Elevator machine room above the shaft. */}
      <Block
        position={[(shaft.minX + shaft.maxX) / 2, 1.3, (shaft.minZ + shaft.maxZ) / 2]}
        size={[shaft.maxX - shaft.minX, 2.6, shaft.maxZ - shaft.minZ]}
        material={materials.concrete}
      />
      <Block position={[3.5, 0.6, -2.5]} size={[2.4, 1.2, 1.6]} material={materials.metalDark} />
      <Block position={[0.6, 0.45, -3.2]} size={[1.2, 0.9, 1.2]} material={materials.metalDark} />
      <Block position={[-5.75, 2.75, -3.75]} size={[0.12, 0.3, 0.12]} material={materials.ledRed} castShadow={false} />
      <RoofSign />
    </group>
  )
}
