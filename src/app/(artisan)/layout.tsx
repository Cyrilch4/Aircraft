import Link from 'next/link'
import { BarChart2, GitBranch } from 'lucide-react'
import { cookies } from 'next/headers'
import { ImpersonationBanner } from '@/components/ImpersonationBanner'

export default async function ArtisanLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const impName = cookieStore.get('imp_name')?.value
  const impType = cookieStore.get('imp_type')?.value

  return (
    <>
      {impName && impType === 'artisan' && (
        <ImpersonationBanner name={impName} type="artisan" />
      )}
      <nav className="border-b border-[#D2D2D7] bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
          <Link href="/" className="font-semibold text-[15px] text-[#1D1D1F] mr-4">
            InvestHub
          </Link>
          <Link
            href="/historiques"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            Performances
          </Link>
          <Link
            href="/organisation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            Organisation
          </Link>
        </div>
      </nav>
      {children}
    </>
  )
}
