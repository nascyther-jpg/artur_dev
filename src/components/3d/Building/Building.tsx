import { Suspense } from "react"

import { floorBaseY } from "@/data/building"
import { floors } from "@/data/floors"
import { experienceStore } from "@/lib/experience/experienceStore"

import { FloorContent } from "../Floors/FloorContent"
import { FloorContext } from "../shared/FloorContext"
import { FloorShell } from "./FloorShell"
import { Roof } from "./Roof"

/** The whole tower. Only the floor(s) the player can see get interiors and colliders. */
export function Building() {
  const current = experienceStore.use((state) => state.floorIndex)
  const target = experienceStore.use((state) => state.targetFloorIndex)

  return (
    <group>
      {floors.map((floor, index) => {
        const detailed = index === current || index === target
        return (
          <FloorContext.Provider key={floor.id} value={{ index, floor }}>
            <group position={[0, floorBaseY(index), 0]}>
              <FloorShell floor={floor} index={index} detailed={detailed} />
              {detailed && (
                <Suspense fallback={null}>
                  <FloorContent floor={floor} />
                </Suspense>
              )}
            </group>
          </FloorContext.Provider>
        )
      })}
      <Roof y={floorBaseY(floors.length)} />
    </group>
  )
}
