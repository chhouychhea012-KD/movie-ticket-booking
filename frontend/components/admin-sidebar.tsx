'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Ticket, 
  Film, 
  Users, 
  Settings, 
  BarChart3,
  X,
  Menu,
  Building2,
  Calendar,
  QrCode
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <Ticket className="w-5 h-5" /> },
  { label: 'Movies', href: '/admin/movies', icon: <Film className="w-5 h-5" /> },
  { label: 'Cinemas', href: '/admin/cinemas', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Showtimes', href: '/admin/showtimes', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Ticket Validation', href: '/admin/ticket-validation', icon: <QrCode className="w-5 h-5" /> },
  { label: 'Customers', href: '/admin/customers', icon: <Users className="w-5 h-5" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">CineAdmin</h1>
              <p className="text-slate-500 text-xs">Movie Booking</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-500 border-l-4 border-orange-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <span className={cn(
                "transition-colors",
                isActive(item.href) ? "text-orange-500" : "text-slate-500 group-hover:text-white"
              )}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.href) && (
                <div className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-white font-medium text-sm">Admin User</p>
                <p className="text-slate-500 text-xs">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
