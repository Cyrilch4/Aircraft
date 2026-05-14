import { createClient } from '@/lib/supabase/server'
import type { FilleulTotalStats } from '@/lib/types'

export async function getFilleulTotalStats(
  earnerId: string,
  filleulId: string
): Promise<FilleulTotalStats | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_filleul_total_stats', {
    p_earner_id: earnerId,
    p_filleul_id: filleulId,
  })
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return null
  return data[0] as FilleulTotalStats
}
