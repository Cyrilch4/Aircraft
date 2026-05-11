import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbItem } from '@/lib/types'

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  if (items.length === 0) return null

  const crumbs = [{ id: '', name: 'Mon réseau' }, ...items]

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        const href =
          i === 0
            ? '/historiques'
            : `/historiques/${crumb.id}?path=${crumbs
                .slice(1, i + 1)
                .map((c) => c.id)
                .join(',')}`

        return (
          <span key={crumb.id || 'root'} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            {isLast ? (
              <span className="font-medium text-gray-900">{crumb.name}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-gray-900 hover:underline transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
