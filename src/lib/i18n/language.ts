import { readString, writeString } from "@/lib/storage"
import { createStore } from "@/lib/store/createStore"

export type Language = "pt" | "en"

/** Text written in every language of the site. Resolve it with `t` (anywhere) or `useT` (components). */
export type Localized<T = string> = Record<Language, T>

export const HTML_LANG: Record<Language, string> = { pt: "pt-BR", en: "en" }

const KEY = "portfolio:language"

function initialLanguage(): Language {
  const stored = readString(KEY)
  if (stored === "pt" || stored === "en") return stored
  // First visit: follow the browser, so visitors from abroad land on the English version.
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en"
}

export const languageStore = createStore<{ language: Language }>({ language: initialLanguage() })

export const getLanguage = () => languageStore.get().language

export const useLanguage = () => languageStore.use((state) => state.language)

export function setLanguage(language: Language) {
  writeString(KEY, language)
  languageStore.set({ language })
}

/** Same value in every language (numbers, names, brands). */
export const both = <T>(value: T): Localized<T> => ({ pt: value, en: value })

/** Builds a localized value from a per-language template. */
export const localized = <T>(build: (language: Language) => T): Localized<T> => ({ pt: build("pt"), en: build("en") })

/** Resolves a localized value; outside React it reads the current language. */
export const t = <T>(text: Localized<T>, language: Language = getLanguage()): T => text[language]

/** Resolver bound to the current language; the component re-renders when it changes. */
export function useT() {
  const language = useLanguage()
  return <T>(text: Localized<T>): T => text[language]
}
