'use client'

import { useState } from 'react'
import { Plus, X, Save, Info } from 'lucide-react'

const LEVEL_COLORS: Record<number, string> = {
  1: '#0071E3',
  2: '#34C759',
  3: '#FF9500',
  4: '#AF52DE',
  5: '#FF3B30',
}

interface NiveauConfig {
  level: number
  taux: string
  conditions: string[]
}

const INITIAL_CONFIG: NiveauConfig[] = [
  { level: 1, taux: '20', conditions: ['Minimum 2 filleuls directs actifs'] },
  { level: 2, taux: '5', conditions: ['Minimum 1 filleul actif'] },
  { level: 3, taux: '4', conditions: [] },
  { level: 4, taux: '3', conditions: [] },
  { level: 5, taux: '2', conditions: [] },
]

export default function ParametresMLMPage() {
  const [config, setConfig] = useState<NiveauConfig[]>(INITIAL_CONFIG)
  const [saved, setSaved] = useState(false)

  function updateTaux(level: number, value: string) {
    setConfig((prev) =>
      prev.map((n) => (n.level === level ? { ...n, taux: value } : n))
    )
    setSaved(false)
  }

  function addCondition(level: number) {
    setConfig((prev) =>
      prev.map((n) =>
        n.level === level ? { ...n, conditions: [...n.conditions, ''] } : n
      )
    )
    setSaved(false)
  }

  function updateCondition(level: number, idx: number, value: string) {
    setConfig((prev) =>
      prev.map((n) =>
        n.level === level
          ? {
              ...n,
              conditions: n.conditions.map((c, i) => (i === idx ? value : c)),
            }
          : n
      )
    )
    setSaved(false)
  }

  function removeCondition(level: number, idx: number) {
    setConfig((prev) =>
      prev.map((n) =>
        n.level === level
          ? { ...n, conditions: n.conditions.filter((_, i) => i !== idx) }
          : n
      )
    )
    setSaved(false)
  }

  function handleSave() {
    // Persistance à connecter à Supabase ultérieurement
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const totalTaux = config.reduce((sum, n) => sum + Number(n.taux || 0), 0)

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">
            Paramètres MLM
          </h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            Taux de reversement par niveau et conditions d'éligibilité
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-xl transition-all ${
            saved
              ? 'bg-[#34C759] text-white'
              : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </div>

      {/* Récap total */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EBF5FF] border border-[#0071E3]/20 mb-6">
        <Info className="w-4 h-4 text-[#0071E3] shrink-0" />
        <p className="text-[13px] text-[#0071E3]">
          Total reversé sur une commission :{' '}
          <span className="font-bold">{totalTaux} %</span>
          {totalTaux > 35 && (
            <span className="ml-2 text-[#FF3B30] font-semibold">⚠ Dépasse 35 %</span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-20">
                Niveau
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-36">
                Taux (%)
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Condition(s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {config.map((n) => {
              const color = LEVEL_COLORS[n.level]
              return (
                <tr key={n.level} className="align-top">
                  {/* Niveau */}
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-[13px] font-bold"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      N-{n.level}
                    </span>
                  </td>

                  {/* Taux */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={n.taux}
                        onChange={(e) => updateTaux(n.level, e.target.value)}
                        className="w-20 px-3 py-2 text-[15px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                        style={{ color }}
                      />
                      <span className="text-[14px] text-[#6E6E73]">%</span>
                    </div>
                  </td>

                  {/* Conditions */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      {n.conditions.map((cond, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={cond}
                            placeholder="Ex : Minimum 2 filleuls actifs"
                            onChange={(e) =>
                              updateCondition(n.level, idx, e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-[13px] text-[#1D1D1F] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                          />
                          <button
                            onClick={() => removeCondition(n.level, idx)}
                            className="text-[#C7C7CC] hover:text-[#FF3B30] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addCondition(n.level)}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter une condition
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px] text-[#C7C7CC]">
        Les modifications ne sont pas encore persistées en base de données — cette fonctionnalité sera disponible lors de l'intégration de l'authentification.
      </p>
    </div>
  )
}
