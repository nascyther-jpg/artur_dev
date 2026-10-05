import { Vector3 } from "three"

import { ELEVATOR, EYE_HEIGHT, floorBaseY, YAW_FACING_FRONT } from "@/data/building"
import { floors } from "@/data/floors"
import { audioEngine } from "@/lib/audio/audioEngine"
import { experienceStore } from "@/lib/experience/experienceStore"
import { easeInOutCubic } from "@/lib/math/easing"

import { moveTo, placePlayer, player } from "../Camera/player"

/** Mutable per-frame elevator state (not React state). */
export const elevator = {
  carY: 0,
  /** 0 = closed, 1 = open. */
  doorOpen: 1,
  fromY: 0,
  toY: 0,
  elapsed: 0,
  duration: 1,
  stepOut: true,
  pending: [] as (() => void)[],
}

export const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export function isInsideCar(x: number, z: number) {
  const { shaft } = ELEVATOR
  return x > shaft.minX && x < shaft.maxX && z > shaft.minZ && z < shaft.maxZ
}

export function carCenter(floorIndex: number) {
  return new Vector3(ELEVATOR.carCenter.x, floorBaseY(floorIndex) + EYE_HEIGHT, ELEVATOR.carCenter.z)
}

/** Hides a teleport behind a short black fade. */
export async function veilTeleport(position: Vector3, look: { yaw: number; pitch: number }) {
  experienceStore.set({ veil: true })
  await wait(320)
  placePlayer(position, look)
  await wait(90)
  experienceStore.set({ veil: false })
}

/**
 * Takes the player to another floor. If they are not in the car yet
 * (floor navigation UI), they are first placed inside it behind a fade.
 */
export async function requestTravel(to: number, options: { stepOut?: boolean } = {}) {
  const state = experienceStore.get()
  if (state.phase !== "explore" || state.elevatorPhase !== "open") return
  if (to < 0 || to >= floors.length || to === state.floorIndex) return

  if (!isInsideCar(player.position.x, player.position.z)) {
    await veilTeleport(carCenter(state.floorIndex), { yaw: YAW_FACING_FRONT, pitch: 0 })
  }

  elevator.stepOut = options.stepOut ?? true
  audioEngine.play("door")
  experienceStore.set({ elevatorPhase: "closing", targetFloorIndex: to })
  return new Promise<void>((resolve) => elevator.pending.push(resolve))
}

export function tickElevator(dt: number) {
  const state = experienceStore.get()
  switch (state.elevatorPhase) {
    case "open":
      elevator.carY = floorBaseY(state.floorIndex)
      elevator.doorOpen = 1
      break

    case "closing":
      elevator.doorOpen = Math.max(0, elevator.doorOpen - dt / ELEVATOR.doorDuration)
      if (elevator.doorOpen === 0) {
        elevator.fromY = floorBaseY(state.floorIndex)
        elevator.toY = floorBaseY(state.targetFloorIndex)
        elevator.elapsed = 0
        elevator.duration = 1.6 + 0.55 * Math.abs(state.targetFloorIndex - state.floorIndex)
        audioEngine.startHum()
        experienceStore.set({ elevatorPhase: "moving" })
      }
      break

    case "moving": {
      elevator.elapsed += dt
      const progress = Math.min(1, elevator.elapsed / elevator.duration)
      elevator.carY = elevator.fromY + (elevator.toY - elevator.fromY) * easeInOutCubic(progress)
      if (progress === 1) {
        audioEngine.stopHum()
        audioEngine.play("ding")
        experienceStore.set({ elevatorPhase: "opening", floorIndex: state.targetFloorIndex })
      }
      break
    }

    case "opening":
      elevator.doorOpen = Math.min(1, elevator.doorOpen + dt / ELEVATOR.doorDuration)
      if (elevator.doorOpen === 1) {
        experienceStore.set({ elevatorPhase: "open" })
        const pending = elevator.pending.splice(0)
        pending.forEach((resolve) => resolve())
        if (elevator.stepOut && !state.touring && isInsideCar(player.position.x, player.position.z)) {
          const base = floorBaseY(state.floorIndex)
          void moveTo(
            new Vector3(ELEVATOR.exitPoint.x, base + EYE_HEIGHT, ELEVATOR.exitPoint.z),
            { yaw: YAW_FACING_FRONT, pitch: 0 },
            1.3,
          )
        }
      }
      break
  }
}
