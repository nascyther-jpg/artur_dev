import { Vector3 } from "three"

import { easeInOutCubic } from "@/lib/math/easing"

export interface LookAngles {
  yaw: number
  pitch: number
}

interface ScriptedMove {
  from: Vector3
  to: Vector3
  fromLook: LookAngles
  toLook: LookAngles
  elapsed: number
  duration: number
  ease: (t: number) => number
  resolve: () => void
}

/**
 * The camera rig state. Both the user controls and scripted sequences
 * (intro, elevator, tour) write here; PlayerController applies it to the camera.
 */
export const player = {
  position: new Vector3(0, 4.5, 26),
  yaw: 0,
  pitch: 0.1,
  targetYaw: 0,
  targetPitch: 0.1,
  velocity: { x: 0, z: 0 },
  /** Extra field-of-view zoom from the mouse wheel, in degrees. */
  zoom: 0,
  script: null as ScriptedMove | null,
}

/** Yaw/pitch that make the camera at `from` look at `target` (camera looks down -Z at yaw 0). */
export function anglesTo(from: Vector3, target: Vector3): LookAngles {
  const dx = target.x - from.x
  const dy = target.y - from.y
  const dz = target.z - from.z
  return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }
}

export function placePlayer(position: Vector3, look: LookAngles) {
  cancelScript()
  player.position.copy(position)
  player.yaw = player.targetYaw = look.yaw
  player.pitch = player.targetPitch = look.pitch
  player.velocity.x = player.velocity.z = 0
}

/** Moves the camera along a straight line; resolves when done or cancelled. */
export function moveTo(
  to: Vector3,
  look: LookAngles,
  duration: number,
  ease: (t: number) => number = easeInOutCubic,
): Promise<void> {
  cancelScript()
  return new Promise((resolve) => {
    player.velocity.x = player.velocity.z = 0
    player.script = {
      from: player.position.clone(),
      to: to.clone(),
      fromLook: { yaw: player.yaw, pitch: player.pitch },
      toLook: look,
      elapsed: 0,
      duration: Math.max(0.01, duration),
      ease,
      resolve,
    }
  })
}

export function cancelScript() {
  const script = player.script
  if (!script) return
  player.script = null
  player.targetYaw = player.yaw
  player.targetPitch = player.pitch
  script.resolve()
}
