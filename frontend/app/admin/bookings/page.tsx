'use client'

import { useState, useEffect } from 'react'
import { bookingsAPI } from '@/lib/api'
import { Search, Download, Plus, X, Edit2, Trash2, Eye, Check, Ticket, Clock, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BookingData {
  id: string
  movieTitle: string
  movieId: string
  cinemaName: string
  cinemaId: string
  showtime: string
  showtimeId: string
  seats: any[]
  ticketPrice: number
  totalPrice: number
  discount?: number
  couponCode?: string
  paymentMethod: string
  paymentStatus: string
  status: string
  ticketCode: string
  bookingDate: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<BookingData | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<BookingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/bookings/all?limit=100`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()
      
      if (data.success && data.data?.bookings) {
        const parsedBookings = data.data.bookings.map((b: any) => ({
          ...b,
          seats: typeof b.seats === 'string' ? JSON.parse(b.seats || '[]') : b.seats || []
        }))
        setBookings(parsedBookings)
        setFilteredBookings(parsedBookings)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(booking =>
      booking.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cinemaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, bookings])

  const handleCancelBooking = async (id: string) => {
    try {
      const response = await bookingsAPI.updateStatus(id, 'cancelled')
      if (response.success) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
        setViewBooking(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await bookingsAPI.cancel(id)
      if (response.success) {
        setBookings(bookings.filter(b => b.id !== id))
        setDeleteConfirm(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking')
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await bookingsAPI.updateStatus(id, status)
      if (response.success) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
        setViewBooking(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'used': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'expired': return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const exportToCSV = () => {
    const headers = ['Movie', 'Cinema', 'Showtime', 'Seats', 'Total', 'Status', 'Date', 'Ticket Code']
    const rows = bookings.map(b => [
      b.movieTitle,
      b.cinemaName,
      b.showtime,
      Array.isArray(b.seats) ? b.seats.map((s: any) => s.seatNumber || s).join(', ') : '',
      b.totalPrice,
      b.status,
      b.bookingDate,
      b.ticketCode
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
  }

  const totalRevenue = bookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0)
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length
  const pendingCount = bookings.filter(b => b.status === 'pending').length

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
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">Search and manage all customer bookings</p>
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search by movie, cinema or ticket code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/80 border-slate-700/50 text-white placeholder:text-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="used">Used</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Ticket className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Bookings</p>
                <p className="text-xl font-bold text-white">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Confirmed</p>
                <p className="text-xl font-bold text-white">{confirmedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Revenue</p>
                <p className="text-xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pending</p>
                <p className="text-xl font-bold text-white">{pendingCount}</p>
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
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Movie</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Cinema</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Showtime</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Seats</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Total</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Status</th>
                    <th className="text-right text-slate-400 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const seatNumbers = Array.isArray(booking.seats) ? booking.seats.map((s: any) => s.seatNumber || s).join(', ') : ''
                    return (
                      <tr key={booking.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-white font-medium">{booking.movieTitle}</p>
                            <p className="text-slate-500 text-xs">{booking.ticketCode}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-300">{booking.cinemaName}</td>
                        <td className="px-4 py-4 text-slate-300">{booking.showtime}</td>
                        <td className="px-4 py-4 text-slate-300">{seatNumbers}</td>
                        <td className="px-4 py-4 text-orange-400 font-semibold">${booking.totalPrice}</td>
                        <td className="px-4 py-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewBooking(booking)}
                              className="text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {deleteConfirm === booking.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(booking.id)}
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Check className="w-4 h-4" />
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
                                onClick={() => setDeleteConfirm(booking.id)}
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

            {filteredBookings.length === 0 && (
              <div className="p-12 text-center">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Booking Details
                <button onClick={() => setViewBooking(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Movie</p>
                  <p className="text-white font-medium">{viewBooking.movieTitle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Cinema</p>
                  <p className="text-white font-medium">{viewBooking.cinemaName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Showtime</p>
                  <p className="text-white font-medium">{viewBooking.showtime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Seats</p>
                  <p className="text-white font-medium">{Array.isArray(viewBooking.seats) ? viewBooking.seats.map((s: any) => s.seatNumber || s).join(', ') : ''}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Ticket Price</p>
                  <p className="text-white font-medium">${viewBooking.ticketPrice}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Total Price</p>
                  <p className="text-orange-400 font-medium">${viewBooking.totalPrice}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Ticket Code</p>
                  <p className="text-white font-medium">{viewBooking.ticketCode}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Booking Date</p>
                  <p className="text-white font-medium">{viewBooking.bookingDate ? new Date(viewBooking.bookingDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Payment Method</p>
                  <p className="text-white font-medium">{viewBooking.paymentMethod || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <Badge className={getStatusColor(viewBooking.status)}>
                    {getStatusLabel(viewBooking.status)}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                {viewBooking.status === 'confirmed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancelBooking(viewBooking.id)}
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel Booking
                  </Button>
                )}
                {viewBooking.status === 'pending' && (
                  <Button
                    onClick={() => handleUpdateStatus(viewBooking.id, 'confirmed')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Confirm Booking
                  </Button>
                )}
                {viewBooking.status === 'confirmed' && (
                  <Button
                    onClick={() => handleUpdateStatus(viewBooking.id, 'completed')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}