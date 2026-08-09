'use client'

import { DollarSign, Film, Star, Ticket, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStatsProps {
  totalBookings: number
  totalRevenue: number
  totalUsers: number
  activeMovies: number
  averageRating: number
  activeCinemas?: number
}

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: value >= 1000 ? 0 : 2,
}).format(value)

export default function AdminStats({
  totalBookings,
  totalRevenue,
  totalUsers,
  activeMovies,
  averageRating,
  activeCinemas = 0,
}: AdminStatsProps) {
  const stats = [
    {
      title: 'Bookings',
      value: formatNumber(totalBookings),
      detail: 'All active tickets',
      icon: Ticket,
      tone: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      detail: 'Completed payments',
      icon: DollarSign,
      tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Customers',
      value: formatNumber(totalUsers),
      detail: 'Registered accounts',
      icon: Users,
      tone: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Now Showing',
      value: formatNumber(activeMovies),
      detail: `${formatNumber(activeCinemas)} active cinemas`,
      icon: Film,
      tone: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
    },
    {
      title: 'Avg Rating',
      value: averageRating ? averageRating.toFixed(1) : '0.0',
      detail: 'Movie catalog score',
      icon: Star,
      tone: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-4 shadow-sm transition hover:border-slate-600/80 hover:bg-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.title}</p>
                <p className="mt-2 truncate text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border', stat.tone)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 truncate text-sm text-slate-400">{stat.detail}</p>
          </div>
        )
      })}
    </div>
  )
}
