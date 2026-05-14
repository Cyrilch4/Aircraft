export interface FilleulStats {
  filleul_id: string
  full_name: string
  month_nb: number
  month_amount: number
  year_nb: number
  year_amount: number
  has_recruits: boolean
}

export interface LevelCount {
  level: number
  count: number
}

export interface BreadcrumbItem {
  id: string
  name: string
}

export interface FlatTreeNode {
  id: string
  full_name: string
  sponsor_id: string | null
  depth: number
}

export interface TreeNode extends FlatTreeNode {
  children: TreeNode[]
}

export interface FilleulTotalStats {
  full_name: string
  month_nb: number
  month_amount: number
  year_nb: number
  year_amount: number
  has_recruits: boolean
}
