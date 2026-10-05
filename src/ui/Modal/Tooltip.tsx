import { useEffect } from "react"

import { useT } from "@/lib/i18n/language"
import { clearTooltip, interactionStore } from "@/lib/interaction/interactionStore"

/** Cinematic lower-third card; dismisses itself. */
export function Tooltip() {
  const tooltip = interactionStore.use((state) => state.tooltip)
  const t = useT()

  useEffect(() => {
    if (!tooltip) return
    const timer = window.setTimeout(() => {
      if (interactionStore.get().tooltip?.key === tooltip.key) clearTooltip()
    }, tooltip.durationMs)
    return () => window.clearTimeout(timer)
  }, [tooltip])

  if (!tooltip) return null
  return (
    <div
      key={tooltip.key}
      role="status"
      className="absolute bottom-28 left-4 max-w-[min(420px,calc(100vw-2rem))] animate-hud-fade sm:bottom-20 sm:left-6"
    >
      <div className="relative overflow-hidden border-l border-ember/80 bg-black/50 py-4 pr-6 pl-5 backdrop-blur-md">
        <p className="font-mono text-[10px] tracking-[0.3em] text-ember">{t(tooltip.category).toUpperCase()}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-[0.12em] text-neutral-50">{t(tooltip.title).toUpperCase()}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">{t(tooltip.text)}</p>
        <span
          className="absolute bottom-0 left-0 h-px bg-white/30"
          style={{ animation: `tooltip-timer ${tooltip.durationMs}ms linear forwards` }}
        />
      </div>
      <style>{`@keyframes tooltip-timer { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  )
}
