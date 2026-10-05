import { useEffect, useRef, useState } from "react"

import { ELEVATOR_AREA_ID, floors } from "@/data/floors"
import { profile } from "@/data/profile"
import { commands } from "@/lib/experience/commands"
import { experienceStore } from "@/lib/experience/experienceStore"
import { useT } from "@/lib/i18n/language"
import { interactionStore } from "@/lib/interaction/interactionStore"
import { getInteractive } from "@/lib/interaction/registry"

import { ElevatorPanel } from "../FloorNavigation/ElevatorPanel"
import { FloorNavigation } from "../FloorNavigation/FloorNavigation"
import { InteractionModal } from "../Modal/InteractionModal"
import { Tooltip } from "../Modal/Tooltip"
import { TouchControls } from "../TouchControls/TouchControls"
import { SettingsBar } from "./SettingsBar"

function Brand() {
  const floorIndex = experienceStore.use((state) => state.floorIndex)
  const target = experienceStore.use((state) => state.targetFloorIndex)
  const elevatorPhase = experienceStore.use((state) => state.elevatorPhase)
  const travelling = elevatorPhase === "closing" || elevatorPhase === "moving"
  const floor = floors[floorIndex]
  const t = useT()

  return (
    <div>
      <p className="text-lg leading-none font-semibold tracking-[0.28em] text-neutral-100">
        {profile.name.split(" ")[0].toUpperCase()}
      </p>
      <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-neutral-400">{profile.role.toUpperCase()}</p>
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-300">
        <span className="h-px w-6 bg-ember" />
        {travelling ? (
          <span>
            {t(target > floorIndex ? { pt: "SUBINDO", en: "GOING UP" } : { pt: "DESCENDO", en: "GOING DOWN" })} → {t(floors[target].number)}
          </span>
        ) : (
          <span>
            {t({ pt: "ANDAR", en: "FLOOR" })} {t(floor.number)} / {t(floor.title).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

/** Big "01 · ORIGEM" when arriving on a floor, smaller label when entering an area. */
function AreaLabel() {
  const floorIndex = experienceStore.use((state) => state.floorIndex)
  const area = experienceStore.use((state) => state.area)
  const elevatorPhase = experienceStore.use((state) => state.elevatorPhase)
  // Holds ids, not text, so a label on screen follows a language switch.
  const [label, setLabel] = useState<{ key: number; floorIndex: number; areaId?: string } | null>(null)
  const t = useT()
  const counter = useRef(0)
  const lastFloor = useRef(floorIndex)

  useEffect(() => {
    if (floorIndex !== lastFloor.current && elevatorPhase === "opening") {
      lastFloor.current = floorIndex
      setLabel({ key: ++counter.current, floorIndex })
    }
  }, [floorIndex, elevatorPhase])

  useEffect(() => {
    if (!area || area === ELEVATOR_AREA_ID || elevatorPhase !== "open") return
    setLabel((current) =>
      current && current.areaId === area ? current : { key: ++counter.current, floorIndex, areaId: area },
    )
  }, [area, elevatorPhase, floorIndex])

  if (!label) return null
  const floor = floors[label.floorIndex]
  const areaLabel = label.areaId ? floor.areas.find((candidate) => candidate.id === label.areaId)?.label : undefined
  const big = areaLabel ? t(areaLabel).toUpperCase() : `${t(floor.number)} · ${t(floor.title).toUpperCase()}`
  const small = areaLabel ? undefined : t(floor.tagline)
  return (
    <div key={label.key} className="pointer-events-none absolute inset-x-0 top-[22%] animate-hud-label text-center" aria-live="polite">
      <p className="text-[clamp(1.4rem,4vw,2.6rem)] font-light tracking-[0.24em] text-neutral-100">{big}</p>
      {small && <p className="mt-2 font-mono text-[11px] tracking-[0.3em] text-neutral-400">{small.toUpperCase()}</p>}
    </div>
  )
}

function Crosshair() {
  const focusedId = interactionStore.use((state) => state.focusedId)
  const active = interactionStore.use((state) => state.active)
  if (active) return null
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2" aria-hidden="true">
      <div
        className={`rounded-full border transition-all duration-200 ${
          focusedId ? "size-5 border-ember/90" : "size-1.5 border-white/70 bg-white/70"
        }`}
      />
    </div>
  )
}

function InteractPrompt({ isTouch }: { isTouch: boolean }) {
  const focusedId = interactionStore.use((state) => state.focusedId)
  const active = interactionStore.use((state) => state.active)
  const touring = experienceStore.use((state) => state.touring)
  const t = useT()
  if (!focusedId || active || touring || isTouch) return null
  const definition = getInteractive(focusedId)?.definition
  const title = definition ? t(definition.title) : ""
  return (
    <div className="pointer-events-none absolute top-[calc(50%+34px)] left-1/2 -translate-x-1/2 animate-hud-fade text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] text-ember">{t({ pt: "E / CLIQUE · INTERAGIR", en: "E / CLICK · INTERACT" })}</p>
      <p className="mt-1 text-sm tracking-wide text-neutral-100">{title}</p>
    </div>
  )
}

function ControlsHint({ isTouch, pointerLocked }: { isTouch: boolean; pointerLocked: boolean }) {
  const touring = experienceStore.use((state) => state.touring)
  const t = useT()
  if (touring) {
    return (
      <div className="pointer-events-auto flex items-center gap-3 border border-white/10 bg-black/45 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-neutral-300 backdrop-blur-md">
        {t({ pt: "EXPLORANDO AUTOMATICAMENTE", en: "AUTO-EXPLORING" })}
        <button type="button" onClick={() => commands.stopTour()} className="text-ember hover:text-white">
          {t({ pt: "PARAR", en: "STOP" })}
        </button>
      </div>
    )
  }
  if (isTouch) return null
  return (
    <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-400">
      {pointerLocked
        ? t({ pt: "WASD / MOUSE · SHIFT CORRER · E INTERAGIR · ESC SOLTAR", en: "WASD / MOUSE · SHIFT RUN · E INTERACT · ESC RELEASE" })
        : t({ pt: "CLIQUE NA CENA PARA CONTROLAR · WASD / MOUSE", en: "CLICK THE SCENE TO TAKE CONTROL · WASD / MOUSE" })}
    </p>
  )
}

function Veil() {
  const veil = experienceStore.use((state) => state.veil)
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-300 ${veil ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    />
  )
}

export function HUD({ isTouch }: { isTouch: boolean }) {
  const phase = experienceStore.use((state) => state.phase)
  const pointerLocked = experienceStore.use((state) => state.pointerLocked)
  const visible = phase === "explore"

  return (
    <>
      <Veil />
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-20 text-neutral-200 select-none">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <Brand />
          </div>
          <div className="absolute top-4 right-4 max-w-[calc(100vw-11.5rem)] sm:top-6 sm:right-6 sm:max-w-[70vw]">
            <SettingsBar />
          </div>
          <div className="absolute top-1/2 right-3 -translate-y-1/2 sm:right-6">
            <FloorNavigation />
          </div>
          <AreaLabel />
          <Crosshair />
          <InteractPrompt isTouch={isTouch} />
          <div className="absolute right-4 bottom-40 sm:right-24 sm:bottom-8">
            <ElevatorPanel pointerLocked={pointerLocked} />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0">
            <ControlsHint isTouch={isTouch} pointerLocked={pointerLocked} />
          </div>
          <Tooltip />
          {isTouch && <TouchControls />}
        </div>
      )}
      <InteractionModal />
    </>
  )
}
