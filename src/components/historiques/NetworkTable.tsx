import Link from 'next/link'
import { ChevronRight, TrendingUp } from 'lucide-react'
import type { FilleulStats } from '@/lib/types'

interface NetworkTableProps {
  rows: FilleulStats[]
  basePath: string
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

function buildDrillPath(basePath: string, pathIds: string[], filleulId: string) {
  const newPath = [...pathIds, filleulId].join(',')
  return `/historiques/${filleulId}?path=${newPath}`
}

export function NetworkTable({ rows, basePath, pathIds }: NetworkTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">Aucun filleul à ce niveau pour le moment</p>
      </div>
    )
  }

  const totalMonthNb = rows.reduce((s, r) => s + r.month_nb, 0)
  const totalMonthAmount = rows.reduce((s, r) => s + r.month_amount, 0)
  const totalYearNb = rows.reduce((s, r) => s + r.year_nb, 0)
  const totalYearAmount = rows.reduce((s, r) => s + r.year_amount, 0)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th
              rowSpan={2}
              className="px-4 py-3 text-left font-semibold text-gray-600 w-48"
            >
              Filleul
            </th>
            <th
              colSpan={2}
              className="px-4 py-2 text-center font-semibold text-gray-600 border-l border-gray-200"
            >
              Mois en cours
            </th>
            <th
              colSpan={2}
              className="px-4 py-2 text-center font-semibold text-gray-600 border-l border-gray-200"
            >
              Année (YTD)
            </th>
            <th rowSpan={2} className="w-8" />
          </tr>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 text-center font-medium text-gray-500 border-l border-gray-200 w-20">
              NB
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-500 w-28">
              Montant
            </th>
            <th className="px-4 py-2 text-center font-medium text-gray-500 border-l border-gray-200 w-20">
              NB
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-500 w-28">
              Montant
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const href = buildDrillPath(basePath, pathIds, row.filleul_id)
            const canDrillDown = row.has_recruits

            return (
              <tr
                key={row.filleul_id}
                className={
                  canDrillDown
                    ? 'hover:bg-blue-50 cursor-pointer transition-colors group'
                    : 'hover:bg-gray-50 transition-colors'
                }
              >
                <td className="px-4 py-3">
                  {canDrillDown ? (
                    <Link href={href} className="font-medium text-blue-600 hover:underline">
                      {row.full_name}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-800">{row.full_name}</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center text-gray-600 border-l border-gray-100">
                  {row.month_nb > 0 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                      {row.month_nb}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-800">
                  {row.month_amount > 0 ? (
                    formatEur(row.month_amount)
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center text-gray-600 border-l border-gray-100">
                  {row.year_nb > 0 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                      {row.year_nb}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-800">
                  {row.year_amount > 0 ? (
                    formatEur(row.year_amount)
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                <td className="px-2 py-3 text-right">
                  {canDrillDown && (
                    <Link href={href}>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>

        <tfoot>
          <tr className="bg-gray-50 border-t-2 border-gray-200 font-semibold">
            <td className="px-4 py-3 text-gray-700">Total</td>
            <td className="px-4 py-3 text-center border-l border-gray-200">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                {totalMonthNb}
              </span>
            </td>
            <td className="px-4 py-3 text-right font-mono text-gray-900">
              {formatEur(totalMonthAmount)}
            </td>
            <td className="px-4 py-3 text-center border-l border-gray-200">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                {totalYearNb}
              </span>
            </td>
            <td className="px-4 py-3 text-right font-mono text-gray-900">
              {formatEur(totalYearAmount)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
