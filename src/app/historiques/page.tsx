import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLevelCounts, getNetworkStats } from '@/lib/queries/network'
import { LevelTabs } from '@/components/historiques/LevelTabs'
import { NetworkTable } from '@/components/historiques/NetworkTable'

interface PageProps {
  searchParams: { level?: string }
}

export default async function HistoriquesPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const activeLevel = Math.min(Math.max(Number(searchParams.level ?? '1'), 1), 5)

  const [counts, rows] = await Promise.all([
    getLevelCounts(user.id),
    getNetworkStats(user.id, user.id, activeLevel),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historiques</h1>
        <p className="mt-1 text-sm text-gray-500">
          Revenus générés par votre réseau, niveau par niveau
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 pt-4">
          <LevelTabs counts={counts} activeLevel={activeLevel} />
        </div>

        <div className="p-4">
          <NetworkTable rows={rows} basePath="/historiques" pathIds={[]} />
        </div>
      </div>
    </div>
  )
}
