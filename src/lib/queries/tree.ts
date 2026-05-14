import { createClient } from '@/lib/supabase/server'
import type { FlatTreeNode, TreeNode } from '@/lib/types'

function buildTree(nodes: FlatTreeNode[], parentId: string): TreeNode[] {
  return nodes
    .filter((n) => n.sponsor_id === parentId)
    .map((n) => ({
      ...n,
      children: buildTree(nodes, n.id),
    }))
}

export async function getNetworkTree(rootId: string): Promise<TreeNode | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_network_tree', {
    p_root_id: rootId,
  })
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return null

  const nodes = data as FlatTreeNode[]
  const root = nodes.find((n) => n.depth === 0)
  if (!root) return null

  return {
    ...root,
    children: buildTree(nodes, root.id),
  }
}
