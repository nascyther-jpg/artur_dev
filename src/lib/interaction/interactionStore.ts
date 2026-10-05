import type { InteractionDefinition } from "@/data/interactions"
import type { Localized } from "@/lib/i18n/language"
import { createStore } from "@/lib/store/createStore"

export interface TooltipState {
  /** Changes on every show so the same tooltip can be re-triggered. */
  key: number
  /** Localized, so a card on screen follows a language switch. */
  category: Localized
  title: Localized
  text: Localized
  durationMs: number
}

export interface InteractionState {
  /** Object under the crosshair (or last tapped) within reach. */
  focusedId: string | null
  /** Object under the mouse cursor while the pointer is not locked. */
  hoveredId: string | null
  /** Definition shown in the modal / computer screen. */
  active: InteractionDefinition | null
  tooltip: TooltipState | null
}

export const interactionStore = createStore<InteractionState>({
  focusedId: null,
  hoveredId: null,
  active: null,
  tooltip: null,
})

let tooltipKey = 0

export function showTooltip(tooltip: Omit<TooltipState, "key">) {
  interactionStore.set({ tooltip: { ...tooltip, key: ++tooltipKey } })
}

export function clearTooltip() {
  interactionStore.set({ tooltip: null })
}

export function closeInteraction() {
  interactionStore.set({ active: null })
}
