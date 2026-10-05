import { floors } from "@/data/floors"
import { commands } from "@/lib/experience/commands"
import { experienceStore } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"

/** Shown while standing inside the car: the same choice as the 3D button panel. */
export function ElevatorPanel({ pointerLocked }: { pointerLocked: boolean }) {
  const inElevator = experienceStore.use((state) => state.inElevator)
  const elevatorPhase = experienceStore.use((state) => state.elevatorPhase)
  const current = experienceStore.use((state) => state.floorIndex)
  const target = experienceStore.use((state) => state.targetFloorIndex)
  const touring = experienceStore.use((state) => state.touring)
  const t = useT()

  if (!inElevator || touring) return null
  const moving = elevatorPhase !== "open"

  return (
    <div className="pointer-events-auto animate-hud-fade border border-white/10 bg-black/45 p-4 backdrop-blur-md">
      <p className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">{t({ pt: "ELEVADOR", en: "ELEVATOR" })}</p>
      <p className="mt-1 text-sm text-neutral-200">
        {moving
          ? `${t(target > current ? { pt: "Subindo para", en: "Going up to" } : { pt: "Descendo para", en: "Going down to" })} ${t(floors[target].number)} · ${t(floors[target].title)}`
          : t({ pt: "Escolha o andar", en: "Choose a floor" })}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {floors.map((floor, index) => (
          <button
            key={floor.id}
            type="button"
            disabled={moving || index === current}
            onClick={() => commands.travelTo(index)}
            aria-label={`${t({ pt: "Ir para o andar", en: "Go to floor" })} ${t(floor.number)}, ${t(floor.title)}`}
            className={`h-10 w-12 border font-mono text-sm transition-colors ${
              index === (moving ? target : current)
                ? "border-ember/70 bg-ember/20 text-neutral-50"
                : "border-white/15 text-neutral-300 hover:border-white/50 hover:text-white disabled:opacity-40"
            }`}
          >
            {t(floor.number)}
          </button>
        ))}
      </div>
      {pointerLocked && !moving && (
        <p className="mt-3 font-mono text-[10px] tracking-wider text-neutral-500">{t({ pt: "TECLAS 0–5 OU MIRE NO PAINEL", en: "KEYS 0–5 OR AIM AT THE PANEL" })}</p>
      )}
    </div>
  )
}
