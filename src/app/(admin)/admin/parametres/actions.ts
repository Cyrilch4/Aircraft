'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveMlmConfig(key: string, value: unknown) {
  const supabase = createClient()
  const { error } = await supabase.rpc('set_mlm_config', {
    p_key: key,
    p_value: value,
  })
  if (error) throw new Error(error.message)
}
