export const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Frame-rate independent exponential smoothing. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

export function shortestAngle(from: number, to: number) {
  const delta = (to - from) % (Math.PI * 2)
  return ((2 * delta) % (Math.PI * 2)) - delta
}

export const dampAngle = (current: number, target: number, lambda: number, dt: number) =>
  current + shortestAngle(current, target) * (1 - Math.exp(-lambda * dt))

export const lerpAngle = (from: number, to: number, t: number) => from + shortestAngle(from, to) * t
