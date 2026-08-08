'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clapperboard, Home, Ticket, User } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Clapperboard },
  { href: '/bookings', label: 'Tickets', icon: Ticket },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#252a32] bg-[#0b0d10]/95 px-3 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition ${active ? 'bg-[#1b1f26] text-white' : 'text-slate-500 hover:text-white'}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-[#e50914]' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
