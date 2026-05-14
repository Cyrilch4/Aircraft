import type { FilleulTotalStats } from '@/lib/types'

function formatEur(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function NbPill({ value }: { value: number }) {
  if (value === 0) return <span className="text-[#C7C7CC]">—</span>
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#EBF5FF] text-[#0071E3] font-semibold text-[13px]">
      {value}
    </span>
  )
}

interface FilleulSummaryRowProps {
  stats: FilleulTotalStats
}

export function FilleulSummaryRow({ stats }: FilleulSummaryRowProps) {
  return (
    <div className="rounded-xl border border-[#D2D2D7] overflow-hidden mb-5">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#F9F9FB]">
            <th
              rowSpan={2}
              className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] align-middle border-b border-[#D2D2D7]"
            >
              Mon organisation
            </th>
            <th
              colSpan={2}
              className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]"
            >
              Mois en cours
            </th>
            <th
              colSpan={2}
              className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]"
            >
              Année en cours (à date)
            </th>
            <th rowSpan={2} className="w-10 border-b border-[#D2D2D7]" />
          </tr>
          <tr className="bg-[#F9F9FB] border-b border-[#D2D2D7]">
            <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]">NB</th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Montant</th>
            <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]">NB</th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="px-5 py-4 font-semibold text-[15px] text-[#1D1D1F]">
              {stats.full_name}
            </td>
            <td className="px-4 py-4 text-center border-l border-[#F5F5F7]">
              <NbPill value={stats.month_nb} />
            </td>
            <td className="px-4 py-4 text-right text-[#1D1D1F]">
              {stats.month_amount > 0 ? formatEur(stats.month_amount) : <span className="text-[#C7C7CC]">—</span>}
            </td>
            <td className="px-4 py-4 text-center border-l border-[#F5F5F7]">
              <NbPill value={stats.year_nb} />
            </td>
            <td className="px-4 py-4 text-right text-[#1D1D1F]">
              {stats.year_amount > 0 ? formatEur(stats.year_amount) : <span className="text-[#C7C7CC]">—</span>}
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
