import Link from 'next/link'
import { BarChart2, LayoutDashboard, HardHat, ArrowRight } from 'lucide-react'

const PORTALS = [
  {
    href: '/admin',
    icon: LayoutDashboard,
    label: 'Back-office',
    description: 'Gérez les artisans, clients, fournisseurs, la facturation et les paramètres du réseau MLM.',
    accent: '#1D1D1F',
    bg: 'bg-[#1D1D1F]',
    textColor: 'text-white',
    subColor: 'text-white/60',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    arrowColor: 'text-white/40 group-hover:text-white',
    badge: 'Administrateur',
    badgeBg: 'bg-white/10 text-white/70',
  },
  {
    href: '/historiques',
    icon: BarChart2,
    label: 'Portail Artisan',
    description: 'Suivez vos performances, visualisez votre réseau et consultez vos revenus niveau par niveau.',
    accent: '#0071E3',
    bg: 'bg-white',
    textColor: 'text-[#1D1D1F]',
    subColor: 'text-[#6E6E73]',
    iconBg: 'bg-[#EBF5FF]',
    iconColor: 'text-[#0071E3]',
    arrowColor: 'text-[#C7C7CC] group-hover:text-[#0071E3]',
    badge: 'Artisan',
    badgeBg: 'bg-[#EBF5FF] text-[#0071E3]',
  },
  {
    href: '/chantier',
    icon: HardHat,
    label: 'Portail Client',
    description: 'Suivez l\'avancement de votre chantier en temps réel, accédez à vos documents et contacts.',
    accent: '#34C759',
    bg: 'bg-white',
    textColor: 'text-[#1D1D1F]',
    subColor: 'text-[#6E6E73]',
    iconBg: 'bg-[#34C759]/10',
    iconColor: 'text-[#34C759]',
    arrowColor: 'text-[#C7C7CC] group-hover:text-[#34C759]',
    badge: 'Client final',
    badgeBg: 'bg-[#34C759]/10 text-[#34C759]',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-bold text-[#1D1D1F] tracking-tight leading-tight">
            InvestHub
          </h1>
          <p className="mt-3 text-[17px] text-[#6E6E73]">
            Choisissez votre espace
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {PORTALS.map(({
            href, icon: Icon, label, description, bg, textColor, subColor,
            iconBg, iconColor, arrowColor, badge, badgeBg,
          }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-5 ${bg} rounded-2xl border border-[#D2D2D7] px-6 py-5 hover:shadow-md transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[17px] font-semibold ${textColor}`}>{label}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
                    {badge}
                  </span>
                </div>
                <p className={`text-[14px] ${subColor} leading-snug`}>{description}</p>
              </div>
              <ArrowRight className={`w-5 h-5 shrink-0 transition-colors ${arrowColor}`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
