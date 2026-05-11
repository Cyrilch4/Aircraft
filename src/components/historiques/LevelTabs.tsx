'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import type { LevelCount } from '@/lib/types'

interface LevelTabsProps {
  counts: LevelCount[]
  activeLevel: number
}

export function LevelTabs({ counts, activeLevel }: LevelTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countsMap = new Map(counts.map((c) => [c.level, c.count]))

  function buildHref(level: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('level', String(level))
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex gap-1 border-b border-gray-200">
      {[1, 2, 3, 4, 5].map((level) => {
        const count = countsMap.get(level) ?? 0
        const isActive = level === activeLevel
        const isDisabled = count === 0

        return (
          <Link
            key={level}
            href={buildHref(level)}
            aria-disabled={isDisabled}
            className={[
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              isActive
                ? 'border-blue-600 text-blue-600'
                : isDisabled
                  ? 'border-transparent text-gray-300 pointer-events-none select-none'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300',
            ].join(' ')}
          >
            N-{level}
            <span
              className={[
                'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : isDisabled
                    ? 'bg-gray-100 text-gray-300'
                    : 'bg-gray-100 text-gray-500',
              ].join(' ')}
            >
              {count}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
