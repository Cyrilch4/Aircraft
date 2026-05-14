import { getNetworkTree } from '@/lib/queries/tree'
import { NetworkTree } from '@/components/organisation/NetworkTree'
import { GenealogyTree } from '@/components/organisation/GenealogyTree'
import type { TreeNode } from '@/lib/types'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

function countAllDescendants(node: TreeNode): number {
  return node.children.reduce(
    (sum, child) => sum + 1 + countAllDescendants(child),
    0
  )
}

interface PageProps {
  searchParams: Promise<{ vue?: string }>
}

export default async function OrganisationPage({ searchParams }: PageProps) {
  const { vue } = await searchParams
  const activeView = vue === 'genealogie' ? 'genealogie' : 'arborescence'

  const tree = await getNetworkTree(DEMO_USER_ID)
  const total = tree ? countAllDescendants(tree) : 0

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[34px] font-bold text-[#1D1D1F] tracking-tight leading-tight">
          Organisation
        </h1>
        <p className="mt-2 text-[17px] text-[#6E6E73]">
          Vue en arborescence de votre réseau
        </p>
      </div>

      {/* Toggle vue */}
      <div className="flex gap-1 mb-6">
        {([
          { key: 'arborescence', label: 'Arborescence' },
          { key: 'genealogie',  label: 'Généalogie' },
        ] as const).map(({ key, label }) => (
          <Link
            key={key}
            href={`/organisation?vue=${key}`}
            className={[
              'px-4 py-2 text-[15px] font-medium rounded-full transition-colors',
              activeView === key
                ? 'bg-[#0071E3] text-white'
                : 'text-[#1D1D1F] hover:bg-[#F5F5F7]',
            ].join(' ')}
          >
            {label}
          </Link>
        ))}
      </div>

      {!tree || total === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#C7C7CC] rounded-xl border border-[#D2D2D7]">
          <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">Aucun membre dans votre réseau pour le moment</p>
        </div>
      ) : activeView === 'genealogie' ? (
        <div className="rounded-xl border border-[#D2D2D7] bg-white p-8 overflow-x-auto">
          <GenealogyTree root={tree} />
        </div>
      ) : (
        <NetworkTree root={tree} totalCount={total} />
      )}
    </div>
  )
}
