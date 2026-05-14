import { createClient } from '@/lib/supabase/server'
import { ParametresClient } from './ParametresClient'

const DEFAULT_RATES = [
  { level: 1, taux: 20, conditions: ['Minimum 2 filleuls directs actifs'] },
  { level: 2, taux: 5,  conditions: ['Minimum 1 filleul actif'] },
  { level: 3, taux: 4,  conditions: [] },
  { level: 4, taux: 3,  conditions: [] },
  { level: 5, taux: 2,  conditions: [] },
]

const DEFAULT_MODELE = { part_artisan: 70, marketing: 5, operations: 3 }
const DEFAULT_PARTAGE = { apporteur: 30, realisateur: 70 }

export default async function ParametresPage() {
  const supabase = createClient()

  const [ratesRes, modeleRes, partageRes] = await Promise.all([
    supabase.rpc('get_mlm_config', { p_key: 'mlm_rates' }),
    supabase.rpc('get_mlm_config', { p_key: 'modele_affaire' }),
    supabase.rpc('get_mlm_config', { p_key: 'partage_affaire' }),
  ])

  return (
    <ParametresClient
      initialMlmRates={ratesRes.data ?? DEFAULT_RATES}
      initialModele={{ ...DEFAULT_MODELE, ...(modeleRes.data ?? {}) }}
      initialPartage={partageRes.data ?? DEFAULT_PARTAGE}
    />
  )
}
