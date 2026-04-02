'use client'

import { useState, useEffect } from 'react'
import { showtimesAPI, moviesAPI, cinemasAPI } from '@/lib/api'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, Calendar, Clock, Users, CheckCircle, XCircle, Loader2, Film, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Showtime, Movie, Cinema } from '@/types'

interface ExtendedShowtime extends Showtime {
  movieTitle?: string
  cinemaName?: string
  screenName?: string
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ExtendedShowtime[]>([])
  const [filteredShowtimes, setFilteredShowtimes] = useState<ExtendedShowtime[]>([])
  const [movies, setMovies] = useState<{ id: string; title: string; duration?: number }[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedMovie, setSelectedMovie] = useState('')
  const [selectedCinema, setSelectedCinema] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingShowtime, setEditingShowtime] = useState<ExtendedShowtime | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewShowtime, setViewShowtime] = useState<ExtendedShowtime | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    screenId: '',
    date: '',
    startTime: '',
    endTime: '',
    price: 10,
    totalSeats: 100,
    status: 'selling' as Showtime['status']
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [showtimesRes, moviesRes, cinemasRes] = await Promise.all([
        showtimesAPI.getAll({}),
        moviesAPI.getAll({}),
        cinemasAPI.getAll()
      ])

      if (showtimesRes.success && showtimesRes.data?.showtimes) {
        const showtimesWithInfo: ExtendedShowtime[] = showtimesRes.data.showtimes.map((st: Showtime) => {
          const movie = moviesRes.data?.movies?.find((m: Movie) => m.id === st.movieId)
          const cinema = cinemasRes.data?.cinemas?.find((c: Cinema) => c.id === st.cinemaId)
          const cinemaScreens = typeof cinema?.screens === 'string' ? JSON.parse(cinema.screens || '[]') : (cinema?.screens || [])
          const screen = Array.isArray(cinemaScreens) ? cinemaScreens.find((s: any) => s.id === st.screenId) : null
          return {
            ...st,
            movieTitle: movie?.title || 'Unknown',
            cinemaName: cinema?.name || 'Unknown',
            screenName: screen?.name || 'Unknown'
          }
        })
        setShowtimes(showtimesWithInfo)
        setFilteredShowtimes(showtimesWithInfo)
      }

      if (moviesRes.success && moviesRes.data?.movies) {
        setMovies(moviesRes.data.movies)
      }

      if (cinemasRes.success && cinemasRes.data?.cinemas) {
        setCinemas(cinemasRes.data.cinemas)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
      console.error('Load data error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = showtimes.filter(showtime => {
      const matchesSearch = !searchTerm || 
        showtime.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.cinemaName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMovie = !selectedMovie || showtime.movieId === selectedMovie
      const matchesCinema = !selectedCinema || showtime.cinemaId === selectedCinema
      const matchesDate = !selectedDate || showtime.date === selectedDate
      
      return matchesSearch && matchesMovie && matchesCinema && matchesDate
    })
    setFilteredShowtimes(filtered)
  }, [searchTerm, selectedMovie, selectedCinema, selectedDate, showtimes])

  const getCinemaScreens = (cinema: Cinema | undefined) => {
    if (!cinema) return []
    return typeof cinema.screens === 'string' ? JSON.parse(cinema.screens || '[]') : (cinema.screens || [])
  }

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHour = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const movie = movies.find(m => m.id === formData.movieId)
      const duration = movie?.duration || 120
      const endTime = calculateEndTime(formData.startTime, duration)

      const showtimeData = {
        ...formData,
        endTime,
        availableSeats: formData.totalSeats
      }

      if (editingShowtime) {
        const response = await showtimesAPI.update(editingShowtime.id, showtimeData)
        if (response.success && response.data) {
          const movie = movies.find(m => m.id === response.data?.movieId)
          const cinema = cinemas.find(c => c.id === response.data?.cinemaId)
          const screens = getCinemaScreens(cinema)
          const screen = screens.find((s: any) => s.id === response.data?.screenId)
          setShowtimes(showtimes.map(s => 
            s.id === editingShowtime.id 
              ? { ...s, ...response.data, movieTitle: movie?.title, cinemaName: cinema?.name, screenName: screen?.name }
              : s
          ))
          setShowModal(false)
          setEditingShowtime(null)
        } else {
          setError(response.message || 'Failed to update showtime')
        }
      } else {
        const response = await showtimesAPI.create(showtimeData)
        if (response.success && response.data) {
          const movie = movies.find(m => m.id === response.data?.movieId)
          const cinema = cinemas.find(c => c.id === response.data?.cinemaId)
          const screens = getCinemaScreens(cinema)
          const screen = screens.find((s: any) => s.id === response.data?.screenId)
          setShowtimes([{ ...response.data, movieTitle: movie?.title, cinemaName: cinema?.name, screenName: screen?.name }, ...showtimes])
          setShowModal(false)
        } else {
          setError(response.message || 'Failed to create showtime')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await showtimesAPI.delete(id)
      if (response.success) {
        setShowtimes(showtimes.filter(s => s.id !== id))
        setDeleteConfirm(null)
      } else {
        setError(response.message || 'Failed to delete showtime')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete showtime')
    }
  }

  const handleUpdateStatus = async (id: string, status: Showtime['status']) => {
    try {
      const response = await showtimesAPI.update(id, { status })
      if (response.success) {
        setShowtimes(showtimes.map(s => s.id === id ? { ...s, status } : s))
        setViewShowtime(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status')
    }
  }

  const handleOpenCreate = () => {
    const firstMovie = movies[0]
    const firstCinema = cinemas[0]
    const firstCinemaScreens = firstCinema 
      ? (typeof firstCinema.screens === 'string' ? JSON.parse(firstCinema.screens || '[]') : (firstCinema.screens || []))
      : []
    const firstScreen = firstCinemaScreens[0]
    
    setEditingShowtime(null)
    setFormData({
      movieId: firstMovie?.id || '',
      cinemaId: firstCinema?.id || '',
      screenId: firstScreen?.id || '',
      date: new Date().toISOString().split('T')[0],
      startTime: '19:00',
      endTime: '',
      price: 10,
      totalSeats: 100,
      status: 'selling'
    })
    setShowModal(true)
  }

  const handleOpenEdit = (showtime: ExtendedShowtime) => {
    setEditingShowtime(showtime)
    setFormData({
      movieId: showtime.movieId,
      cinemaId: showtime.cinemaId,
      screenId: showtime.screenId,
      date: showtime.date,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
      price: showtime.price,
      totalSeats: showtime.totalSeats,
      status: showtime.status
    })
    setShowModal(true)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      selling: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold_out: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }
    const labels: Record<string, string> = {
      scheduled: 'Scheduled',
      selling: 'Selling',
      sold_out: 'Sold Out',
      cancelled: 'Cancelled',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.scheduled}`}>
        {labels[status] || status}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = ['Movie', 'Cinema', 'Screen', 'Date', 'Time', 'Price', 'Status']
    const rows = showtimes.map(s => [
      s.movieTitle || '',
      s.cinemaName || '',
      s.screenName || '',
      s.date,
      s.startTime,
      s.price,
      s.status
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'showtimes.csv'
    a.click()
  }

  const currentCinema = cinemas.find(c => c.id === formData.cinemaId)
  const currentCinemaScreens = currentCinema 
    ? (typeof currentCinema.screens === 'string' ? JSON.parse(currentCinema.screens || '[]') : (currentCinema.screens || []))
    : []
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

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
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Showtimes</h1>
          <p className="text-slate-400 mt-1">Manage movie schedules across all cinemas</p>
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
            Add Showtime
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search by movie or cinema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-xs mb-2">Movie</label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="">All Movies</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-2">Cinema</label>
              <select
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="">All Cinemas</option>
                {cinemas.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-2">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Showtimes</p>
                <p className="text-xl font-bold text-white">{filteredShowtimes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Active Shows</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.filter(s => s.status === 'selling').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sold Out</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.filter(s => s.status === 'sold_out').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Available Seats</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.reduce((acc, s) => acc + (s.availableSeats || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Showtimes List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Movie</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Cinema</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Screen</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Date</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Time</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Price</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Seats</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Status</th>
                  <th className="text-right text-slate-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShowtimes.map((showtime) => {
                  const occupancy = showtime.totalSeats > 0 
                    ? ((showtime.totalSeats - (showtime.availableSeats || 0)) / showtime.totalSeats * 100).toFixed(0)
                    : 0
                  
                  return (
                    <tr key={showtime.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                            <Film className="w-5 h-5 text-orange-500" />
                          </div>
                          <p className="text-white font-medium">{showtime.movieTitle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          {showtime.cinemaName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {showtime.screenName || '-'}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {showtime.date ? new Date(showtime.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-500" />
                          {showtime.startTime} - {showtime.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-orange-400 font-semibold">${showtime.price}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-slate-300">{showtime.availableSeats || 0} / {showtime.totalSeats}</p>
                          <div className="w-24 h-2 bg-slate-700 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full ${
                                parseInt(occupancy as string) > 80 ? 'bg-red-500' : 
                                parseInt(occupancy as string) > 50 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(showtime.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewShowtime(showtime)}
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(showtime)}
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {deleteConfirm === showtime.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(showtime.id)}
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
                              onClick={() => setDeleteConfirm(showtime.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredShowtimes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mb-4" />
              <p>No showtimes found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingShowtime ? 'Edit Showtime' : 'Create New Showtime'}
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Movie</label>
                  <select
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select Movie</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Cinema</label>
                  <select
                    value={formData.cinemaId}
                    onChange={(e) => {
                      const cinema = cinemas.find(c => c.id === e.target.value)
                      const screens = getCinemaScreens(cinema)
                      setFormData({ 
                        ...formData, 
                        cinemaId: e.target.value,
                        screenId: screens[0]?.id || ''
                      })
                    }}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select Cinema</option>
                    {cinemas.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Screen</label>
                  <select
                    value={formData.screenId}
                    onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select Screen</option>
                    {currentCinemaScreens.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Start Time</label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Price ($)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Total Seats</label>
                    <Input
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Showtime['status'] })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="selling">Selling</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingShowtime ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {viewShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Showtime Details
                <button onClick={() => setViewShowtime(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Movie</p>
                  <p className="text-white font-medium">{viewShowtime.movieTitle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Cinema</p>
                  <p className="text-white font-medium">{viewShowtime.cinemaName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Screen</p>
                  <p className="text-white font-medium">{viewShowtime.screenName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Date</p>
                  <p className="text-white font-medium">{viewShowtime.date ? new Date(viewShowtime.date).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Time</p>
                  <p className="text-white font-medium">{viewShowtime.startTime} - {viewShowtime.endTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Price</p>
                  <p className="text-orange-400 font-medium">${viewShowtime.price}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Available Seats</p>
                  <p className="text-white font-medium">{viewShowtime.availableSeats || 0} / {viewShowtime.totalSeats}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  {getStatusBadge(viewShowtime.status)}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                {viewShowtime.status !== 'selling' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(viewShowtime.id, 'selling')}
                    className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    Start Selling
                  </Button>
                )}
                {viewShowtime.status === 'selling' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(viewShowtime.id, 'sold_out')}
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Mark Sold Out
                  </Button>
                )}
                <Button
                  onClick={() => {
                    handleOpenEdit(viewShowtime)
                    setViewShowtime(null)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}