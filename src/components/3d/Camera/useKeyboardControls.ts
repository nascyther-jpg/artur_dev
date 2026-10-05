import { useEffect } from "react"

import { experienceStore } from "@/lib/experience/experienceStore"
import { clearInput, input, MOVEMENT_KEYS } from "@/lib/input/input"
import { interactFocused } from "@/lib/interaction/interact"
import { clearTooltip, closeInteraction, interactionStore } from "@/lib/interaction/interactionStore"

import { requestTravel } from "../Elevator/elevatorController"
import { stopTour } from "./tour"

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

export function useKeyboardControls() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return
      const { phase, touring } = experienceStore.get()

      if (event.code === "Escape") {
        if (interactionStore.get().active) closeInteraction()
        else clearTooltip()
        if (touring) stopTour()
        return
      }
      if (phase !== "explore") return

      if (event.code === "KeyE") {
        interactFocused()
        return
      }
      // Inside the car, 0–5 pick a floor (0 = térreo).
      const digit = /^(?:Digit|Numpad)(\d)$/.exec(event.code)
      if (digit && experienceStore.get().inElevator) {
        void requestTravel(Number(digit[1]))
        return
      }
      if (MOVEMENT_KEYS.has(event.code) || event.code.startsWith("Shift")) {
        if (interactionStore.get().active) return
        if (touring && MOVEMENT_KEYS.has(event.code)) stopTour()
        input.keys.add(event.code)
        if (event.code.startsWith("Arrow")) event.preventDefault()
      }
    }
    const onKeyUp = (event: KeyboardEvent) => input.keys.delete(event.code)
    const onBlur = () => clearInput()

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
      clearInput()
    }
  }, [])
}
