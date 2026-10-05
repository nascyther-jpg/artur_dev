// Raw input shared by keyboard, mouse, touch joystick and the player controller.
// Plain mutable object: it is read every frame, so it must not trigger React renders.

export const input = {
  keys: new Set<string>(),
  /** Virtual joystick, x = strafe, y = forward, both in [-1, 1]. */
  joystick: { x: 0, y: 0 },
  lookDeltaX: 0,
  lookDeltaY: 0,
  wheel: 0,
}

const FORWARD = ["KeyW", "ArrowUp"]
const BACKWARD = ["KeyS", "ArrowDown"]
const LEFT = ["KeyA", "ArrowLeft"]
const RIGHT = ["KeyD", "ArrowRight"]
export const MOVEMENT_KEYS = new Set([...FORWARD, ...BACKWARD, ...LEFT, ...RIGHT])

const pressed = (codes: string[]) => codes.some((code) => input.keys.has(code))

/** Movement intent in camera space: x = right, y = forward. */
export function readMoveIntent() {
  let x = input.joystick.x
  let y = input.joystick.y
  if (pressed(FORWARD)) y += 1
  if (pressed(BACKWARD)) y -= 1
  if (pressed(RIGHT)) x += 1
  if (pressed(LEFT)) x -= 1
  const length = Math.hypot(x, y)
  if (length > 1) {
    x /= length
    y /= length
  }
  return { x, y, sprint: input.keys.has("ShiftLeft") || input.keys.has("ShiftRight") }
}

export function clearInput() {
  input.keys.clear()
  input.joystick.x = 0
  input.joystick.y = 0
  input.lookDeltaX = 0
  input.lookDeltaY = 0
  input.wheel = 0
}
