import { profile } from "@/data/profile"
import { useT, type Localized } from "@/lib/i18n/language"

import { LanguageToggle } from "../LanguageToggle/LanguageToggle"

export function WebGLFallback({ reason, onContinue }: { reason: Localized | null; onContinue: () => void }) {
  const t = useT()
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#07080a] px-6 text-neutral-300">
      <LanguageToggle className="fixed top-4 right-4 sm:top-6 sm:right-6" />
      <div className="max-w-md">
        <p className="text-3xl font-semibold tracking-[0.2em] text-neutral-100">{profile.name.split(" ")[0].toUpperCase()}</p>
        <div className="my-6 h-px w-12 bg-ember" />
        <h1 className="text-xl text-neutral-100">{t({ pt: "Seu dispositivo não suporta a experiência 3D completa.", en: "Your device doesn't support the full 3D experience." })}</h1>
        {reason && <p className="mt-3 text-sm text-neutral-500">{t(reason)}</p>}
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{t({ pt: "Todo o conteúdo continua disponível na versão tradicional do portfólio.", en: "All the content is still available in the traditional version of the portfolio." })}</p>
        <button
          type="button"
          autoFocus
          onClick={onContinue}
          className="mt-8 w-full border border-neutral-100 bg-neutral-100 px-6 py-3.5 text-sm font-semibold tracking-[0.2em] text-neutral-950 hover:bg-white"
        >
          {t({ pt: "CONTINUAR PARA O PORTFÓLIO", en: "CONTINUE TO THE PORTFOLIO" })}
        </button>
      </div>
    </main>
  )
}
