// Textos do site editorial (hero, sobre e trajetória). Projetos ficam em projects.ts; contato e links em profile.ts.

import type { Localized } from "@/lib/i18n/language"

import { profile } from "./profile"

export interface Fact {
  label: Localized
  value: Localized
}

export const heroIntro: Localized = {
  pt: "Estudo Gestão da TI na Fatec Tatuí e construo software com React, TypeScript e Python. Gosto de entender por que as coisas funcionam, e de testar até ter certeza de que funcionam.",
  en: "I study IT Management at Fatec Tatuí and build software with React, TypeScript and Python. I like understanding why things work, and testing until I'm sure they do.",
}

/** The four short facts under the hero. */
export const heroFacts: Fact[] = [
  { label: { pt: "Agora", en: "Now" }, value: { pt: "Gestão da TI, Fatec Tatuí — 6º semestre", en: "IT Management, Fatec Tatuí — 6th semester" } },
  { label: { pt: "Foco", en: "Focus" }, value: { pt: "QA, testes e desenvolvimento", en: "QA, testing and development" } },
  { label: { pt: "Idiomas", en: "Languages" }, value: { pt: "Português, inglês (C1), russo (B2)", en: "Portuguese, English (C1), Russian (B2)" } },
  { label: { pt: "Status", en: "Status" }, value: profile.status },
]

/** Paragraphs after the "how I work" quote (interactions.quote). */
export const aboutBio: Localized<string[]> = {
  pt: [
    "Muito do que eu sei veio de ler documentação, testar, errar e tentar de novo, antes mesmo da faculdade. Hoje estudo Gestão da Tecnologia da Informação na Fatec Tatuí e trabalho com React, TypeScript, Python e PostgreSQL.",
    "Quero começar por QA e testes de software, sem me prender a uma área só: também estudo desenvolvimento, banco de dados, Linux e fundamentos de gestão de TI.",
  ],
  en: [
    "A lot of what I know came from reading documentation, testing, failing and trying again, even before college. Today I study Information Technology Management at Fatec Tatuí and work with React, TypeScript, Python and PostgreSQL.",
    "I want to start in QA and software testing without boxing myself into a single area: I also study development, databases, Linux and IT management fundamentals.",
  ],
}

export const aboutFacts: Fact[] = [
  {
    label: { pt: "Formação", en: "Education" },
    value: { pt: "Gestão da TI — Fatec Tatuí, 6º semestre (2026)", en: "IT Management — Fatec Tatuí, 6th semester (2026)" },
  },
  {
    label: { pt: "Idiomas", en: "Languages" },
    value: { pt: "Português nativo, inglês fluente (C1), russo intermediário (B2)", en: "Native Portuguese, fluent English (C1), intermediate Russian (B2)" },
  },
  {
    label: { pt: "Procurando", en: "Looking for" },
    value: { pt: "Primeira vaga em QA, SDET, suporte ou desenvolvimento", en: "A first role in QA, SDET, support or development" },
  },
  {
    label: { pt: "Fora da tela", en: "Off-screen" },
    value: { pt: "Violão, videogames e boas histórias (Naruto incluído).", en: "Guitar, video games and good stories (Naruto included)." },
  },
]

export const tools: { label: Localized; items: Localized<string[]> }[] = [
  { label: { pt: "Front-end", en: "Front-end" }, items: { pt: ["React", "TypeScript", "Tailwind CSS", "Three.js · R3F"], en: ["React", "TypeScript", "Tailwind CSS", "Three.js · R3F"] } },
  {
    label: { pt: "Back-end e dados", en: "Back-end & data" },
    items: { pt: ["Python", "FastAPI", "PostgreSQL", "MariaDB · MongoDB", "Firebase"], en: ["Python", "FastAPI", "PostgreSQL", "MariaDB · MongoDB", "Firebase"] },
  },
  { label: { pt: "Mobile", en: "Mobile" }, items: { pt: ["React Native", "Expo"], en: ["React Native", "Expo"] } },
  {
    label: { pt: "Qualidade", en: "Quality" },
    items: { pt: ["pytest", "Casos de teste", "Relato de bugs", "JUnit XML"], en: ["pytest", "Test cases", "Bug reports", "JUnit XML"] },
  },
  {
    label: { pt: "Ambiente", en: "Environment" },
    items: { pt: ["Git e GitHub", "Linux (Red Hat, Kali, Arch)", "Figma"], en: ["Git & GitHub", "Linux (Red Hat, Kali, Arch)", "Figma"] },
  },
]

export const experience: { id: string; kind: Localized; role: Localized; org: string; text: Localized }[] = [
  {
    id: "fatec",
    kind: { pt: "Formação · atual", en: "Education · current" },
    role: { pt: "Gestão da Tecnologia da Informação", en: "Information Technology Management" },
    org: "Fatec Tatuí",
    text: { pt: "Curso tecnólogo, 6º semestre em 2026.", en: "Technologist degree, 6th semester in 2026." },
  },
  {
    id: "g2i",
    kind: { pt: "Trabalho", en: "Work" },
    role: { pt: "Engenharia de IA", en: "AI Engineering" },
    org: "G2i.CO",
    text: {
      pt: "Projetos de inteligência artificial, desenvolvimento de modelos e implementação de soluções, em ambiente remoto.",
      en: "Artificial intelligence projects, model development and solution implementation, working remotely.",
    },
  },
  {
    id: "mavsa",
    kind: { pt: "Trabalho", en: "Work" },
    role: { pt: "Recreacionista", en: "Recreation Assistant" },
    org: "Mavsa Resort",
    text: {
      pt: "Atendimento, trabalho em equipe e resolver problema na hora, com gente olhando.",
      en: "Customer service, teamwork and solving problems on the spot, with people watching.",
    },
  },
]
