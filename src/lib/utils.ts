import { clsx, type ClassValue } from "clsx"

/** Joins class names. No conflict resolution: callers never pass two utilities for the same property. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
