import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Short, quiet entrance as content scrolls in: a small lift and a fade, once.
 * Plain CSS transition (see `.reveal` in index.css), so no animation library ships with the site.
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // Without IntersectionObserver the content is simply shown.
  const [shown, setShown] = useState(() => !("IntersectionObserver" in window))

  useEffect(() => {
    const element = ref.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("reveal", shown && "is-shown", className)} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  )
}
