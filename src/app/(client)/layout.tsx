import Link from 'next/link'
import { HardHat } from 'lucide-react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-[#D2D2D7] bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#34C759]/15 flex items-center justify-center">
              <HardHat className="w-4 h-4 text-[#34C759]" />
            </div>
            <span className="font-semibold text-[15px] text-[#1D1D1F]">Mon chantier</span>
          </div>
          <Link href="/" className="text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
            InvestHub
          </Link>
        </div>
      </nav>
      {children}
    </>
  )
}
