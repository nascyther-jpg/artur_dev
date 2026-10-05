// Command bus between the DOM UI (main bundle) and the 3D scene (lazy chunk),
// so UI code never has to import three.js.

export interface ExperienceCommands {
  travelTo: (floorIndex: number) => void
  startTour: () => void
  stopTour: () => void
  enter: () => void
  requestPointerLock: () => void
}

let implementation: Partial<ExperienceCommands> = {}

export function registerCommands(commands: ExperienceCommands) {
  implementation = commands
  return () => {
    if (implementation === commands) implementation = {}
  }
}

export const commands: ExperienceCommands = {
  travelTo: (floorIndex) => implementation.travelTo?.(floorIndex),
  startTour: () => implementation.startTour?.(),
  stopTour: () => implementation.stopTour?.(),
  enter: () => implementation.enter?.(),
  requestPointerLock: () => implementation.requestPointerLock?.(),
}
