'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/movie-card'
import MovieSlideshow from '@/components/movie-slideshow'
import { useApp } from '@/context/AppContext'
import { MapPin, Search, Ticket, Timer, Building2 } from 'lucide-react'

export default function Home() {
  const { nowShowing, comingSoon, movies, cinemas, searchMovies, selectedCity, setSelectedCity, cities } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof movies>([])

  useEffect(() => {
    const trimmed = query.trim()
    setResults(trimmed ? searchMovies(trimmed).slice(0, 6) : [])
  }, [query, searchMovies])

  const recommended = [...movies].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4)

  return (
    <div className="cinema-page">
      <MovieSlideshow movies={nowShowing.slice(0, 5)} />

      <section className="cinema-container relative z-20 -mt-14">
        <div className="cinema-card grid gap-4 p-4 md:grid-cols-[1fr_240px_auto] md:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by movie, genre, or director"
              className="h-12 w-full rounded-xl border border-[#252a32] bg-[#0f1217] pl-12 pr-4 text-sm text-white outline-none transition focus:border-[#e50914]"
            />
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-14 z-30 overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/40">
                {results.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#1b1f26]">
                    <img src={movie.poster} alt={movie.title} className="h-14 w-10 rounded-md object-cover" />
                    <div>
                      <p className="font-medium text-white">{movie.title}</p>
                      <p className="text-xs text-slate-500">{(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).slice(0, 2).join(' / ')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="h-12 rounded-xl border border-[#252a32] bg-[#0f1217] px-4 text-sm text-white outline-none transition focus:border-[#e50914]"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.name}>{city.name}</option>
            ))}
          </select>

          <Link href="/movies" className="cinema-button-primary h-12">
            <Ticket className="h-4 w-4" />
            Browse Movies
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {nowShowing.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#252a32] bg-[#101318] py-14">
        <div className="cinema-container grid gap-4 md:grid-cols-3">
          <InfoCard icon={<Timer className="h-5 w-5" />} title="Fast Booking" text="Pick a showtime, choose seats, and pay in a few clear steps." />
          <InfoCard icon={<Ticket className="h-5 w-5" />} title="Digital Tickets" text="Get booking details and a scannable ticket after checkout." />
          <InfoCard icon={<Building2 className="h-5 w-5" />} title="Local Cinemas" text="Browse available locations and screenings by city." />
        </div>
      </section>

      <section className="cinema-container grid gap-12 py-16 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="cinema-section-title">Recommended</h2>
              <p className="cinema-muted mt-2">Top rated choices for your next cinema night.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recommended.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {comingSoon.length > 0 && (
            <div className="mt-14">
              <div className="mb-8">
                <h2 className="cinema-section-title">Coming Soon</h2>
                <p className="cinema-muted mt-2">Upcoming releases to keep on your watchlist.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
            <p className="cinema-muted mt-2">Use code WEEKEND30 on selected screenings.</p>
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
