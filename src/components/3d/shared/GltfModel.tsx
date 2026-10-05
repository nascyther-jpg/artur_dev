import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"

/** Loaded on demand by ModelSlot, so the glTF/Draco/Meshopt loaders only ship when a model is configured. */
export default function GltfModel({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}${url}`)
  const model = useMemo(() => scene.clone(true), [scene])
  return <primitive object={model} scale={scale} />
}
