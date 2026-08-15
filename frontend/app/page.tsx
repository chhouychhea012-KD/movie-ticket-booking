'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import MovieSlideshow from '@/components/movie-slideshow'
import { useApp } from '@/context/AppContext'
import { ArrowRight, BadgePercent, Building2, MapPin, Search, Ticket, Timer } from 'lucide-react'
import { normalizeStringArray } from '@/lib/utils'

export default function Home() {
  const { nowShowing, comingSoon, movies, cinemas, searchMovies, selectedCity, setSelectedCity, cities } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof movies>([])

  useEffect(() => {
    const trimmed = query.trim()
    setResults(trimmed ? searchMovies(trimmed).slice(0, 6) : [])
  }, [query, searchMovies])

  const cinemaPreview = (selectedCity ? cinemas.filter((cinema) => cinema.city === selectedCity) : cinemas).slice(0, 6)
  const promoMovies = [...movies].slice(0, 6)

  return (
    <div className="cinema-page">
      <h1 className="sr-only">CamboCine movie ticket booking online in Cambodia</h1>
      <p className="sr-only">
        CamboCine is the Cambodia movie booking site for showtimes, seats, checkout, and tickets.
      </p>
      <MovieSlideshow movies={nowShowing.slice(0, 5)} />

      <section className="cinema-container relative z-20 -mt-12 sm:-mt-20">
        <div className="cinema-card mx-auto grid max-w-6xl gap-3 p-4 shadow-[0_26px_80px_rgba(0,0,0,0.38)] sm:gap-4 sm:p-5 lg:grid-cols-[minmax(360px,1fr)_300px_220px] lg:items-center lg:gap-6 xl:max-w-7xl">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 sm:h-5 sm:w-5" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by movie, genre, or director"
              className="h-[52px] w-full rounded-xl border border-[#252a32] bg-[#0f1217] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 sm:h-14 sm:rounded-2xl sm:pl-12"
            />
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-14 z-30 max-h-[320px] overflow-y-auto rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/40 sm:top-[4.25rem] sm:max-h-[360px]">
                {results.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#1b1f26]">
                    <img src={movie.poster} alt={movie.title} className="h-14 w-10 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{movie.title}</p>
                      <p className="text-xs text-slate-500">{normalizeStringArray(movie.genre).slice(0, 2).join(' / ')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="h-[52px] w-full rounded-xl border border-[#252a32] bg-[#0f1217] px-4 text-sm font-medium text-white outline-none transition focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 sm:h-14 sm:rounded-2xl"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.name}>{city.name}</option>
            ))}
          </select>

          <Link href="/movies" className="cinema-button-primary h-[52px] w-full rounded-xl px-5 py-0 sm:h-14 sm:rounded-2xl">
            <Ticket className="h-4 w-4" />
            <span className="whitespace-nowrap">Browse Movies</span>
          </Link>
        </div>
      </section>

      <section className="cinema-container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="cinema-section-title">Now Showing</h2>
            <p className="cinema-muted mt-2">Book seats for today's most popular screenings.</p>
          </div>
          <Link href="/movies" className="text-sm font-semibold text-[#f23b43] hover:text-white">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {nowShowing.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="cinema-container pb-16">
        <div className="cinema-card overflow-hidden border-[#2c3139] bg-[#11141a] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]">
              <img
                src={movies[0]?.backdrop || movies[0]?.poster || '/logo-nav.png'}
                alt="CamboCine promotion"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,16,0.18)_0%,rgba(11,13,16,0.44)_38%,rgba(11,13,16,0.92)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(11,13,16,0.35),rgba(11,13,16,0))]" />
              <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-10">
                <div className="max-w-xl">
                  <span className="cinema-chip border-[#f5c451]/30 bg-[#f5c451]/10 text-[#f5c451]">
                    <BadgePercent className="h-3.5 w-3.5" />
                    Special Offers
                  </span>
                  <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    Big screen nights, sharper deals.
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                    Grab tickets, snacks, and seat upgrades with clean, simple movie offers.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/movies" className="cinema-button-primary h-11 px-5 py-0">
                      Browse Movies
                    </Link>
                    <Link href="/offers" className="cinema-button-secondary h-11 px-5 py-0">
                      View Offers
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-[#252a32] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Quick Picks</p>
                <p className="mt-2 text-lg font-semibold text-white">Fast paths to your next booking.</p>
                <p className="cinema-muted mt-2 max-w-md">
                  Jump straight to the most useful parts of the site without extra clutter.
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  { label: 'Best rated movies', href: '/movies', note: 'Find top picks in one tap.' },
                  { label: 'Nearby cinemas', href: '/cinemas', note: 'See locations by city.' },
                  { label: 'Active deals', href: '/offers', note: 'Open current promotions.' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-[#252a32] bg-[#101318] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#e50914]/40 hover:bg-[#14171c]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#e50914] transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#252a32] bg-[#101318] py-14">
        <div className="cinema-container grid gap-4 md:grid-cols-3">
          <InfoCard icon={<Timer className="h-5 w-5" />} title="Fast Booking" text="Choose a time, pick seats, and pay quickly." />
          <InfoCard icon={<Ticket className="h-5 w-5" />} title="Digital Tickets" text="Get a ticket and booking details after checkout." />
          <InfoCard icon={<Building2 className="h-5 w-5" />} title="Local Cinemas" text="See nearby cinemas and showtimes by city." />
        </div>
      </section>

      <section className="cinema-container grid gap-12 py-16 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="cinema-section-title">Cinemas</h2>
              <p className="cinema-muted mt-2">Clean location cards, easy to scan.</p>
            </div>
            <Link href="/cinemas" className="text-sm font-semibold text-[#f23b43] hover:text-white">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cinemaPreview.map((cinema) => (
              <Link
                key={cinema.id}
                href="/cinemas"
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
                    <span className={`cinema-chip ${cinema.isActive !== false ? 'border-emerald-500/30 text-emerald-300' : 'border-slate-500/30 text-slate-300'}`}>
                      {cinema.isActive !== false ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-base font-semibold text-white">{cinema.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{cinema.address}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {normalizeStringArray(cinema.facilities).slice(0, 3).map((facility) => (
                      <span key={facility} className="cinema-chip text-[11px]">{facility}</span>
                    ))}
                    {Array.isArray(cinema.screens) && cinema.screens.length ? (
                      <span className="cinema-chip text-[11px]">{cinema.screens.length} screens</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="cinema-section-title">Promotions</h2>
                <p className="cinema-muted mt-2">Small cards, quick offers, clear actions.</p>
              </div>
              <Link href="/offers" className="text-sm font-semibold text-[#f23b43] hover:text-white">See offers</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {promoMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] transition hover:-translate-y-0.5 hover:border-[#e50914]/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-transparent" />
                    <div className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                      {index % 2 === 0 ? 'Deal' : 'New'}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{normalizeStringArray(movie.genre).slice(0, 2).join(' / ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {comingSoon.length > 0 && (
            <div className="mt-14">
              <div className="mb-8">
                <h2 className="cinema-section-title">Coming Soon</h2>
                <p className="cinema-muted mt-2">Upcoming releases to watch for.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
                {comingSoon.slice(0, 4).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="cinema-card p-5">
            <p className="text-sm font-semibold text-white">Weekend Offer</p>
            <p className="mt-2 text-3xl font-semibold text-[#f5c451]">30% off</p>
            <p className="cinema-muted mt-2">Use WEEKEND30 on selected screenings.</p>
            <Link href="/movies" className="cinema-button-primary mt-5 w-full">Find Showtimes</Link>
          </div>

          <div className="cinema-card p-5">
            <h3 className="text-lg font-semibold text-white">Cinema Locations</h3>
            <div className="mt-4 space-y-3">
              {cinemas.slice(0, 5).map((cinema) => (
                <div key={cinema.id} className="rounded-xl border border-[#252a32] bg-[#101318] p-3">
                  <p className="font-medium text-white">{cinema.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {cinema.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="cinema-card-soft p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f26] text-[#e50914]">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="cinema-muted mt-2">{text}</p>
    </div>
  )
}
