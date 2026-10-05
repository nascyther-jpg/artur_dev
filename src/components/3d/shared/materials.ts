import { BoxGeometry, DoubleSide, MeshStandardMaterial } from "three"

import { createCanvasTexture, seededRandom } from "./canvasTexture"

// Shared geometry/materials: every mesh reuses them, which keeps shader programs
// and GPU memory low. They live for the whole session, so they are never disposed.

/** 1×1×1 box scaled per mesh. */
export const unitBox = new BoxGeometry(1, 1, 1)

function speckle(base: string, seed: number, spots: string[], count: number) {
  return createCanvasTexture(
    256,
    256,
    (context, width, height) => {
      const random = seededRandom(seed)
      context.fillStyle = base
      context.fillRect(0, 0, width, height)
      for (let i = 0; i < count; i++) {
        context.fillStyle = spots[i % spots.length]
        context.globalAlpha = 0.05 + random() * 0.12
        const size = 1 + random() * 3
        context.fillRect(random() * width, random() * height, size, size)
      }
      context.globalAlpha = 1
    },
    true,
  )
}

function planks() {
  return createCanvasTexture(
    512,
    512,
    (context, width, height) => {
      const random = seededRandom(7)
      const rows = 8
      const rowHeight = height / rows
      for (let row = 0; row < rows; row++) {
        let x = -random() * 200
        while (x < width) {
          const length = 180 + random() * 220
          const tone = 70 + random() * 26
          context.fillStyle = `rgb(${tone + 22}, ${tone - 4}, ${tone - 26})`
          context.fillRect(x, row * rowHeight, length, rowHeight)
          context.strokeStyle = "rgba(0,0,0,0.35)"
          context.lineWidth = 2
          context.strokeRect(x, row * rowHeight, length, rowHeight)
          for (let grain = 0; grain < 6; grain++) {
            context.strokeStyle = `rgba(30,18,10,${0.08 + random() * 0.08})`
            context.lineWidth = 1
            const y = row * rowHeight + random() * rowHeight
            context.beginPath()
            context.moveTo(x, y)
            context.bezierCurveTo(x + length / 3, y + 3, x + (2 * length) / 3, y - 3, x + length, y)
            context.stroke()
          }
          x += length
        }
      }
    },
    true,
  )
}

// Walls use the scaled unit box, so a texture would stretch with each wall; they stay flat-shaded.
const polishedMap = speckle("#6f6d69", 23, ["#3f3d3a", "#9b9892", "#57544f"], 1800)
polishedMap.repeat.set(6, 6)
const woodFloorMap = planks()
woodFloorMap.repeat.set(3, 3)

const standard = (parameters: ConstructorParameters<typeof MeshStandardMaterial>[0]) =>
  new MeshStandardMaterial(parameters)

export const materials = {
  concrete: standard({ color: "#6f6d69", roughness: 0.95 }),
  concreteDark: standard({ color: "#3e3c3a", roughness: 0.92 }),
  polishedConcrete: standard({ color: "#8a8883", map: polishedMap, roughness: 0.45, metalness: 0.05 }),
  plaster: standard({ color: "#8f8a82", roughness: 0.9 }),
  paintedWall: standard({ color: "#3f4843", roughness: 0.88 }),
  woodFloor: standard({ color: "#b89a82", map: woodFloorMap, roughness: 0.7 }),
  woodDark: standard({ color: "#3a2a20", roughness: 0.65 }),
  wood: standard({ color: "#7a5537", roughness: 0.6 }),
  metalDark: standard({ color: "#26282b", roughness: 0.4, metalness: 0.75 }),
  steel: standard({ color: "#9aa0a6", roughness: 0.28, metalness: 0.9 }),
  blackPlastic: standard({ color: "#141516", roughness: 0.55 }),
  greyPlastic: standard({ color: "#55585c", roughness: 0.6 }),
  fabricBlue: standard({ color: "#3d4b5c", roughness: 1 }),
  fabricWarm: standard({ color: "#7a4a36", roughness: 1 }),
  fabricGrey: standard({ color: "#5b5e62", roughness: 1 }),
  fabricLight: standard({ color: "#d8d3ca", roughness: 1 }),
  paper: standard({ color: "#ece8df", roughness: 0.9 }),
  leaf: standard({ color: "#3f5a3a", roughness: 0.85, side: DoubleSide }),
  ceramic: standard({ color: "#d9d4cc", roughness: 0.35 }),
  glass: standard({
    color: "#9fb3c4",
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  }),
  warmBulb: standard({ color: "#fff1d6", emissive: "#ffcf8a", emissiveIntensity: 2.2 }),
  coolPanel: standard({ color: "#eef3ff", emissive: "#dfe9ff", emissiveIntensity: 1.4 }),
  ledGreen: standard({ color: "#1c3a26", emissive: "#3fdc7a", emissiveIntensity: 1.5 }),
  ledRed: standard({ color: "#3a1c1c", emissive: "#ff4a3d", emissiveIntensity: 2 }),
}

export type MaterialName = keyof typeof materials
