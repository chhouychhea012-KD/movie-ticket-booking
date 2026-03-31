'use client'

import { Ticket, DollarSign, Users, TrendingUp, Film, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStatsProps {
  totalBookings: number
  totalRevenue: number
}

const statsCards = [
  {
    title: 'Total Bookings',
    value: 0, // Will be passed as prop
    icon: <Ticket className="w-6 h-6" />,
    bgGradient: 'from-blue-500 to-cyan-500',
    bgGlow: 'bg-blue-500/20',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Total Revenue',
    value: 0, // Will be passed as prop
    prefix: '$',
    icon: <DollarSign className="w-6 h-6" />,
    bgGradient: 'from-emerald-500 to-teal-500',
    bgGlow: 'bg-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Active Movies',
    value: 6,
    icon: <Film className="w-6 h-6" />,
    bgGradient: 'from-orange-500 to-amber-500',
    bgGlow: 'bg-orange-500/20',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    title: 'Average Rating',
    value: 4.5,
    suffix: '/5',
    icon: <Star className="w-6 h-6" />,
    bgGradient: 'from-violet-500 to-purple-500',
    bgGlow: 'bg-violet-500/20',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
]

export default function AdminStats({ totalBookings, totalRevenue }: AdminStatsProps) {
  const updatedStats = [
    {
      ...statsCards[0],
      value: totalBookings,
    },
    {
      ...statsCards[1],
      value: totalRevenue,
    },
    ...statsCards.slice(2),
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {updatedStats.map((stat, index) => (
        <div
          key={stat.title}
          className="relative group"
        >
          {/* Glow Effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
            stat.bgGradient
          )} />
          
          {/* Card */}
          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
              <div className={cn(
                "w-full h-full rounded-full bg-gradient-to-br",
                stat.bgGradient
              )} />
            </div>

            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
              stat.iconBg
            )}>
              <span className={stat.iconColor}>
                {stat.icon}
              </span>
            </div>

            {/* Content */}
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-1">
                {stat.prefix && (
                  <span className="text-2xl font-bold text-slate-300">{stat.prefix}</span>
                )}
                <span className="text-4xl font-bold text-white">
                  {typeof stat.value === 'number' && stat.value % 1 !== 0 
                    ? stat.value.toFixed(1) 
                    : stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-lg text-slate-400">{stat.suffix}</span>
                )}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                index < 2 ? "text-emerald-400" : "text-orange-400"
              )}>
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
