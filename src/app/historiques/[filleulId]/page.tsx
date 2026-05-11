import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getBreadcrumbChain,
  getLevelCounts,
  getNetworkStats,
} from '@/lib/queries/network'
import { LevelTabs } from '@/components/historiques/LevelTabs'
import { NetworkTable } from '@/components/historiques/NetworkTable'
import { BreadcrumbNav } from '@/components/historiques/BreadcrumbNav'

interface PageProps {
  params: { filleulId: string }
  searchParams: { level?: string; path?: string }
}

export default async function FilleulHistoriquesPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { filleulId } = params
  const activeLevel = Math.min(Math.max(Number(searchParams.level ?? '1'), 1), 5)

  // path = liste ordonnée d'IDs depuis la racine jusqu'au filleul courant
  const pathIds = searchParams.path
    ? searchParams.path.split(',').filter(Boolean)
    : [filleulId]

  const [counts, rows, breadcrumb] = await Promise.all([
    getLevelCounts(filleulId),
    getNetworkStats(user.id, filleulId, activeLevel),
    getBreadcrumbChain(pathIds),
  ])

  if (breadcrumb.length === 0) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <BreadcrumbNav items={breadcrumb} />
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Réseau de {breadcrumb[breadcrumb.length - 1]?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Revenus que ce réseau vous a générés, niveau par niveau
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 pt-4">
          <LevelTabs counts={counts} activeLevel={activeLevel} />
        </div>

        <div className="p-4">
          <NetworkTable
            rows={rows}
            basePath={`/historiques/${filleulId}`}
            pathIds={pathIds}
          />
        </div>
      </div>
    </div>
  )
}
