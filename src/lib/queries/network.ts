import { createClient } from '@/lib/supabase/server'
import type { BreadcrumbItem, FilleulStats, LevelCount } from '@/lib/types'

export async function getNetworkStats(
  earnerId: string,
  rootId: string,
  level: number
): Promise<FilleulStats[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_network_stats', {
    p_earner_id: earnerId,
    p_root_id: rootId,
    p_level: level,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as FilleulStats[]
}

export async function getLevelCounts(rootId: string): Promise<LevelCount[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_level_counts', {
    p_root_id: rootId,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as LevelCount[]
}

export async function getProfileName(userId: string): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()
  return data?.full_name ?? ''
}

export async function getBreadcrumbChain(
  ids: string[]
): Promise<BreadcrumbItem[]> {
  if (ids.length === 0) return []
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', ids)
  if (!data) return []
  return ids
    .map((id) => {
      const profile = data.find((p) => p.id === id)
      return profile ? { id, name: profile.full_name } : null
    })
    .filter(Boolean) as BreadcrumbItem[]
}
