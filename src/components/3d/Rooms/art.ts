import { floors, type FloorDefinition } from "@/data/floors"
import { interactions } from "@/data/interactions"
import { profile } from "@/data/profile"
import { t } from "@/lib/i18n/language"

import { FONT_MONO, FONT_SANS, seededRandom, wrapText, type Draw } from "../shared/canvasTexture"

const ACCENT = "#d9a066"
const INK = "#ece7de"
const MUTED = "#9a958c"

/** Early days: a small editor with a first script, warm and a bit messy. */
export const drawOriginScreen: Draw = (context, width, height) => {
  context.fillStyle = "#1b1a17"
  context.fillRect(0, 0, width, height)
  context.fillStyle = "#26241f"
  context.fillRect(0, 0, width, 44)
  ;["#e0655a", "#e6b450", "#6cbf6a"].forEach((color, i) => {
    context.fillStyle = color
    context.beginPath()
    context.arc(26 + i * 26, 22, 8, 0, Math.PI * 2)
    context.fill()
  })
  context.fillStyle = MUTED
  context.font = `500 22px ${FONT_SANS}`
  const file = t({ pt: "primeiro_programa.py", en: "first_program.py" })
  context.fillText(file, 120, 30)

  const lines: [string, string][] = t({
    pt: [
      ["#8a8577", "# tentando entender como isso funciona"],
      ["#e6b450", 'nome = input("Qual é o seu nome? ")'],
      ["#cfc9bd", ""],
      ["#e0655a", "for tentativa in range(3):"],
      ["#cfc9bd", '    print(f"Olá, {nome}! tentativa {tentativa}")'],
      ["#cfc9bd", ""],
      ["#8a8577", "# funcionou!! agora quero construir algo de verdade"],
    ],
    en: [
      ["#8a8577", "# trying to figure out how this works"],
      ["#e6b450", 'name = input("What is your name? ")'],
      ["#cfc9bd", ""],
      ["#e0655a", "for attempt in range(3):"],
      ["#cfc9bd", '    print(f"Hello, {name}! attempt {attempt}")'],
      ["#cfc9bd", ""],
      ["#8a8577", "# it worked!! now I want to build something real"],
    ],
  })
  context.font = `500 28px ${FONT_MONO}`
  lines.forEach(([color, text], i) => {
    context.fillStyle = "#5c5850"
    context.fillText(String(i + 1).padStart(2, " "), 20, 100 + i * 44)
    context.fillStyle = color
    context.fillText(text, 80, 100 + i * 44)
  })
  context.fillStyle = "#11100e"
  context.fillRect(0, height - 120, width, 120)
  context.fillStyle = "#6cbf6a"
  context.font = `500 24px ${FONT_MONO}`
  context.fillText(`$ python ${file}`, 24, height - 78)
  context.fillStyle = "#cfc9bd"
  context.fillText(t({ pt: "Olá, Enrique! tentativa 0", en: "Hello, Enrique! attempt 0" }), 24, height - 40)
}

export const drawReceptionScreen: Draw = (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#15171b")
  gradient.addColorStop(1, "#23201c")
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
  context.fillStyle = ACCENT
  context.fillRect(60, 70, 4, 60)
  context.fillStyle = MUTED
  context.font = `500 30px ${FONT_SANS}`
  context.fillText(t({ pt: "BEM-VINDO", en: "WELCOME" }), 84, 110)
  context.fillStyle = INK
  context.font = `600 86px ${FONT_SANS}`
  context.fillText(profile.name.toUpperCase(), 60, 240)
  context.fillStyle = "#c9c3b8"
  context.font = `500 40px ${FONT_SANS}`
  context.fillText(profile.role.toUpperCase(), 60, 300)
  context.fillStyle = MUTED
  context.font = `400 30px ${FONT_SANS}`
  context.fillText(t(profile.education), 60, 360)
  context.fillStyle = ACCENT
  context.font = `500 28px ${FONT_SANS}`
  context.fillText(t({ pt: "Clique para conhecer  →", en: "Click to learn more  →" }), 60, height - 60)
}

export const drawQuote: Draw = (context, width, height) => {
  context.fillStyle = "#1c1b19"
  context.fillRect(0, 0, width, height)
  context.fillStyle = ACCENT
  context.fillRect(80, 90, 90, 4)
  context.fillStyle = MUTED
  context.font = `500 36px ${FONT_SANS}`
  context.fillText(t(interactions.quote.title).toUpperCase(), 200, 104)
  context.fillStyle = INK
  context.font = `500 72px ${FONT_SANS}`
  const lines = wrapText(context, t(interactions.quote.description), width - 160)
  lines.forEach((line, i) => context.fillText(line, 80, 220 + i * 92))
}

export const drawDirectory: Draw = (context, width, height) => {
  context.fillStyle = "#16171a"
  context.fillRect(0, 0, width, height)
  context.fillStyle = MUTED
  context.font = `500 34px ${FONT_SANS}`
  context.fillText(t(interactions.directory.title).toUpperCase(), 60, 90)
  context.fillStyle = ACCENT
  context.fillRect(60, 112, 60, 3)
  const rowHeight = (height - 190) / floors.length
  ;[...floors].reverse().forEach((floor, i) => {
    const y = 140 + i * rowHeight + rowHeight / 2
    context.fillStyle = "rgba(255,255,255,0.08)"
    context.fillRect(60, y + rowHeight / 2 - 2, width - 120, 1)
    context.fillStyle = INK
    context.font = `600 52px ${FONT_SANS}`
    context.fillText(t(floor.number), 60, y + 16)
    context.font = `500 44px ${FONT_SANS}`
    context.fillText(t(floor.title), 190, y + 14)
    context.fillStyle = floor.status === "ready" ? MUTED : "#6f6a62"
    context.font = `400 28px ${FONT_SANS}`
    const note = t(floor.status === "ready" ? floor.tagline : { pt: "em preparação", en: "coming soon" })
    context.textAlign = "right"
    context.fillText(note, width - 60, y + 12)
    context.textAlign = "left"
  })
}

export const drawContactScreen: Draw = (context, width, height) => {
  context.fillStyle = "#15161a"
  context.fillRect(0, 0, width, height)
  context.fillStyle = ACCENT
  context.fillRect(50, 60, 4, 50)
  context.fillStyle = INK
  context.font = `600 64px ${FONT_SANS}`
  context.fillText(t(interactions.contact.title), 74, 104)
  context.fillStyle = "#c9c3b8"
  context.font = `400 34px ${FONT_SANS}`
  ;t({ pt: ["E-mail", "LinkedIn", "GitHub", "Currículo"], en: ["Email", "LinkedIn", "GitHub", "Resume"] }).forEach((label, i) => context.fillText(`·  ${label}`, 74, 190 + i * 54))
  context.fillStyle = ACCENT
  context.font = `500 30px ${FONT_SANS}`
  context.fillText(t({ pt: "Clique para abrir", en: "Click to open" }), 74, height - 50)
}

/** Warm abstract swirl: an homage poster without any copyrighted artwork. */
export const drawSpiralPoster: Draw = (context, width, height) => {
  context.fillStyle = "#e9dfcc"
  context.fillRect(0, 0, width, height)
  context.translate(width / 2, height * 0.42)
  context.strokeStyle = "#e0662c"
  context.lineWidth = 16
  context.beginPath()
  for (let t = 0; t < Math.PI * 6; t += 0.05) {
    const r = 6 + t * 11
    context.lineTo(Math.cos(t) * r, Math.sin(t) * r)
  }
  context.stroke()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.fillStyle = "#1c1b19"
  context.fillRect(40, height - 150, width - 80, 4)
  context.font = `600 40px ${FONT_SANS}`
  context.fillText(t({ pt: "NUNCA DESISTIR", en: "NEVER GIVE UP" }), 40, height - 90)
}

export const drawSkylinePoster: Draw = (context, width, height) => {
  context.fillStyle = "#1a2230"
  context.fillRect(0, 0, width, height)
  const random = seededRandom(9)
  context.fillStyle = "#e9dfcc"
  for (let i = 0; i < 60; i++) context.fillRect(random() * width, random() * height * 0.5, 2, 2)
  context.fillStyle = "#0d1118"
  let x = 0
  while (x < width) {
    const w = 20 + random() * 50
    const h = 60 + random() * 150
    context.fillRect(x, height - h, w, h)
    x += w + 4
  }
  context.fillStyle = "#e0a15a"
  context.beginPath()
  context.arc(width * 0.78, height * 0.22, 26, 0, Math.PI * 2)
  context.fill()
}

export const drawPhoto: Draw = (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, "#c9a877")
  gradient.addColorStop(1, "#5a4630")
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
  context.fillStyle = "rgba(20,14,10,0.55)"
  context.beginPath()
  context.ellipse(width * 0.35, height * 0.62, width * 0.12, height * 0.3, 0, 0, Math.PI * 2)
  context.ellipse(width * 0.62, height * 0.66, width * 0.11, height * 0.26, 0, 0, Math.PI * 2)
  context.fill()
}

export const drawFloorSign = (floor: FloorDefinition): Draw => (context, width, height) => {
  context.fillStyle = "#18191c"
  context.fillRect(0, 0, width, height)
  context.fillStyle = ACCENT
  context.fillRect(70, 80, 80, 4)
  context.fillStyle = MUTED
  context.font = `500 34px ${FONT_SANS}`
  context.fillText(`${t({ pt: "ANDAR", en: "FLOOR" })} ${t(floor.number)}`, 170, 94)
  context.fillStyle = INK
  context.font = `600 110px ${FONT_SANS}`
  context.fillText(t(floor.title), 70, 230)
  context.fillStyle = "#c9c3b8"
  context.font = `400 40px ${FONT_SANS}`
  wrapText(context, t(floor.summary), width - 140).forEach((line, i) => context.fillText(line, 70, 310 + i * 54))
  if (floor.id !== "future") {
    context.fillStyle = MUTED
    context.font = `500 30px ${FONT_SANS}`
    context.fillText(t({ pt: "ESTE ANDAR ESTÁ SENDO PREPARADO", en: "THIS FLOOR IS BEING PREPARED" }), 70, height - 70)
  }
}
