import Link from 'next/link'
import { Plus, ExternalLink, Home, Building2, Briefcase } from 'lucide-react'

type BienType = 'appartement' | 'maison' | 'bureau' | 'local'

const BIENS = [
  {
    id: 'b1', ref: 'BIE-20190315-0001', type: 'appartement' as BienType,
    adresse: '8 allée des Roses', codePostal: '75016', ville: 'Paris',
    surface: 65, pieces: 3, etage: 4, annee: 1978, dpe: 'D',
    proprietaire: { id: 'c1', nom: 'Marie Lefebvre' },
    nbChantiers: 2, statut: 'occupe' as const,
  },
  {
    id: 'b2', ref: 'BIE-20120601-0002', type: 'maison' as BienType,
    adresse: '3 rue Victor Hugo', codePostal: '69001', ville: 'Lyon',
    surface: 120, pieces: 5, etage: 0, annee: 1965, dpe: 'E',
    proprietaire: { id: 'c2', nom: 'Pierre Rousseau' },
    nbChantiers: 0, statut: 'occupe' as const,
  },
  {
    id: 'b3', ref: 'BIE-20170901-0003', type: 'appartement' as BienType,
    adresse: '15 avenue Foch', codePostal: '31000', ville: 'Toulouse',
    surface: 85, pieces: 4, etage: 2, annee: 1990, dpe: 'C',
    proprietaire: { id: 'c3', nom: 'Isabelle Moreau' },
    nbChantiers: 1, statut: 'occupe' as const,
  },
  {
    id: 'b4', ref: 'BIE-20150410-0004', type: 'appartement' as BienType,
    adresse: '22 rue de la Paix', codePostal: '33000', ville: 'Bordeaux',
    surface: 110, pieces: 5, etage: 3, annee: 1905, dpe: 'F',
    proprietaire: { id: 'c4', nom: 'François Blanc' },
    nbChantiers: 1, statut: 'occupe' as const,
  },
  {
    id: 'b5', ref: 'BIE-20220115-0005', type: 'bureau' as BienType,
    adresse: '14 rue des Acacias', codePostal: '59000', ville: 'Lille',
    surface: 95, pieces: 0, etage: 1, annee: 2005, dpe: 'B',
    proprietaire: { id: 'c6', nom: 'Antoine Girard' },
    nbChantiers: 1, statut: 'occupe' as const,
  },
  {
    id: 'b6', ref: 'BIE-20201101-0006', type: 'appartement' as BienType,
    adresse: '19 rue du Commerce', codePostal: '44000', ville: 'Nantes',
    surface: 55, pieces: 2, etage: 5, annee: 2001, dpe: 'C',
    proprietaire: { id: 'c8', nom: 'Nicolas Fontaine' },
    nbChantiers: 1, statut: 'occupe' as const,
  },
]

const TYPE_CONFIG: Record<BienType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  appartement: { icon: Building2, label: 'Appartement', color: '#0071E3', bg: '#EBF5FF' },
  maison:      { icon: Home,      label: 'Maison',      color: '#34C759', bg: '#F0FFF4' },
  bureau:      { icon: Briefcase, label: 'Bureau',      color: '#AF52DE', bg: '#F5EEFF' },
  local:       { icon: Building2, label: 'Local',       color: '#FF9500', bg: '#FFF3E0' },
}

const DPE_COLOR: Record<string, string> = {
  A: '#00C853', B: '#64DD17', C: '#AEEA00', D: '#FFD600', E: '#FF9800', F: '#FF5722', G: '#B71C1C',
}

export default function BiensPage() {
  const total = BIENS.length
  const avecChantier = BIENS.filter((b) => b.nbChantiers > 0).length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Biens</h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            {total} biens enregistrés · {avecChantier} avec chantier(s)
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Réf.</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Bien</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Propriétaire</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Surface</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Pièces</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">DPE</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Chantiers</th>
              <th className="w-12 px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {BIENS.map((b) => {
              const cfg = TYPE_CONFIG[b.type]
              const Icon = cfg.icon
              return (
                <tr key={b.id} className="hover:bg-[#F5F5F7] transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-mono text-[11px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-1 rounded-lg whitespace-nowrap">{b.ref}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                        <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-[14px] text-[#1D1D1F]">{b.adresse}</div>
                        <div className="text-[12px] text-[#6E6E73]">{b.codePostal} {b.ville} · {cfg.label} · {b.etage > 0 ? `${b.etage}ᵉ étage` : 'RDC'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/clients/${b.proprietaire.id}`} className="text-[13px] text-[#0071E3] hover:underline font-medium">
                      {b.proprietaire.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[13px] font-semibold text-[#1D1D1F]">{b.surface} m²</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[13px] text-[#1D1D1F]">{b.pieces > 0 ? b.pieces : '—'}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-bold text-white"
                      style={{ backgroundColor: DPE_COLOR[b.dpe] ?? '#999' }}
                    >
                      {b.dpe}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {b.nbChantiers > 0 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#EBF5FF] text-[12px] font-bold text-[#0071E3]">
                        {b.nbChantiers}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#C7C7CC]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/biens/${b.id}`}
                      className="inline-flex items-center gap-1 text-[13px] text-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                    >
                      Fiche <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
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
