import { Vector3 } from "three"

import { ELEVATOR, EYE_HEIGHT, floorBaseY, YAW_FACING_FRONT } from "@/data/building"
import { categoryLabels, interactions } from "@/data/interactions"
import { tourStart, tourStops } from "@/data/tour"
import { audioEngine } from "@/lib/audio/audioEngine"
import { both } from "@/lib/i18n/language"
import { experienceStore } from "@/lib/experience/experienceStore"
import { releasePointerLock } from "@/lib/interaction/interact"
import { clearTooltip, closeInteraction, showTooltip } from "@/lib/interaction/interactionStore"
import { getInteractive } from "@/lib/interaction/registry"

import { carCenter, requestTravel, veilTeleport, wait } from "../Elevator/elevatorController"
import { anglesTo, cancelScript, moveTo, player } from "./player"

const WALK_SPEED = 1.5
let runId = 0

const toWorld = (floor: number, [x, z]: [number, number]) =>
  new Vector3(x, floorBaseY(floor) + EYE_HEIGHT, z)

async function walk(target: Vector3, lookAt?: Vector3) {
  const distance = player.position.distanceTo(target)
  const look = lookAt
    ? anglesTo(target, lookAt)
    : distance > 0.05
      ? anglesTo(player.position, new Vector3(target.x, player.position.y, target.z))
      : { yaw: player.yaw, pitch: player.pitch }
  await moveTo(target, look, Math.max(1.1, distance / WALK_SPEED))
}

async function rideTo(floor: number, alive: () => boolean) {
  const current = experienceStore.get().floorIndex
  await walk(toWorld(current, [ELEVATOR.exitPoint.x, ELEVATOR.exitPoint.z]))
  if (!alive()) return
  await moveTo(carCenter(current), { yaw: 0, pitch: 0 }, 1.1)
  if (!alive()) return
  await moveTo(carCenter(current), { yaw: YAW_FACING_FRONT, pitch: 0 }, 0.8)
  if (!alive()) return
  await requestTravel(floor, { stepOut: false })
}

export function stopTour() {
  if (!experienceStore.get().touring) return
  runId++
  cancelScript()
  clearTooltip()
  experienceStore.set({ touring: false })
}

export async function startTour() {
  const state = experienceStore.get()
  if (state.phase !== "explore" || state.touring || state.elevatorPhase !== "open") return

  const id = ++runId
  const alive = () => id === runId
  experienceStore.set({ touring: true })
  closeInteraction()
  releasePointerLock()

  try {
    if (state.floorIndex !== tourStart.floor) {
      await requestTravel(tourStart.floor, { stepOut: false })
      if (!alive()) return
    }
    const start = toWorld(tourStart.floor, tourStart.position)
    await veilTeleport(start, anglesTo(start, new Vector3(...tourStart.lookAt)))

    for (const stop of tourStops) {
      if (!alive()) return
      if (stop.floor !== experienceStore.get().floorIndex) {
        await rideTo(stop.floor, alive)
        if (!alive()) return
      }
      for (const point of stop.path ?? []) {
        await walk(toWorld(stop.floor, point))
        if (!alive()) return
      }
      const [lx, ly, lz] = stop.lookAt
      await walk(toWorld(stop.floor, stop.position), new Vector3(lx, floorBaseY(stop.floor) + ly, lz))
      if (!alive()) return

      const holdMs = stop.holdMs ?? 4000
      const definition = stop.interactionId ? interactions[stop.interactionId] : undefined
      if (definition) {
        getInteractive(definition.id)?.react()
        audioEngine.play("blip")
        showTooltip({
          category: categoryLabels[definition.category],
          title: definition.title,
          text: definition.description,
          durationMs: holdMs,
        })
      } else if (stop.caption) {
        showTooltip({ category: both("Tour"), ...stop.caption, durationMs: holdMs })
      }
      await wait(holdMs)
    }
  } finally {
    if (alive()) experienceStore.set({ touring: false })
  }
}
