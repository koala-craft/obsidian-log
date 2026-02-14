import { useRef } from 'react'
import { Link } from '@tanstack/react-router'

const SCROLL_SPEED_PX_PER_MS = 0.04

type TopCardProps = {
  to: string
  params?: Record<string, string>
  ariaLabel: string
  title: string
  children: React.ReactNode
}

export function TopCard({ to, params, ariaLabel, title, children }: TopCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)

  const scrollOnHover = (direction: 'end' | 'start') => {
    const el = scrollRef.current
    if (!el) return
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    if (direction === 'start') {
      el.scrollLeft = 0
      return
    }

    const target = el.scrollWidth - el.clientWidth
    if (target <= 0) return

    const start = el.scrollLeft
    const distance = Math.abs(target - start)
    const durationMs = distance / SCROLL_SPEED_PX_PER_MS
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      el.scrollLeft = start + (target - start) * progress
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step)
      } else {
        rafIdRef.current = null
      }
    }
    rafIdRef.current = requestAnimationFrame(step)
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => scrollOnHover('end')}
      onMouseLeave={() => scrollOnHover('start')}
    >
      <Link
        to={to}
        params={params}
        className="absolute inset-0 z-0 rounded-lg cursor-pointer"
        aria-label={ariaLabel}
      />
      <div className="relative z-10 flex min-h-[72px] flex-col justify-center rounded-lg bg-zinc-800/50 px-4 py-3 pointer-events-none">
        <h3 className="truncate text-base font-semibold text-cyan-400">
          {title}
        </h3>
        <div
          ref={scrollRef}
          className="mt-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'auto' } as React.CSSProperties}
        >
          <div className="flex min-w-max flex-nowrap items-center gap-x-2 text-xs text-zinc-500">
            {children}
          </div>
        </div>
      </div>
    </li>
  )
}
