import Link from 'next/link'
import { Plus, ExternalLink, CheckCircle2, Clock, Hammer, CalendarDays, MapPin } from 'lucide-react'
import { ActiviteList } from '@/components/ActiviteBadge'
import type { ActiviteSlug } from '@/lib/activites'

type Statut = 'planifie' | 'en_cours' | 'termine'

const CHANTIERS = [
  {
    id: 'ch1', ref: 'CHA-20260415-0003',
    titre: 'Rénovation salle de bain + mise aux normes électriques',
    client: { id: 'c1', nom: 'Marie Lefebvre' },
    adresse: '8 allée des Roses, 75016 Paris',
    activites: ['plomberie', 'electricite'] as ActiviteSlug[],
    artisans: [
      { id: '11111111-1111-1111-1111-111111111111', nom: 'Sophie Martin',    activite: 'Plomberie' },
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL', activite: 'Électricité' },
    ],
    statut: 'en_cours' as Statut,
    date_debut: '2026-04-15', date_fin_prevue: '2026-06-30',
    avancement: 60, montant: '9 800 €',
  },
  {
    id: 'ch2', ref: 'CHA-20260502-0004',
    titre: 'Extension maison — fondations et gros œuvre',
    client: { id: 'c3', nom: 'Isabelle Moreau' },
    adresse: '15 avenue Foch, 31000 Toulouse',
    activites: ['maconnerie'] as ActiviteSlug[],
    artisans: [
      { id: '33333333-3333-3333-3333-333333333333', nom: 'Julie Bernard', activite: 'Maçonnerie' },
    ],
    statut: 'en_cours' as Statut,
    date_debut: '2026-05-02', date_fin_prevue: '2026-09-15',
    avancement: 20, montant: '38 000 €',
  },
  {
    id: 'ch3', ref: 'CHA-20260510-0005',
    titre: 'Installation pompe à chaleur + tableau électrique',
    client: { id: 'c6', nom: 'Antoine Girard' },
    adresse: '14 rue des Acacias, 59000 Lille',
    activites: ['electricite', 'chauffage'] as ActiviteSlug[],
    artisans: [
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL', activite: 'Électricité + Chauffage' },
    ],
    statut: 'en_cours' as Statut,
    date_debut: '2026-05-10', date_fin_prevue: '2026-07-20',
    avancement: 45, montant: '12 400 €',
  },
  {
    id: 'ch4', ref: 'CHA-20260701-0006',
    titre: 'Ravalement façade + peinture intérieure',
    client: { id: 'c8', nom: 'Nicolas Fontaine' },
    adresse: '19 rue du Commerce, 44000 Nantes',
    activites: ['peinture', 'menuiserie'] as ActiviteSlug[],
    artisans: [
      { id: '44444444-4444-4444-4444-444444444444', nom: 'Leroy Bâtiment', activite: 'Peinture' },
    ],
    statut: 'planifie' as Statut,
    date_debut: '2026-07-01', date_fin_prevue: '2026-08-31',
    avancement: 0, montant: '7 200 €',
  },
  {
    id: 'ch5', ref: 'CHA-20251001-0001',
    titre: 'Rénovation complète appartement haussmannien',
    client: { id: 'c4', nom: 'François Blanc' },
    adresse: '22 rue de la Paix, 33000 Bordeaux',
    activites: ['maconnerie', 'peinture', 'electricite', 'plomberie'] as ActiviteSlug[],
    artisans: [
      { id: '44444444-4444-4444-4444-444444444444', nom: 'Leroy Bâtiment',   activite: 'Maçonnerie + Peinture' },
      { id: '11111111-1111-1111-1111-111111111111', nom: 'Sophie Martin',     activite: 'Plomberie' },
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL',  activite: 'Électricité' },
    ],
    statut: 'termine' as Statut,
    date_debut: '2025-10-01', date_fin_prevue: '2026-02-28',
    avancement: 100, montant: '54 000 €',
  },
]

const STATUT_CONFIG = {
  planifie: { label: 'Planifié',   icon: Clock,         className: 'text-[#6E6E73] bg-[#F5F5F7]'    },
  en_cours: { label: 'En cours',   icon: Hammer,        className: 'text-[#0071E3] bg-[#EBF5FF]'    },
  termine:  { label: 'Terminé',    icon: CheckCircle2,  className: 'text-[#34C759] bg-[#34C759]/10' },
}

function StatutBadge({ statut }: { statut: Statut }) {
  const { label, icon: Icon, className } = STATUT_CONFIG[statut]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ChantiersPage() {
  const enCours  = CHANTIERS.filter((c) => c.statut === 'en_cours').length
  const planifie = CHANTIERS.filter((c) => c.statut === 'planifie').length
  const termine  = CHANTIERS.filter((c) => c.statut === 'termine').length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Chantiers</h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            {CHANTIERS.length} chantiers · {enCours} en cours · {planifie} planifié{planifie > 1 ? 's' : ''} · {termine} terminé{termine > 1 ? 's' : ''}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau chantier
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Réf.</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Chantier</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Client</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Activité(s)</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Intervenant(s)</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Montant</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Avancement</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Dates</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Statut</th>
              <th className="w-12 px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {CHANTIERS.map((ch) => (
              <tr key={ch.id} className="hover:bg-[#F5F5F7] transition-colors group">
                <td className="px-5 py-4">
                  <span className="font-mono text-[11px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-1 rounded-lg whitespace-nowrap">{ch.ref}</span>
                </td>
                <td className="px-5 py-4 max-w-[260px]">
                  <div className="font-semibold text-[14px] text-[#1D1D1F] leading-snug">{ch.titre}</div>
                  <div className="flex items-center gap-1 mt-1 text-[12px] text-[#6E6E73]">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{ch.adresse}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[13px] font-medium text-[#1D1D1F]">{ch.client.nom}</div>
                </td>
                <td className="px-4 py-4">
                  <ActiviteList slugs={ch.activites} />
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {ch.artisans.map((a, i) => (
                      <div key={i} className="text-[12px] text-[#6E6E73]">
                        <Link href={`/admin/artisans/${a.id}`} className="font-medium text-[#0071E3] hover:underline">{a.nom}</Link>
                        <span className="text-[#C7C7CC]"> · </span>
                        {a.activite}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-[13px] text-[#1D1D1F]">{ch.montant}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 min-w-[90px]">
                    <div className="flex-1 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ch.avancement === 100 ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`} style={{ width: `${ch.avancement}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#1D1D1F] w-7 shrink-0 text-right">{ch.avancement}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-[12px] text-[#6E6E73]">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatDate(ch.date_debut)}</span>
                  </div>
                  <div className="text-[11px] text-[#C7C7CC] mt-0.5 ml-4.5">
                    → {formatDate(ch.date_fin_prevue)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatutBadge statut={ch.statut} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/chantiers/${ch.id}`}
                    className="inline-flex items-center gap-1 text-[13px] text-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Voir <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
