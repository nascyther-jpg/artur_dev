// Interface illustrations for projects that don't have real screenshots yet (drawn from each app's description).
// Replace them by adding image paths to `images` in src/data/projects.ts.

import type { ReactNode } from "react"

type Align = "xMidYMid" | "xMinYMid"

interface MockupProps {
  className?: string
  /** Text alternative; without it the illustration is treated as decorative. */
  label?: string
}

function Canvas({ children, background, align = "xMidYMid", className, label }: MockupProps & { children: ReactNode; background: string; align?: Align }) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio={`${align} slice`}
      className={className}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      style={{ fontFamily: "inherit", letterSpacing: "-0.01em" }}
    >
      <rect width="1600" height="1000" fill={background} />
      {children}
    </svg>
  )
}

/* ─────────────────────────────── NewEdu ─────────────────────────────── */

const EDU = { accent: "#4c5fd5", accentSoft: "#eceffd", ink: "#16171c", muted: "#7a7d88", line: "#e4e6ec", surface: "#f2f3f6" }

function Phone({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="330" height="680" rx="48" fill="#151413" />
      <rect x="12" y="12" width="306" height="656" rx="37" fill="#fbfbfc" />
      <rect x="125" y="26" width="80" height="22" rx="11" fill="#151413" />
      <text x="40" y="44" fontSize="15" fontWeight="600" fill={EDU.ink}>9:41</text>
      <g transform="translate(262 34)" fill={EDU.ink}>
        <rect x="0" y="6" width="4" height="6" rx="1" />
        <rect x="6" y="3" width="4" height="9" rx="1" />
        <rect x="12" y="0" width="4" height="12" rx="1" />
        <rect x="21" y="1" width="20" height="10" rx="3" fill="none" stroke={EDU.ink} strokeWidth="1.5" />
        <rect x="23" y="3" width="14" height="6" rx="1.5" />
      </g>
      {children}
    </g>
  )
}

function LessonRow({ y, color, title, detail, progress }: { y: number; color: string; title: string; detail: string; progress: number }) {
  return (
    <g transform={`translate(32 ${y})`}>
      <rect width="266" height="60" rx="14" fill={EDU.surface} />
      <rect x="12" y="13" width="34" height="34" rx="10" fill={color} />
      <text x="58" y="27" fontSize="14" fontWeight="600" fill={EDU.ink}>{title}</text>
      <text x="58" y="45" fontSize="12" fill={EDU.muted}>{detail}</text>
      <circle cx="240" cy="30" r="12" fill="none" stroke={EDU.line} strokeWidth="4" />
      <circle
        cx="240"
        cy="30"
        r="12"
        fill="none"
        stroke={EDU.accent}
        strokeWidth="4"
        strokeDasharray={`${progress * 75.4} 75.4`}
        transform="rotate(-90 240 30)"
        strokeLinecap="round"
      />
    </g>
  )
}

function TabBar({ active }: { active: number }) {
  return (
    <g transform="translate(12 596)">
      <rect width="306" height="1" fill={EDU.line} />
      {["Início", "Trilhas", "Ranking", "Perfil"].map((label, i) => (
        <g key={label} transform={`translate(${38 + i * 77} 18)`}>
          <rect x="-10" y="0" width="20" height="20" rx="6" fill={i === active ? EDU.accent : "#c9ccd5"} />
          <text y="38" fontSize="10.5" textAnchor="middle" fontWeight={i === active ? 600 : 400} fill={i === active ? EDU.accent : EDU.muted}>
            {label}
          </text>
        </g>
      ))}
    </g>
  )
}

function RankRow({ y, rank, name, xp, you }: { y: number; rank: number; name: string; xp: string; you?: boolean }) {
  return (
    <g transform={`translate(32 ${y})`}>
      {you && <rect x="-8" y="-6" width="282" height="54" rx="14" fill={EDU.accentSoft} />}
      <text x="6" y="27" fontSize="14" fontWeight="600" fill={you ? EDU.accent : EDU.muted}>{rank}</text>
      <circle cx="50" cy="21" r="17" fill={you ? EDU.accent : "#d9dce4"} />
      <text x="50" y="26" fontSize="13" fontWeight="600" textAnchor="middle" fill={you ? "#fff" : EDU.ink}>{name[0]}</text>
      <text x="80" y="26" fontSize="15" fontWeight={you ? 600 : 500} fill={EDU.ink}>{name}</text>
      <text x="262" y="26" fontSize="14" fontWeight="600" textAnchor="end" fill={EDU.ink} style={{ fontVariantNumeric: "tabular-nums" }}>{xp}</text>
    </g>
  )
}

export function NewEduMockup({ className, label }: MockupProps) {
  return (
    <Canvas background="#dcdfe3" className={className} label={label}>
      {/* Home */}
      <Phone x={235} y={205}>
        <text x="32" y="112" fontSize="26" fontWeight="600" fill={EDU.ink}>Olá, Ana</text>
        <text x="32" y="138" fontSize="13" fill={EDU.muted}>Meta de hoje: 3 de 5 sessões</text>
        <rect x="32" y="160" width="266" height="150" rx="18" fill={EDU.accent} />
        <text x="54" y="192" fontSize="11" fontWeight="600" fill="#fff" opacity="0.75" letterSpacing="1.5">NÍVEL 12</text>
        <text x="54" y="238" fontSize="34" fontWeight="600" fill="#fff">1.360 XP</text>
        <rect x="54" y="258" width="222" height="8" rx="4" fill="#fff" opacity="0.28" />
        <rect x="54" y="258" width="151" height="8" rx="4" fill="#fff" />
        <text x="54" y="290" fontSize="12" fill="#fff" opacity="0.8">640 XP para o nível 13</text>
        <text x="32" y="352" fontSize="15" fontWeight="600" fill={EDU.ink}>Continue estudando</text>
        <LessonRow y={370} color="#f0b44c" title="Matemática" detail="Funções do 1º grau · 8/12" progress={0.66} />
        <LessonRow y={442} color="#5bb89a" title="Português" detail="Crase · 3/10" progress={0.3} />
        <LessonRow y={514} color="#e0745a" title="Simulado ENEM" detail="20 questões · 40 min" progress={0.1} />
        <TabBar active={0} />
      </Phone>

      {/* Question */}
      <Phone x={635} y={150}>
        <text x="32" y="100" fontSize="13" fill={EDU.muted}>Simulado · Matemática</text>
        <text x="32" y="128" fontSize="21" fontWeight="600" fill={EDU.ink}>Questão 7 de 20</text>
        <rect x="226" y="108" width="72" height="28" rx="14" fill={EDU.surface} />
        <text x="262" y="127" fontSize="13" fontWeight="600" textAnchor="middle" fill={EDU.ink} style={{ fontVariantNumeric: "tabular-nums" }}>12:40</text>
        <rect x="32" y="150" width="266" height="6" rx="3" fill={EDU.line} />
        <rect x="32" y="150" width="93" height="6" rx="3" fill={EDU.accent} />
        <text x="32" y="204" fontSize="18" fontWeight="500" fill={EDU.ink}>Qual é o valor de x na</text>
        <text x="32" y="229" fontSize="18" fontWeight="500" fill={EDU.ink}>equação 2x + 6 = 14?</text>
        {["x = 2", "x = 4", "x = 6", "x = 8"].map((option, i) => {
          const selected = i === 1
          return (
            <g key={option} transform={`translate(32 ${262 + i * 66})`}>
              <rect width="266" height="54" rx="14" fill={selected ? EDU.accentSoft : "#fff"} stroke={selected ? EDU.accent : EDU.line} strokeWidth="1.5" />
              <circle cx="30" cy="27" r="14" fill={selected ? EDU.accent : EDU.surface} />
              <text x="30" y="32" fontSize="13" fontWeight="600" textAnchor="middle" fill={selected ? "#fff" : EDU.muted}>{"ABCD"[i]}</text>
              <text x="58" y="32" fontSize="16" fontWeight={selected ? 600 : 400} fill={EDU.ink}>{option}</text>
            </g>
          )
        })}
        <rect x="32" y="540" width="266" height="54" rx="14" fill={EDU.ink} />
        <text x="165" y="573" fontSize="15" fontWeight="600" textAnchor="middle" fill="#fff">Confirmar resposta</text>
        <text x="165" y="628" fontSize="12.5" textAnchor="middle" fill={EDU.muted}>+20 XP ao acertar</text>
      </Phone>

      {/* Ranking */}
      <Phone x={1035} y={205}>
        <text x="32" y="112" fontSize="26" fontWeight="600" fill={EDU.ink}>Ranking</text>
        <rect x="32" y="132" width="266" height="36" rx="10" fill={EDU.surface} />
        <rect x="35" y="135" width="130" height="30" rx="8" fill="#fff" />
        <text x="100" y="155" fontSize="13" fontWeight="600" textAnchor="middle" fill={EDU.ink}>Semana</text>
        <text x="232" y="155" fontSize="13" textAnchor="middle" fill={EDU.muted}>Geral</text>
        <RankRow y={192} rank={1} name="Ana" xp="2.140" />
        <RankRow y={250} rank={2} name="Você" xp="1.980" you />
        <RankRow y={308} rank={3} name="Léo" xp="1.720" />
        <RankRow y={366} rank={4} name="Bia" xp="1.610" />
        <RankRow y={424} rank={5} name="Caio" xp="1.480" />
        <rect x="32" y="490" width="266" height="88" rx="16" fill={EDU.surface} />
        <text x="50" y="518" fontSize="13" fontWeight="600" fill={EDU.ink}>Sequência de 6 dias</text>
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={50 + i * 34} y="534" width="26" height="26" rx="7" fill={i < 6 ? "#f0b44c" : "#dfe1e7"} />
        ))}
        <TabBar active={2} />
      </Phone>
    </Canvas>
  )
}

/* ─────────────────────────────── QA Lab ─────────────────────────────── */

const QA = { ink: "#1b1a18", muted: "#76716a", line: "#e7e4de", pass: "#2f7d4f", fail: "#b42318", flaky: "#a15c07" }

const STATUS_STYLE = {
  Passed: { fill: "#e7f3ec", text: QA.pass },
  Failed: { fill: "#fbe9e7", text: QA.fail },
  Flaky: { fill: "#fbf0dc", text: QA.flaky },
}

const RUN_ROWS: { id: string; name: string; suite: string; source: string; status: keyof typeof STATUS_STYLE; time: string }[] = [
  { id: "TC-101", name: "Login with valid credentials", suite: "auth", source: "pytest", status: "Passed", time: "0.42s" },
  { id: "TC-102", name: "Wrong password shows an error", suite: "auth", source: "pytest", status: "Passed", time: "0.38s" },
  { id: "TC-118", name: "Email with a trailing space", suite: "auth", source: "manual", status: "Failed", time: "—" },
  { id: "TC-131", name: "Cart total with a coupon", suite: "checkout", source: "Jest", status: "Flaky", time: "1.20s" },
  { id: "TC-140", name: "Checkout as a guest", suite: "checkout", source: "Cypress", status: "Passed", time: "3.85s" },
  { id: "TC-152", name: "Session expires after 30 min", suite: "auth", source: "pytest", status: "Passed", time: "0.91s" },
]

const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

export function QaLabMockup({ className, label }: MockupProps) {
  return (
    <Canvas background="#e8e5de" align="xMinYMid" className={className} label={label}>
      <g transform="translate(110 80)">
        <rect width="1380" height="880" rx="14" fill="#fff" stroke="#d6d2c9" />
        {/* Browser chrome */}
        <path d="M14 0h1352a14 14 0 0 1 14 14v32H0V14A14 14 0 0 1 14 0z" fill="#f4f2ee" />
        {[24, 44, 64].map((cx) => (
          <circle key={cx} cx={cx} cy="23" r="6" fill="#d3cfc7" />
        ))}
        <rect x="470" y="10" width="440" height="26" rx="8" fill="#fff" stroke={QA.line} />
        <text x="690" y="28" fontSize="13" textAnchor="middle" fill={QA.muted}>qalab.local/runs/42</text>

        {/* Sidebar */}
        <path d="M0 46h230v834H14a14 14 0 0 1-14-14z" fill="#1b1a18" />
        <rect x="26" y="74" width="26" height="26" rx="7" fill="#f3f1ec" />
        <path d="M33 87l4 4 8-8" stroke="#1b1a18" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="64" y="93" fontSize="18" fontWeight="600" fill="#f3f1ec">QA Lab</text>
        <text x="26" y="136" fontSize="11" fontWeight="600" fill="#8f8a82" letterSpacing="1.2">PROJECT</text>
        <text x="26" y="158" fontSize="14" fill="#e9e6df">Storefront</text>
        {["Dashboard", "Test cases", "Cycles", "Runs", "Bugs", "Reports"].map((item, i) => {
          const active = item === "Runs"
          return (
            <g key={item} transform={`translate(14 ${190 + i * 42})`}>
              {active && <rect width="202" height="34" rx="8" fill="#2f2d2a" />}
              <text x="14" y="22" fontSize="14" fontWeight={active ? 600 : 400} fill={active ? "#fff" : "#b9b4ab"}>{item}</text>
              {item === "Bugs" && (
                <>
                  <rect x="160" y="8" width="28" height="18" rx="9" fill="#3a2320" />
                  <text x="174" y="21" fontSize="11" fontWeight="600" textAnchor="middle" fill="#f19a8f">4</text>
                </>
              )}
            </g>
          )
        })}

        {/* Main */}
        <g transform="translate(270 0)">
          <text x="0" y="98" fontSize="13" fill={QA.muted}>Runs  /  #42</text>
          <text x="0" y="134" fontSize="27" fontWeight="600" fill={QA.ink}>Run #42 · Release 1.4.0</text>
          <text x="1070" y="134" fontSize="13" textAnchor="end" fill={QA.muted}>Imported from JUnit XML · 2 min ago</text>

          {[
            { label: "PASSED", value: "71", color: QA.pass },
            { label: "FAILED", value: "4", color: QA.fail },
            { label: "FLAKY", value: "2", color: QA.flaky },
            { label: "PASS RATE", value: "92%", color: QA.ink },
          ].map((stat, i) => (
            <g key={stat.label} transform={`translate(${i * 272} 168)`}>
              <rect width="254" height="84" rx="10" fill="#faf9f7" stroke={QA.line} />
              <text x="18" y="30" fontSize="11" fontWeight="600" fill={QA.muted} letterSpacing="1.2">{stat.label}</text>
              <text x="18" y="66" fontSize="30" fontWeight="600" fill={stat.color} style={{ fontVariantNumeric: "tabular-nums" }}>{stat.value}</text>
            </g>
          ))}
          <rect x="0" y="276" width="964" height="8" rx="4" fill={QA.pass} />
          <rect x="964" y="276" width="70" height="8" fill={QA.fail} />
          <rect x="1034" y="276" width="36" height="8" rx="4" fill={QA.flaky} />

          {/* Table */}
          <g transform="translate(0 322)">
            {[
              ["CASE", 0],
              ["SUITE", 560],
              ["SOURCE", 690],
              ["STATUS", 840],
            ].map(([label, x]) => (
              <text key={label} x={x} y="0" fontSize="11" fontWeight="600" fill={QA.muted} letterSpacing="1.2">{label}</text>
            ))}
            <text x="1070" y="0" fontSize="11" fontWeight="600" fill={QA.muted} letterSpacing="1.2" textAnchor="end">TIME</text>
            {RUN_ROWS.map((row, i) => {
              const style = STATUS_STYLE[row.status]
              const y = 20 + i * 54
              return (
                <g key={row.id} transform={`translate(0 ${y})`}>
                  <rect y="0" width="1070" height="1" fill={QA.line} />
                  <text x="0" y="33" fontSize="13" fill={QA.muted} fontFamily={MONO}>{row.id}</text>
                  <text x="86" y="33" fontSize="15" fill={QA.ink}>{row.name}</text>
                  <text x="560" y="33" fontSize="14" fill={QA.muted}>{row.suite}</text>
                  <rect x="690" y="15" width={row.source.length * 8 + 18} height="26" rx="6" fill="#f4f2ee" />
                  <text x={699} y="33" fontSize="12.5" fill={QA.ink} fontFamily={MONO}>{row.source}</text>
                  <rect x="840" y="15" width="74" height="26" rx="13" fill={style.fill} />
                  <text x="877" y="33" fontSize="12.5" fontWeight="600" textAnchor="middle" fill={style.text}>{row.status}</text>
                  <text x="1070" y="33" fontSize="14" textAnchor="end" fill={QA.ink} fontFamily={MONO}>{row.time}</text>
                </g>
              )
            })}
            <rect y={20 + RUN_ROWS.length * 54} width="1070" height="1" fill={QA.line} />
          </g>

          {/* Linked bug */}
          <g transform="translate(0 708)">
            <rect width="1070" height="96" rx="10" fill="#faf9f7" stroke={QA.line} />
            <rect width="4" height="96" rx="2" fill={QA.fail} />
            <text x="28" y="38" fontSize="13" fill={QA.muted} fontFamily={MONO}>BUG-014</text>
            <text x="120" y="38" fontSize="15" fontWeight="600" fill={QA.ink}>Email with a trailing space is rejected at login</text>
            <text x="28" y="70" fontSize="13.5" fill={QA.muted}>Linked to TC-118 · Priority: Medium · Status: Open</text>
            <rect x="962" y="28" width="84" height="40" rx="8" fill="#1b1a18" />
            <text x="1004" y="53" fontSize="13" fontWeight="600" textAnchor="middle" fill="#fff">View bug</text>
          </g>
        </g>
      </g>
    </Canvas>
  )
}
