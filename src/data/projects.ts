// Cada projeto vira uma sala no andar 04. Para adicionar um projeto, basta incluir um item aqui.

import { both, type Localized } from "@/lib/i18n/language"

export interface Project {
  id: string
  name: Localized
  category: Localized
  tagline: Localized
  problem: Localized
  solution: Localized
  stack: string[]
  /** Plataforma, mostrada ao lado da categoria. */
  platform: Localized
  /** Caminhos em /public (ex.: "images/newedu-1.webp"). Sem imagem, o site mostra a ilustração da interface. */
  images: string[]
  /** Texto alternativo da imagem (ou da ilustração da interface, quando não há imagem). */
  imageAlt: Localized
  /** Versões otimizadas de images[0]: srcset em WebP e, opcional, um recorte 4:5 para celular. */
  imageSources?: { webp: string; portrait?: string }
  links: { github?: string; live?: string }
}

export const projects: Project[] = [
  {
    id: "newedu",
    name: both("NewEdu"),
    category: { pt: "EdTech", en: "EdTech" },
    tagline: {
      pt: "Estudar pra prova, só que com XP, níveis e ranking.",
      en: "Studying for exams, but with XP, levels and a leaderboard.",
    },
    problem: {
      pt: "Estudar para provas e concursos sozinho é desmotivador e difícil de acompanhar.",
      en: "Studying for exams and public-service tests on your own is discouraging and hard to keep track of.",
    },
    solution: {
      pt: "Plataforma gamificada com XP, níveis, ranking e acompanhamento de progresso. Participei do planejamento, da definição do produto, da prototipação e do desenvolvimento.",
      en: "A gamified platform with XP, levels, a leaderboard and progress tracking. I took part in planning, product definition, prototyping and development.",
    },
    platform: { pt: "App mobile", en: "Mobile app" },
    stack: ["React Native", "Expo", "Firebase", "Firestore", "Figma"],
    images: [],
    imageAlt: {
      pt: "Ilustração da interface do NewEdu: tela inicial com nível e XP, uma questão de simulado e o ranking semanal.",
      en: "Illustration of the NewEdu interface: home screen with level and XP, a practice-exam question and the weekly leaderboard.",
    },
    links: { github: "https://github.com/" },
  },
  {
    id: "qa-lab",
    name: both("QA Lab"),
    category: { pt: "Qualidade de software", en: "Software quality" },
    tagline: {
      pt: "Casos de teste, ciclos por versão, bugs e resultados do pytest no mesmo lugar.",
      en: "Test cases, per-release cycles, bugs and pytest results in one place.",
    },
    problem: {
      pt: "Testes manuais e automatizados costumam viver em ferramentas separadas, sem um relatório único.",
      en: "Manual and automated tests usually live in separate tools, with no single report.",
    },
    solution: {
      pt: "Gerenciador de testes no estilo TestRail: importa JUnit XML (pytest, Jest, Cypress), detecta testes instáveis e exporta relatórios. API em FastAPI sobre PostgreSQL, coberta por 77 testes.",
      en: "A TestRail-style test manager: imports JUnit XML (pytest, Jest, Cypress), detects flaky tests and exports reports. FastAPI API on PostgreSQL, covered by 77 tests.",
    },
    platform: { pt: "Web + API", en: "Web + API" },
    stack: ["Python", "PostgreSQL", "FastAPI", "pytest", "JavaScript"],
    images: [],
    imageAlt: {
      pt: "Ilustração da interface do QA Lab: execução de testes de uma versão, com casos aprovados, falhos e instáveis e um bug vinculado.",
      en: "Illustration of the QA Lab interface: a release test run with passed, failed and flaky cases and a linked bug.",
    },
    links: { github: "https://github.com/" },
  },
  {
    id: "portfolio-3d",
    name: { pt: "Portfólio 3D", en: "3D Portfolio" },
    category: { pt: "Web interativa", en: "Interactive web" },
    platform: { pt: "Web · WebGL", en: "Web · WebGL" },
    tagline: {
      pt: "Um prédio explorável em que cada andar é uma fase da minha trajetória.",
      en: "An explorable building where each floor is a chapter of my journey.",
    },
    problem: {
      pt: "Um currículo em PDF não mostra como eu construo software.",
      en: "A PDF resume doesn't show how I build software.",
    },
    solution: {
      pt: "Experiência em primeira pessoa com React Three Fiber: elevador funcional, tour automático, interações definidas por dados, qualidade ajustada a cada dispositivo e versão sem WebGL.",
      en: "A first-person experience built with React Three Fiber: a working elevator, an automatic tour, data-driven interactions, quality tuned per device and a version that works without WebGL.",
    },
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "Web Audio API"],
    images: ["images/portfolio-3d.jpg"],
    imageSources: {
      webp: "images/portfolio-3d-1200.webp 1200w, images/portfolio-3d-2400.webp 2400w",
      portrait: "images/portfolio-3d-portrait.webp",
    },
    imageAlt: {
      pt: "Captura da experiência 3D: o prédio do portfólio à noite, com as janelas acesas, entre outros prédios da cidade.",
      en: "Screenshot of the 3D experience: the portfolio building at night, windows lit, among other city buildings.",
    },
    links: {},
  },
]
