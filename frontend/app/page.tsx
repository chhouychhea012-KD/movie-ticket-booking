'use client'

import { useState, useEffect } from 'react'
import MovieCard from '@/components/movie-card'
import MovieSlideshow from '@/components/movie-slideshow'
import { useApp } from '@/context/AppContext'
import { Search, TrendingUp, Calendar, Play } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { nowShowing, comingSoon, searchMovies, selectedCity } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    if (searchQuery) {
      const results = searchMovies(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchMovies])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Slideshow */}
      <MovieSlideshow movies={nowShowing.slice(0, 5)} autoPlayInterval={5000} />

      <div className="max-w-7xl mx-auto px-4 pb-16 -mt-8 relative z-30">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/90 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition shadow-xl backdrop-blur-sm"
            />
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl z-50">
                {searchResults.slice(0, 5).map(movie => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-slate-700/50 transition"
                  >
                    <div className="w-10 h-14 bg-slate-700 rounded overflow-hidden">
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-slate-400 text-sm">{movie.genre.join(', ')}</p>
                    </div>
                  </Link>
                ))}
                <Link href="/movies" className="block p-3 text-center text-orange-500 hover:bg-slate-700/50 border-t border-slate-700/50">
                  View all results
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/movies" className="group bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/50 transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition">
                <Play className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Now Showing</h3>
                <p className="text-slate-400 text-sm">{nowShowing.length} movies</p>
              </div>
            </div>
          </Link>
          
          <Link href="/bookings" className="group bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">My Bookings</h3>
                <p className="text-slate-400 text-sm">View tickets</p>
              </div>
            </div>
          </Link>

          <Link href="/movies" className="group bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Trending</h3>
                <p className="text-slate-400 text-sm">Top rated</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Now Showing */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Now Showing</h2>
              <p className="text-slate-400 mt-1">Book your tickets now</p>
            </div>
            <Link href="/movies" className="text-orange-500 hover:text-orange-400 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nowShowing.slice(0, 8).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Coming Soon</h2>
                <p className="text-slate-400 mt-1">Get ready for upcoming movies</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.slice(0, 4).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
