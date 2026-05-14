import Link from 'next/link'
import { UserPlus, ExternalLink, CheckCircle2, Clock, AlertCircle, Banknote, HardHat, LogIn } from 'lucide-react'

const CLIENTS = [
  { id: 'c1', prenom: 'Marie',    nom: 'Lefebvre',  email: 'marie.lefebvre@email.fr',  adresse: '8 allée des Roses, 75016 Paris',          chantier: true,  facturation: 'a_facturer' },
  { id: 'c2', prenom: 'Pierre',   nom: 'Rousseau',  email: 'pierre.rousseau@email.fr', adresse: '3 rue Victor Hugo, 69001 Lyon',            chantier: false, facturation: 'facture'    },
  { id: 'c3', prenom: 'Isabelle', nom: 'Moreau',    email: 'isabelle.moreau@email.fr', adresse: '15 avenue Foch, 31000 Toulouse',           chantier: true,  facturation: 'a_venir'    },
  { id: 'c4', prenom: 'François', nom: 'Blanc',     email: 'francois.blanc@email.fr',  adresse: '22 rue de la Paix, 33000 Bordeaux',        chantier: false, facturation: 'paye'       },
  { id: 'c5', prenom: 'Claire',   nom: 'Dupuis',    email: 'claire.dupuis@email.fr',   adresse: '7 place Bellecour, 69002 Lyon',            chantier: false, facturation: 'paye'       },
  { id: 'c6', prenom: 'Antoine',  nom: 'Girard',    email: 'antoine.girard@email.fr',  adresse: '14 rue des Acacias, 59000 Lille',          chantier: true,  facturation: 'a_facturer' },
  { id: 'c7', prenom: 'Lucie',    nom: 'Perrin',    email: 'lucie.perrin@email.fr',    adresse: '2 impasse du Moulin, 67000 Strasbourg',    chantier: false, facturation: 'facture'    },
  { id: 'c8', prenom: 'Nicolas',  nom: 'Fontaine',  email: 'nicolas.fontaine@email.fr',adresse: '19 rue du Commerce, 44000 Nantes',         chantier: true,  facturation: 'a_venir'    },
]

const FACTURATION_CONFIG = {
  a_venir:     { label: 'À venir',     icon: Clock,         className: 'text-[#6E6E73] bg-[#F5F5F7]'       },
  a_facturer:  { label: 'À facturer',  icon: AlertCircle,   className: 'text-[#FF9500] bg-[#FF9500]/10'    },
  facture:     { label: 'Facturé',     icon: Banknote,      className: 'text-[#0071E3] bg-[#EBF5FF]'       },
  paye:        { label: 'Payé',        icon: CheckCircle2,  className: 'text-[#34C759] bg-[#34C759]/10'    },
}

function FacturationBadge({ statut }: { statut: keyof typeof FACTURATION_CONFIG }) {
  const { label, icon: Icon, className } = FACTURATION_CONFIG[statut]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

export default function ClientsPage() {
  const enCours = CLIENTS.filter((c) => c.chantier).length
  const aFacturer = CLIENTS.filter((c) => c.facturation === 'a_facturer').length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Clients finaux</h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            {CLIENTS.length} clients · {enCours} chantier{enCours > 1 ? 's' : ''} en cours · {aFacturer} à facturer
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
          <UserPlus className="w-4 h-4" />
          Ajouter un client
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Client</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Adresse</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Email</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Chantier</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Facturation</th>
              <th className="w-16 px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {CLIENTS.map((c) => {
              const encodedName = encodeURIComponent(`${c.prenom} ${c.nom}`)
              return (
                <tr key={c.id} className="hover:bg-[#F5F5F7] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#34C759]/10 flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-bold text-[#34C759]">{c.prenom[0]}{c.nom[0]}</span>
                      </div>
                      <span className="font-semibold text-[14px] text-[#1D1D1F]">{c.prenom} {c.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[13px] text-[#6E6E73] max-w-[220px] truncate">{c.adresse}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[13px] text-[#1D1D1F]">{c.email}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {c.chantier ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#34C759] bg-[#34C759]/10">
                        <HardHat className="w-3.5 h-3.5" />
                        En cours
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#C7C7CC]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <FacturationBadge statut={c.facturation as keyof typeof FACTURATION_CONFIG} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/admin/impersonate?id=${c.id}&type=client&name=${encodedName}`}
                        title={`Accéder au portail de ${c.prenom} ${c.nom}`}
                        className="inline-flex items-center gap-1 text-[13px] text-[#FF9500] hover:underline"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Portail
                      </a>
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="inline-flex items-center gap-1 text-[13px] text-[#0071E3] hover:underline"
                      >
                        Fiche <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
