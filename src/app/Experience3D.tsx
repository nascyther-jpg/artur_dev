import { useEffect, useState } from "react"

import Experience from "@/components/3d/Experience"
import { enterFallback, reportLoad } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"
import type { DeviceCapabilities } from "@/lib/performance/capabilities"
import { HUD } from "@/ui/HUD/HUD"
import { LoadingScreen } from "@/ui/LoadingScreen/LoadingScreen"

import { ErrorBoundary } from "./ErrorBoundary"

const FONT_TIMEOUT_MS = 2500

/** Canvas textures draw text once, so the web font must be ready before the scene mounts. */
function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      reportLoad(0.35, { pt: "Carregando tipografia", en: "Loading fonts" })
      setReady(true)
    }
    const timer = window.setTimeout(finish, FONT_TIMEOUT_MS)
    Promise.all([
      document.fonts.load('600 64px "Geist Variable"'),
      document.fonts.load('400 32px "Geist Variable"'),
    ])
      .catch(() => undefined)
      .finally(finish)
    return () => window.clearTimeout(timer)
  }, [])
  return ready
}

/** Everything the 3D building needs (scene, loading screen, HUD), loaded only when the visitor opens it. */
export default function Experience3D({ capabilities }: { capabilities: DeviceCapabilities }) {
  const t = useT()
  const fontsReady = useFontsReady()

  useEffect(() => {
    reportLoad(0.15, { pt: "Verificando o dispositivo", en: "Checking your device" })
  }, [])

  return (
    <>
      <h1 className="sr-only">{t({ pt: "Enrique Artur, portfólio em 3D", en: "Enrique Artur, 3D portfolio" })}</h1>
      <ErrorBoundary
        fallback={null}
        onError={() => enterFallback({ pt: "Ocorreu um erro ao montar a experiência 3D.", en: "Something went wrong while setting up the 3D experience." })}
      >
        {fontsReady && <Experience capabilities={capabilities} />}
      </ErrorBoundary>
      <LoadingScreen isTouch={capabilities.isTouch} />
      <HUD isTouch={capabilities.isTouch} />
    </>
  )
}
