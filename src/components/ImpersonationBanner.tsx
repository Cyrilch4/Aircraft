import Link from 'next/link'
import { LogOut, ShieldAlert } from 'lucide-react'

interface Props {
  name: string
  type: 'artisan' | 'client'
}

export function ImpersonationBanner({ name, type }: Props) {
  const label = type === 'artisan' ? 'artisan' : 'client'
  return (
    <div className="bg-[#FF9500] text-white px-5 py-2.5 flex items-center justify-between text-[13px] font-medium shadow-sm">
      <div className="flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          Mode back-office — Vous consultez le portail {label} de{' '}
          <strong>{decodeURIComponent(name)}</strong>
        </span>
      </div>
      <Link
        href="/admin/impersonate/end"
        className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 px-3 py-1.5 rounded-full transition-colors text-[12px] font-semibold whitespace-nowrap"
      >
        <LogOut className="w-3.5 h-3.5" />
        Quitter
      </Link>
    </div>
  )
}
