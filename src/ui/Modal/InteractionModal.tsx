import { useEffect, useRef } from "react"

import { categoryLabels } from "@/data/interactions"
import { useT } from "@/lib/i18n/language"
import { closeInteraction, interactionStore } from "@/lib/interaction/interactionStore"

import { ComputerScreen } from "./ComputerScreen"

/** Side panel for "modal" interactions and centered window for "screen" ones. */
export function InteractionModal() {
  const active = interactionStore.use((state) => state.active)
  const closeButton = useRef<HTMLButtonElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const t = useT()

  useEffect(() => {
    if (!active) return
    closeButton.current?.focus()
    container.current?.focus()
  }, [active])

  if (!active) return null

  if (active.interactionType === "screen") {
    return (
      <div
        ref={container}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t(active.title)}
        className="fixed inset-0 z-50 flex animate-hud-fade items-center justify-center bg-black/40 p-4 outline-none"
        onClick={(event) => event.target === event.currentTarget && closeInteraction()}
      >
        <ComputerScreen definition={active} onClose={closeInteraction} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={(event) => event.target === event.currentTarget && closeInteraction()}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="interaction-title"
        className="flex h-full w-full animate-hud-fade flex-col overflow-y-auto border-l border-white/10 bg-[#0b0c0e]/88 px-7 py-8 text-neutral-300 backdrop-blur-lg sm:w-[440px] sm:px-10 sm:py-12"
      >
        <div className="flex items-start justify-between gap-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-ember">{t(categoryLabels[active.category]).toUpperCase()}</p>
          <button
            ref={closeButton}
            type="button"
            onClick={closeInteraction}
            className="font-mono text-[11px] tracking-widest text-neutral-400 hover:text-white focus-visible:outline-2 focus-visible:outline-ember"
          >
            ESC ✕
          </button>
        </div>
        <h2 id="interaction-title" className="mt-5 text-3xl font-semibold tracking-tight text-neutral-50">
          {t(active.title)}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-neutral-400">{t(active.description)}</p>
        <div className="my-7 h-px w-12 bg-white/20" />
        <div className="space-y-4 text-[15px] leading-relaxed">
          {active.body && t(active.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {active.links && t(active.links).length > 0 && (
          <div className="mt-8 flex flex-col gap-2">
            {t(active.links).map((link, index) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener"
                className={`flex items-center justify-between border px-4 py-3 text-sm tracking-wide transition-colors ${
                  index === 0
                    ? "border-neutral-100 bg-neutral-100 text-neutral-950 hover:bg-white"
                    : "border-white/15 text-neutral-200 hover:border-white/50"
                }`}
              >
                {link.label}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        )}
        <p className="mt-auto pt-10 font-mono text-[10px] tracking-[0.25em] text-neutral-600">{t({ pt: "CLIQUE NA CENA PARA CONTINUAR", en: "CLICK THE SCENE TO CONTINUE" })}</p>
      </aside>
    </div>
  )
}
