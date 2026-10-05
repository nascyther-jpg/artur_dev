import { useEffect, useRef, useState } from "react"

import { profile } from "@/data/profile"
import { commands } from "@/lib/experience/commands"
import { experienceStore, set3DMode } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"

import { LanguageToggle } from "../LanguageToggle/LanguageToggle"

const CELLS = 22

export function LoadingScreen({ isTouch }: { isTouch: boolean }) {
  const phase = experienceStore.use((state) => state.phase)
  const target = experienceStore.use((state) => state.loadTarget)
  const label = experienceStore.use((state) => state.loadLabel)
  const [shown, setShown] = useState(0)
  const enterButton = useRef<HTMLButtonElement>(null)
  const t = useT()

  // Animate toward the latest real milestone; "ready" only once the bar is visibly full.
  const shownRef = useRef(0)
  useEffect(() => {
    let frame = 0
    const tick = () => {
      const value = shownRef.current
      const next = Math.min(target, value + Math.max(0.004, (target - value) * 0.08))
      shownRef.current = next
      setShown(next)
      if (next < target) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  useEffect(() => {
    if (shown >= 1 && experienceStore.get().phase === "loading") experienceStore.set({ phase: "ready" })
  }, [shown])

  useEffect(() => {
    if (phase === "ready") enterButton.current?.focus()
  }, [phase])

  if (phase === "intro" || phase === "explore") return null

  const ready = phase === "ready"
  const filled = Math.round(shown * CELLS)
  const bar = `[${"█".repeat(filled)}${"░".repeat(CELLS - filled)}]`

  return (
    <div
      className={`fixed inset-0 z-40 flex items-end justify-center px-6 pb-[12vh] text-neutral-200 transition-colors duration-1000 sm:items-center sm:pb-0 ${
        ready ? "bg-linear-to-t from-black/90 via-black/40 to-black/10" : "bg-[#07080a]"
      }`}
    >
      <LanguageToggle className="absolute top-4 right-4 sm:top-6 sm:right-6" />
      <div className="w-full max-w-md" aria-live="polite">
        <p className="text-[clamp(2.6rem,9vw,4.2rem)] leading-none font-semibold tracking-[0.18em] text-neutral-100">
          {profile.name.split(" ")[0].toUpperCase()}
        </p>
        <p className="mt-3 font-mono text-xs tracking-[0.3em] text-ember">
          {ready ? t({ pt: "PRONTO", en: "READY" }) : t({ pt: "CONSTRUINDO...", en: "BUILDING..." })}
        </p>

        <div className="mt-8 font-mono text-sm text-neutral-400" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(shown * 100)} aria-label={t({ pt: "Carregando ambiente 3D", en: "Loading 3D environment" })}>
          <span className="block whitespace-nowrap text-neutral-300">{bar}</span>
          <span className="mt-2 flex justify-between text-xs tracking-wider text-neutral-500">
            <span>{ready ? t({ pt: "Ambiente carregado.", en: "Environment loaded." }) : `${t(label)}...`}</span>
            <span>{Math.round(shown * 100)}%</span>
          </span>
        </div>

        <div className={`mt-10 transition-opacity duration-500 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <button
            ref={enterButton}
            type="button"
            onClick={() => commands.enter()}
            className="w-full border border-neutral-200/80 bg-neutral-100 px-6 py-3.5 text-sm font-semibold tracking-[0.3em] text-neutral-950 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          >
            {t({ pt: "ENTRAR", en: "ENTER" })}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-neutral-500">
            {isTouch
              ? t({ pt: "Joystick para andar · arraste para olhar · toque nos objetos", en: "Joystick to walk · drag to look · tap objects" })
              : t({ pt: "WASD para andar · mouse para olhar · clique para interagir", en: "WASD to walk · mouse to look · click to interact" })}
          </p>
          <button
            type="button"
            onClick={() => set3DMode(false)}
            className="mx-auto mt-3 block text-xs tracking-widest text-neutral-400 underline-offset-4 hover:text-neutral-100 hover:underline"
          >
            {t({ pt: "VOLTAR AO SITE", en: "BACK TO SITE" })}
          </button>
        </div>
      </div>
    </div>
  )
}
