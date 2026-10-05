import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Color, type AmbientLight, type DirectionalLight, type HemisphereLight } from "three"

import { floorBaseY } from "@/data/building"
import { floors } from "@/data/floors"
import { experienceStore } from "@/lib/experience/experienceStore"
import { damp } from "@/lib/math/easing"

import { useQuality } from "../shared/QualityContext"

const BLEND = 2.5

/**
 * Global lights follow the active floor and blend toward its mood
 * (warm bedroom, neutral study, cold lab...) instead of switching abruptly.
 */
export function FloorLighting() {
  const quality = useQuality()
  const ambient = useRef<AmbientLight>(null)
  const hemisphere = useRef<HemisphereLight>(null)
  const key = useRef<DirectionalLight>(null)
  const scratch = useMemo(() => new Color(), [])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const { floorIndex, elevatorPhase, targetFloorIndex } = experienceStore.get()
    const lighting = floors[floorIndex].lighting
    const t = 1 - Math.exp(-BLEND * delta)

    if (ambient.current) {
      ambient.current.color.lerp(scratch.set(lighting.ambient.color), t)
      ambient.current.intensity = damp(ambient.current.intensity, lighting.ambient.intensity, BLEND, delta)
    }
    if (hemisphere.current) {
      hemisphere.current.color.lerp(scratch.set(lighting.hemisphere.sky), t)
      hemisphere.current.groundColor.lerp(scratch.set(lighting.hemisphere.ground), t)
      hemisphere.current.intensity = damp(hemisphere.current.intensity, lighting.hemisphere.intensity, BLEND, delta)
    }
    const light = key.current
    if (light) {
      // While travelling the key light waits for the destination, so the new floor is lit on arrival.
      const base = floorBaseY(elevatorPhase === "moving" ? targetFloorIndex : floorIndex)
      light.position.set(10, base + 9, 9)
      light.target.position.set(0, base, 0)
      light.target.updateMatrixWorld()
      light.color.lerp(scratch.set(lighting.key.color), t)
      light.intensity = damp(light.intensity, lighting.key.intensity, BLEND, delta)
    }
  })

  const initial = floors[0].lighting
  return (
    <>
      <ambientLight ref={ambient} color={initial.ambient.color} intensity={initial.ambient.intensity} />
      <hemisphereLight ref={hemisphere} args={[initial.hemisphere.sky, initial.hemisphere.ground, initial.hemisphere.intensity]} />
      <directionalLight
        ref={key}
        color={initial.key.color}
        intensity={initial.key.intensity}
        castShadow={quality.shadows}
        shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
    </>
  )
}
