import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import {
  BackSide,
  Color,
  Fog,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  ShaderMaterial,
} from "three"
import { useThree } from "@react-three/fiber"

import { createCanvasTexture, seededRandom } from "../shared/canvasTexture"
import { materials, unitBox } from "../shared/materials"
import { useQuality } from "../shared/QualityContext"

const SKY = { top: "#04060a", horizon: "#1a2130", glow: "#3b2d27" }
const FOG_COLOR = "#131820"

function Sky() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        uniforms: {
          top: { value: new Color(SKY.top) },
          horizon: { value: new Color(SKY.horizon) },
          glow: { value: new Color(SKY.glow) },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDirection;
          void main() {
            vDirection = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 top;
          uniform vec3 horizon;
          uniform vec3 glow;
          varying vec3 vDirection;
          void main() {
            float h = vDirection.y;
            vec3 color = mix(horizon, top, smoothstep(0.0, 0.5, h));
            color += glow * exp(-abs(h) * 12.0) * 0.8;
            color = mix(color, horizon * 0.35, smoothstep(0.0, -0.2, h));
            gl_FragColor = vec4(color, 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])
  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[450, 32, 16]} />
    </mesh>
  )
}

/** Distant city as a single instanced mesh with a lit-windows texture. */
function City() {
  const { cityBuildings } = useQuality()
  const mesh = useRef<InstancedMesh>(null)

  const material = useMemo(() => {
    const windows = createCanvasTexture(64, 128, (context, width, height) => {
      const random = seededRandom(3)
      context.fillStyle = "#000"
      context.fillRect(0, 0, width, height)
      for (let y = 4; y < height - 4; y += 6) {
        for (let x = 3; x < width - 3; x += 5) {
          if (random() < 0.28) {
            const warm = random() < 0.7
            context.fillStyle = warm ? `rgba(255, 206, 150, ${0.45 + random() * 0.5})` : `rgba(190, 210, 255, ${0.3 + random() * 0.4})`
            context.fillRect(x, y, 3, 3)
          }
        }
      }
    })
    return new MeshStandardMaterial({
      color: "#16181c",
      roughness: 0.9,
      emissive: "#ffffff",
      emissiveMap: windows,
      emissiveIntensity: 0.55,
    })
  }, [])

  useEffect(
    () => () => {
      material.emissiveMap?.dispose()
      material.dispose()
    },
    [material],
  )

  useLayoutEffect(() => {
    const instanced = mesh.current
    if (!instanced) return
    const random = seededRandom(42)
    const dummy = new Object3D()
    const tint = new Color()
    for (let i = 0; i < cityBuildings; i++) {
      const angle = random() * Math.PI * 2
      const radius = 48 + random() * 120
      const width = 8 + random() * 14
      const depth = 8 + random() * 14
      const height = 10 + random() * random() * 70
      dummy.position.set(Math.cos(angle) * radius, height / 2 - 0.05, Math.sin(angle) * radius)
      dummy.rotation.set(0, random() * Math.PI, 0)
      dummy.scale.set(width, height, depth)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
      instanced.setColorAt(i, tint.setHSL(0.6, 0.05, 0.08 + random() * 0.06))
    }
    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    instanced.computeBoundingSphere()
  }, [cityBuildings])

  return <instancedMesh key={cityBuildings} ref={mesh} args={[unitBox, material, cityBuildings]} />
}

function StreetLamp({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={unitBox} material={materials.metalDark} position={[0, 2.2, 0]} scale={[0.1, 4.4, 0.1]} />
      <mesh geometry={unitBox} material={materials.metalDark} position={[0, 4.4, -0.35]} scale={[0.12, 0.08, 0.8]} />
      <mesh geometry={unitBox} material={materials.warmBulb} position={[0, 4.34, -0.6]} scale={[0.22, 0.04, 0.3]} />
    </group>
  )
}

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh material={materials.woodDark} position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 2, 6]} />
      </mesh>
      <mesh material={materials.leaf} position={[0, 2.7, 0]} castShadow>
        <icosahedronGeometry args={[1.3, 0]} />
      </mesh>
    </group>
  )
}

export function Exterior() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new Fog(FOG_COLOR, 35, 190)
    scene.background = new Color(FOG_COLOR)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])

  return (
    <group>
      <Sky />
      <City />
      {/* Street, plaza and sidewalk. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#121315" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 6]} receiveShadow material={materials.polishedConcrete}>
        <planeGeometry args={[34, 26]} />
      </mesh>
      <mesh geometry={unitBox} material={materials.concrete} position={[0, -0.02, 19.2]} scale={[34, 0.08, 0.3]} receiveShadow />
      {[-15, -5, 5, 15].map((x) => (
        <StreetLamp key={x} x={x} z={18.4} />
      ))}
      <Tree x={-10} z={9} />
      <Tree x={10.5} z={8} scale={1.1} />
      <Tree x={-12} z={1} scale={0.9} />
      <Tree x={12.5} z={0} />
    </group>
  )
}
