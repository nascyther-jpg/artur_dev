import { lazy, Suspense, useEffect, useState } from "react"

import { Portfolio } from "@/components/portfolio/Portfolio"
import { enterFallback, experienceStore, set3DMode } from "@/lib/experience/experienceStore"
import { HTML_LANG, useLanguage } from "@/lib/i18n/language"
import { getCapabilities, hasWebGLApi, type DeviceCapabilities } from "@/lib/performance/capabilities"
import { WebGLFallback } from "@/ui/Fallback/WebGLFallback"

import { load3D } from "./load3D"

// three.js, the HUD and the loading screen live in their own chunk, downloaded only when the visitor opens the building.
const Experience3D = lazy(load3D)

const DESCRIPTION = {
  pt: "Enrique Artur, desenvolvedor de software. Projetos em React, TypeScript, Python e PostgreSQL, com foco em qualidade e testes.",
  en: "Enrique Artur, software developer. Projects in React, TypeScript, Python and PostgreSQL, with a focus on quality and testing.",
}

/** Runs `task` when the browser is idle (or soon after load where requestIdleCallback is missing). */
function whenIdle(task: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout: 3000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(task, 1500)
  return () => clearTimeout(id)
}

export function App() {
  const mode = experienceStore.use((state) => state.mode)
  const fallbackReason = experienceStore.use((state) => state.fallbackReason)
  const [continuedFromFallback, setContinuedFromFallback] = useState(false)
  const language = useLanguage()
  // The WebGL probe stays off the first render: it runs right away only when the page opens straight into 3D (#3d).
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(() => (mode === "3d" ? getCapabilities() : null))

  useEffect(() => {
    if (capabilities) return
    return whenIdle(() => setCapabilities(getCapabilities()))
  }, [capabilities])

  useEffect(() => {
    if (mode === "3d" && capabilities && !capabilities.webgl) {
      enterFallback({ pt: "WebGL não está disponível neste navegador.", en: "WebGL is not available in this browser." })
    }
  }, [mode, capabilities])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language]
    document.querySelector('meta[name="description"]')?.setAttribute("content", DESCRIPTION[language])
  }, [language])

  useEffect(() => {
    document.documentElement.classList.toggle("experience-3d", mode === "3d")
  }, [mode])

  if (mode === "fallback" && !continuedFromFallback) {
    return <WebGLFallback reason={fallbackReason} onContinue={() => setContinuedFromFallback(true)} />
  }

  if (mode !== "3d" || !capabilities?.webgl) {
    const canUse3D = mode === "site" && (capabilities ? capabilities.webgl : hasWebGLApi())
    const enter3D = () => {
      setCapabilities(getCapabilities())
      set3DMode(true)
    }
    return <Portfolio onEnter3D={canUse3D ? enter3D : undefined} />
  }

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#07080a]" />}>
      <Experience3D capabilities={capabilities} />
    </Suspense>
  )
}
