import { useEffect, useMemo } from "react"
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three"

import { useLanguage } from "@/lib/i18n/language"

export const FONT_SANS = '"Geist Variable", system-ui, sans-serif'
export const FONT_MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

export type Draw = (context: CanvasRenderingContext2D, width: number, height: number) => void

/** Draws once into a 2D canvas and wraps it in a texture (signs, screens, patterns). */
export function createCanvasTexture(width: number, height: number, draw: Draw, repeat = false) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D context unavailable")
  draw(context, width, height)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  if (repeat) texture.wrapS = texture.wrapT = RepeatWrapping
  return texture
}

/** Texture owned by a component: created once per `key` and language (signs carry text), disposed on unmount. */
export function useCanvasTexture(width: number, height: number, draw: Draw, key: string) {
  const language = useLanguage()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` identifies the drawing
  const texture = useMemo(() => createCanvasTexture(width, height, draw), [key, width, height, language])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/** Deterministic pseudo-random numbers so procedural details don't change between renders. */
export function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}
