'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, Star, Calendar, Clock, Film, Clapperboard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Movie {
  id: string
  title: string
  genre: string
  rating: number
  duration: number
  poster: string
  releaseDate: string
  synopsis: string
  showtimes: string[]
  status: 'now_showing' | 'coming_soon' | 'ended'
  director: string
  cast: string[]
  language: string
  ageRating: string
}

// Generate initial movies
const generateInitialMovies = (): Movie[] => {
  return [
    {
      id: '1',
      title: 'Dune: Part Two',
      genre: 'Sci-Fi',
      rating: 8.5,
      duration: 148,
      poster: '',
      releaseDate: '2024-03-15',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
      showtimes: ['10:00 AM', '1:30 PM', '4:00 PM', '7:00 PM', '9:30 PM'],
      status: 'now_showing',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
      language: 'English',
      ageRating: 'PG-13'
    },
    {
      id: '2',
      title: 'The Batman',
      genre: 'Action',
      rating: 8.2,
      duration: 176,
      poster: '',
      releaseDate: '2024-03-04',
      synopsis: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s corruption.',
      showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:00 PM'],
      status: 'now_showing',
      director: 'Matt Reeves',
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
      language: 'English',
      ageRating: 'PG-13'
    },
    {
      id: '3',
      title: 'Oppenheimer',
      genre: 'Drama',
      rating: 8.4,
      duration: 180,
      poster: '',
      releaseDate: '2024-03-01',
      synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '8:30 PM'],
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'],
      language: 'English',
      ageRating: 'R'
    },
    {
      id: '4',
      title: 'Barbie',
      genre: 'Comedy',
      rating: 7.8,
      duration: 114,
      poster: '',
      releaseDate: '2024-03-10',
      synopsis: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
      showtimes: ['1:00 PM', '4:00 PM', '7:00 PM'],
      status: 'now_showing',
      director: 'Greta Gerwig',
      cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'],
      language: 'English',
      ageRating: 'PG-13'
    },
    {
      id: '5',
      title: 'Spider-Man: ATSV',
      genre: 'Animation',
      rating: 8.6,
      duration: 140,
      poster: '',
      releaseDate: '2024-03-20',
      synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      showtimes: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
      status: 'now_showing',
      director: 'Joaquim Dos Santos',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry'],
      language: 'English',
      ageRating: 'PG'
    }
  ]
}

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Fantasy']
const languages = ['English', 'Thai', 'Japanese', 'Korean', 'Chinese', 'Hindi']
const ageRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17']

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMovie, setViewMovie] = useState<Movie | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Action',
    rating: 7.5,
    duration: 120,
    releaseDate: '',
    synopsis: '',
    status: 'now_showing' as Movie['status'],
    director: '',
    cast: '',
    language: 'English',
    ageRating: 'PG-13',
    showtimes: ''
  })

  useEffect(() => {
    const storedMovies = localStorage.getItem('movies')
    if (storedMovies) {
      const parsed = JSON.parse(storedMovies)
      setMovies(parsed)
      setFilteredMovies(parsed)
    } else {
      const initial = generateInitialMovies()
      setMovies(initial)
      setFilteredMovies(initial)
      localStorage.setItem('movies', JSON.stringify(initial))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (genreFilter !== 'all') {
      filtered = filtered.filter(m => m.genre === genreFilter)
    }

    setFilteredMovies(filtered)
  }, [searchTerm, genreFilter, movies])

  // Save to localStorage
  const saveMovies = (updatedMovies: Movie[]) => {
    setMovies(updatedMovies)
    setFilteredMovies(updatedMovies)
    localStorage.setItem('movies', JSON.stringify(updatedMovies))
  }

  // Handle create/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const showtimesArray = formData.showtimes.split(',').map(s => s.trim()).filter(s => s)
    const castArray = formData.cast.split(',').map(s => s.trim()).filter(s => s)
    
    if (editingMovie) {
      // Update existing
      const updated = movies.map(m =>
        m.id === editingMovie.id
          ? {
              ...m,
              title: formData.title,
              genre: formData.genre,
              rating: formData.rating,
              duration: formData.duration,
              releaseDate: formData.releaseDate,
              synopsis: formData.synopsis,
              status: formData.status,
              director: formData.director,
              cast: castArray,
              language: formData.language,
              ageRating: formData.ageRating,
              showtimes: showtimesArray
            }
          : m
      )
      saveMovies(updated)
    } else {
      // Create new
      const newMovie: Movie = {
        id: Date.now().toString(),
        title: formData.title,
        genre: formData.genre,
        rating: formData.rating,
        duration: formData.duration,
        poster: '',
        releaseDate: formData.releaseDate,
        synopsis: formData.synopsis,
        status: formData.status,
        director: formData.director,
        cast: castArray,
        language: formData.language,
        ageRating: formData.ageRating,
        showtimes: showtimesArray
      }
      saveMovies([...movies, newMovie])
    }
    
    setShowModal(false)
    setEditingMovie(null)
  }

  // Handle delete
  const handleDelete = (id: string) => {
    const updated = movies.filter(m => m.id !== id)
    saveMovies(updated)
    setDeleteConfirm(null)
  }

  // Open create modal
  const handleOpenCreate = () => {
    setEditingMovie(null)
    setFormData({
      title: '',
      genre: 'Action',
      rating: 7.5,
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      synopsis: '',
      status: 'now_showing',
      director: '',
      cast: '',
      language: 'English',
      ageRating: 'PG-13',
      showtimes: '10:00 AM, 2:00 PM, 6:00 PM'
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      synopsis: movie.synopsis,
      status: movie.status,
      director: movie.director,
      cast: movie.cast.join(', '),
      language: movie.language,
      ageRating: movie.ageRating,
      showtimes: movie.showtimes.join(', ')
    })
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'now_showing':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'coming_soon':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ended':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Title', 'Genre', 'Rating', 'Duration', 'Release Date', 'Status', 'Director']
    const rows = movies.map(m => [
      m.title,
      m.genre,
      m.rating,
      m.duration,
      m.releaseDate,
      m.status,
      m.director
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'movies.csv'
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Movies</h1>
          <p className="text-slate-400 mt-1">Manage your movie catalog</p>
        </div>
        
        {/* Search and Add */}
        <div className="flex items-center gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-slate-300 text-sm transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Movie</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search movies by title or director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
        >
          <option value="all">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Film className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Movies</p>
                <p className="text-xl font-bold text-white">{movies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clapperboard className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Now Showing</p>
                <p className="text-xl font-bold text-white">{movies.filter(m => m.status === 'now_showing').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Coming Soon</p>
                <p className="text-xl font-bold text-white">{movies.filter(m => m.status === 'coming_soon').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Avg Rating</p>
                <p className="text-xl font-bold text-white">{(movies.reduce((s, m) => s + m.rating, 0) / movies.length).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="group relative bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Poster */}
              <div className="relative h-48 overflow-hidden bg-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-yellow-400 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.rating}
                  </span>
                  <span className={`px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-xs border ${getStatusColor(movie.status)}`}>
                    {movie.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
                  <Film className="w-16 h-16 text-slate-500" />
                </div>
              </div>

              {/* Content */}
              <div className="relative p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
                  <span className="shrink-0 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                    {movie.genre}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{movie.synopsis}</p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-slate-500 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {movie.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </span>
                  <span className="text-orange-400">{movie.ageRating}</span>
                </div>

                {/* Showtimes */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {movie.showtimes.slice(0, 4).map((time, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {time}
                    </span>
                  ))}
                  {movie.showtimes.length > 4 && (
                    <span className="px-2 py-1 text-slate-500 text-xs">
                      +{movie.showtimes.length - 4} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMovie(movie)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(movie)}
                    className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {deleteConfirm === movie.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirm(movie.id)}
                      className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No movies found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingMovie ? 'Edit Movie' : 'Create New Movie'}
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Genre</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Synopsis</label>
                  <textarea
                    value={formData.synopsis}
                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Director</label>
                    <input
                      type="text"
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Cast (comma separated)</label>
                    <input
                      type="text"
                      value={formData.cast}
                      onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                      placeholder="Actor 1, Actor 2"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Age Rating</label>
                    <select
                      value={formData.ageRating}
                      onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      {ageRatings.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Release Date</label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Showtimes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.showtimes}
                    onChange={(e) => setFormData({ ...formData, showtimes: e.target.value })}
                    placeholder="10:00 AM, 2:00 PM, 6:00 PM"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                  >
                    {editingMovie ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {viewMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {viewMovie.title}
                <button onClick={() => setViewMovie(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium">
                  {viewMovie.genre}
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" /> {viewMovie.rating}
                </span>
                <span className={`px-2 py-1 rounded-lg text-sm border ${getStatusColor(viewMovie.status)}`}>
                  {viewMovie.status.replace('_', ' ')}
                </span>
              </div>
              
              <div>
                <p className="text-slate-400 text-xs mb-1">Synopsis</p>
                <p className="text-white">{viewMovie.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Director</p>
                  <p className="text-white">{viewMovie.director}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Cast</p>
                  <p className="text-white">{viewMovie.cast.join(', ')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Duration</p>
                  <p className="text-white">{viewMovie.duration} minutes</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Release Date</p>
                  <p className="text-white">{new Date(viewMovie.releaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Language</p>
                  <p className="text-white">{viewMovie.language}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Age Rating</p>
                  <p className="text-white">{viewMovie.ageRating}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Showtimes</p>
                <div className="flex flex-wrap gap-2">
                  {viewMovie.showtimes.map((time, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    handleOpenEdit(viewMovie)
                    setViewMovie(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Movie
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
