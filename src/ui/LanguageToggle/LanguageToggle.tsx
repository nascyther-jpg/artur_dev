import { HTML_LANG, setLanguage, useLanguage, type Language } from "@/lib/i18n/language"
import { cn } from "@/lib/utils"

const OPTIONS: { value: Language; code: string; name: string }[] = [
  { value: "pt", code: "PT", name: "Português" },
  { value: "en", code: "EN", name: "English" },
]

const TONES = {
  dark: {
    group: "h-9 border border-white/10 bg-black/35 font-mono text-[10px] tracking-[0.18em]",
    button: "h-full px-2.5 focus-visible:outline-2 focus-visible:outline-ember",
    active: "bg-ember/15 text-neutral-50",
    idle: "text-neutral-500 hover:text-white",
  },
  light: {
    group: "gap-0.5 text-[0.72rem] font-medium tracking-[0.06em]",
    button: "focus-ring min-h-8 px-1.5 underline-offset-[6px]",
    active: "text-ink underline decoration-1",
    idle: "text-ink-muted hover:text-ink",
  },
}

/** PT | EN switch. The whole site follows it live, including the signs inside the 3D scene. */
export function LanguageToggle({ tone = "dark", className }: { tone?: keyof typeof TONES; className?: string }) {
  const language = useLanguage()
  const style = TONES[tone]

  return (
    <div role="group" aria-label={language === "pt" ? "Idioma" : "Language"} className={cn("pointer-events-auto flex items-center", style.group, className)}>
      {OPTIONS.map((option) => {
        const active = option.value === language
        return (
          <button
            key={option.value}
            type="button"
            lang={HTML_LANG[option.value]}
            // Starts with the visible code so voice control ("click PT") matches the accessible name.
            aria-label={`${option.code}, ${option.name}`}
            aria-pressed={active}
            title={option.name}
            onClick={() => setLanguage(option.value)}
            className={cn("transition-colors", style.button, active ? style.active : style.idle)}
          >
            {option.code}
          </button>
        )
      })}
    </div>
  )
}
