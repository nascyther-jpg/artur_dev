import { both, type Localized } from "@/lib/i18n/language"

import { ELEVATOR } from "./building"

export type FloorId = "ground" | "origin" | "transition" | "technology" | "projects" | "future"

export interface FloorArea {
  id: string
  label: Localized
  /** [minX, maxX, minZ, maxZ] in floor-local coordinates. */
  bounds: [number, number, number, number]
}

export interface FloorLighting {
  ambient: { color: string; intensity: number }
  hemisphere: { sky: string; ground: string; intensity: number }
  /** Light coming through the windows (casts the only shadow). */
  key: { color: string; intensity: number }
  /** Color of the lit windows seen from outside. */
  windowGlow: string
}

export interface FloorDefinition {
  id: FloorId
  number: Localized
  title: Localized
  tagline: Localized
  summary: Localized
  /** "preview" floors render a placeholder until their rooms are built. */
  status: "ready" | "preview"
  lighting: FloorLighting
  areas: FloorArea[]
}

export const ELEVATOR_AREA_ID = "elevator"

const elevatorArea: FloorArea = {
  id: ELEVATOR_AREA_ID,
  label: { pt: "Elevador", en: "Elevator" },
  bounds: [ELEVATOR.shaft.minX, ELEVATOR.shaft.maxX, ELEVATOR.shaft.minZ, ELEVATOR.shaft.maxZ],
}

export const floors: FloorDefinition[] = [
  {
    id: "ground",
    number: { pt: "T", en: "G" },
    title: { pt: "Quem sou eu", en: "Who I am" },
    tagline: { pt: "Recepção", en: "Reception" },
    summary: {
      pt: "Enrique Artur, estudante de Gestão da TI na Fatec Tatuí e desenvolvedor em formação. Curioso por natureza, em TI por escolha.",
      en: "Enrique Artur, IT Management student at Fatec Tatuí and developer in the making. Curious by nature, in tech by choice.",
    },
    status: "ready",
    lighting: {
      ambient: { color: "#fff1e0", intensity: 0.5 },
      hemisphere: { sky: "#cfd8e6", ground: "#2a2522", intensity: 0.6 },
      key: { color: "#9fb4d9", intensity: 0.9 },
      windowGlow: "#f3d6aa",
    },
    areas: [elevatorArea, { id: "lobby", label: { pt: "Recepção", en: "Reception" }, bounds: [-7, 7, -5, 5] }],
  },
  {
    id: "origin",
    number: both("01"),
    title: { pt: "Origem", en: "Origin" },
    tagline: { pt: "O quarto onde tudo começou", en: "The bedroom where it all began" },
    summary: {
      pt: "A fase mais pessoal: o quarto, o primeiro computador e as histórias que despertaram a vontade de construir coisas.",
      en: "The most personal chapter: the bedroom, the first computer and the stories that sparked the urge to build things.",
    },
    status: "ready",
    lighting: {
      ambient: { color: "#ffcf9e", intensity: 0.4 },
      hemisphere: { sky: "#8a93a8", ground: "#3a2a20", intensity: 0.5 },
      key: { color: "#7f95c4", intensity: 0.55 },
      windowGlow: "#ffc27a",
    },
    areas: [
      elevatorArea,
      { id: "hall", label: { pt: "Corredor", en: "Hallway" }, bounds: [-7, -3, -2.5, 5] },
      { id: "bedroom", label: { pt: "Quarto", en: "Bedroom" }, bounds: [-3, 7, -5, 5] },
    ],
  },
  {
    id: "transition",
    number: both("02"),
    title: { pt: "Transição", en: "Transition" },
    tagline: { pt: "Do quarto para a mesa de trabalho", en: "From the bedroom to the work desk" },
    summary: {
      pt: "A mudança da vida pessoal para a profissional: estudo, primeiros projetos, terminal, diagramas e muito post-it.",
      en: "The shift from personal to professional life: studying, first projects, the terminal, diagrams and lots of sticky notes.",
    },
    status: "preview",
    lighting: {
      ambient: { color: "#f4f1ea", intensity: 0.3 },
      hemisphere: { sky: "#c9ced6", ground: "#2b2a28", intensity: 0.4 },
      key: { color: "#c8d2e0", intensity: 0.7 },
      windowGlow: "#f1e4c8",
    },
    areas: [elevatorArea],
  },
  {
    id: "technology",
    number: both("03"),
    title: { pt: "Tecnologia", en: "Technology" },
    tagline: { pt: "O laboratório", en: "The lab" },
    summary: {
      pt: "As ferramentas do dia a dia integradas ao ambiente: código nos monitores, comandos no terminal e arquitetura no quadro.",
      en: "Everyday tools built into the space: code on the monitors, commands in the terminal and architecture on the whiteboard.",
    },
    status: "preview",
    lighting: {
      ambient: { color: "#dfe8f5", intensity: 0.3 },
      hemisphere: { sky: "#b8c8e0", ground: "#1e232b", intensity: 0.45 },
      key: { color: "#a9c2ea", intensity: 0.8 },
      windowGlow: "#cfe0ff",
    },
    areas: [elevatorArea],
  },
  {
    id: "projects",
    number: both("04"),
    title: { pt: "Projetos", en: "Projects" },
    tagline: { pt: "Uma sala para cada projeto", en: "A room for every project" },
    summary: {
      pt: "Cada projeto ganha uma sala própria, com problema, solução, tecnologias e links.",
      en: "Every project gets its own room, with the problem, the solution, the tech stack and links.",
    },
    status: "preview",
    lighting: {
      ambient: { color: "#f5f3ef", intensity: 0.35 },
      hemisphere: { sky: "#d6dae0", ground: "#2a2826", intensity: 0.45 },
      key: { color: "#d7dde8", intensity: 0.8 },
      windowGlow: "#fbe9cf",
    },
    areas: [elevatorArea],
  },
  {
    id: "future",
    number: both("05"),
    title: { pt: "Futuro", en: "Future" },
    tagline: { pt: "Ainda em construção", en: "Still under construction" },
    summary: {
      pt: "Ainda em construção. A história ainda está sendo escrita.",
      en: "Still under construction. The story is still being written.",
    },
    status: "preview",
    lighting: {
      ambient: { color: "#e9eef5", intensity: 0.4 },
      hemisphere: { sky: "#aebdd6", ground: "#2e2b27", intensity: 0.55 },
      key: { color: "#dfe7f5", intensity: 1.1 },
      windowGlow: "#9fb0c8",
    },
    areas: [elevatorArea],
  },
]
