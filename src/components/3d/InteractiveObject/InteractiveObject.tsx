import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type ReactNode } from "react"
import type { Group, Mesh } from "three"

import {
  interactions,
  type InteractionCategory,
  type InteractionDefinition,
  type InteractionType,
} from "@/data/interactions"
import { experienceStore } from "@/lib/experience/experienceStore"
import { both, type Localized } from "@/lib/i18n/language"
import { interact } from "@/lib/interaction/interact"
import { interactionStore } from "@/lib/interaction/interactionStore"
import { registerInteractive } from "@/lib/interaction/registry"
import { damp } from "@/lib/math/easing"

import { useFloor } from "../shared/FloorContext"
import { materials } from "../shared/materials"

type Vec3 = [number, number, number]
export type Reaction = "hop" | "wiggle" | "spin" | "none"

export interface InteractiveObjectProps {
  id: string
  /** Optional overrides; defaults come from src/data/interactions.ts. */
  title?: Localized
  description?: Localized
  category?: InteractionCategory
  interactionType?: InteractionType
  position?: Vec3
  rotation?: Vec3
  scale?: number | Vec3
  reaction?: Reaction
  /** Where the focus marker floats, relative to the object. */
  markerOffset?: Vec3
  /** Overrides the floor from context (e.g. elevator buttons travel with the car). */
  floorIndex?: number
  /** Max distance for mouse/touch clicks (the crosshair uses its own reach). */
  clickDistance?: number
  onInteract?: () => void
  children: ReactNode
}

const REACTION_DURATION: Record<Reaction, number> = { hop: 0.55, wiggle: 0.7, spin: 0.9, none: 0 }

export function InteractiveObject({
  id,
  title,
  description,
  category,
  interactionType,
  position,
  rotation,
  scale,
  reaction = "none",
  markerOffset = [0, 0.35, 0],
  floorIndex,
  clickDistance = 6,
  onInteract,
  children,
}: InteractiveObjectProps) {
  const floor = useFloor()
  const resolvedFloor = floorIndex ?? floor.index
  const gl = useThree((state) => state.gl)
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const marker = useRef<Mesh>(null)
  const reactionStart = useRef(-1)
  const clock = useThree((state) => state.clock)
  const onInteractRef = useRef(onInteract)
  useEffect(() => {
    onInteractRef.current = onInteract
  }, [onInteract])

  const definition = useMemo<InteractionDefinition>(() => {
    const base = interactions[id]
    if (!base && !title) console.warn(`InteractiveObject "${id}" has no entry in data/interactions.ts`)
    return {
      id,
      title: title ?? base?.title ?? both(id),
      description: description ?? base?.description ?? both(""),
      category: category ?? base?.category ?? "personal",
      interactionType: interactionType ?? base?.interactionType ?? "tooltip",
      body: base?.body,
      links: base?.links,
      floorId: base?.floorId,
      sound: base?.sound,
    }
  }, [id, title, description, category, interactionType])

  useEffect(() => {
    const object = outer.current
    if (!object) return
    return registerInteractive({
      definition,
      object,
      floorIndex: resolvedFloor,
      react: () => {
        reactionStart.current = clock.elapsedTime
      },
      onInteract: () => onInteractRef.current?.(),
    })
  }, [definition, resolvedFloor, clock])

  useFrame((state, delta) => {
    const { focusedId, hoveredId } = interactionStore.get()
    const highlighted = focusedId === id || hoveredId === id
    if (marker.current) {
      const target = highlighted ? 1 : 0
      const next = damp(marker.current.scale.x, target, 12, delta)
      marker.current.scale.setScalar(next < 0.001 ? 0 : next)
      marker.current.visible = next > 0.01
      marker.current.position.y = markerOffset[1] + Math.sin(state.clock.elapsedTime * 3) * 0.015
      marker.current.rotation.y += delta * 1.5
    }

    const group = inner.current
    if (!group || reactionStart.current < 0 || reaction === "none") return
    const progress = (state.clock.elapsedTime - reactionStart.current) / REACTION_DURATION[reaction]
    if (progress >= 1) {
      reactionStart.current = -1
      group.position.set(0, 0, 0)
      group.rotation.set(0, 0, 0)
      return
    }
    if (reaction === "hop") group.position.y = Math.sin(progress * Math.PI) * 0.06
    if (reaction === "wiggle") group.rotation.z = Math.sin(progress * Math.PI * 6) * 0.12 * (1 - progress)
    if (reaction === "spin") group.rotation.y = progress * Math.PI * 2
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // With the pointer locked, the crosshair decides what is clicked (see PlayerController).
    if (document.pointerLockElement || event.delta > 8) return
    event.stopPropagation()
    if (experienceStore.get().phase !== "explore") return
    if (event.distance > clickDistance) {
      if (!window.matchMedia("(pointer: coarse)").matches) {
        void Promise.resolve(gl.domElement.requestPointerLock()).catch(() => undefined)
      }
      return
    }
    interactionStore.set({ focusedId: id })
    interact(id)
  }

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (document.pointerLockElement || event.pointerType !== "mouse") return
    event.stopPropagation()
    interactionStore.set({ hoveredId: id })
    document.body.style.cursor = "pointer"
  }

  const handleOut = () => {
    if (interactionStore.get().hoveredId === id) interactionStore.set({ hoveredId: null })
    document.body.style.cursor = ""
  }

  return (
    <group
      ref={outer}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <group ref={inner}>{children}</group>
      <mesh
        ref={marker}
        position={markerOffset}
        material={materials.warmBulb}
        scale={0}
        visible={false}
        raycast={() => null}
      >
        <octahedronGeometry args={[0.028, 0]} />
      </mesh>
    </group>
  )
}
