import { createContext, useContext } from "react"

import type { FloorDefinition } from "@/data/floors"

export interface FloorContextValue {
  index: number
  floor: FloorDefinition | null
}

/** Tells nested props which floor they belong to (colliders, interactives). */
export const FloorContext = createContext<FloorContextValue>({ index: 0, floor: null })

export const useFloor = () => useContext(FloorContext)
