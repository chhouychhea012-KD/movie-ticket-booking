'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { Search, User, LogOut, Ticket, Heart, MapPin, ChevronDown, Menu, X, Clapperboard, Star, Sparkles } from 'lucide-react'
import { Movie } from '@/types'

export default function Navigation() {
  const router = useRouter()
  const { user, logout, cities, selectedCity, setSelectedCity, searchMovies } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on outside click
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside city dropdown
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false)
      }
      // Check if click is outside user menu
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-black/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative" style={{ width: '380px', height: '90px' }}>
              <img 
                src="/logo.png" 
                alt="CinemaHub" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  transformOrigin: 'center'
                }}
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value
                  setSearchQuery(query)
                  if (query.length > 0) {
                    const results = searchMovies(query)
                    setSearchResults(results)
                    setShowSearchResults(true)
                  } else {
                    setShowSearchResults(false)
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) {
                    setShowSearchResults(true)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSearchResults(false), 200)
                }}
                placeholder="Search movies, cinemas..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-900 transition-all duration-300"
              />
            </div>
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/30 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searchResults.slice(0, 6).map((movie: any) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchQuery('')
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-800/80 transition-all"
                  >
                    <div className="w-12 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-slate-400 text-sm">{movie.genre.join(', ')}</p>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/movies?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setShowSearchResults(false)
                    setSearchQuery('')
                  }}
                  className="block px-4 py-3 text-center text-orange-500 hover:bg-slate-800/80 border-t border-slate-800"
                >
                  View all results
                </Link>
              </div>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {/* City Selector */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCityDropdownOpen(!cityDropdownOpen)
                }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:border-orange-500/50"
              >
                <div className="relative">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <div className="absolute inset-0 bg-orange-500/20 blur-sm" />
                </div>
                <span className="text-sm font-medium">{selectedCity}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {cityDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/30 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-500 font-medium">SELECT CITY</p>
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name)
                        setCityDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-800/80 transition-all ${
                        selectedCity === city.name 
                          ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500' 
                          : 'text-slate-300'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{city.name}</span>
                      {selectedCity === city.name && (
                        <Sparkles className="w-3 h-3 ml-auto text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1 px-2">
              <Link 
                href="/movies" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Clapperboard className="w-4 h-4" />
                <span className="text-sm font-medium">Movies</span>
              </Link>
              <Link 
                href="/bookings" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span className="text-sm font-medium">Bookings</span>
              </Link>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-white transition-all duration-300 hover:border-orange-500/50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/20">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.firstName}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/30 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-4 border-b border-slate-800">
                      <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-slate-500 text-sm truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all">
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link href="/bookings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all">
                        <Ticket className="w-4 h-4" />
                        <span>My Bookings</span>
                      </Link>
                      <Link href="/profile?tab=favorites" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all">
                        <Heart className="w-4 h-4" />
                        <span>Favorites</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate-800 py-2">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-red-500/10 text-red-400 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/login" 
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
            
            <Link 
              href="/admin" 
              className="px-3 py-2 text-slate-500 hover:text-white text-sm transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fadeIn">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500"
              />
            </div>
            
            {/* Mobile City Selector */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 font-medium mb-2 block">SELECT CITY</label>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.name)}
                    className={`px-4 py-3 rounded-xl text-left transition-all ${
                      selectedCity === city.name 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link 
                href="/movies" 
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clapperboard className="w-5 h-5" />
                <span className="font-medium">Movies</span>
              </Link>
              <Link 
                href="/bookings" 
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Ticket className="w-5 h-5" />
                <span className="font-medium">My Bookings</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-red-400 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
              
              <Link 
                href="/admin" 
                className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  )
}
