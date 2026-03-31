'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Search, User, LogOut, Ticket, Heart, Settings, MapPin, ChevronDown, Film, Calendar, Star } from 'lucide-react'

export default function Navigation() {
  const { user, logout, cities, selectedCity, setSelectedCity } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Film className="w-8 h-8" />
            CinemaHub
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* City Selector */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-300 transition"
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {cityDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.name)
                      setCityDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-slate-700/50 transition ${
                      selectedCity === city.name ? 'bg-orange-500/20 text-orange-400' : 'text-slate-300'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition">
              Movies
            </Link>
            <Link href="/bookings" className="text-slate-300 hover:text-white transition">
              My Bookings
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-white transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full mt-2 right-0 w-56 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 text-slate-300 transition">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link href="/bookings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 text-slate-300 transition">
                      <Ticket className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <Link href="/profile?tab=favorites" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 text-slate-300 transition">
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <div className="border-t border-slate-700/50">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-slate-700/50 text-red-400 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition">
                Login
              </Link>
            )}
            
            <Link href="/admin" className="text-slate-300 hover:text-white transition text-sm">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500"
              />
            </div>
            
            {/* Mobile City Selector */}
            <div className="mb-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/" className="text-slate-300 hover:text-white transition py-2">
                Movies
              </Link>
              <Link href="/bookings" className="text-slate-300 hover:text-white transition py-2">
                My Bookings
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-slate-300 hover:text-white transition py-2">
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-red-400 hover:text-red-300 transition py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 transition py-2">
                  Login
                </Link>
              )}
              <Link href="/admin" className="text-slate-300 hover:text-white transition py-2">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
