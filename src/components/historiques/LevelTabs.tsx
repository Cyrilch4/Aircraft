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
  const totalCount = counts.reduce((sum, c) => sum + c.count, 0)

  function buildHref(level: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('level', String(level))
    return `${pathname}?${params.toString()}`
  }

  const tabs = [
    { level: 0, label: 'Total', count: totalCount },
    ...[1, 2, 3, 4, 5].map((l) => ({ level: l, label: `N-${l}`, count: countsMap.get(l) ?? 0 })),
  ]

  return (
    <div className="flex gap-1">
      {tabs.map(({ level, label, count }) => {
        const isActive = level === activeLevel
        const isDisabled = count === 0 && level !== 0

        return (
          <Link
            key={level}
            href={buildHref(level)}
            aria-disabled={isDisabled}
            className={[
              'flex items-center gap-2 px-4 py-2 text-[15px] font-medium rounded-full transition-colors',
              isActive
                ? 'bg-[#0071E3] text-white'
                : isDisabled
                  ? 'text-[#C7C7CC] pointer-events-none select-none'
                  : 'text-[#1D1D1F] hover:bg-[#F5F5F7]',
            ].join(' ')}
          >
            {label}
            <span
              className={[
                'text-[12px] font-semibold px-2 py-0.5 rounded-full',
                isActive
                  ? 'bg-[#0055AA] text-white'
                  : isDisabled
                    ? 'bg-[#F5F5F7] text-[#C7C7CC]'
                    : 'bg-[#F5F5F7] text-[#1D1D1F]',
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
