import { both, localized, type Localized } from "@/lib/i18n/language"

import type { FloorId } from "./floors"
import { profile } from "./profile"

export type InteractionType =
  /** Side panel with full content. */
  | "modal"
  /** Simulated computer interface. */
  | "screen"
  /** Cinematic contextual card that fades out by itself. */
  | "tooltip"
  /** The object only reacts (movement, light, sound), optionally with a short caption. */
  | "reaction"

export type InteractionCategory =
  | "identity"
  | "personal"
  | "study"
  | "music"
  | "games"
  | "technology"
  | "contact"
  | "navigation"

export const categoryLabels: Record<InteractionCategory, Localized> = {
  identity: { pt: "Identidade", en: "Identity" },
  personal: { pt: "Pessoal", en: "Personal" },
  study: { pt: "Estudo", en: "Study" },
  music: { pt: "Música", en: "Music" },
  games: { pt: "Jogos", en: "Games" },
  technology: { pt: "Tecnologia", en: "Technology" },
  contact: { pt: "Contato", en: "Contact" },
  navigation: { pt: "Navegação", en: "Navigation" },
}

export type SoundName = "blip" | "strum" | "melody" | "rumble" | "toggle"

export interface InteractionLink {
  label: string
  href: string
}

export interface InteractionDefinition {
  id: string
  title: Localized
  category: InteractionCategory
  interactionType: InteractionType
  description: Localized
  body?: Localized<string[]>
  links?: Localized<InteractionLink[]>
  floorId?: FloorId
  sound?: SoundName
}

// Os textos marcados como rascunho são sugestões: ajuste para a sua história real.
const definitions: InteractionDefinition[] = [
  {
    id: "reception",
    title: both("Enrique Artur"),
    category: "identity",
    interactionType: "modal",
    floorId: "ground",
    description: localized((language) => `${profile.role} · ${profile.education[language]}`),
    body: {
      pt: [
        profile.summary.pt,
        "Trabalho com React, React Native, JavaScript/TypeScript e Python, bancos relacionais (principalmente PostgreSQL) e tenho uma base forte em testes e QA.",
        "Este prédio conta a minha trajetória: cada andar é uma fase. Use o elevador para subir.",
      ],
      en: [
        profile.summary.en,
        "I work with React, React Native, JavaScript/TypeScript and Python, relational databases (mostly PostgreSQL), and I have a solid foundation in testing and QA.",
        "This building tells my story: each floor is a chapter. Take the elevator to go up.",
      ],
    },
    links: {
      pt: [
        { label: "Currículo", href: profile.links.cv.pt },
        { label: "GitHub", href: profile.links.github },
        { label: "LinkedIn", href: profile.links.linkedin },
      ],
      en: [
        { label: "Resume", href: profile.links.cv.en },
        { label: "GitHub", href: profile.links.github },
        { label: "LinkedIn", href: profile.links.linkedin },
      ],
    },
  },
  {
    id: "quote",
    title: { pt: "Como eu trabalho", en: "How I work" },
    category: "identity",
    interactionType: "tooltip",
    floorId: "ground",
    description: {
      pt: "Gosto de entender o porquê das coisas. Testo, erro, tento de novo, até funcionar. É assim que eu aprendo, e é assim que eu quero trabalhar.",
      en: "I like to understand why things work. I test, I fail, I try again until it works. That's how I learn, and that's how I want to work.",
    },
  },
  {
    id: "directory",
    title: { pt: "Diretório", en: "Directory" },
    category: "navigation",
    interactionType: "tooltip",
    floorId: "ground",
    description: {
      pt: "Cada andar é uma fase: Origem, Transição, Tecnologia, Projetos e Futuro. O elevador fica logo ao lado.",
      en: "Each floor is a chapter: Origin, Transition, Technology, Projects and Future. The elevator is right next to it.",
    },
  },
  {
    id: "contact",
    title: { pt: "Contato", en: "Contact" },
    category: "contact",
    interactionType: "modal",
    floorId: "ground",
    description: {
      pt: "Aberto a vagas de entrada em TI e a projetos em que eu possa aprender, contribuir e crescer.",
      en: "Open to entry-level tech roles and to projects where I can learn, contribute and grow.",
    },
    body: {
      pt: ["O jeito mais rápido de falar comigo é por e-mail ou LinkedIn."],
      en: ["The fastest way to reach me is by email or LinkedIn."],
    },
    links: {
      pt: [
        { label: "Enviar e-mail", href: profile.links.email },
        { label: "LinkedIn", href: profile.links.linkedin },
        { label: "GitHub", href: profile.links.github },
      ],
      en: [
        { label: "Send an email", href: profile.links.email },
        { label: "LinkedIn", href: profile.links.linkedin },
        { label: "GitHub", href: profile.links.github },
      ],
    },
  },
  {
    id: "computer",
    title: { pt: "O primeiro computador", en: "The first computer" },
    category: "technology",
    interactionType: "screen",
    floorId: "origin",
    description: {
      pt: "Foi através da curiosidade por tecnologia que comecei a entender que eu não queria apenas consumir tecnologia. Eu queria construir.",
      en: "It was through my curiosity about technology that I started to realize I didn't just want to consume technology. I wanted to build it.",
    },
  },
  {
    id: "naruto",
    title: both("Naruto"),
    category: "personal",
    interactionType: "tooltip",
    floorId: "origin",
    description: {
      pt: "Uma das histórias que me acompanhou durante uma parte importante da minha vida.",
      en: "One of the stories that stayed with me through an important part of my life.",
    },
  },
  {
    id: "books",
    title: { pt: "Livros", en: "Books" },
    category: "study",
    interactionType: "modal",
    floorId: "origin",
    description: { pt: "Estudo e aprendizado autodidata.", en: "Study and self-taught learning." },
    body: {
      pt: [
        "Muito do que eu sei veio de ler documentação, testar, errar e tentar de novo, antes mesmo da faculdade.",
        "Inglês fluente (C1) ajudou: dá pra ler qualquer documentação e aprender direto da fonte. E, porque um idioma só não tinha graça, russo intermediário (B2).",
      ],
      en: [
        "A lot of what I know came from reading documentation, testing, failing and trying again, even before college.",
        "Fluent English (C1) helped: I can read any documentation and learn straight from the source. And, since one extra language just wasn't enough, intermediate Russian (B2).",
      ],
    },
  },
  {
    id: "headphones",
    title: { pt: "Fones", en: "Headphones" },
    category: "music",
    interactionType: "reaction",
    floorId: "origin",
    // Rascunho
    description: { pt: "Trilha sonora de muitas horas de estudo.", en: "The soundtrack to many hours of studying." },
    sound: "melody",
  },
  {
    id: "guitar",
    title: { pt: "Violão", en: "Guitar" },
    category: "music",
    interactionType: "reaction",
    floorId: "origin",
    // Rascunho
    description: { pt: "Nem toda curiosidade é sobre tecnologia.", en: "Not every curiosity is about technology." },
    sound: "strum",
  },
  {
    id: "controller",
    title: { pt: "Controle", en: "Controller" },
    category: "games",
    interactionType: "reaction",
    floorId: "origin",
    // Rascunho
    description: {
      pt: "Videogames: a primeira vez que eu quis entender o que acontece por trás da tela.",
      en: "Video games: the first time I wanted to understand what happens behind the screen.",
    },
    sound: "rumble",
  },
  {
    id: "desk-lamp",
    title: { pt: "Luminária", en: "Desk lamp" },
    category: "personal",
    interactionType: "reaction",
    floorId: "origin",
    description: both(""),
    sound: "toggle",
  },
]

export const interactions: Record<string, InteractionDefinition> = Object.fromEntries(
  definitions.map((definition) => [definition.id, definition]),
)

export const interactionsByFloor = (floorId: FloorId) =>
  definitions.filter((definition) => definition.floorId === floorId && definition.description.pt)
