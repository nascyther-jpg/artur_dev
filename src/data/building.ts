// Shared dimensions of the building, in meters. Every floor uses the same footprint.

export const FLOOR_HEIGHT = 4
export const SLAB_THICKNESS = 0.25
export const WALL_HEIGHT = FLOOR_HEIGHT - SLAB_THICKNESS
export const WALL_THICKNESS = 0.2
export const EYE_HEIGHT = 1.62
export const PLAYER_RADIUS = 0.28

/** Interior bounds (inner face of the facade walls). */
export const INTERIOR = { minX: -7, maxX: 7, minZ: -5, maxZ: 5 } as const

/** Elevator shaft in the back-left corner; its door faces +Z. */
export const ELEVATOR = {
  shaft: { minX: -7, maxX: -4.5, minZ: -5, maxZ: -2.5 },
  door: { minX: -6.35, maxX: -5.15, z: -2.5, height: 2.3 },
  carCenter: { x: -5.75, z: -3.75 },
  /** Where the camera settles after stepping out on arrival. */
  exitPoint: { x: -5.75, z: -1.5 },
  doorDuration: 0.9,
} as const

/** Yaw that makes the camera look toward +Z (out of the elevator). */
export const YAW_FACING_FRONT = Math.PI

export const floorBaseY = (index: number) => index * FLOOR_HEIGHT
