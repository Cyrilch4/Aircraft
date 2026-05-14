import { Users, UserCheck, TrendingUp, Banknote, ArrowUpRight, Clock } from 'lucide-react'

const STATS = [
  { label: 'Artisans actifs', value: '12', delta: '+2 ce mois', icon: Users, color: '#0071E3' },
  { label: 'Clients finaux', value: '47', delta: '+8 ce mois', icon: UserCheck, color: '#34C759' },
  { label: 'CA réseau (YTD)', value: '284 000 €', delta: '+12 % vs N-1', icon: TrendingUp, color: '#FF9500' },
  { label: 'Commissions versées', value: '18 240 €', delta: 'dont 3 200 € ce mois', icon: Banknote, color: '#AF52DE' },
]

const ACTIVITY = [
  { label: 'Nouvel artisan inscrit', sub: 'En attente de validation KYC', time: 'Il y a 2h', color: '#0071E3' },
  { label: 'Chantier terminé', sub: 'Client — Réception signée', time: 'Il y a 5h', color: '#34C759' },
  { label: 'Commission calculée', sub: '3 artisans • 1 240 €', time: 'Hier', color: '#FF9500' },
  { label: 'Nouveau fournisseur affilié', sub: 'Contrat de partenariat envoyé', time: 'Hier', color: '#AF52DE' },
  { label: 'Facture générée', sub: 'Facture #2026-047', time: 'Il y a 2j', color: '#6E6E73' },
]

function StatCard({
  label, value, delta, icon: Icon, color,
}: (typeof STATS)[0]) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E5EA]">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#C7C7CC]" />
      </div>
      <div className="text-[26px] font-bold text-[#1D1D1F] leading-tight">{value}</div>
      <div className="mt-1 text-[13px] text-[#6E6E73]">{label}</div>
      <div className="mt-1 text-[12px] font-medium" style={{ color }}>{delta}</div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-[15px] text-[#6E6E73]">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F7]">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F]">Activité récente</h2>
            <Clock className="w-4 h-4 text-[#C7C7CC]" />
          </div>
          <ul className="divide-y divide-[#F5F5F7]">
            {ACTIVITY.map((a) => (
              <li key={a.label} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[#1D1D1F] truncate">{a.label}</div>
                  <div className="text-[12px] text-[#6E6E73] truncate">{a.sub}</div>
                </div>
                <div className="text-[12px] text-[#C7C7CC] shrink-0">{a.time}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F5F5F7]">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F]">Actions rapides</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: 'Ajouter un artisan', href: '/admin/artisans' },
              { label: 'Créer un client', href: '/admin/clients' },
              { label: 'Générer des commissions', href: '/admin/facturation' },
              { label: 'Modifier les taux MLM', href: '/admin/parametres' },
              { label: 'Publier un contenu', href: '/admin/contenus' },
            ].map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors group"
              >
                {a.label}
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C7C7CC] group-hover:text-[#0071E3] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
