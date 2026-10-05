// Slots for external 3D models. While `url` is null the procedural placeholder is rendered.
// Drop a .glb in public/models and set its path here (e.g. "models/naruto.glb").

export interface ModelSlotDefinition {
  url: string | null
  /** Uniform scale applied to the loaded model. */
  scale: number
}

export type ModelSlotId = "naruto"

export const modelSlots: Record<ModelSlotId, ModelSlotDefinition> = {
  naruto: { url: null, scale: 1 },
}
