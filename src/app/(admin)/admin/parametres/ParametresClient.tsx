'use client'

import { useState, useTransition } from 'react'
import { Plus, X, Save, Info, TrendingUp, Users } from 'lucide-react'
import { saveMlmConfig } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NiveauConfig {
  level: number
  taux: number
  conditions: string[]
}

interface ModeleAffaire {
  marketing: number
  operations: number
}

interface PartageAffaire {
  apporteur: number
  realisateur: number
}

interface Props {
  initialMlmRates: NiveauConfig[]
  initialModele: ModeleAffaire
  initialPartage: PartageAffaire
}

// ─── Couleurs niveaux ─────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<number, string> = {
  1: '#0071E3',
  2: '#34C759',
  3: '#FF9500',
  4: '#AF52DE',
  5: '#FF3B30',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n % 1 === 0 ? `${n} %` : `${n.toFixed(1)} %`
}

function RowCalc({
  num, label, value, highlight = false, negative = false,
}: {
  num: string; label: string; value: number; highlight?: boolean; negative?: boolean
}) {
  const isNegative = value < 0
  return (
    <tr className={highlight ? 'bg-[#F9F9FB]' : ''}>
      <td className="px-5 py-3 text-[12px] text-[#C7C7CC] w-8">{num}</td>
      <td className="px-4 py-3 text-[14px] text-[#6E6E73]">{label}</td>
      <td className="px-5 py-3 text-right">
        <span className={`text-[15px] font-semibold ${
          highlight ? 'text-[#1D1D1F]' : isNegative ? 'text-[#FF3B30]' : 'text-[#1D1D1F]'
        }`}>
          {fmt(value)}
        </span>
      </td>
    </tr>
  )
}

function RowInput({
  num, label, value, onChange,
}: {
  num: string; label: string; value: number; onChange: (v: number) => void
}) {
  return (
    <tr>
      <td className="px-5 py-3 text-[12px] text-[#C7C7CC] w-8">{num}</td>
      <td className="px-4 py-3 text-[14px] text-[#6E6E73]">{label}</td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 px-3 py-1.5 text-[14px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-right focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
          />
          <span className="text-[13px] text-[#6E6E73]">%</span>
        </div>
      </td>
    </tr>
  )
}

// ─── Tab 1 : Taux MLM ─────────────────────────────────────────────────────────

function TabMlm({
  rates, setRates, onSave, saving, saved,
}: {
  rates: NiveauConfig[]
  setRates: (r: NiveauConfig[]) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  const total = rates.reduce((s, r) => s + Number(r.taux), 0)

  function updateTaux(level: number, value: string) {
    setRates(rates.map((n) => n.level === level ? { ...n, taux: Number(value) } : n))
  }
  function addCondition(level: number) {
    setRates(rates.map((n) => n.level === level ? { ...n, conditions: [...n.conditions, ''] } : n))
  }
  function updateCondition(level: number, idx: number, value: string) {
    setRates(rates.map((n) => n.level === level
      ? { ...n, conditions: n.conditions.map((c, i) => i === idx ? value : c) }
      : n))
  }
  function removeCondition(level: number, idx: number) {
    setRates(rates.map((n) => n.level === level
      ? { ...n, conditions: n.conditions.filter((_, i) => i !== idx) }
      : n))
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EBF5FF] border border-[#0071E3]/20 mb-5">
        <Info className="w-4 h-4 text-[#0071E3] shrink-0" />
        <p className="text-[13px] text-[#0071E3]">
          Total reversé : <span className="font-bold">{total} %</span>
          {total > 35 && <span className="ml-2 text-[#FF3B30] font-semibold">⚠ Dépasse 35 %</span>}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-24">Niveau</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-36">Taux (%)</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Condition(s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {rates.map((n) => {
              const color = LEVEL_COLORS[n.level]
              return (
                <tr key={n.level} className="align-top">
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-[13px] font-bold" style={{ backgroundColor: `${color}18`, color }}>
                      N-{n.level}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number" min="0" max="100" step="0.5"
                        value={n.taux}
                        onChange={(e) => updateTaux(n.level, e.target.value)}
                        className="w-20 px-3 py-2 text-[15px] font-semibold bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                        style={{ color }}
                      />
                      <span className="text-[14px] text-[#6E6E73]">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      {n.conditions.map((cond, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text" value={cond}
                            placeholder="Ex : Minimum 2 filleuls actifs"
                            onChange={(e) => updateCondition(n.level, idx, e.target.value)}
                            className="flex-1 px-3 py-2 text-[13px] text-[#1D1D1F] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                          />
                          <button onClick={() => removeCondition(n.level, idx)} className="text-[#C7C7CC] hover:text-[#FF3B30] transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addCondition(n.level)} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                        <Plus className="w-3.5 h-3.5" />Ajouter une condition
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Tab 2 : Modèle d'affaire ─────────────────────────────────────────────────

function TabModele({
  modele, setModele, totalMlm, onSave, saving, saved,
}: {
  modele: ModeleAffaire
  setModele: (m: ModeleAffaire) => void
  totalMlm: number
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  const partArtisan = 100 - totalMlm
  const revenusPlateformeBruts = 100 - partArtisan  // = totalMlm
  const revenusNets = revenusPlateformeBruts - totalMlm  // = 0 par construction
  const resultat = revenusNets - modele.marketing - modele.operations

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] mb-5">
        <Info className="w-4 h-4 text-[#6E6E73] shrink-0" />
        <p className="text-[13px] text-[#6E6E73]">
          Les lignes calculées (grisées) se mettent à jour automatiquement selon les taux de l'onglet <strong>Taux MLM</strong>.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 w-8" />
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Poste</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-36">Valeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            <RowCalc num="1" label="CA Chantier" value={100} highlight />
            <RowCalc num="2" label="Part artisan (= 100 % − reversements réseau)" value={partArtisan} />
            <RowCalc num="3" label="Revenus bruts plateforme (1 − 2)" value={revenusPlateformeBruts} highlight />
            <RowCalc num="4" label="Reversements réseau (depuis onglet Taux MLM)" value={totalMlm} />
            <RowCalc num="5" label="Revenus nets (3 − 4)" value={revenusNets} highlight />
            <RowInput
              num="6" label="Marketing et communication"
              value={modele.marketing}
              onChange={(v) => setModele({ ...modele, marketing: v })}
            />
            <RowInput
              num="7" label="Opérations"
              value={modele.operations}
              onChange={(v) => setModele({ ...modele, operations: v })}
            />
            <tr className="bg-[#1D1D1F]">
              <td className="px-5 py-3.5 text-[12px] text-white/40">8</td>
              <td className="px-4 py-3.5 text-[14px] font-semibold text-white">Résultat d'exploitation (5 − 6 − 7)</td>
              <td className="px-5 py-3.5 text-right">
                <span className={`text-[16px] font-bold ${resultat < 0 ? 'text-[#FF3B30]' : resultat === 0 ? 'text-white/60' : 'text-[#34C759]'}`}>
                  {fmt(resultat)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Tab 3 : Partage d'affaire ────────────────────────────────────────────────

function TabPartage({
  partage, setPartage, partArtisan, onSave, saving, saved,
}: {
  partage: PartageAffaire
  setPartage: (p: PartageAffaire) => void
  partArtisan: number
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  const total = partage.apporteur + partage.realisateur
  const isValid = Math.abs(total - 100) < 0.01

  function updateApporteur(v: number) {
    setPartage({ apporteur: v, realisateur: Math.max(0, 100 - v) })
  }
  function updateRealisateur(v: number) {
    setPartage({ apporteur: Math.max(0, 100 - v), realisateur: v })
  }

  const apporteurDuCA = (partage.apporteur / 100) * partArtisan
  const realisateurDuCA = (partage.realisateur / 100) * partArtisan

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EBF5FF] border border-[#0071E3]/20 mb-5">
        <Info className="w-4 h-4 text-[#0071E3] shrink-0" />
        <p className="text-[13px] text-[#0071E3]">
          La <strong>Part artisan</strong> du modèle d'affaire ({fmt(partArtisan)} du CA) est divisée entre l'apporteur d'affaires et l'artisan réalisateur.
        </p>
      </div>

      {/* Barre visuelle */}
      <div className="mb-5">
        <div className="h-5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#0071E3] transition-all flex items-center justify-center"
            style={{ width: `${partage.apporteur}%` }}
          >
            {partage.apporteur >= 10 && (
              <span className="text-[11px] font-bold text-white">{partage.apporteur} %</span>
            )}
          </div>
          <div
            className="h-full bg-[#34C759] transition-all flex items-center justify-center"
            style={{ width: `${partage.realisateur}%` }}
          >
            {partage.realisateur >= 10 && (
              <span className="text-[11px] font-bold text-white">{partage.realisateur} %</span>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-[#6E6E73]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#0071E3]" />
            Apporteur d'affaires
          </div>
          <div className="flex items-center gap-1.5">
            Artisan réalisateur
            <div className="w-2 h-2 rounded-full bg-[#34C759]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Bénéficiaire</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-32">% de la part artisan</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] w-32">% du CA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {/* Apporteur */}
            <tr>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF5FF] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#0071E3]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1D1D1F]">Apporteur d'affaires</div>
                    <div className="text-[12px] text-[#6E6E73]">L'artisan qui recommande la mission</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="number" min="0" max="100" step="1"
                    value={partage.apporteur}
                    onChange={(e) => updateApporteur(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-[15px] font-semibold text-[#0071E3] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-right focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                  />
                  <span className="text-[13px] text-[#6E6E73]">%</span>
                </div>
              </td>
              <td className="px-5 py-4 text-right">
                <span className="text-[15px] font-semibold text-[#0071E3]">{fmt(apporteurDuCA)}</span>
              </td>
            </tr>

            {/* Réalisateur */}
            <tr>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#34C759]/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#34C759]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1D1D1F]">Artisan réalisateur</div>
                    <div className="text-[12px] text-[#6E6E73]">L'artisan qui exécute la mission</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="number" min="0" max="100" step="1"
                    value={partage.realisateur}
                    onChange={(e) => updateRealisateur(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-[15px] font-semibold text-[#34C759] bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-right focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                  />
                  <span className="text-[13px] text-[#6E6E73]">%</span>
                </div>
              </td>
              <td className="px-5 py-4 text-right">
                <span className="text-[15px] font-semibold text-[#34C759]">{fmt(realisateurDuCA)}</span>
              </td>
            </tr>

            {/* Total */}
            <tr className="bg-[#F9F9FB]">
              <td className="px-5 py-3.5 text-[13px] font-semibold text-[#1D1D1F]">Total part artisan</td>
              <td className="px-4 py-3.5 text-center">
                <span className={`text-[14px] font-bold ${isValid ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                  {total} % {!isValid && '⚠ doit être égal à 100 %'}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className="text-[15px] font-semibold text-[#1D1D1F]">{fmt(partArtisan)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Bouton Save commun ───────────────────────────────────────────────────────

function SaveButton({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold rounded-xl transition-all ${
        saved ? 'bg-[#34C759] text-white' : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
      } disabled:opacity-50`}
    >
      <Save className="w-4 h-4" />
      {saving ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
    </button>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

const TABS = [
  { key: 'mlm', label: 'Taux MLM' },
  { key: 'modele', label: "Modèle d'affaire" },
  { key: 'partage', label: "Partage d'affaire" },
] as const

type TabKey = typeof TABS[number]['key']

export function ParametresClient({ initialMlmRates, initialModele, initialPartage }: Props) {
  const [tab, setTab] = useState<TabKey>('mlm')
  const [mlmRates, setMlmRates] = useState<NiveauConfig[]>(initialMlmRates)
  const [modele, setModele] = useState<ModeleAffaire>(initialModele)
  const [partage, setPartage] = useState<PartageAffaire>(initialPartage)
  const [savedTab, setSavedTab] = useState<TabKey | null>(null)
  const [isPending, startTransition] = useTransition()

  const totalMlm = mlmRates.reduce((s, r) => s + Number(r.taux), 0)
  const partArtisan = 100 - totalMlm

  function save(key: string, value: unknown, tabKey: TabKey) {
    startTransition(async () => {
      await saveMlmConfig(key, value)
      setSavedTab(tabKey)
      setTimeout(() => setSavedTab(null), 2500)
    })
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Paramètres MLM</h1>
        <p className="mt-1 text-[15px] text-[#6E6E73]">
          Configurez les taux de reversement et votre modèle économique
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#F5F5F7] p-1 rounded-xl w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-all ${
              tab === key
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'mlm' && (
        <TabMlm
          rates={mlmRates} setRates={setMlmRates}
          onSave={() => save('mlm_rates', mlmRates, 'mlm')}
          saving={isPending} saved={savedTab === 'mlm'}
        />
      )}
      {tab === 'modele' && (
        <TabModele
          modele={modele} setModele={setModele}
          totalMlm={totalMlm}
          onSave={() => save('modele_affaire', modele, 'modele')}
          saving={isPending} saved={savedTab === 'modele'}
        />
      )}
      {tab === 'partage' && (
        <TabPartage
          partage={partage} setPartage={setPartage}
          partArtisan={partArtisan}
          onSave={() => save('partage_affaire', partage, 'partage')}
          saving={isPending} saved={savedTab === 'partage'}
        />
      )}
    </div>
  )
}
