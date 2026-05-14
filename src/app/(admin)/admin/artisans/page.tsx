import Link from 'next/link'
import { UserPlus, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react'

const ARTISANS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    prenom: 'Sophie',
    nom: 'Martin',
    email: 'sophie.martin@email.fr',
    tel: '06 12 34 56 78',
    adresse: '12 rue du Faubourg, 75011 Paris',
    projets: 8,
    convention: 'signee',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    prenom: 'Thomas',
    nom: 'Dupont',
    email: 'thomas.dupont@email.fr',
    tel: '06 23 45 67 89',
    adresse: '3 allée des Chênes, 69007 Lyon',
    projets: 5,
    convention: 'signee',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    prenom: 'Julie',
    nom: 'Bernard',
    email: 'julie.bernard@email.fr',
    tel: '06 34 56 78 90',
    adresse: '8 avenue Gambetta, 33000 Bordeaux',
    projets: 3,
    convention: 'attente',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    prenom: 'Marc',
    nom: 'Leroy',
    email: 'marc.leroy@email.fr',
    tel: '06 45 67 89 01',
    adresse: '27 rue Nationale, 59000 Lille',
    projets: 12,
    convention: 'signee',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    prenom: 'Emma',
    nom: 'Moreau',
    email: 'emma.moreau@email.fr',
    tel: '06 56 78 90 12',
    adresse: '5 place du Capitole, 31000 Toulouse',
    projets: 1,
    convention: 'non_signee',
  },
]

const CONVENTION_CONFIG = {
  signee: {
    label: 'Signée',
    icon: CheckCircle2,
    className: 'text-[#34C759] bg-[#34C759]/10',
  },
  attente: {
    label: 'En attente',
    icon: Clock,
    className: 'text-[#FF9500] bg-[#FF9500]/10',
  },
  non_signee: {
    label: 'Non signée',
    icon: XCircle,
    className: 'text-[#FF3B30] bg-[#FF3B30]/10',
  },
}

function ConventionBadge({ statut }: { statut: keyof typeof CONVENTION_CONFIG }) {
  const { label, icon: Icon, className } = CONVENTION_CONFIG[statut]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

export default function ArtisansPage() {
  const signees = ARTISANS.filter((a) => a.convention === 'signee').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Artisans</h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            {ARTISANS.length} artisans · {signees} conventions signées
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
          <UserPlus className="w-4 h-4" />
          Ajouter un artisan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Artisan
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Contact
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Adresse
              </th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Projets
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
                Convention
              </th>
              <th className="w-12 px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {ARTISANS.map((a) => (
              <tr key={a.id} className="hover:bg-[#F5F5F7] transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0071E3]/10 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-bold text-[#0071E3]">
                        {a.prenom[0]}{a.nom[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-[#1D1D1F]">
                        {a.prenom} {a.nom}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[13px] text-[#1D1D1F]">{a.email}</div>
                  <div className="text-[12px] text-[#6E6E73] mt-0.5">{a.tel}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[13px] text-[#6E6E73] max-w-[200px] truncate">{a.adresse}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F7] text-[13px] font-semibold text-[#1D1D1F]">
                    {a.projets}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <ConventionBadge statut={a.convention as keyof typeof CONVENTION_CONFIG} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/artisans/${a.id}`}
                    className="inline-flex items-center gap-1 text-[13px] text-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Voir
                    <ExternalLink className="w-3.5 h-3.5" />
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
