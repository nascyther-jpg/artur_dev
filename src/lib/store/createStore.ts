import { useSyncExternalStore } from "react"

type Updater<T> = Partial<T> | ((state: T) => Partial<T>)

export interface Store<T extends object> {
  get: () => T
  set: (update: Updater<T>) => void
  subscribe: (listener: () => void) => () => void
  use: <S>(selector: (state: T) => S) => S
}

/**
 * Minimal external store shared by the DOM UI and the R3F scene.
 * Selectors must return primitives or stable references.
 */
export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<() => void>()

  const get = () => state

  const set = (update: Updater<T>) => {
    const partial = typeof update === "function" ? update(state) : update
    const changed = (Object.keys(partial) as (keyof T)[]).some(
      (key) => !Object.is(state[key], partial[key]),
    )
    if (!changed) return
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function use<S>(selector: (state: T) => S): S {
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state),
    )
  }

  return { get, set, subscribe, use }
}
