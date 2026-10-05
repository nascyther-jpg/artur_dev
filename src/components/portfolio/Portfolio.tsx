import { ArrowDown, ArrowRight, ArrowUpRight, Box } from "lucide-react"
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react"

import { prefetch3D } from "@/app/load3D"
import { Reveal } from "@/components/site/reveal"
import { aboutBio, aboutFacts, experience, heroFacts, heroIntro, tools } from "@/data/about"
import { interactions } from "@/data/interactions"
import { profile } from "@/data/profile"
import { projects, type Project } from "@/data/projects"
import { useT, type Localized } from "@/lib/i18n/language"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/ui/LanguageToggle/LanguageToggle"

import { NewEduMockup, QaLabMockup } from "./mockups"

/* ─────────────────────────────── Shared styles ─────────────────────────────── */

const WRAP = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"
const LABEL_TYPE = "text-[0.75rem] font-medium uppercase tracking-[0.1em]"
const LABEL = `${LABEL_TYPE} text-ink-muted`
const ACTION =
  "focus-ring group/action inline-flex min-h-11 items-center gap-1.5 text-[0.98rem] font-medium text-ink underline decoration-rule decoration-1 underline-offset-[6px] transition-colors hover:decoration-ink"
const ARROW = "size-4 transition-transform duration-300 ease-out-quart group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"

const NAV: { id: string; label: Localized }[] = [
  { id: "projetos", label: { pt: "Projetos", en: "Work" } },
  { id: "sobre", label: { pt: "Sobre", en: "About" } },
  { id: "trajetoria", label: { pt: "Trajetória", en: "Experience" } },
  { id: "contato", label: { pt: "Contato", en: "Contact" } },
]

const RESUME_LABEL = { pt: "Currículo", en: "Resume" }
const ENTER_3D_LABEL = { pt: "Explorar em 3D", en: "Explore in 3D" }

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const t = useT()
  const external = /^https?:/.test(href)
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} className={cn(ACTION, className)}>
      {children}
      <ArrowUpRight className={ARROW} strokeWidth={1.75} aria-hidden="true" />
      {external && <span className="sr-only">{t({ pt: "(abre em nova aba)", en: "(opens in a new tab)" })}</span>}
    </a>
  )
}

function SectionHeader({ index, label, title, id }: { index: string; label: Localized; title: ReactNode; id: string }) {
  const t = useT()
  return (
    <Reveal className={WRAP}>
      <div className="grid grid-cols-12 gap-x-6 gap-y-5 border-t border-rule pt-5">
        <p className={cn(LABEL, "col-span-12 tabular-nums md:col-span-3")}>
          <span className="text-ink">{index}</span>
          <span className="mx-2" aria-hidden="true">/</span>
          {t(label)}
        </p>
        <h2 id={id} className="col-span-12 text-[clamp(2.25rem,5.2vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance md:col-span-9">
          {title}
        </h2>
      </div>
    </Reveal>
  )
}

/* ─────────────────────────────────── Header ─────────────────────────────────── */

// Below lg the links move into the full-screen menu (the full nav doesn't fit on tablets).
function SiteHeader({ onEnter3D, open, setOpen }: { onEnter3D?: () => void; open: boolean; setOpen: (open: boolean) => void }) {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggle.current?.focus()
    }
    const closeOnDesktop = () => window.innerWidth >= 1024 && setOpen(false)
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", closeOnDesktop)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", closeOnDesktop)
    }
  }, [open, setOpen])

  const close = () => setOpen(false)

  return (
    <header className={cn("sticky top-0 z-40 border-b bg-paper transition-colors duration-300", scrolled || open ? "border-rule" : "border-transparent")}>
      <div className={cn(WRAP, "flex h-16 items-center justify-between gap-6")}>
        <a href="#top" onClick={close} className="focus-ring text-[0.95rem] font-semibold tracking-[-0.02em] whitespace-nowrap text-ink">
          {profile.name}
        </a>

        <nav aria-label={t({ pt: "Principal", en: "Main" })} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.875rem] text-ink-soft">
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="focus-ring transition-colors hover:text-ink">
                  {t(item.label)}
                </a>
              </li>
            ))}
            <li>
              <a href={t(profile.links.cv)} className="focus-ring transition-colors hover:text-ink">
                {t(RESUME_LABEL)}
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          {onEnter3D && (
            <button
              type="button"
              onClick={onEnter3D}
              onPointerEnter={prefetch3D}
              onFocus={prefetch3D}
              className="focus-ring hidden min-h-8 items-center gap-1.5 text-[0.875rem] text-ink transition-colors whitespace-nowrap hover:text-accent lg:inline-flex"
            >
              <Box className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {t(ENTER_3D_LABEL)}
            </button>
          )}
          <LanguageToggle tone="light" />
          <button
            type="button"
            ref={toggle}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="menu"
            className="focus-ring min-h-10 px-1 text-[0.875rem] font-medium text-ink lg:hidden"
          >
            {open ? t({ pt: "Fechar", en: "Close" }) : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-rule bg-paper lg:hidden">
          <nav aria-label={t({ pt: "Menu", en: "Menu" })} className={cn(WRAP, "flex min-h-full flex-col pt-4 pb-10")}>
            <ul>
              {NAV.map((item, index) => (
                <li key={item.id} className="border-b border-rule">
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    className="focus-ring flex items-baseline justify-between py-4 text-[2.25rem] leading-none font-medium tracking-[-0.04em] text-ink"
                  >
                    {t(item.label)}
                    <span className={cn(LABEL, "tabular-nums")}>{String(index + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col items-start gap-2 pt-10">
              <ExternalLink href={t(profile.links.cv)}>{t(RESUME_LABEL)}</ExternalLink>
              {onEnter3D && (
                <button type="button" onClick={onEnter3D} onPointerEnter={prefetch3D} onFocus={prefetch3D} className={ACTION}>
                  {t(ENTER_3D_LABEL)}
                  <ArrowUpRight className={ARROW} strokeWidth={1.75} aria-hidden="true" />
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ──────────────────────────────────── Hero ──────────────────────────────────── */

function Hero() {
  const t = useT()
  return (
    <section id="top" aria-labelledby="hero-title" className={cn(WRAP, "pt-8 pb-4 md:pt-14")}>
      <div className={cn(LABEL, "flex flex-wrap justify-between gap-x-6 gap-y-1")}>
        <span>{t({ pt: "Portfólio", en: "Portfolio" })} — 2026</span>
        <span>
          {profile.location} — {t({ pt: "Brasil", en: "Brazil" })}
        </span>
      </div>

      <div className="relative mt-10 md:mt-14">
        <h1
          id="hero-title"
          // Negative margin aligns the letters (not their side bearing) with the grid edge.
          className="-ml-[0.055em] text-[18vw] leading-[0.84] font-semibold tracking-[-0.06em] text-ink uppercase md:text-[clamp(3.5rem,15.5vw,15rem)]"
        >
          <span className="block">Enrique</span>
          <span className="block md:pl-[33.4%]">Artur</span>
        </h1>
        <p className="mt-5 text-[clamp(1.25rem,2vw,1.75rem)] leading-tight font-medium tracking-[-0.03em] text-ink md:absolute md:bottom-[0.35em] md:left-0 md:mt-0 md:max-w-[30%]">
          {profile.role}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 border-t border-rule pt-6 md:mt-16">
        <p className="col-span-12 text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.45] text-ink-soft md:col-span-7 lg:col-span-5">
          {t(heroIntro)}
        </p>
        <div className="col-span-12 flex flex-wrap items-center gap-x-7 gap-y-3 self-start md:col-span-5 md:justify-end lg:col-span-4 lg:col-start-9">
          <a
            href="#projetos"
            className="focus-ring group/action inline-flex h-12 items-center gap-2 bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors duration-300 hover:bg-accent"
          >
            {t({ pt: "Ver projetos", en: "See projects" })}
            <ArrowDown className="size-4 transition-transform duration-300 ease-out-quart group-hover/action:translate-y-0.5" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href="#contato" className={ACTION}>
            {t({ pt: "Entrar em contato", en: "Get in touch" })}
          </a>
        </div>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-20 md:grid-cols-4">
        {heroFacts.map((fact) => (
          <div key={fact.label.en}>
            <dt className={LABEL}>{t(fact.label)}</dt>
            <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">{t(fact.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ────────────────────────────────── Projects ────────────────────────────────── */

const MOCKUPS: Record<string, ComponentType<{ className?: string; label?: string }>> = {
  newedu: NewEduMockup,
  "qa-lab": QaLabMockup,
}

function CaseStudy({ project, index, onEnter3D }: { project: Project; index: number; onEnter3D?: () => void }) {
  const t = useT()
  const number = String(index + 1).padStart(2, "0")
  const titleId = `${project.id}-title`
  const codeHref = project.links.live ?? project.links.github
  const explore = project.id === "portfolio-3d" ? onEnter3D : undefined

  const mediaClass =
    "h-full w-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.015] motion-reduce:transition-none"
  const Mockup = MOCKUPS[project.id]
  const sources = project.imageSources
  const media = project.images[0] ? (
    <picture>
      {sources?.portrait && <source media="(max-width: 639px)" type="image/webp" srcSet={sources.portrait} />}
      {/* The 16:9 picture covers a 16:10 frame, so it renders about 11% wider than the frame. */}
      {sources && <source type="image/webp" srcSet={sources.webp} sizes="(min-width: 1440px) 1494px, 111vw" />}
      <img
        src={project.images[0]}
        alt={t(project.imageAlt)}
        width={2400}
        height={1350}
        loading="lazy"
        decoding="async"
        className={mediaClass}
      />
    </picture>
  ) : Mockup ? (
    <Mockup className={mediaClass} label={t(project.imageAlt)} />
  ) : null

  // The overlay repeats the main action for pointer users; keyboard and screen readers use the text links,
  // and the picture itself stays visible to assistive technology.
  const overlay = "absolute inset-0 cursor-pointer"
  const mediaAction = explore ? (
    <button type="button" tabIndex={-1} aria-hidden="true" onClick={explore} onPointerEnter={prefetch3D} className={overlay} />
  ) : codeHref ? (
    <a href={codeHref} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className={overlay} />
  ) : null

  return (
    <article aria-labelledby={titleId} className="group">
      <Reveal>
        <div className="flex items-baseline justify-between gap-6 border-t border-ink pt-4">
          <span className={cn(LABEL_TYPE, "text-ink tabular-nums")}>{number}</span>
          <span className={cn(LABEL, "text-right")}>
            {t(project.category)} · {t(project.platform)}
          </span>
        </div>
        <h3 id={titleId} className="mt-5 text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.92] font-medium tracking-[-0.05em] text-ink md:mt-7">
          {t(project.name)}
        </h3>
      </Reveal>

      <Reveal className="mt-8 md:mt-10">
        <figure className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep sm:aspect-[16/10]">
          {media}
          {mediaAction}
        </figure>
      </Reveal>

      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-10">
        <p className="col-span-12 text-[clamp(1.3rem,1.9vw,1.65rem)] leading-[1.3] tracking-[-0.02em] text-ink lg:col-span-4">
          {t(project.tagline)}
        </p>
        <dl className="col-span-12 grid gap-5 text-[0.98rem] leading-[1.6] md:col-span-8 lg:col-span-5">
          <div>
            <dt className={LABEL}>{t({ pt: "Problema", en: "Problem" })}</dt>
            <dd className="mt-1.5 text-ink-soft">{t(project.problem)}</dd>
          </div>
          <div>
            <dt className={LABEL}>{t({ pt: "O que construí", en: "What I built" })}</dt>
            <dd className="mt-1.5 text-ink-soft">{t(project.solution)}</dd>
          </div>
        </dl>
        <div className="col-span-12 flex flex-col gap-6 md:col-span-4 lg:col-span-3">
          <div>
            <p className={LABEL}>Stack</p>
            <ul className="mt-1.5 text-[0.98rem] leading-[1.6] text-ink-soft">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start">
            {explore && (
              <button type="button" onClick={explore} onPointerEnter={prefetch3D} onFocus={prefetch3D} className={ACTION}>
                {t({ pt: "Explorar o prédio", en: "Explore the building" })}
                <ArrowUpRight className={ARROW} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
            {codeHref && (
              <ExternalLink href={codeHref}>
                {project.links.live ? t({ pt: "Ver online", en: "View live" }) : t({ pt: "Código no GitHub", en: "Code on GitHub" })}
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Work({ onEnter3D }: { onEnter3D?: () => void }) {
  const t = useT()
  return (
    <section id="projetos" aria-labelledby="projetos-title" className="mt-28 scroll-mt-20 md:mt-40">
      <SectionHeader
        index="01"
        id="projetos-title"
        label={{ pt: "Projetos", en: "Work" }}
        title={
          <>
            {t({ pt: "Projetos selecionados", en: "Selected work" })}
            <span className="ml-3 align-top text-[0.32em] font-normal tracking-normal text-ink-muted tabular-nums">
              ({String(projects.length).padStart(2, "0")})
            </span>
          </>
        }
      />
      <div className={cn(WRAP, "mt-14 space-y-28 md:mt-20 md:space-y-40")}>
        {projects.map((project, index) => (
          <CaseStudy key={project.id} project={project} index={index} onEnter3D={onEnter3D} />
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────── About ─────────────────────────────────── */

function About() {
  const t = useT()
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="mt-32 scroll-mt-20 md:mt-48">
      <SectionHeader index="02" id="sobre-title" label={{ pt: "Sobre", en: "About" }} title={t(profile.headline)} />
      <div className={cn(WRAP, "mt-12 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-16")}>
        <Reveal className="col-span-12 space-y-6 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.6] text-ink-soft md:col-span-9 md:col-start-4 lg:col-span-5 lg:col-start-4">
          <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.35] tracking-[-0.025em] text-ink">{t(interactions.quote.description)}</p>
          {t(aboutBio).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal className="col-span-12 md:col-span-9 md:col-start-4 lg:col-span-3 lg:col-start-10">
          <dl className="divide-y divide-rule border-y border-rule">
            {aboutFacts.map((fact) => (
              <div key={fact.label.en} className="py-4">
                <dt className={LABEL}>{t(fact.label)}</dt>
                <dd className="mt-1 text-[0.95rem] leading-snug text-ink">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="col-span-12 border-t border-rule pt-6 md:col-span-9 md:col-start-4">
          <h3 className={LABEL}>{t({ pt: "Ferramentas", en: "Tools" })}</h3>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {tools.map((group) => (
              <div key={group.label.en}>
                <h4 className="text-[0.95rem] font-medium text-ink">{t(group.label)}</h4>
                <ul className="mt-2 space-y-1 text-[0.95rem] leading-snug text-ink-soft">
                  {t(group.items).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────── Experience ──────────────────────────────── */

function Experience() {
  const t = useT()
  return (
    <section id="trajetoria" aria-labelledby="trajetoria-title" className="mt-32 scroll-mt-20 md:mt-48">
      <SectionHeader
        index="03"
        id="trajetoria-title"
        label={{ pt: "Trajetória", en: "Experience" }}
        title={t({ pt: "Experiência e formação", en: "Experience and education" })}
      />
      <div className={cn(WRAP, "mt-12 md:mt-16")}>
        <ol>
          {experience.map((entry) => (
            <li key={entry.id} className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-rule py-7 md:py-9">
              <p className={cn(LABEL, "col-span-12 md:col-span-3")}>{t(entry.kind)}</p>
              <div className="col-span-12 md:col-span-4">
                <h3 className="text-[clamp(1.35rem,2vw,1.75rem)] leading-tight font-medium tracking-[-0.03em] text-ink">{t(entry.role)}</h3>
                <p className="mt-1 text-ink-muted">{entry.org}</p>
              </div>
              <p className="col-span-12 leading-[1.6] text-ink-soft md:col-span-5">{t(entry.text)}</p>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-12 gap-x-6 border-t border-rule pt-5">
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <ExternalLink href={t(profile.links.cv)}>{t({ pt: "Currículo completo", en: "Full resume" })}</ExternalLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────── Contact + footer ───────────────────────────── */

function Contact() {
  const t = useT()
  const email = profile.links.email.replace(/^mailto:/, "")
  return (
    <section id="contato" aria-labelledby="contato-title" className="mt-32 scroll-mt-20 md:mt-48">
      <SectionHeader index="04" id="contato-title" label={{ pt: "Contato", en: "Contact" }} title={t({ pt: "Vamos conversar.", en: "Let's talk." })} />
      <Reveal className={cn(WRAP, "mt-10 grid grid-cols-12 gap-x-6 md:mt-14")}>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <p className="max-w-[36rem] text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.6] text-ink-soft">
            {t(interactions.contact.description)} {t({ pt: "O jeito mais rápido de falar comigo é por e-mail.", en: "The fastest way to reach me is by email." })}
          </p>
          <a
            href={profile.links.email}
            className="focus-ring group/action mt-8 inline-flex max-w-full items-center gap-3 text-[clamp(1.5rem,4.4vw,3.75rem)] leading-tight font-medium tracking-[-0.04em] break-all text-ink underline decoration-rule decoration-1 underline-offset-[0.18em] transition-colors hover:decoration-ink md:break-normal"
          >
            {email}
            <ArrowRight className="size-[0.7em] shrink-0 transition-transform duration-300 ease-out-quart group-hover/action:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-1">
            <li>
              <ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.links.github}>GitHub</ExternalLink>
            </li>
            <li>
              <ExternalLink href={t(profile.links.cv)}>{t(RESUME_LABEL)}</ExternalLink>
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  )
}

function Footer({ inert }: { inert: boolean }) {
  const t = useT()
  return (
    <footer inert={inert} className={cn(WRAP, "mt-28 md:mt-40")}>
      <div className="flex flex-col gap-3 border-t border-rule py-8 text-[0.85rem] text-ink-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 {profile.fullName}</p>
        <p>{t({ pt: "Feito com React, TypeScript e Three.js.", en: "Built with React, TypeScript and Three.js." })}</p>
        <a href="#top" className="focus-ring self-start transition-colors hover:text-ink md:self-auto">
          {t({ pt: "Voltar ao topo", en: "Back to top" })} <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  )
}

/* ───────────────────────────────────── Page ─────────────────────────────────── */

/** The editorial portfolio: the main page. The 3D building is an optional signature reached from here. */
// True once the page has been shown; the fade-in then only plays when coming back from the 3D building.
let shownBefore = false

export function Portfolio({ onEnter3D }: { onEnter3D?: () => void }) {
  const t = useT()
  const [fadeIn] = useState(() => shownBefore)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    shownBefore = true
  }, [])
  return (
    <div className={cn("min-h-svh bg-paper text-ink", fadeIn && "page-in")}>
      <a
        inert={menuOpen}
        href="#conteudo"
        className="focus-ring sr-only z-50 bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t({ pt: "Pular para o conteúdo", en: "Skip to content" })}
      </a>
      <SiteHeader onEnter3D={onEnter3D} open={menuOpen} setOpen={setMenuOpen} />
      {/* While the full-screen menu is open, the page behind it can't be reached with Tab or a screen reader. */}
      <main id="conteudo" tabIndex={-1} inert={menuOpen} className="outline-none">
        <Hero />
        <Work onEnter3D={onEnter3D} />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer inert={menuOpen} />
    </div>
  )
}
