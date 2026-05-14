import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getBreadcrumbChain,
  getLevelCounts,
  getNetworkStats,
} from '@/lib/queries/network'
import { getFilleulTotalStats } from '@/lib/queries/filleul'
import { LevelTabs } from '@/components/historiques/LevelTabs'
import { NetworkTable } from '@/components/historiques/NetworkTable'
import { TotalNetworkTable } from '@/components/historiques/TotalNetworkTable'
import { BreadcrumbNav } from '@/components/historiques/BreadcrumbNav'
import { FilleulSummaryRow } from '@/components/historiques/FilleulSummaryRow'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

interface PageProps {
  params: Promise<{ filleulId: string }>
  searchParams: Promise<{ level?: string; path?: string }>
}

export default async function FilleulPerformancesPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const earnerId = user?.id ?? DEMO_USER_ID

  const { filleulId } = await params
  const { level, path } = await searchParams
  const raw = Number(level ?? '1')
  const activeLevel = raw === 0 ? 0 : Math.min(Math.max(raw, 1), 5)

  const pathIds = path ? path.split(',').filter(Boolean) : [filleulId]

  const [counts, breadcrumb, summaryStats] = await Promise.all([
    getLevelCounts(filleulId),
    getBreadcrumbChain(pathIds),
    getFilleulTotalStats(earnerId, filleulId),
  ])

  if (breadcrumb.length === 0) notFound()

  const filleulName = breadcrumb[breadcrumb.length - 1]?.name ?? ''

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <BreadcrumbNav items={breadcrumb} />
        <h1 className="mt-3 text-[34px] font-bold text-[#1D1D1F] tracking-tight leading-tight">
          {filleulName}
        </h1>
        <p className="mt-2 text-[17px] text-[#6E6E73]">
          Contribution à vos performances, niveau par niveau
        </p>
      </div>

      {/* Ligne de synthèse individuelle */}
      {summaryStats && <FilleulSummaryRow stats={summaryStats} />}

      {/* Titre sous-réseau */}
      <p className="mb-4 text-[15px] font-medium text-[#6E6E73]">
        Organisation de {filleulName}
      </p>

      <div className="mb-5">
        <LevelTabs counts={counts} activeLevel={activeLevel} />
      </div>

      {activeLevel === 0 ? (
        <TotalView earnerId={earnerId} rootId={filleulId} pathIds={pathIds} />
      ) : (
        <SingleLevelView
          earnerId={earnerId}
          rootId={filleulId}
          level={activeLevel}
          pathIds={pathIds}
        />
      )}
    </div>
  )
}

async function TotalView({
  earnerId,
  rootId,
  pathIds,
}: {
  earnerId: string
  rootId: string
  pathIds: string[]
}) {
  const allLevelRows = await Promise.all(
    [1, 2, 3, 4, 5].map((l) => getNetworkStats(earnerId, rootId, l))
  )
  const groups = [1, 2, 3, 4, 5].map((l, i) => ({ level: l, rows: allLevelRows[i] }))
  return <TotalNetworkTable groups={groups} pathIds={pathIds} />
}

async function SingleLevelView({
  earnerId,
  rootId,
  level,
  pathIds,
}: {
  earnerId: string
  rootId: string
  level: number
  pathIds: string[]
}) {
  const rows = await getNetworkStats(earnerId, rootId, level)
  return (
    <NetworkTable
      rows={rows}
      basePath={`/historiques/${rootId}`}
      pathIds={pathIds}
    />
  )
}
