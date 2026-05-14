import { Fragment } from 'react'
import Link from 'next/link'
import { ChevronRight, TrendingUp } from 'lucide-react'
import type { FilleulStats } from '@/lib/types'

export interface LevelGroup {
  level: number
  rows: FilleulStats[]
}

interface TotalNetworkTableProps {
  groups: LevelGroup[]
  pathIds: string[]
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function buildDrillPath(pathIds: string[], filleulId: string) {
  const newPath = [...pathIds, filleulId].join(',')
  return `/historiques/${filleulId}?path=${newPath}`
}

function NbPill({ value }: { value: number }) {
  if (value === 0) return <span className="text-[#C7C7CC]">—</span>
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#EBF5FF] text-[#0071E3] font-semibold text-[13px]">
      {value}
    </span>
  )
}

export function TotalNetworkTable({ groups, pathIds }: TotalNetworkTableProps) {
  const nonEmpty = groups.filter((g) => g.rows.length > 0)

  if (nonEmpty.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#C7C7CC] rounded-xl border border-[#D2D2D7]">
        <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">Aucun filleul dans votre réseau pour le moment</p>
      </div>
    )
  }

  const allRows = nonEmpty.flatMap((g) => g.rows)
  const totalMonthNb = allRows.reduce((s, r) => s + r.month_nb, 0)
  const totalMonthAmount = allRows.reduce((s, r) => s + r.month_amount, 0)
  const totalYearNb = allRows.reduce((s, r) => s + r.year_nb, 0)
  const totalYearAmount = allRows.reduce((s, r) => s + r.year_amount, 0)

  return (
    <div className="overflow-x-auto rounded-xl border border-[#D2D2D7]">
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
            <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]">
              NB
            </th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
              Montant
            </th>
            <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] border-l border-[#E5E5EA]">
              NB
            </th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">
              Montant
            </th>
          </tr>
        </thead>

        <tbody>
          {nonEmpty.map((group) => {
            const gMonthNb = group.rows.reduce((s, r) => s + r.month_nb, 0)
            const gMonthAmt = group.rows.reduce((s, r) => s + r.month_amount, 0)
            const gYearNb = group.rows.reduce((s, r) => s + r.year_nb, 0)
            const gYearAmt = group.rows.reduce((s, r) => s + r.year_amount, 0)

            return (
              <Fragment key={group.level}>
                {/* En-tête du groupe */}
                <tr className="bg-[#F5F5F7] border-t border-[#E5E5EA]">
                  <td
                    colSpan={6}
                    className="px-5 py-2 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide"
                  >
                    N-{group.level}
                    <span className="ml-2 font-normal normal-case tracking-normal text-[#C7C7CC]">
                      · {group.rows.length} filleul{group.rows.length > 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>

                {/* Lignes du groupe */}
                {group.rows.map((row, i) => {
                  const href = buildDrillPath(pathIds, row.filleul_id)
                  const canDrillDown = row.has_recruits
                  const isLastInGroup = i === group.rows.length - 1

                  return (
                    <tr
                      key={row.filleul_id}
                      className={[
                        'hover:bg-[#F5F5F7] transition-colors group',
                        isLastInGroup ? '' : 'border-b border-[#F5F5F7]',
                      ].join(' ')}
                    >
                      <td className="px-5 py-4">
                        <Link href={href} className="font-medium text-[#0071E3] hover:underline">
                          {row.full_name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-center border-l border-[#F5F5F7]">
                        <NbPill value={row.month_nb} />
                      </td>
                      <td className="px-4 py-4 text-right text-[#1D1D1F]">
                        {row.month_amount > 0 ? formatEur(row.month_amount) : <span className="text-[#C7C7CC]">—</span>}
                      </td>
                      <td className="px-4 py-4 text-center border-l border-[#F5F5F7]">
                        <NbPill value={row.year_nb} />
                      </td>
                      <td className="px-4 py-4 text-right text-[#1D1D1F]">
                        {row.year_amount > 0 ? formatEur(row.year_amount) : <span className="text-[#C7C7CC]">—</span>}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {canDrillDown && (
                          <Link href={href}>
                            <ChevronRight className="w-4 h-4 text-[#C7C7CC] group-hover:text-[#0071E3] transition-colors" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {/* Sous-total du niveau */}
                <tr className="bg-[#F9F9FB] border-t border-[#E5E5EA]">
                  <td className="px-5 py-3 text-[13px] font-medium text-[#6E6E73]">
                    Sous-total N-{group.level}
                  </td>
                  <td className="px-4 py-3 text-center border-l border-[#E5E5EA]">
                    <NbPill value={gMonthNb} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#1D1D1F]">
                    {formatEur(gMonthAmt)}
                  </td>
                  <td className="px-4 py-3 text-center border-l border-[#E5E5EA]">
                    <NbPill value={gYearNb} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#1D1D1F]">
                    {formatEur(gYearAmt)}
                  </td>
                  <td />
                </tr>
              </Fragment>
            )
          })}
        </tbody>

        <tfoot>
          <tr className="bg-[#F9F9FB] border-t-2 border-[#D2D2D7]">
            <td className="px-5 py-4 font-bold text-[#1D1D1F]">Total</td>
            <td className="px-4 py-4 text-center border-l border-[#E5E5EA]">
              <NbPill value={totalMonthNb} />
            </td>
            <td className="px-4 py-4 text-right font-bold text-[#1D1D1F]">
              {formatEur(totalMonthAmount)}
            </td>
            <td className="px-4 py-4 text-center border-l border-[#E5E5EA]">
              <NbPill value={totalYearNb} />
            </td>
            <td className="px-4 py-4 text-right font-bold text-[#1D1D1F]">
              {formatEur(totalYearAmount)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
