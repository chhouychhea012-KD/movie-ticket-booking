'use client'

import { useState, useEffect } from 'react'
import { paymentsAPI } from '@/lib/api'
import { CreditCard, Search, Filter, Download, DollarSign, CheckCircle, Clock, XCircle, Wallet, Banknote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PaymentRecord {
  id: string
  bookingId?: string
  movieTitle: string
  showtime: string
  seats: string[]
  ticketPrice: number
  totalPrice: number
  bookingDate: string
  status: string
  paymentMethod: string
  paymentId?: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus)
    }

    if (selectedMethod) {
      filtered = filtered.filter(p => p.paymentMethod === selectedMethod)
    }

    setFilteredPayments(filtered)
  }, [searchTerm, selectedStatus, selectedMethod, payments])

  const loadPayments = async () => {
    try {
      const response = await paymentsAPI.getAll({ limit: 100 })
      if (response.success && response.data?.payments) {
        setPayments(response.data.payments)
        setFilteredPayments(response.data.payments)
      } else {
        // Fallback to localStorage
        loadFromLocalStorage()
      }
    } catch (error) {
      // Fallback to localStorage on error
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    const storedBookings = localStorage.getItem('bookings')
    const bookings = storedBookings ? JSON.parse(storedBookings) : []
    
    const dataStoreBookings = localStorage.getItem('cinemahub_bookings')
    const dsBookings = dataStoreBookings ? JSON.parse(dataStoreBookings) : []

    const allPayments: PaymentRecord[] = [
      ...bookings.map((b: any) => ({
        id: b.id,
        bookingId: b.id,
        movieTitle: b.movieTitle || 'Unknown',
        showtime: b.showtime || 'N/A',
        seats: Array.isArray(b.seats) ? b.seats : [],
        ticketPrice: b.ticketPrice || 0,
        totalPrice: b.totalPrice || 0,
        bookingDate: b.bookingDate || new Date().toISOString(),
        status: b.paymentStatus === 'completed' ? 'completed' : (b.status || 'pending'),
        paymentMethod: b.paymentMethod || 'unknown',
        paymentId: b.paymentId || b.transactionId
      })),
      ...dsBookings.map((b: any) => ({
        id: b.id,
        bookingId: b.id,
        movieTitle: b.movieTitle || 'Unknown',
        showtime: b.showtime || 'N/A',
        seats: Array.isArray(b.seats) ? b.seats.map((s: any) => s.seatNumber || s) : [],
        ticketPrice: b.ticketPrice || 0,
        totalPrice: b.totalPrice || 0,
        bookingDate: b.bookingDate || new Date().toISOString(),
        status: b.paymentStatus === 'completed' ? 'completed' : (b.status || 'pending'),
        paymentMethod: b.paymentMethod || 'unknown',
        paymentId: b.paymentId || b.transactionId
      }))
    ]

    const uniquePayments = allPayments.reduce((acc: PaymentRecord[], p) => {
      if (!acc.find(existing => existing.id === p.id)) {
        acc.push(p)
      }
      return acc
    }, [])

    uniquePayments.sort((a, b) => 
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    )

    setPayments(uniquePayments)
    setFilteredPayments(uniquePayments)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'visa':
        return <CreditCard className="w-4 h-4" />
      case 'bakong':
        return <Wallet className="w-4 h-4" />
      case 'abapayway':
        return <Banknote className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Movie', 'Seats', 'Amount', 'Payment Method', 'Status', 'Date']
    const rows = filteredPayments.map(p => [
      p.id,
      p.movieTitle,
      Array.isArray(p.seats) ? p.seats.join(', ') : '',
      Number(p.totalPrice),
      p.paymentMethod,
      p.status,
      p.bookingDate
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payments.csv'
    a.click()
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.totalPrice) || 0), 0)
  const completedPayments = payments.filter(p => p.status === 'completed' || p.status === 'confirmed')
  const pendingPayments = payments.filter(p => p.status === 'pending')

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Payments</h1>
          <p className="text-slate-400 mt-1">Track and manage all payment transactions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-slate-300 text-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-500" />
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
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Transactions</p>
                <p className="text-xl font-bold text-white">{payments.length}</p>
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
                <p className="text-slate-400 text-xs">Completed</p>
                <p className="text-xl font-bold text-white">{completedPayments.length}</p>
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
                <p className="text-xl font-bold text-white">{pendingPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by movie or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Methods</option>
              <option value="visa">Visa</option>
              <option value="bakong">Bakong</option>
              <option value="abapayway">ABA Payway</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-700/20">
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Payment ID</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Movie</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Seats</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Amount</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Method</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr 
                    key={payment.id}
                    className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30 hover:bg-slate-700/30 transition`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm font-mono">{payment.id.substring(0, 8)}...</p>
                      {payment.paymentId && (
                        <p className="text-slate-500 text-xs">Ref: {payment.paymentId.substring(0, 12)}...</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{payment.movieTitle}</p>
                      <p className="text-slate-500 text-sm">{payment.showtime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">
{Array.isArray(payment.seats) && payment.seats.length > 0 ? payment.seats.join(', ') : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
${Number(payment.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.paymentMethod)}
                        <span className="text-slate-300 capitalize">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm">{formatDate(payment.bookingDate)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">No payments found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}