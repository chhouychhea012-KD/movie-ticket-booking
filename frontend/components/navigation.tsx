'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { ChevronDown, Clapperboard, LogOut, MapPin, Menu, Search, Ticket, User, X } from 'lucide-react'
import { Movie } from '@/types'
import { normalizeStringArray } from '@/lib/utils'

export default function Navigation() {
  const { user, logout, cities, selectedCity, setSelectedCity, searchMovies } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [showResults, setShowResults] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setCityOpen(false)
      if (userRef.current && !userRef.current.contains(event.target as Node)) setUserOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    const trimmed = value.trim()
    if (!trimmed) {
      setResults([])
      setShowResults(false)
      return
    }
    setResults(searchMovies(trimmed).slice(0, 6))
    setShowResults(true)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'border-b border-[#252a32] bg-[#0b0d10]/95 shadow-2xl shadow-black/30 backdrop-blur-xl' : 'bg-[#0b0d10]/80 backdrop-blur-md'}`}>
      <div className="cinema-container">
        <div className="flex h-20 items-center gap-4 lg:h-20">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={closeMobile}>
            <img
              src="/logo-nav.png"
              alt="CamboCine Movie Time"
              className="h-16 w-32 object-contain drop-shadow-[0_0_14px_rgba(236,72,153,0.45)] sm:w-40 lg:w-44"
            />
            <span className="sr-only">CamboCine</span>
          </Link>

          <div className="relative hidden max-w-md flex-1 lg:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              onFocus={() => query && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 180)}
              placeholder="Search movies"
              className="h-11 w-full rounded-xl border border-[#252a32] bg-[#14171c] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#e50914]"
            />
            {showResults && results.length > 0 && (
              <div className="absolute left-0 right-0 top-13 overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/40">
                {results.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    onClick={() => {
                      setQuery('')
                      setShowResults(false)
                    }}
                    className="flex items-center gap-3 px-3 py-3 transition hover:bg-[#1b1f26]"
                  >
                    <img src={movie.poster} alt={movie.title} className="h-14 w-10 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{movie.title}</p>
                      <p className="truncate text-xs text-slate-400">
                        {normalizeStringArray(movie.genre).slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link href="/movies" className="cinema-button-secondary h-10 px-4 py-0">
              Movies
            </Link>
            <Link href={user ? '/bookings' : '/auth/login?redirect=/bookings'} className="cinema-button-secondary h-10 px-4 py-0">
              <Ticket className="h-4 w-4" />
              Tickets
            </Link>

            <div className="relative" ref={cityRef}>
              <button onClick={(event) => { event.stopPropagation(); setCityOpen(!cityOpen) }} className="cinema-button-secondary h-10 px-4 py-0">
                <MapPin className="h-4 w-4 text-[#e50914]" />
                {selectedCity}
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {cityOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/40">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name)
                        setCityOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#1b1f26] ${selectedCity === city.name ? 'text-white' : 'text-slate-400'}`}
                    >
                      <MapPin className="h-4 w-4 text-[#e50914]" />
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative" ref={userRef}>
                <button onClick={(event) => { event.stopPropagation(); setUserOpen(!userOpen) }} className="flex h-10 items-center gap-2 rounded-xl border border-[#252a32] bg-[#14171c] px-3 text-sm text-white transition hover:bg-[#1b1f26]">
                  <span className="flex h-7 w-7 overflow-hidden rounded-lg bg-[#252a32] text-xs font-semibold">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName || 'Account'} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    )}
                  </span>
                  <span className="max-w-24 truncate">{user.firstName}</span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/40">
                    <div className="border-b border-[#252a32] px-4 py-3">
                      <p className="break-words font-medium text-white">{user.firstName} {user.lastName}</p>
                      <p className="break-all text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-[#1b1f26]">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    {(user.role === 'admin' || user.role === 'owner' || user.role === 'staff') && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-[#1b1f26]">
                        <Clapperboard className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <button onClick={logout} className="flex w-full items-center gap-3 border-t border-[#252a32] px-4 py-3 text-left text-sm text-[#f23b43] transition hover:bg-[#1b1f26]">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="cinema-button-primary h-10 px-4 py-0">
                Sign In
              </Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="ml-auto rounded-xl border border-[#252a32] bg-[#14171c] p-2 text-white md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="space-y-3 border-t border-[#252a32] py-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search movies"
                className="h-11 w-full rounded-xl border border-[#252a32] bg-[#14171c] pl-11 pr-4 text-sm text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <button key={city.id} onClick={() => setSelectedCity(city.name)} className={`rounded-xl border px-3 py-2 text-left text-sm ${selectedCity === city.name ? 'border-[#e50914] text-white' : 'border-[#252a32] text-slate-400'}`}>
                  {city.name}
                </button>
              ))}
            </div>
            <Link href="/movies" onClick={closeMobile} className="cinema-button-secondary w-full">Movies</Link>
            <Link href={user ? '/bookings' : '/auth/login?redirect=/bookings'} onClick={closeMobile} className="cinema-button-secondary w-full">My Tickets</Link>
            {user ? (
              <>
                <Link href="/profile" onClick={closeMobile} className="cinema-button-secondary w-full">Profile</Link>
                <button onClick={() => { logout(); closeMobile() }} className="cinema-button-secondary w-full text-[#f23b43]">Logout</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={closeMobile} className="cinema-button-primary w-full">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
