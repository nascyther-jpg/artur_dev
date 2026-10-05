export type QualityTier = "high" | "medium" | "low"

export interface DeviceCapabilities {
  webgl: boolean
  webgl2: boolean
  isTouch: boolean
  isMobile: boolean
  tier: QualityTier
  gpu: string | null
}

const WEAK_GPU = /swiftshader|llvmpipe|software|basic render|mali-[gt]?[1-7]\d?\b|adreno \(tm\) [1-5]\d\d|powervr|intel\(r\) (hd|uhd) graphics [2-6]\d{2}\b/i
const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render/i

function probeWebGL() {
  try {
    const canvas = document.createElement("canvas")
    const gl2 = canvas.getContext("webgl2")
    const gl = gl2 ?? canvas.getContext("webgl")
    if (!gl) return { webgl: false, webgl2: false, gpu: null }
    const info = gl.getExtension("WEBGL_debug_renderer_info")
    const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : null
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    return { webgl: true, webgl2: Boolean(gl2), gpu }
  } catch {
    return { webgl: false, webgl2: false, gpu: null }
  }
}

export function detectCapabilities(): DeviceCapabilities {
  const { webgl, webgl2, gpu } = probeWebGL()
  const isTouch = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0
  const isMobile = isTouch && Math.min(window.screen.width, window.screen.height) < 820
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const weakGpu = gpu ? WEAK_GPU.test(gpu) : false

  let tier: QualityTier
  if (isMobile || (gpu && SOFTWARE_GPU.test(gpu)) || !webgl2) tier = "low"
  else if (isTouch || weakGpu || cores < 6 || memory < 8) tier = "medium"
  else tier = "high"

  return { webgl, webgl2, isTouch, isMobile, tier, gpu }
}

let cached: DeviceCapabilities | null = null

/** Runs the probe once. It creates a WebGL context, so callers keep it off the first render. */
export function getCapabilities(): DeviceCapabilities {
  cached ??= detectCapabilities()
  return cached
}

/** Cheap guess used until the probe runs: the browser exposes the WebGL API at all. */
export const hasWebGLApi = () => typeof WebGLRenderingContext !== "undefined"
