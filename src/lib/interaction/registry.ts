import type { Object3D } from "three"

import type { InteractionDefinition } from "@/data/interactions"

/** Registered on floor -1, an object is reachable from any floor (elevator buttons). */
export const ANY_FLOOR = -1

export interface InteractiveEntry {
  definition: InteractionDefinition
  object: Object3D
  floorIndex: number
  /** Plays the object's own reaction (hop, wiggle...). */
  react: () => void
  onInteract?: () => void
}

const entries = new Map<string, InteractiveEntry>()

export function registerInteractive(entry: InteractiveEntry) {
  entries.set(entry.definition.id, entry)
  entry.object.userData.interactiveId = entry.definition.id
  return () => {
    if (entries.get(entry.definition.id) === entry) entries.delete(entry.definition.id)
  }
}

export function getInteractive(id: string) {
  return entries.get(id)
}

export function getInteractiveObjects(floorIndex: number): Object3D[] {
  const objects: Object3D[] = []
  entries.forEach((entry) => {
    if (entry.floorIndex === floorIndex || entry.floorIndex === ANY_FLOOR) objects.push(entry.object)
  })
  return objects
}

/** Walks up from a raycast hit to the InteractiveObject group that owns it. */
export function findInteractiveId(object: Object3D | null): string | null {
  let current = object
  while (current) {
    const id = current.userData.interactiveId as string | undefined
    if (id) return id
    current = current.parent
  }
  return null
}
