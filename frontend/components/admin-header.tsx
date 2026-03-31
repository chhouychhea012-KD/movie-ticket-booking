'use client'

import { Bell, Search, LogOut, Home, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search movies, bookings, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-700 transition"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Back to Site */}
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">View Site</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-white font-medium">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <Link 
          href="/auth/login" 
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}
