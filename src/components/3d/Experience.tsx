import { PerformanceMonitor } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"

import { commands } from "@/lib/experience/commands"
import { enterFallback, experienceStore, reportLoad } from "@/lib/experience/experienceStore"
import { interactionStore } from "@/lib/interaction/interactionStore"
import type { DeviceCapabilities } from "@/lib/performance/capabilities"
import { getQualitySettings } from "@/lib/performance/quality"

import { useKeyboardControls } from "./Camera/useKeyboardControls"
import { Scene } from "./Scene"
import { QualityContext } from "./shared/QualityContext"

/** Lazy-loaded entry of the 3D experience (three.js lives only in this chunk). */
export default function Experience({ capabilities }: { capabilities: DeviceCapabilities }) {
  const performanceMode = experienceStore.use((state) => state.performanceMode)
  const quality = getQualitySettings(capabilities.tier, performanceMode)
  // PerformanceMonitor drops to the lower bound of the current preset when FPS declines.
  const [reduced, setReduced] = useState(false)
  const dpr = quality.dpr[reduced ? 0 : 1]

  useKeyboardControls()

  useEffect(() => {
    reportLoad(0.6, { pt: "Montando o prédio", en: "Assembling the building" })
  }, [])

  return (
    <div className="fixed inset-0 touch-none select-none" aria-hidden="true">
      <Canvas
        shadows={capabilities.tier !== "low" ? "percentage" : false}
        dpr={dpr}
        gl={{ antialias: capabilities.tier !== "low", powerPreference: "high-performance", stencil: false }}
        camera={{ fov: 62, near: 0.05, far: 600, position: [0, 4.5, 26] }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            // Leaving the 3D mode disposes the renderer, which also fires this event.
            if (experienceStore.get().mode !== "3d") return
            event.preventDefault()
            enterFallback({ pt: "A conexão com a placa de vídeo foi perdida.", en: "The connection to the graphics card was lost." })
          })
        }}
        onPointerMissed={() => {
          const { phase } = experienceStore.get()
          if (phase === "explore" && !interactionStore.get().active) commands.requestPointerLock()
        }}
      >
        <QualityContext.Provider value={quality}>
          <PerformanceMonitor
            flipflops={3}
            onDecline={() => setReduced(true)}
            onIncline={() => setReduced(false)}
            onFallback={() => setReduced(true)}
          />
          <Suspense fallback={null}>
            <Scene isTouch={capabilities.isTouch} />
          </Suspense>
        </QualityContext.Provider>
      </Canvas>
    </div>
  )
}
