import { ExternalLink, Plus, MapPin } from 'lucide-react'

const FOURNISSEURS = [
  {
    id: 'f1',
    enseigne: 'Point P',
    categorie: 'Matériaux gros œuvre',
    adresse: '45 route Industrielle, 93200 Saint-Denis',
    tel: '01 48 22 00 00',
    email: 'pro.sainddenis@pointp.fr',
    couleur: '#E63946',
  },
  {
    id: 'f2',
    enseigne: 'Leroy Merlin Pro',
    categorie: 'Bricolage & second œuvre',
    adresse: "2 avenue de l'Europe, 92000 Nanterre",
    tel: '01 47 25 90 00',
    email: 'pro.nanterre@leroymerlin.fr',
    couleur: '#2DC653',
  },
  {
    id: 'f3',
    enseigne: 'CEDEO',
    categorie: 'Sanitaire & plomberie',
    adresse: '12 rue de la Bonne Graine, 45000 Orléans',
    tel: '02 38 25 00 00',
    email: 'contact.orleans@cedeo.fr',
    couleur: '#0071E3',
  },
  {
    id: 'f4',
    enseigne: 'Würth France',
    categorie: 'Fixation & outillage pro',
    adresse: 'Zone Industrielle Nord, 67025 Strasbourg',
    tel: '03 88 47 80 00',
    email: 'strasbourg@wurth.fr',
    couleur: '#FF3B30',
  },
  {
    id: 'f5',
    enseigne: 'Rexel',
    categorie: 'Électricité & éclairage',
    adresse: '13 bd du Fort de Vaux, 75017 Paris',
    tel: '01 42 85 00 00',
    email: 'paris17@rexel.fr',
    couleur: '#FF9500',
  },
  {
    id: 'f6',
    enseigne: 'Loxam',
    categorie: 'Location de matériel',
    adresse: '5 avenue Newton, 92000 Nanterre',
    tel: '01 47 14 90 00',
    email: 'agence.nanterre@loxam.fr',
    couleur: '#AF52DE',
  },
  {
    id: 'f7',
    enseigne: 'Brico Dépôt Pro',
    categorie: 'Matériaux & équipements',
    adresse: '8 rue de la Fontaine, 44300 Nantes',
    tel: '02 40 00 00 00',
    email: 'pro.nantes@bricodepot.fr',
    couleur: '#FF6B00',
  },
  {
    id: 'f8',
    enseigne: 'Manutan',
    categorie: 'Équipement atelier & EPI',
    adresse: '100 avenue du Général de Gaulle, 95013 Cergy',
    tel: '01 34 23 00 00',
    email: 'contact@manutan.fr',
    couleur: '#34C759',
  },
]

export default function FournisseursPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Fournisseurs</h1>
          <p className="mt-1 text-[15px] text-[#6E6E73]">
            {FOURNISSEURS.length} enseignes partenaires
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un fournisseur
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Enseigne</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Adresse</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Téléphone</th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Email</th>
              <th className="w-12 px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {FOURNISSEURS.map((f) => (
              <tr key={f.id} className="hover:bg-[#F5F5F7] transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                      style={{ backgroundColor: f.couleur }}
                    >
                      {f.enseigne.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-[#1D1D1F]">{f.enseigne}</div>
                      <div className="text-[12px] text-[#6E6E73]">{f.categorie}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-start gap-1.5 text-[13px] text-[#6E6E73] max-w-[220px]">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C7C7CC]" />
                    {f.adresse}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <a href={`tel:${f.tel.replace(/\s/g, '')}`} className="text-[13px] text-[#1D1D1F] hover:text-[#0071E3] transition-colors">
                    {f.tel}
                  </a>
                </td>
                <td className="px-4 py-4">
                  <a href={`mailto:${f.email}`} className="text-[13px] text-[#1D1D1F] hover:text-[#0071E3] transition-colors truncate block max-w-[200px]">
                    {f.email}
                  </a>
                </td>
                <td className="px-4 py-4 text-right">
                  <a
                    href={`/admin/fournisseurs/${f.id}`}
                    className="inline-flex items-center gap-1 text-[13px] text-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Voir <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
