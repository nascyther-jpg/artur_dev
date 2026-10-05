import { useEffect, useState } from "react"

import type { InteractionDefinition } from "@/data/interactions"
import { prefersReducedMotion } from "@/lib/accessibility/reducedMotion"
import { useT } from "@/lib/i18n/language"

/** Simulated old computer: the story types itself in a terminal window. */
export function ComputerScreen({ definition, onClose }: { definition: InteractionDefinition; onClose: () => void }) {
  const t = useT()
  const text = t(definition.description)
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    if (typed >= text.length) return
    const timer = window.setTimeout(() => setTyped((count) => count + 1), 24)
    return () => window.clearTimeout(timer)
  }, [typed, text])

  return (
    <div className="w-[min(640px,calc(100vw-2rem))] border border-white/15 bg-[#11100e]/95 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#e0655a]" />
          <span className="size-2.5 rounded-full bg-[#e6b450]" />
          <span className="size-2.5 rounded-full bg-[#6cbf6a]" />
        </div>
        <p className="font-mono text-[11px] tracking-wider text-neutral-500">{t({ pt: "enrique@quarto: ~", en: "enrique@bedroom: ~" })}</p>
        <button type="button" onClick={onClose} className="font-mono text-[11px] tracking-widest text-neutral-400 hover:text-white">
          ESC ✕
        </button>
      </div>
      <div className="min-h-[220px] p-6 font-mono text-[15px] leading-relaxed text-neutral-200">
        <p className="text-[#6cbf6a]">{t({ pt: "$ cat historia.txt", en: "$ cat story.txt" })}</p>
        <p className="mt-3" aria-label={text}>
          <span aria-hidden="true">{text.slice(0, typed)}</span>
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-caret bg-neutral-300" aria-hidden="true" />
        </p>
        {typed >= text.length && (
          <p className="mt-6 animate-hud-fade text-neutral-500">
            <span className="text-[#6cbf6a]">$</span> {t({ pt: "./construir --a-partir-de=curiosidade", en: "./build --from=curiosity" })}
          </p>
        )}
      </div>
    </div>
  )
}
