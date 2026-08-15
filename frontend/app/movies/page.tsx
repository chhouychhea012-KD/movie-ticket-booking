'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { Check, Grid, Languages, List, Search, SlidersHorizontal, Star, Calendar, TrendingUp, X } from 'lucide-react'
import MovieCard from '@/components/movie-card'
import { Movie } from '@/types'
import { normalizeStringArray } from '@/lib/utils'

export default function MoviesPage() {
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
  const sortOptions = [
    { value: 'release', label: 'Newest release' },
    { value: 'rating', label: 'Highest rating' },
    { value: 'title', label: 'Title A-Z' },
  ] as const

  useEffect(() => {
    let results = searchQuery ? searchMovies(searchQuery) : nowShowing
    
    // Apply genre filter
    if (selectedGenres.length > 0) {
      results = results.filter(m => normalizeStringArray(m.genre).some(g => selectedGenres.includes(g)))
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
  const genreCounts = genres.reduce<Record<string, number>>((counts, genre) => {
    counts[genre] = movies.filter((movie) =>
      normalizeStringArray(movie.genre).includes(genre)
    ).length
    return counts
  }, {})
  const languageCounts = languages.reduce<Record<string, number>>((counts, language) => {
    counts[language] = movies.filter((movie) => movie.language === language).length
    return counts
  }, {})

  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre]
    )
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((current) =>
      current.includes(language) ? current.filter((item) => item !== language) : [...current, language]
    )
  }

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
                className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-slate-700/50 p-2 transition hover:bg-slate-700"
                aria-label="Open movie filters"
              >
                <SlidersHorizontal className="w-5 h-5 text-slate-400" />
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e50914] px-1 text-[11px] font-semibold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Active Filters */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#252a32] bg-[#101318] p-3">
            <span className="px-1 text-sm font-medium text-slate-400">Active filters</span>
            {searchQuery && (
              <span className="flex items-center gap-2 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-3 py-1.5 text-sm text-white">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGenres.map(genre => (
              <span key={genre} className="flex items-center gap-2 rounded-full border border-[#252a32] bg-[#1b1f26] px-3 py-1.5 text-sm text-slate-200">
                {genre}
                <button onClick={() => setSelectedGenres(selectedGenres.filter(g => g !== genre))}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {selectedLanguages.map(lang => (
              <span key={lang} className="flex items-center gap-2 rounded-full border border-[#252a32] bg-[#1b1f26] px-3 py-1.5 text-sm text-slate-200">
                {lang}
                <button onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {selectedRating > 0 && (
              <span className="flex items-center gap-2 rounded-full border border-[#f5c451]/30 bg-[#f5c451]/10 px-3 py-1.5 text-sm text-[#f5c451]">
                Rating: {selectedRating}+
                <button onClick={() => setSelectedRating(0)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="ml-auto rounded-full px-3 py-1.5 text-sm font-semibold text-[#f23b43] transition hover:bg-[#1b1f26] hover:text-white">
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="hidden lg:block">
            <div className="cinema-card sticky top-24 overflow-hidden p-0">
              <div className="border-b border-[#252a32] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f26] text-[#e50914]">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Filters</h3>
                      <p className="text-xs text-slate-500">Refine your movie list</p>
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-[#e50914] px-2.5 py-1 text-xs font-semibold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 p-5">
                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-12 w-full rounded-xl border border-[#252a32] bg-[#101318] px-4 text-sm font-medium text-white outline-none transition focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
                >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
              </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Genre</label>
                  <div className="grid grid-cols-2 gap-2">
                  {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`group flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm transition ${
                          selectedGenres.includes(genre)
                            ? 'border-[#e50914] bg-[#e50914]/15 text-white'
                            : 'border-[#252a32] bg-[#101318] text-slate-400 hover:border-[#343a46] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{genre}</span>
                        <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] ${
                          selectedGenres.includes(genre)
                            ? 'bg-[#e50914] text-white'
                            : 'bg-[#1b1f26] text-slate-500 group-hover:text-slate-300'
                        }`}>
                          {selectedGenres.includes(genre) ? <Check className="h-3 w-3" /> : genreCounts[genre]}
                        </span>
                      </button>
                  ))}
                </div>
              </div>

                <div>
                  <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Languages className="h-3.5 w-3.5" />
                    Language
                  </label>
                  <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          selectedLanguages.includes(lang)
                            ? 'border-[#e50914] bg-[#e50914] text-white'
                            : 'border-[#252a32] bg-[#101318] text-slate-400 hover:border-[#343a46] hover:text-white'
                        }`}
                      >
                        {lang}
                        <span className="ml-2 text-xs opacity-60">{languageCounts[lang]}</span>
                      </button>
                  ))}
                </div>
              </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum Rating</label>
                  <div className="grid grid-cols-3 gap-2">
                  {[7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                        className={`flex min-h-12 items-center justify-center gap-1.5 rounded-xl border text-sm font-semibold transition ${
                        selectedRating === rating
                            ? 'border-[#e50914] bg-[#e50914] text-white'
                            : 'border-[#252a32] bg-[#101318] text-slate-400 hover:border-[#343a46] hover:text-white'
                      }`}
                    >
                        <Star className={`h-3.5 w-3.5 ${selectedRating === rating ? 'fill-current' : ''}`} />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

                <div className="rounded-2xl border border-[#252a32] bg-[#101318] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{filteredMovies.length} movies</p>
                      <p className="text-xs text-slate-500">match your filters</p>
                    </div>
              <button
                onClick={clearFilters}
                      className="rounded-xl bg-[#1b1f26] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-[#252a32] hover:text-white"
              >
                      Reset
              </button>
                  </div>
                </div>
              </div>
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
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-3 backdrop-blur-sm lg:hidden sm:items-center sm:justify-center sm:p-4">
          <div className="w-full max-h-[88vh] max-w-md overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-[#252a32] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f26] text-[#e50914]">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <p className="text-xs text-slate-500">{filteredMovies.length} movies available</p>
                </div>
              </div>
              <button onClick={() => setShowFilters(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-[#1b1f26] hover:text-white" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-150px)] space-y-6 overflow-y-auto p-5">
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-12 w-full rounded-xl border border-[#252a32] bg-[#101318] px-4 text-sm font-medium text-white outline-none focus:border-[#e50914]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Genre</label>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm transition ${
                        selectedGenres.includes(genre)
                          ? 'border-[#e50914] bg-[#e50914]/15 text-white'
                          : 'border-[#252a32] bg-[#101318] text-slate-400'
                      }`}
                    >
                      <span className="truncate">{genre}</span>
                      <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] ${
                        selectedGenres.includes(genre) ? 'bg-[#e50914] text-white' : 'bg-[#1b1f26] text-slate-500'
                      }`}>
                        {selectedGenres.includes(genre) ? <Check className="h-3 w-3" /> : genreCounts[genre]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Languages className="h-3.5 w-3.5" />
                  Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        selectedLanguages.includes(lang)
                          ? 'border-[#e50914] bg-[#e50914] text-white'
                          : 'border-[#252a32] bg-[#101318] text-slate-400'
                      }`}
                    >
                      {lang}
                      <span className="ml-2 text-xs opacity-60">{languageCounts[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum Rating</label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex min-h-12 items-center justify-center gap-1.5 rounded-xl border text-sm font-semibold transition ${
                        selectedRating === rating
                          ? 'border-[#e50914] bg-[#e50914] text-white'
                          : 'border-[#252a32] bg-[#101318] text-slate-400'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${selectedRating === rating ? 'fill-current' : ''}`} />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#252a32] p-4">
              <button
                onClick={clearFilters}
                className="flex-1 rounded-xl bg-[#1b1f26] py-3 font-semibold text-slate-300 transition hover:bg-[#252a32] hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-[#e50914] py-3 font-semibold text-white transition hover:bg-[#f23b43]"
              >
                Show {filteredMovies.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
