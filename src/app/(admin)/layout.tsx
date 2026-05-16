import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  HardHat,
  Package,
  Receipt,
  FileText,
  Settings2,
} from 'lucide-react'

const NAV = [
  { href: '/admin',            label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/artisans',   label: 'Artisans',        icon: Users           },
  { href: '/admin/clients',    label: 'Clients finaux',  icon: UserCheck       },
  { href: '/admin/chantiers',  label: 'Chantiers',       icon: HardHat         },
  { href: '/admin/fournisseurs',label: 'Fournisseurs',   icon: Package         },
  { href: '/admin/facturation', label: 'Facturation',    icon: Receipt         },
  { href: '/admin/contenus',   label: 'Contenus',        icon: FileText        },
  { href: '/admin/parametres', label: 'Paramètres MLM',  icon: Settings2       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#1D1D1F] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="text-white font-semibold text-[15px]">
            InvestHub
          </Link>
          <div className="mt-0.5 text-[11px] font-medium text-[#6E6E73] uppercase tracking-wide">
            Back-office
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[12px] text-white/30">Administrateur</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
