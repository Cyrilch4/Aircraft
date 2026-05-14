import Link from 'next/link'
import type { TreeNode } from '@/lib/types'

const LEVEL_COLORS = [
  '#1D1D1F', // root
  '#0071E3', // N-1 blue
  '#34C759', // N-2 green
  '#FF9500', // N-3 orange
  '#AF52DE', // N-4 purple
  '#FF3B30', // N-5 red
]

function NodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const color = LEVEL_COLORS[Math.min(depth, LEVEL_COLORS.length - 1)]
  const isRoot = depth === 0
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7] transition-colors group">
        {/* Dot */}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Name */}
        {isRoot ? (
          <span className="font-semibold text-[15px] text-[#1D1D1F]">
            {node.full_name}
          </span>
        ) : (
          <Link
            href={`/historiques/${node.id}?path=${node.id}`}
            className="font-medium text-[15px] text-[#0071E3] hover:underline"
          >
            {node.full_name}
          </Link>
        )}

        {/* Level badge */}
        {!isRoot && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}18`, color }}
          >
            N-{depth}
          </span>
        )}

        {/* Children count */}
        {hasChildren && (
          <span className="ml-auto text-[12px] text-[#C7C7CC] opacity-0 group-hover:opacity-100 transition-opacity">
            {node.children.length} recrue{node.children.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Children avec ligne de connexion */}
      {hasChildren && (
        <div className="ml-4 pl-4 border-l border-[#E5E5EA]">
          {node.children.map((child) => (
            <NodeRow key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface NetworkTreeProps {
  root: TreeNode
  totalCount: number
}

export function NetworkTree({ root, totalCount }: NetworkTreeProps) {
  return (
    <div className="rounded-xl border border-[#D2D2D7] bg-white overflow-hidden">
      {/* Stats bar */}
      <div className="flex items-center gap-6 px-5 py-4 border-b border-[#E5E5EA] bg-[#F9F9FB]">
        {LEVEL_COLORS.slice(1).map((color, i) => {
          const level = i + 1
          const count = countAtDepth(root, level)
          if (count === 0) return null
          return (
            <div key={level} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[13px] text-[#6E6E73]">
                N-{level} ·{' '}
                <span className="font-semibold text-[#1D1D1F]">{count}</span>
              </span>
            </div>
          )
        })}
        <div className="ml-auto text-[13px] text-[#6E6E73]">
          <span className="font-semibold text-[#1D1D1F]">{totalCount}</span> membres au total
        </div>
      </div>

      {/* Tree */}
      <div className="p-4">
        <NodeRow node={root} depth={0} />
      </div>
    </div>
  )
}

function countAtDepth(node: TreeNode, targetDepth: number): number {
  if (node.children.length === 0) return 0
  let count = 0
  for (const child of node.children) {
    if (child.depth === targetDepth) count++
    count += countAtDepth(child, targetDepth)
  }
  return count
}
