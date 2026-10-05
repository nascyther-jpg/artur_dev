import type { Localized } from "@/lib/i18n/language"
import { createStore } from "@/lib/store/createStore"
import { readBoolean, writeBoolean } from "@/lib/storage"

/** "site" is the editorial portfolio (default); "3d" is the explorable building. */
export type ExperienceMode = "site" | "3d" | "fallback"
/** loading → ready (exterior view + "Entrar") → intro (camera flies in) → explore */
export type ExperiencePhase = "loading" | "ready" | "intro" | "explore"
export type ElevatorPhase = "open" | "closing" | "moving" | "opening"

export interface ExperienceState {
  mode: ExperienceMode
  fallbackReason: Localized | null
  phase: ExperiencePhase
  loadTarget: number
  loadLabel: Localized
  /** Floor the player (and the elevator car) is on. */
  floorIndex: number
  /** Destination while the elevator travels; equals floorIndex otherwise. */
  targetFloorIndex: number
  elevatorPhase: ElevatorPhase
  inElevator: boolean
  /** Id of the FloorArea the player is standing in. */
  area: string | null
  pointerLocked: boolean
  touring: boolean
  /** Full-screen black fade used to hide teleports. */
  veil: boolean
  soundOn: boolean
  performanceMode: boolean
}

const KEYS = {
  sound: "portfolio:sound",
  performance: "portfolio:performance",
} as const

/** The 3D building opens from a button or a shared link ending in #3d. */
const HASH_3D = "#3d"

export const experienceStore = createStore<ExperienceState>({
  mode: window.location.hash === HASH_3D ? "3d" : "site",
  fallbackReason: null,
  phase: "loading",
  loadTarget: 0,
  loadLabel: { pt: "Preparando", en: "Preparing" },
  floorIndex: 0,
  targetFloorIndex: 0,
  elevatorPhase: "open",
  inElevator: false,
  area: null,
  pointerLocked: false,
  touring: false,
  veil: false,
  soundOn: readBoolean(KEYS.sound, true),
  performanceMode: readBoolean(KEYS.performance, false),
})

export function reportLoad(target: number, label: Localized) {
  const { loadTarget } = experienceStore.get()
  if (target > loadTarget) experienceStore.set({ loadTarget: target, loadLabel: label })
}

export function setSound(on: boolean) {
  writeBoolean(KEYS.sound, on)
  experienceStore.set({ soundOn: on })
}

export function setPerformanceMode(on: boolean) {
  writeBoolean(KEYS.performance, on)
  experienceStore.set({ performanceMode: on })
}

export function set3DMode(on: boolean) {
  const { pathname, search } = window.location
  window.history.replaceState(null, "", on ? HASH_3D : pathname + search)
  if (!on) window.scrollTo(0, 0)
  experienceStore.set({
    mode: on ? "3d" : "site",
    // Entering 3D mounts a fresh scene, so the whole session restarts.
    phase: "loading",
    loadTarget: 0,
    floorIndex: 0,
    targetFloorIndex: 0,
    elevatorPhase: "open",
    inElevator: false,
    area: null,
    touring: false,
    veil: false,
  })
}

export function enterFallback(reason: Localized) {
  experienceStore.set({ mode: "fallback", fallbackReason: reason, touring: false })
}
