'use client'

import { useCallback, useState, useEffect } from 'react'
import { bookingsAPI } from '@/lib/api'
import { Search, Download, X, Trash2, Eye, Check, Ticket, Clock, DollarSign, Loader2, RefreshCw } from 'lucide-react'
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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<BookingData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const parseBooking = (booking: any): BookingData => ({
    ...booking,
    seats: typeof booking.seats === 'string' ? JSON.parse(booking.seats || '[]') : booking.seats || []
  })

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingsAPI.getAdminAll({
        limit: 100,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })

      if (response.success && response.data?.bookings) {
        const parsedBookings = response.data.bookings.map(parseBooking)
        setBookings(parsedBookings)
        setFilteredBookings(parsedBookings)
      } else {
        setBookings([])
        setFilteredBookings([])
        setError(response.message || 'Failed to load bookings')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

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

  const applyBookingUpdate = (id: string, update: Partial<BookingData>) => {
    setBookings((current) => current.map((booking) => (
      booking.id === id ? { ...booking, ...update } : booking
    )))
    setViewBooking((current) => current?.id === id ? { ...current, ...update } : current)
  }

  const handleUpdateStatus = async (id: string, status: string, paymentStatus?: string) => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)
      const response = await bookingsAPI.updateStatus(id, status, paymentStatus)
      if (response.success) {
        const paymentUpdate = paymentStatus || (status === 'cancelled' ? 'refunded' : undefined)
        applyBookingUpdate(id, { status, ...(paymentUpdate ? { paymentStatus: paymentUpdate } : {}) })
        setSuccess(`Booking marked as ${getStatusLabel(status)}`)
      } else {
        setError(response.message || 'Failed to update booking status')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleteConfirm(null)
      await handleUpdateStatus(id, 'cancelled')
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking')
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
      case 'refunded': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const exportToCSV = () => {
    const headers = ['Movie', 'Cinema', 'Showtime', 'Seats', 'Total', 'Booking Status', 'Payment Status', 'Date', 'Ticket Code']
    const rows = filteredBookings.map(b => [
      b.movieTitle,
      b.cinemaName,
      b.showtime,
      Array.isArray(b.seats) ? b.seats.map((s: any) => s.seatNumber || s).join(', ') : '',
      b.totalPrice,
      b.status,
      b.paymentStatus,
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

  const totalRevenue = bookings.reduce((s, b) => (
    b.status !== 'cancelled' && b.paymentStatus === 'completed' ? s + (Number(b.totalPrice) || 0) : s
  ), 0)
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
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-300 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">Search and manage all customer bookings</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={loadBookings}
            disabled={loading}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={exportToCSV}
            disabled={filteredBookings.length === 0}
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
              <div className="min-w-0">
                <p className="text-slate-400 text-xs">Total Revenue</p>
                <p className="truncate text-xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
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
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Payment</th>
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
                          <Badge className={getStatusColor(booking.paymentStatus)}>
                            {getStatusLabel(booking.paymentStatus || 'pending')}
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
                                  disabled={isSubmitting || booking.status === 'cancelled'}
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
                                disabled={booking.status === 'cancelled' || isSubmitting}
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
                  <p className="text-white font-medium capitalize">{viewBooking.paymentMethod || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Booking Status</p>
                  <Badge className={getStatusColor(viewBooking.status)}>
                    {getStatusLabel(viewBooking.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Payment Status</p>
                  <Badge className={getStatusColor(viewBooking.paymentStatus)}>
                    {getStatusLabel(viewBooking.paymentStatus || 'pending')}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-2 pt-4 border-t border-slate-700 sm:grid-cols-2">
                {['pending', 'confirmed'].includes(viewBooking.status) && (
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => handleUpdateStatus(viewBooking.id, 'cancelled')}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel Booking
                  </Button>
                )}
                {viewBooking.status === 'pending' && (
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleUpdateStatus(viewBooking.id, 'confirmed', 'completed')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Confirm Booking
                  </Button>
                )}
                {viewBooking.status === 'confirmed' && (
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleUpdateStatus(viewBooking.id, 'used')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Mark Used
                  </Button>
                )}
                {viewBooking.status === 'completed' && (
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleUpdateStatus(viewBooking.id, 'used')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Mark Used
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
