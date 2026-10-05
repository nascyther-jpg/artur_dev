import type { ComponentType } from "react"

import type { FloorDefinition, FloorId } from "@/data/floors"

import { GroundFloor } from "./GroundFloor"
import { OriginFloor } from "./OriginFloor"
import { PlaceholderFloor } from "./PlaceholderFloor"

// Register each floor's interior here once it is built; unregistered floors get the placeholder.
const FLOOR_COMPONENTS: Partial<Record<FloorId, ComponentType>> = {
  ground: GroundFloor,
  origin: OriginFloor,
}

export function FloorContent({ floor }: { floor: FloorDefinition }) {
  const Content = FLOOR_COMPONENTS[floor.id]
  return Content ? <Content /> : <PlaceholderFloor floor={floor} />
}
