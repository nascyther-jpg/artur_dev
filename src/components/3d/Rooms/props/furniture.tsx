import { useLayoutEffect, useMemo, useRef } from "react"
import { Color, InstancedMesh, Object3D } from "three"

import { seededRandom } from "../../shared/canvasTexture"
import { materials, unitBox } from "../../shared/materials"
import { Block } from "../../shared/primitives"

// Props are visual only and face +Z in local space; rooms place them and declare colliders.

type Vec3 = [number, number, number]
interface PlacedProps {
  position?: Vec3
  rotationY?: number
}

export function Desk({ position, rotationY = 0, width = 1.8, depth = 0.75 }: PlacedProps & { width?: number; depth?: number }) {
  const legX = width / 2 - 0.06
  const legZ = depth / 2 - 0.06
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.76, 0]} size={[width, 0.04, depth]} material={materials.wood} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Block key={`${sx}${sz}`} position={[sx * legX, 0.37, sz * legZ]} size={[0.045, 0.74, 0.045]} material={materials.metalDark} />
        )),
      )}
      <Block position={[legX - 0.22, 0.46, -0.02]} size={[0.4, 0.3, depth - 0.12]} material={materials.woodDark} />
      <Block position={[legX - 0.22, 0.46, depth / 2 - 0.055]} size={[0.12, 0.015, 0.012]} material={materials.steel} />
    </group>
  )
}

export function OfficeChair({ position, rotationY = 0, withHoodie = false }: PlacedProps & { withHoodie?: boolean }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Block
          key={i}
          position={[Math.sin((i * Math.PI * 2) / 5) * 0.15, 0.04, Math.cos((i * Math.PI * 2) / 5) * 0.15]}
          size={[0.04, 0.03, 0.3]}
          rotationY={(i * Math.PI * 2) / 5}
          material={materials.metalDark}
        />
      ))}
      <Block position={[0, 0.25, 0]} size={[0.05, 0.4, 0.05]} material={materials.steel} />
      <Block position={[0, 0.48, 0]} size={[0.5, 0.08, 0.48]} material={materials.fabricGrey} />
      <group position={[0, 0.82, -0.23]} rotation={[-0.12, 0, 0]}>
        <Block position={[0, 0, 0]} size={[0.46, 0.58, 0.06]} material={materials.fabricGrey} />
      </group>
      {[-1, 1].map((side) => (
        <Block key={side} position={[side * 0.27, 0.64, 0]} size={[0.05, 0.03, 0.3]} material={materials.blackPlastic} />
      ))}
      {withHoodie && (
        <group position={[0, 1.08, -0.26]} rotation={[-0.12, 0.08, 0]}>
          <Block position={[0, 0, 0]} size={[0.5, 0.14, 0.16]} material={materials.fabricWarm} />
          <Block position={[0.24, -0.2, 0.05]} size={[0.1, 0.38, 0.1]} material={materials.fabricWarm} />
          <Block position={[-0.1, -0.12, -0.06]} size={[0.3, 0.22, 0.05]} material={materials.fabricWarm} />
        </group>
      )}
    </group>
  )
}

export function Bed({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.17, 0]} size={[1.5, 0.22, 2.05]} material={materials.woodDark} />
      <Block position={[0, 0.36, 0.02]} size={[1.42, 0.18, 1.96]} material={materials.fabricLight} />
      <group position={[0.02, 0.47, 0.3]} rotation={[0, 0.03, 0.015]}>
        <Block position={[0, 0, 0]} size={[1.48, 0.08, 1.38]} material={materials.fabricBlue} />
        <Block position={[-0.15, 0.05, -0.62]} size={[1.1, 0.07, 0.22]} material={materials.fabricBlue} rotationY={0.06} />
      </group>
      <Block position={[-0.34, 0.51, -0.74]} size={[0.56, 0.12, 0.34]} material={materials.fabricLight} rotationY={0.08} />
      <Block position={[0.33, 0.52, -0.76]} size={[0.56, 0.13, 0.34]} material={materials.fabricLight} rotationY={-0.05} />
      <Block position={[0, 0.56, -1.0]} size={[1.58, 0.92, 0.07]} material={materials.woodDark} />
    </group>
  )
}

export function Nightstand({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.25, 0]} size={[0.45, 0.5, 0.4]} material={materials.wood} />
      <Block position={[0, 0.34, 0.201]} size={[0.38, 0.01, 0.01]} material={materials.woodDark} />
      <Block position={[0.05, 0.515, 0.02]} size={[0.14, 0.03, 0.2]} material={materials.fabricWarm} rotationY={0.3} />
    </group>
  )
}

/** Shelf with instanced books (one draw call for all of them). */
export function Bookshelf({ position, rotationY = 0, width = 2, height = 1.9, seed = 5 }: PlacedProps & { width?: number; height?: number; seed?: number }) {
  const depth = 0.34
  const shelves = 5
  const books = useRef<InstancedMesh>(null)

  const layout = useMemo(() => {
    const random = seededRandom(seed)
    const palette = ["#6b2f2a", "#2f3e4f", "#8a6d3b", "#3f4a3a", "#d8d3ca", "#1f1f22", "#7a4a36", "#4c5a6e"]
    const items: { x: number; y: number; w: number; h: number; d: number; tilt: number; color: string }[] = []
    for (let shelf = 0; shelf < shelves - 1; shelf++) {
      const baseY = 0.06 + (shelf * (height - 0.1)) / (shelves - 1) + 0.02
      let x = -width / 2 + 0.06
      while (x < width / 2 - 0.12) {
        if (random() < 0.12) {
          x += 0.08 + random() * 0.15
          continue
        }
        const w = 0.025 + random() * 0.03
        const h = 0.18 + random() * 0.1
        const tilt = random() < 0.08 ? 0.25 : 0
        items.push({ x: x + w / 2, y: baseY + h / 2, w, h, d: 0.2 + random() * 0.06, tilt, color: palette[Math.floor(random() * palette.length)] })
        x += w + 0.004
      }
    }
    return items
  }, [seed, width, height])

  useLayoutEffect(() => {
    const mesh = books.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    layout.forEach((book, i) => {
      dummy.position.set(book.x, book.y, 0.02)
      dummy.rotation.set(0, 0, book.tilt)
      dummy.scale.set(book.w, book.h, book.d)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color.set(book.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [layout])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[-width / 2 + 0.015, height / 2, 0]} size={[0.03, height, depth]} material={materials.woodDark} />
      <Block position={[width / 2 - 0.015, height / 2, 0]} size={[0.03, height, depth]} material={materials.woodDark} />
      <Block position={[0, height / 2, -depth / 2 + 0.01]} size={[width, height, 0.02]} material={materials.woodDark} />
      {Array.from({ length: shelves }, (_, i) => (
        <Block key={i} position={[0, 0.04 + (i * (height - 0.1)) / (shelves - 1), 0]} size={[width - 0.04, 0.03, depth]} material={materials.wood} />
      ))}
      <instancedMesh key={layout.length} ref={books} args={[unitBox, materials.paper, layout.length]} castShadow />
    </group>
  )
}

export function Wardrobe({ position, rotationY = 0 }: PlacedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 1.05, 0]} size={[1.8, 2.1, 0.6]} material={materials.plaster} />
      <Block position={[0, 1.05, 0.301]} size={[0.01, 2.0, 0.005]} material={materials.metalDark} />
      {[-1, 1].map((side) => (
        <Block key={side} position={[side * 0.07, 1.1, 0.315]} size={[0.015, 0.28, 0.02]} material={materials.steel} />
      ))}
      <Block position={[-0.5, 2.24, 0]} size={[0.5, 0.18, 0.4]} material={materials.fabricGrey} rotationY={0.1} />
    </group>
  )
}

export function Rug({ position, size, color = "#5a3a2e" }: { position: Vec3; size: [number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}

export function Beanbag({ position }: { position: Vec3 }) {
  return (
    <mesh position={position} scale={[0.52, 0.34, 0.5]} material={materials.fabricGrey} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 12]} />
    </mesh>
  )
}

export function Bench({ position, rotationY = 0, length = 2.4 }: PlacedProps & { length?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.14, 0, 0.14].map((z) => (
        <Block key={z} position={[0, 0.45, z]} size={[length, 0.04, 0.12]} material={materials.wood} />
      ))}
      {[-1, 1].map((side) => (
        <Block key={side} position={[side * (length / 2 - 0.2), 0.22, 0]} size={[0.06, 0.44, 0.42]} material={materials.metalDark} />
      ))}
    </group>
  )
}

export function Plant({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh material={materials.concreteDark} position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.19, 0.5, 12]} />
      </mesh>
      <mesh material={materials.woodDark} position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.5, 5]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          material={materials.leaf}
          position={[Math.sin(i * 1.3) * 0.18, 0.85 + i * 0.12, Math.cos(i * 1.3) * 0.18]}
          rotation={[0.6, i * 1.3, 0.3]}
          scale={[0.16, 0.34, 0.16]}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
    </group>
  )
}

export function Curtain({ position, width, height = 2.9 }: { position: Vec3; width: number; height?: number }) {
  const folds = Math.max(3, Math.round(width / 0.16))
  return (
    <group position={position}>
      {Array.from({ length: folds }, (_, i) => (
        <Block
          key={i}
          position={[-width / 2 + (i + 0.5) * (width / folds), height / 2, (i % 2) * 0.05]}
          size={[width / folds + 0.03, height, 0.03]}
          material={materials.fabricGrey}
        />
      ))}
    </group>
  )
}
