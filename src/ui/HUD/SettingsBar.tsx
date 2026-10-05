import { ArrowLeft, FileText, Gauge, Mail, Play, Square, Volume2, VolumeX } from "lucide-react"
import type { ReactNode } from "react"

import { interactions } from "@/data/interactions"
import { profile } from "@/data/profile"
import { audioEngine } from "@/lib/audio/audioEngine"
import { commands } from "@/lib/experience/commands"
import { experienceStore, set3DMode, setPerformanceMode, setSound } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"
import { releasePointerLock } from "@/lib/interaction/interact"
import { interactionStore } from "@/lib/interaction/interactionStore"

import { LanguageToggle } from "../LanguageToggle/LanguageToggle"

const baseClass =
  "pointer-events-auto flex h-9 items-center gap-2 border px-2.5 font-mono text-[10px] tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-ember"

function HudButton({
  label,
  icon,
  active = false,
  onClick,
  href,
}: {
  label: string
  icon: ReactNode
  active?: boolean
  onClick?: () => void
  href?: string
}) {
  const className = `${baseClass} ${
    active ? "border-ember/60 bg-ember/15 text-neutral-50" : "border-white/10 bg-black/35 text-neutral-300 hover:border-white/40 hover:text-white"
  }`
  const content = (
    <>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className} aria-label={label} title={label}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label} aria-pressed={active} title={label}>
      {content}
    </button>
  )
}

export function SettingsBar() {
  const soundOn = experienceStore.use((state) => state.soundOn)
  const performanceMode = experienceStore.use((state) => state.performanceMode)
  const touring = experienceStore.use((state) => state.touring)
  const iconClass = "size-3.5"
  const t = useT()

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <HudButton
        label={touring ? t({ pt: "PARAR TOUR", en: "STOP TOUR" }) : t({ pt: "EXPLORAR AUTOMATICAMENTE", en: "AUTO-EXPLORE" })}
        icon={touring ? <Square className={iconClass} /> : <Play className={iconClass} />}
        active={touring}
        onClick={() => (touring ? commands.stopTour() : commands.startTour())}
      />
      <HudButton
        label={t({ pt: "SOM", en: "SOUND" })}
        icon={soundOn ? <Volume2 className={iconClass} /> : <VolumeX className={iconClass} />}
        active={soundOn}
        onClick={() => {
          setSound(!soundOn)
          audioEngine.setEnabled(!soundOn)
        }}
      />
      <HudButton
        label={t({ pt: "MODO DESEMPENHO", en: "PERFORMANCE MODE" })}
        icon={<Gauge className={iconClass} />}
        active={performanceMode}
        onClick={() => setPerformanceMode(!performanceMode)}
      />
      <HudButton label={t({ pt: "VOLTAR AO SITE", en: "BACK TO SITE" })} icon={<ArrowLeft className={iconClass} />} onClick={() => set3DMode(false)} />
      <HudButton
        label={t({ pt: "CONTATO", en: "CONTACT" })}
        icon={<Mail className={iconClass} />}
        onClick={() => {
          releasePointerLock()
          interactionStore.set({ active: interactions.contact })
        }}
      />
      <HudButton label={t({ pt: "CURRÍCULO", en: "RESUME" })} icon={<FileText className={iconClass} />} href={t(profile.links.cv)} />
      <LanguageToggle />
    </div>
  )
}
