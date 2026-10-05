// Static 2D (XZ) collision against axis-aligned boxes, per floor.
// Enough for walls and furniture; the camera is a circle of PLAYER_RADIUS.

export interface Box2D {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

interface Collider {
  box: Box2D
  /** Dynamic colliders (e.g. elevator doors) can switch themselves off. */
  enabled?: () => boolean
}

const floors = new Map<number, Set<Collider>>()

export function addCollider(floorIndex: number, box: Box2D, enabled?: () => boolean) {
  let set = floors.get(floorIndex)
  if (!set) {
    set = new Set()
    floors.set(floorIndex, set)
  }
  const collider: Collider = { box, enabled }
  set.add(collider)
  return () => {
    set.delete(collider)
  }
}

export function boxFromCenter(x: number, z: number, width: number, depth: number): Box2D {
  return { minX: x - width / 2, maxX: x + width / 2, minZ: z - depth / 2, maxZ: z + depth / 2 }
}

/** Pushes the point (x, z) out of every collider on the floor. Mutates and returns `position`. */
export function resolveCollisions(
  floorIndex: number,
  position: { x: number; z: number },
  radius: number,
) {
  const set = floors.get(floorIndex)
  if (!set) return position
  // Two passes settle corners where two boxes meet.
  for (let pass = 0; pass < 2; pass++) {
    set.forEach(({ box, enabled }) => {
      if (enabled && !enabled()) return
      const closestX = Math.min(Math.max(position.x, box.minX), box.maxX)
      const closestZ = Math.min(Math.max(position.z, box.minZ), box.maxZ)
      const dx = position.x - closestX
      const dz = position.z - closestZ
      const distanceSq = dx * dx + dz * dz
      if (distanceSq >= radius * radius) return
      if (distanceSq > 1e-8) {
        const distance = Math.sqrt(distanceSq)
        position.x = closestX + (dx / distance) * radius
        position.z = closestZ + (dz / distance) * radius
        return
      }
      // Center is inside the box: leave through the nearest side.
      const exits = [
        { d: position.x - box.minX, x: box.minX - radius, z: position.z },
        { d: box.maxX - position.x, x: box.maxX + radius, z: position.z },
        { d: position.z - box.minZ, x: position.x, z: box.minZ - radius },
        { d: box.maxZ - position.z, x: position.x, z: box.maxZ + radius },
      ]
      const nearest = exits.reduce((a, b) => (b.d < a.d ? b : a))
      position.x = nearest.x
      position.z = nearest.z
    })
  }
  return position
}
