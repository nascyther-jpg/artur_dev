import { floors } from "@/data/floors"
import { commands } from "@/lib/experience/commands"
import { experienceStore } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"

/** Vertical floor list on the right edge; works from anywhere in the building. */
export function FloorNavigation() {
  const current = experienceStore.use((state) => state.floorIndex)
  const target = experienceStore.use((state) => state.targetFloorIndex)
  const elevatorPhase = experienceStore.use((state) => state.elevatorPhase)
  const touring = experienceStore.use((state) => state.touring)
  const busy = elevatorPhase !== "open" || touring
  const t = useT()

  return (
    <nav aria-label={t({ pt: "Andares", en: "Floors" })} className="pointer-events-auto flex flex-col items-end gap-1">
      {floors
        .map((floor, index) => ({ floor, index }))
        .reverse()
        .map(({ floor, index }) => {
          const isCurrent = index === current
          const isTarget = busy && index === target && index !== current
          return (
            <button
              key={floor.id}
              type="button"
              disabled={busy || isCurrent}
              onClick={() => commands.travelTo(index)}
              aria-current={isCurrent ? "location" : undefined}
              aria-label={`${t({ pt: "Andar", en: "Floor" })} ${t(floor.number)}, ${t(floor.title)}${floor.status === "preview" ? t({ pt: ", em preparação", en: ", coming soon" }) : ""}`}
              className="group flex h-8 items-center gap-3 disabled:cursor-default sm:h-9"
            >
              <span
                className={`hidden font-mono text-[11px] tracking-[0.2em] whitespace-nowrap transition-opacity sm:inline ${
                  isCurrent ? "text-neutral-200 opacity-100" : "text-neutral-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {t(floor.title).toUpperCase()}
                {floor.status === "preview" && <span className="text-neutral-600"> · {t({ pt: "EM BREVE", en: "COMING SOON" })}</span>}
              </span>
              <span
                className={`flex h-8 w-10 items-center justify-center border font-mono text-xs transition-colors sm:h-9 sm:w-11 ${
                  isCurrent
                    ? "border-ember/70 bg-ember/15 text-neutral-50"
                    : isTarget
                      ? "animate-pulse border-neutral-300/60 text-neutral-100"
                      : "border-white/10 bg-black/30 text-neutral-400 group-hover:border-white/40 group-hover:text-neutral-100"
                }`}
              >
                {t(floor.number)}
              </span>
            </button>
          )
        })}
    </nav>
  )
}
