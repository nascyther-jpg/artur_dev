import { useRef, useState, type PointerEvent } from "react"

import { useT } from "@/lib/i18n/language"
import { input } from "@/lib/input/input"
import { interactFocused } from "@/lib/interaction/interact"
import { interactionStore } from "@/lib/interaction/interactionStore"

const RADIUS = 48

function Joystick() {
  const pointer = useRef<number | null>(null)
  const origin = useRef({ x: 0, y: 0 })
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const t = useT()

  const update = (event: PointerEvent<HTMLDivElement>) => {
    let dx = event.clientX - origin.current.x
    let dy = event.clientY - origin.current.y
    const length = Math.hypot(dx, dy)
    if (length > RADIUS) {
      dx = (dx / length) * RADIUS
      dy = (dy / length) * RADIUS
    }
    input.joystick.x = dx / RADIUS
    input.joystick.y = -dy / RADIUS
    setKnob({ x: dx, y: dy })
  }

  const release = () => {
    pointer.current = null
    input.joystick.x = 0
    input.joystick.y = 0
    setKnob({ x: 0, y: 0 })
  }

  return (
    <div
      role="application"
      aria-label={t({ pt: "Joystick de movimento", en: "Movement joystick" })}
      className="pointer-events-auto relative size-32 touch-none rounded-full border border-white/15 bg-black/25 backdrop-blur-sm"
      onPointerDown={(event) => {
        event.stopPropagation()
        pointer.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        const rect = event.currentTarget.getBoundingClientRect()
        origin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        update(event)
      }}
      onPointerMove={(event) => event.pointerId === pointer.current && update(event)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span
        className="absolute top-1/2 left-1/2 size-12 rounded-full border border-white/40 bg-white/15"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  )
}

export function TouchControls() {
  const focusedId = interactionStore.use((state) => state.focusedId)
  const active = interactionStore.use((state) => state.active)
  const t = useT()

  return (
    <>
      <div className="absolute bottom-16 left-5">
        <Joystick />
      </div>
      {focusedId && !active && (
        <button
          type="button"
          onClick={interactFocused}
          className="pointer-events-auto absolute right-5 bottom-20 size-20 animate-hud-fade rounded-full border border-ember/70 bg-black/45 font-mono text-[10px] tracking-[0.2em] text-neutral-100 backdrop-blur-md"
        >
          {t({ pt: "INTERAGIR", en: "INTERACT" })}
        </button>
      )}
      <p className="absolute top-24 left-4 font-mono text-[10px] tracking-[0.25em] text-neutral-500">{t({ pt: "ARRASTE PARA OLHAR", en: "DRAG TO LOOK" })}</p>
    </>
  )
}
