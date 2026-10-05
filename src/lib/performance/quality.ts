import type { QualityTier } from "./capabilities"

export interface QualitySettings {
  tier: QualityTier
  dpr: [number, number]
  shadows: boolean
  shadowMapSize: number
  /** Decorative point/spot lights beyond the essential ones. */
  extraLights: boolean
  cityBuildings: number
  headBob: boolean
}

const SETTINGS: Record<QualityTier, QualitySettings> = {
  high: {
    tier: "high",
    dpr: [1, 2],
    shadows: true,
    shadowMapSize: 2048,
    extraLights: true,
    cityBuildings: 90,
    headBob: true,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.5],
    shadows: true,
    shadowMapSize: 1024,
    extraLights: true,
    cityBuildings: 55,
    headBob: true,
  },
  low: {
    tier: "low",
    dpr: [0.75, 1],
    shadows: false,
    shadowMapSize: 512,
    extraLights: false,
    cityBuildings: 28,
    headBob: false,
  },
}

/** "Modo desempenho" always forces the low preset. */
export function getQualitySettings(tier: QualityTier, performanceMode: boolean): QualitySettings {
  return SETTINGS[performanceMode ? "low" : tier]
}
