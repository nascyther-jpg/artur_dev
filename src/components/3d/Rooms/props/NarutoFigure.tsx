import { MeshStandardMaterial } from "three"

import { ModelSlot } from "../../shared/ModelSlot"

// Stylized low-poly placeholder (about 25 cm tall). Replace it with a real model by
// setting `modelSlots.naruto.url` in src/data/models.ts.

const orange = new MeshStandardMaterial({ color: "#e8772e", roughness: 0.55 })
const navy = new MeshStandardMaterial({ color: "#1f2a44", roughness: 0.6 })
const skin = new MeshStandardMaterial({ color: "#f0c8a0", roughness: 0.6 })
const hair = new MeshStandardMaterial({ color: "#f2c230", roughness: 0.5 })
const plate = new MeshStandardMaterial({ color: "#c9ccd1", roughness: 0.25, metalness: 0.9 })
const base = new MeshStandardMaterial({ color: "#121316", roughness: 0.4 })
const eyes = new MeshStandardMaterial({ color: "#2b5fa8", roughness: 0.3 })

const SPIKES: [number, number, number, number, number][] = [
  // x, y, z, tiltX, tiltZ
  [0, 0.05, 0, 0, 0],
  [0.03, 0.04, 0.01, 0.2, -0.9],
  [-0.03, 0.04, 0.01, 0.2, 0.9],
  [0.02, 0.035, -0.03, -0.8, -0.5],
  [-0.02, 0.035, -0.03, -0.8, 0.5],
  [0, 0.02, -0.04, -1.3, 0],
  [0.04, 0.01, -0.01, -0.3, -1.4],
  [-0.04, 0.01, -0.01, -0.3, 1.4],
  [0.015, 0.045, 0.03, 0.8, -0.3],
  [-0.015, 0.045, 0.03, 0.8, 0.3],
]

function Placeholder() {
  return (
    <group>
      <mesh material={base} position={[0, 0.007, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.065, 0.014, 24]} />
      </mesh>
      {/* Legs and sandals */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh material={orange} position={[side * 0.019, 0.052, 0]} castShadow>
            <boxGeometry args={[0.028, 0.07, 0.03]} />
          </mesh>
          <mesh material={navy} position={[side * 0.019, 0.02, 0.005]}>
            <boxGeometry args={[0.03, 0.014, 0.04]} />
          </mesh>
        </group>
      ))}
      {/* Jacket */}
      <mesh material={orange} position={[0, 0.118, 0]} castShadow>
        <boxGeometry args={[0.072, 0.072, 0.046]} />
      </mesh>
      <mesh material={navy} position={[0, 0.151, 0]}>
        <boxGeometry args={[0.074, 0.016, 0.048]} />
      </mesh>
      <mesh material={plate} position={[0, 0.13, 0.024]}>
        <boxGeometry args={[0.006, 0.05, 0.002]} />
      </mesh>
      {/* Arms: one relaxed, one raised in a thumbs-up */}
      <mesh material={orange} position={[-0.048, 0.115, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.022, 0.066, 0.022]} />
      </mesh>
      <mesh material={skin} position={[-0.055, 0.078, 0]}>
        <sphereGeometry args={[0.012, 8, 6]} />
      </mesh>
      <mesh material={orange} position={[0.05, 0.14, 0.015]} rotation={[-0.9, 0, 0.5]} castShadow>
        <boxGeometry args={[0.022, 0.066, 0.022]} />
      </mesh>
      <mesh material={skin} position={[0.064, 0.172, 0.04]}>
        <sphereGeometry args={[0.012, 8, 6]} />
      </mesh>
      {/* Head, headband and hair */}
      <group position={[0, 0.195, 0]}>
        <mesh material={skin} castShadow>
          <sphereGeometry args={[0.038, 16, 12]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} material={eyes} position={[side * 0.013, 0.002, 0.034]}>
            <sphereGeometry args={[0.005, 6, 4]} />
          </mesh>
        ))}
        <mesh material={navy} position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.0395, 0.0395, 0.012, 20, 1, true]} />
        </mesh>
        <mesh material={plate} position={[0, 0.014, 0.039]}>
          <boxGeometry args={[0.032, 0.013, 0.004]} />
        </mesh>
        {SPIKES.map(([x, y, z, tiltX, tiltZ], i) => (
          <mesh key={i} material={hair} position={[x, y, z]} rotation={[tiltX, 0, tiltZ]} castShadow>
            <coneGeometry args={[0.016, 0.05, 5]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function NarutoFigure() {
  return <ModelSlot slot="naruto" fallback={<Placeholder />} />
}
