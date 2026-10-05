import { lazy, Suspense, type ReactNode } from "react"

import { ErrorBoundary } from "@/app/ErrorBoundary"
import { modelSlots, type ModelSlotId } from "@/data/models"

const GltfModel = lazy(() => import("./GltfModel"))

/**
 * Renders the external model configured in data/models.ts, or the procedural
 * placeholder while none is set (or if the file fails to load).
 */
export function ModelSlot({ slot, fallback }: { slot: ModelSlotId; fallback: ReactNode }) {
  const { url, scale } = modelSlots[slot]
  if (!url) return <>{fallback}</>
  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfModel url={url} scale={scale} />
      </Suspense>
    </ErrorBoundary>
  )
}
