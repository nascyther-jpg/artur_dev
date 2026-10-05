// Substitua os placeholders de contato antes de publicar.
export const profile = {
  name: "Enrique Artur",
  fullName: "Enrique Artur Rodrigues Santos",
  role: "Software Developer",
  location: "Cesário Lange, SP",
  education: {
    pt: "Gestão da TI · Fatec Tatuí · 6º semestre",
    en: "IT Management · Fatec Tatuí · 6th semester",
  },
  headline: {
    pt: "Curioso por natureza. Em TI por escolha.",
    en: "Curious by nature. In tech by choice.",
  },
  summary: {
    pt: "Estudo Gestão da TI, quebro coisas pra entender como funcionam e depois conserto. Agora quero fazer isso num time de verdade.",
    en: "I study IT Management, break things to understand how they work, and then fix them. Now I want to do that on a real team.",
  },
  status: {
    pt: "Procurando a primeira vaga em TI",
    en: "Looking for my first job in tech",
  },
  links: {
    email: "mailto:seuemail@email.com",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    cv: { pt: "curriculo.html", en: "resume.html" },
  },
} as const
