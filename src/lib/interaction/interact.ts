import { categoryLabels } from "@/data/interactions"
import { audioEngine } from "@/lib/audio/audioEngine"

import { interactionStore, showTooltip } from "./interactionStore"
import { getInteractive } from "./registry"

const TOOLTIP_MS = 5200
const CAPTION_MS = 3200

export function releasePointerLock() {
  if (document.pointerLockElement) document.exitPointerLock()
}

/** Single entry point for every interaction, whatever triggered it (click, E key, tap, tour). */
export function interact(id: string) {
  const entry = getInteractive(id)
  if (!entry) return
  const { definition } = entry

  entry.react()
  entry.onInteract?.()
  audioEngine.play(definition.sound ?? "blip")

  switch (definition.interactionType) {
    case "modal":
    case "screen":
      releasePointerLock()
      interactionStore.set({ active: definition, tooltip: null })
      break
    case "tooltip":
      showTooltip({
        category: categoryLabels[definition.category],
        title: definition.title,
        text: definition.description,
        durationMs: TOOLTIP_MS,
      })
      break
    case "reaction":
      if (definition.description.pt) {
        showTooltip({
          category: categoryLabels[definition.category],
          title: definition.title,
          text: definition.description,
          durationMs: CAPTION_MS,
        })
      }
      break
  }
}

export function interactFocused() {
  const { focusedId, active } = interactionStore.get()
  if (focusedId && !active) interact(focusedId)
}
