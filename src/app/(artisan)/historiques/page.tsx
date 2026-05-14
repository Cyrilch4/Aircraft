import Link from 'next/link'
import { getLevelCounts, getNetworkStats } from '@/lib/queries/network'
import { LevelTabs } from '@/components/historiques/LevelTabs'
import { NetworkTable } from '@/components/historiques/NetworkTable'
import { TotalNetworkTable } from '@/components/historiques/TotalNetworkTable'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

interface PageProps {
  searchParams: Promise<{ level?: string }>
}

export default async function PerformancesPage({ searchParams }: PageProps) {
  const { level } = await searchParams
  const raw = Number(level ?? '1')
  const activeLevel = raw === 0 ? 0 : Math.min(Math.max(raw, 1), 5)

  const counts = await getLevelCounts(DEMO_USER_ID)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[34px] font-bold text-[#1D1D1F] tracking-tight leading-tight">
          Performances
        </h1>
        <p className="mt-2 text-[17px] text-[#6E6E73]">
          Revenus générés par votre réseau, niveau par niveau
        </p>
      </div>

      <div className="mb-5">
        <LevelTabs counts={counts} activeLevel={activeLevel} />
      </div>

      {activeLevel === 0 ? (
        <TotalView earnerId={DEMO_USER_ID} rootId={DEMO_USER_ID} />
      ) : (
        <SingleLevelView earnerId={DEMO_USER_ID} rootId={DEMO_USER_ID} level={activeLevel} />
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-[#F5F5F7]">
        <Link
          href="/historiques-detail"
          className="text-[15px] text-[#0071E3] hover:underline"
        >
          Historiques →
        </Link>
      </div>
    </div>
  )
}

async function TotalView({ earnerId, rootId }: { earnerId: string; rootId: string }) {
  const allLevelRows = await Promise.all(
    [1, 2, 3, 4, 5].map((l) => getNetworkStats(earnerId, rootId, l))
  )
  const groups = [1, 2, 3, 4, 5].map((l, i) => ({ level: l, rows: allLevelRows[i] }))
  return <TotalNetworkTable groups={groups} pathIds={[]} />
}

async function SingleLevelView({
  earnerId,
  rootId,
  level,
}: {
  earnerId: string
  rootId: string
  level: number
}) {
  const rows = await getNetworkStats(earnerId, rootId, level)
  return <NetworkTable rows={rows} basePath="/historiques" pathIds={[]} />
}
