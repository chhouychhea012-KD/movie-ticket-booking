'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Building2, MapPin, Search, Star } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { normalizeStringArray } from '@/lib/utils'

export default function CinemasPage() {
  const { cinemas, selectedCity, movies } = useApp()
  const [query, setQuery] = useState('')

  const filteredCinemas = cinemas.filter((cinema) => {
    const text = `${cinema.name} ${cinema.city} ${cinema.address}`.toLowerCase()
    return text.includes(query.toLowerCase())
  })

  const spotlight = cinemas[0] || null

  return (
    <div className="cinema-page">
      <section className="cinema-container pt-8 sm:pt-10">
        <div className="cinema-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[260px] overflow-hidden bg-[#101318]">
              <img
                src={spotlight?.image || movies[0]?.backdrop || movies[0]?.poster || '/logo-nav.png'}
                alt="Cinemas"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,16,0.18)_0%,rgba(11,13,16,0.55)_45%,rgba(11,13,16,0.88)_100%)]" />
              <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                <div className="max-w-xl">
                  <span className="cinema-chip border-[#f5c451]/30 text-[#f5c451]">
                    <Building2 className="h-3.5 w-3.5" />
                    Cinemas
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                    Clean cinema locations, easy to scan.
                  </h1>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                    Browse cinema halls, screen counts, and city locations in one calm view.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 sm:p-8">
              <div>
                <p className="text-sm font-semibold text-white">Search Location</p>
                <p className="cinema-muted mt-1">Filter by name, city, or address.</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search cinemas..."
                  className="h-12 w-full rounded-xl border border-[#252a32] bg-[#0f1217] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Phnom Penh', 'Siem Reap', 'Battambang', selectedCity].filter(Boolean).slice(0, 4).map((city) => (
                  <span key={city} className="cinema-chip justify-center py-2 text-center">{city}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="cinema-section-title">Cinema List</h2>
            <p className="cinema-muted mt-2">Cards stay compact and readable on every screen.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-[#f23b43] hover:text-white">
            Back home
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCinemas.map((cinema) => (
            <article
              key={cinema.id}
              className="group overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] transition hover:-translate-y-0.5 hover:border-[#e50914]/40"
            >
              <div className="relative h-44 overflow-hidden bg-[#101318]">
                <img
                  src={cinema.image || movies[0]?.poster || '/logo-nav.png'}
                  alt={cinema.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="cinema-chip border-black/20 bg-black/40 text-white backdrop-blur">{cinema.city}</span>
                  <span className="cinema-chip border-emerald-500/30 text-emerald-300">Open</span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="line-clamp-1 text-base font-semibold text-white">{cinema.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{cinema.address}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#e50914]" />
                    {cinema.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-[#f5c451]" />
                    {cinema.screens?.length || 0} screens
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {normalizeStringArray(cinema.facilities).slice(0, 3).map((facility) => (
                    <span key={facility} className="cinema-chip text-[11px]">{facility}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
