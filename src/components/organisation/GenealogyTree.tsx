import Link from 'next/link'
import type { TreeNode } from '@/lib/types'

const LEVEL_COLORS = ['#1D1D1F', '#0071E3', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']

function NodeCard({ node, depth }: { node: TreeNode; depth: number }) {
  const color = LEVEL_COLORS[Math.min(depth, LEVEL_COLORS.length - 1)]
  const isRoot = depth === 0

  const card = (
    <div
      className={[
        'rounded-xl border px-3 py-2.5 text-center min-w-[120px] max-w-[150px] transition-colors',
        isRoot
          ? 'border-[#0071E3] bg-[#EBF5FF]'
          : 'border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] cursor-pointer',
      ].join(' ')}
    >
      <div className="text-[13px] font-semibold text-[#1D1D1F] leading-tight">
        {node.full_name}
      </div>
      {!isRoot && (
        <div className="mt-1 text-[11px] font-semibold" style={{ color }}>
          N-{depth}
        </div>
      )}
    </div>
  )

  if (isRoot) return card

  return (
    <Link href={`/historiques/${node.id}`} className="block">
      {card}
    </Link>
  )
}

function GenealogyLi({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <li>
      <NodeCard node={node} depth={depth} />
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <GenealogyLi key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

interface GenealogyTreeProps {
  root: TreeNode
}

export function GenealogyTree({ root }: GenealogyTreeProps) {
  return (
    <div className="org-tree overflow-x-auto py-2">
      {/* Root card (hors ul pour ne pas avoir de connecteur au-dessus) */}
      <div className="flex flex-col items-center">
        <NodeCard node={root} depth={0} />
        {root.children.length > 0 && (
          <ul>
            {root.children.map((child) => (
              <GenealogyLi key={child.id} node={child} depth={1} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
