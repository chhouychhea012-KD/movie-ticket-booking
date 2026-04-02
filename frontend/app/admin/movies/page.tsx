'use client'

import { useState, useEffect } from 'react'
import { moviesAPI } from '@/lib/api'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, Star, Calendar, Clock, Film, Clapperboard, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Movie } from '@/types'

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Fantasy', 'Adventure', 'Mystery']
const languages = ['English', 'Thai', 'Japanese', 'Korean', 'Chinese', 'Hindi', 'French', 'Spanish']
const ageRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17']

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMovie, setViewMovie] = useState<Movie | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    genre: 'Action' as string,
    rating: 7.5,
    duration: 120,
    releaseDate: '',
    synopsis: '',
    status: 'coming_soon' as Movie['status'],
    director: '',
    cast: '',
    language: 'English',
    ageRating: 'PG-13',
    poster: '',
    trailerUrl: '',
    isFeatured: false
  })

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await moviesAPI.getAll({})
      if (response.success && response.data?.movies) {
        const parsedMovies = response.data.movies.map((m: any) => ({
          ...m,
          genre: typeof m.genre === 'string' ? JSON.parse(m.genre || '[]') : m.genre || [],
          cast: typeof m.cast === 'string' ? JSON.parse(m.cast || '[]') : m.cast || []
        }))
        setMovies(parsedMovies)
        setFilteredMovies(parsedMovies)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  useEffect(() => {
    let filtered = movies.filter(movie =>
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (genreFilter !== 'all') {
      filtered = filtered.filter(m => {
        const genreArray = Array.isArray(m.genre) ? m.genre : []
        return genreArray.some((g: string) => g.toLowerCase() === genreFilter.toLowerCase())
      })
    }

    setFilteredMovies(filtered)
  }, [searchTerm, genreFilter, movies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const castArray = formData.cast.split(',').map(s => s.trim()).filter(s => s)
      
      const movieData = {
        title: formData.title,
        genre: [formData.genre],
        rating: formData.rating,
        duration: formData.duration,
        releaseDate: formData.releaseDate,
        synopsis: formData.synopsis,
        status: formData.status,
        director: formData.director,
        cast: castArray,
        language: formData.language,
        ageRating: formData.ageRating,
        poster: formData.poster || '/movie-poster-placeholder.jpg',
        trailerUrl: formData.trailerUrl,
        isFeatured: formData.isFeatured
      }

      if (editingMovie) {
        const response = await moviesAPI.update(editingMovie.id, movieData)
        if (response.success && response.data) {
          const parsed = {
            ...response.data,
            genre: typeof response.data.genre === 'string' ? JSON.parse(response.data.genre) : response.data.genre,
            cast: typeof response.data.cast === 'string' ? JSON.parse(response.data.cast) : response.data.cast
          }
          setMovies(movies.map(m => m.id === editingMovie.id ? parsed : m))
          setShowModal(false)
          setEditingMovie(null)
        } else {
          setError(response.message || 'Failed to update movie')
        }
      } else {
        const response = await moviesAPI.create(movieData)
        if (response.success && response.data) {
          const parsed = {
            ...response.data,
            genre: typeof response.data.genre === 'string' ? JSON.parse(response.data.genre) : response.data.genre,
            cast: typeof response.data.cast === 'string' ? JSON.parse(response.data.cast) : response.data.cast
          }
          setMovies([parsed, ...movies])
          setShowModal(false)
        } else {
          setError(response.message || 'Failed to create movie')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await moviesAPI.delete(id)
      if (response.success) {
        setMovies(movies.filter(m => m.id !== id))
        setDeleteConfirm(null)
      } else {
        setError(response.message || 'Failed to delete movie')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete movie')
    }
  }

  const handleOpenCreate = () => {
    setEditingMovie(null)
    setFormData({
      title: '',
      genre: 'Action',
      rating: 7.5,
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      synopsis: '',
      status: 'coming_soon',
      director: '',
      cast: '',
      language: 'English',
      ageRating: 'PG-13',
      poster: '',
      trailerUrl: '',
      isFeatured: false
    })
    setShowModal(true)
  }

  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie)
    const genreArray = Array.isArray(movie.genre) ? movie.genre : []
    const castArray = Array.isArray(movie.cast) ? movie.cast : []
    setFormData({
      title: movie.title || '',
      genre: genreArray[0] || 'Action',
      rating: movie.rating || 7.5,
      duration: movie.duration || 120,
      releaseDate: movie.releaseDate || '',
      synopsis: movie.synopsis || '',
      status: movie.status || 'coming_soon',
      director: movie.director || '',
      cast: castArray.join(', '),
      language: movie.language || 'English',
      ageRating: movie.ageRating || 'PG-13',
      poster: movie.poster || '',
      trailerUrl: movie.trailerUrl || '',
      isFeatured: movie.isFeatured || false
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'now_showing': return 'Now Showing'
      case 'coming_soon': return 'Coming Soon'
      case 'ended': return 'Ended'
      default: return status
    }
  }

  const exportToCSV = () => {
    const headers = ['Title', 'Genre', 'Rating', 'Duration', 'Release Date', 'Status', 'Director']
    const rows = movies.map(m => [
      m.title,
      Array.isArray(m.genre) ? m.genre.join(', ') : '',
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

  const avgRating = movies.length > 0 ? (movies.reduce((s, m) => s + (m.rating || 0), 0) / movies.length).toFixed(1) : '0'

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Movies</h1>
          <p className="text-slate-400 mt-1">Manage your movie catalog</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleOpenCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search movies by title or director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/80 border-slate-700/50 text-white placeholder:text-slate-500"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white"
        >
          <option value="all">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

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
                <p className="text-xl font-bold text-white">{avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => {
            const genreArray = Array.isArray(movie.genre) ? movie.genre : []
            return (
              <div 
                key={movie.id} 
                className="group relative bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-48 overflow-hidden bg-slate-700/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-yellow-400 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {movie.rating}
                    </span>
                    <span className={`px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-xs border ${getStatusColor(movie.status)}`}>
                      {getStatusLabel(movie.status)}
                    </span>
                  </div>
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
                    <Film className="w-16 h-16 text-slate-500" />
                  </div>
                </div>

                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
                    <span className="shrink-0 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                      {genreArray.join(', ')}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{movie.synopsis}</p>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-xs mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {movie.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : '-'}
                    </span>
                    <span className="text-orange-400">{movie.ageRating}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setViewMovie(movie)}
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(movie)}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {deleteConfirm === movie.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(movie.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(null)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(movie.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No movies found</p>
        </div>
      )}

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
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Genre</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
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
                    <Input
                      type="text"
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Cast (comma separated)</label>
                    <Input
                      type="text"
                      value={formData.cast}
                      onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                      placeholder="Actor 1, Actor 2"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Duration (min)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Rating</label>
                    <Input
                      type="number"
                      step="0.1"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Age Rating</label>
                    <select
                      value={formData.ageRating}
                      onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
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
                    <Input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Movie['status'] })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="coming_soon">Coming Soon</option>
                    <option value="now_showing">Now Showing</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Poster URL</label>
                    <Input
                      type="text"
                      value={formData.poster}
                      onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                      placeholder="/movie-poster.jpg"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Trailer URL</label>
                    <Input
                      type="text"
                      value={formData.trailerUrl}
                      onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600"
                  />
                  <label htmlFor="isFeatured" className="text-slate-300 text-sm">Feature this movie</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingMovie ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

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
                  {Array.isArray(viewMovie.genre) ? viewMovie.genre.join(', ') : ''}
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" /> {viewMovie.rating}
                </span>
                <span className={`px-2 py-1 rounded-lg text-sm border ${getStatusColor(viewMovie.status)}`}>
                  {getStatusLabel(viewMovie.status)}
                </span>
              </div>
              
              <div>
                <p className="text-slate-400 text-xs mb-1">Synopsis</p>
                <p className="text-white">{viewMovie.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Director</p>
                  <p className="text-white">{viewMovie.director || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Cast</p>
                  <p className="text-white">{Array.isArray(viewMovie.cast) ? viewMovie.cast.join(', ') : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Duration</p>
                  <p className="text-white">{viewMovie.duration} minutes</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Release Date</p>
                  <p className="text-white">{viewMovie.releaseDate ? new Date(viewMovie.releaseDate).toLocaleDateString() : '-'}</p>
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

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => {
                    handleOpenEdit(viewMovie)
                    setViewMovie(null)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Movie
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}