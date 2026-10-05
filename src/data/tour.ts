// Guided tour ("Explorar automaticamente"). Positions are floor-local [x, z];
// `path` lists intermediate points so the camera never crosses walls or furniture.

import type { Localized } from "@/lib/i18n/language"

export interface TourStop {
  floor: number
  path?: [number, number][]
  position: [number, number]
  lookAt: [number, number, number]
  interactionId?: string
  caption?: { title: Localized; text: Localized }
  holdMs?: number
}

export const tourStart = { floor: 0, position: [0, 3.8] as [number, number], lookAt: [2.6, 1.25, 0.55] as [number, number, number] }

export const tourStops: TourStop[] = [
  { floor: 0, position: [0, 3.8], lookAt: [2.6, 1.25, 0.55], interactionId: "reception", holdMs: 4200 },
  { floor: 0, position: [1, -2.3], lookAt: [1.5, 1.9, -5], interactionId: "quote", holdMs: 5200 },
  { floor: 0, position: [-2.5, -3.6], lookAt: [-4.42, 1.7, -3.8], interactionId: "directory", holdMs: 4200 },
  {
    floor: 1,
    path: [
      [-5.75, -1.3],
      [-5, 1.4],
    ],
    position: [-2.2, 1.4],
    lookAt: [3, 1.2, 0],
    caption: {
      title: { pt: "01 · Origem", en: "01 · Origin" },
      text: { pt: "O quarto onde tudo começou.", en: "The bedroom where it all began." },
    },
    holdMs: 3000,
  },
  { floor: 1, position: [4.9, -0.2], lookAt: [6.78, 1.1, -1], interactionId: "computer", holdMs: 5200 },
  { floor: 1, position: [4.9, -0.2], lookAt: [6.72, 0.92, -0.42], interactionId: "naruto", holdMs: 5200 },
  { floor: 1, position: [5, -3.2], lookAt: [5.3, 1.1, -5], interactionId: "books", holdMs: 4200 },
  { floor: 1, position: [2.9, -1.6], lookAt: [1.8, 0.6, -3.4], interactionId: "controller", holdMs: 4000 },
  { floor: 1, position: [4.8, 3], lookAt: [6.35, 0.75, 4.3], interactionId: "guitar", holdMs: 4000 },
  {
    floor: 1,
    position: [4.8, 3],
    lookAt: [1, 1.6, 5],
    caption: {
      title: { pt: "Continue explorando", en: "Keep exploring" },
      text: {
        pt: "Os próximos andares estão sendo preparados. Use o elevador ou WASD para andar por conta própria.",
        en: "The next floors are still being prepared. Take the elevator or use WASD to explore on your own.",
      },
    },
    holdMs: 4500,
  },
]
