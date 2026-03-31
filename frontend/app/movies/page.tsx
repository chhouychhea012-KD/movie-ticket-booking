'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { Search, Filter, Star, Calendar, Clock, TrendingUp, Heart, Grid, List, SlidersHorizontal, X } from 'lucide-react'
import MovieCard from '@/components/movie-card'
import { Movie } from '@/types'

export default function MoviesPage() {
  const router = useRouter()
  const { movies, nowShowing, comingSoon, searchMovies, selectedCity } = useApp()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'rating' | 'release' | 'title'>('release')

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy']
  const languages = ['English', 'Khmer', 'Chinese', 'Thai', 'Korean', 'Japanese']

  useEffect(() => {
    let results = searchQuery ? searchMovies(searchQuery) : nowShowing
    
    // Apply genre filter
    if (selectedGenres.length > 0) {
      results = results.filter(m => m.genre.some(g => selectedGenres.includes(g)))
    }
    
    // Apply language filter
    if (selectedLanguages.length > 0) {
      results = results.filter(m => selectedLanguages.includes(m.language))
    }
    
    // Apply rating filter
    if (selectedRating > 0) {
      results = results.filter(m => m.rating >= selectedRating)
    }
    
    // Sort
    if (sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'title') {
      results = [...results].sort((a, b) => a.title.localeCompare(b.title))
    } else {
      results = [...results].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    }
    
    setFilteredMovies(results)
  }, [searchQuery, selectedGenres, selectedLanguages, selectedRating, sortBy, movies, searchMovies, nowShowing])

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedLanguages([])
    setSelectedRating(0)
    setSearchQuery('')
  }

  const activeFiltersCount = selectedGenres.length + selectedLanguages.length + (selectedRating > 0 ? 1 : 0)

  // Trending movies (mock - based on rating)
  const trendingMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Movies in {selectedCity}
            </h1>
            <p className="text-slate-400 text-lg">Discover and book tickets for the latest movies</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title, genre, or actor..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-lg"
              />
              <button
                onClick={() => setShowFilters(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition"
              >
                <SlidersHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Active Filters */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-slate-400 text-sm">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-2">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGenres.map(genre => (
              <span key={genre} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                {genre}
                <button onClick={() => setSelectedGenres(selectedGenres.filter(g => g !== genre))}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {selectedLanguages.map(lang => (
              <span key={lang} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2">
                {lang}
                <button onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {selectedRating > 0 && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-2">
                Rating: {selectedRating}+
                <button onClick={() => setSelectedRating(0)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-orange-500 hover:text-orange-400 text-sm">
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="hidden lg:block">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="release">Release Date</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-3">Genre</label>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => setSelectedGenres(
                          selectedGenres.includes(genre)
                            ? selectedGenres.filter(g => g !== genre)
                            : [...selectedGenres, genre]
                        )}
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-slate-300 text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-3">Language</label>
                <div className="space-y-2">
                  {languages.map(lang => (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => setSelectedLanguages(
                          selectedLanguages.includes(lang)
                            ? selectedLanguages.filter(l => l !== lang)
                            : [...selectedLanguages, lang]
                        )}
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-slate-300 text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-3">Minimum Rating</label>
                <div className="flex gap-2">
                  {[7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        selectedRating === rating
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? `Search Results (${filteredMovies.length})` : 'Now Showing'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-slate-700/50 text-slate-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-slate-700/50 text-slate-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No movies found</p>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Trending Section (when no search) */}
            {!searchQuery && activeFiltersCount === 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-white">Trending Movies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Coming Soon Section (when no search) */}
            {!searchQuery && activeFiltersCount === 0 && comingSoon.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comingSoon.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filters as sidebar - simplified for mobile */}
              <div>
                <label className="block text-slate-400 text-sm mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                >
                  <option value="release">Release Date</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-3">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenres(
                        selectedGenres.includes(genre)
                          ? selectedGenres.filter(g => g !== genre)
                          : [...selectedGenres, genre]
                      )}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        selectedGenres.includes(genre)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-3">Minimum Rating</label>
                <div className="flex gap-2">
                  {[7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        selectedRating === rating ? 'bg-orange-500 text-white' : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700/50 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}