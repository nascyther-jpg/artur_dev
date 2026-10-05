// One import() for the 3D chunk, shared by React.lazy and the hover/focus prefetch on the "Explore in 3D" buttons.
const importExperience = () => import("./Experience3D")

let pending: ReturnType<typeof importExperience> | null = null

export function load3D() {
  pending ??= importExperience().catch((error: unknown) => {
    pending = null // allow a retry after a network failure
    throw error
  })
  return pending
}

export const prefetch3D = () => void load3D().catch(() => undefined)
