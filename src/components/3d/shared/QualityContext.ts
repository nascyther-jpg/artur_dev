import { createContext, useContext } from "react"

import { getQualitySettings, type QualitySettings } from "@/lib/performance/quality"

export const QualityContext = createContext<QualitySettings>(getQualitySettings("medium", false))

export const useQuality = () => useContext(QualityContext)
