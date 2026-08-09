'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { paymentsAPI } from '@/lib/api'
import {
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

interface PaymentRecord {
  id: string
  bookingId?: string
  movieTitle: string
  showtime: string
  seats: Array<string | { seatNumber?: string }>
  ticketPrice: number
  totalPrice: number
  bookingDate: string
  status: PaymentStatus
  paymentMethod: string
  paymentId?: string
}

interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  methodCounts: Record<string, number>
}

const defaultStats: PaymentStats = {
  totalRevenue: 0,
  totalTransactions: 0,
  completedPayments: 0,
  pendingPayments: 0,
  failedPayments: 0,
  methodCounts: {},
}

const statusOptions: PaymentStatus[] = ['pending', 'completed', 'failed', 'refunded']

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(value)

const getSeatNumbers = (seats: PaymentRecord['seats']) => {
  if (!Array.isArray(seats) || seats.length === 0) return 'N/A'
  return seats.map((seat) => typeof seat === 'string' ? seat : seat.seatNumber || '').filter(Boolean).join(', ')
}

const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1)

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [stats, setStats] = useState<PaymentStats>(defaultStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingStatus, setSubmittingStatus] = useState<PaymentStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [paymentsRes, statsRes] = await Promise.all([
        paymentsAPI.getAll({
          limit: 100,
          status: selectedStatus || undefined,
          method: selectedMethod || undefined,
        }),
        paymentsAPI.getStats(),
      ])

      if (paymentsRes.success && paymentsRes.data?.payments) {
        setPayments(paymentsRes.data.payments)
      } else {
        setPayments([])
        setError(paymentsRes.message || 'Failed to load payments')
      }

      if (statsRes.success && statsRes.data) {
        setStats({ ...defaultStats, ...statsRes.data })
      }
    } catch (err: any) {
      setPayments([])
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [selectedMethod, selectedStatus])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const filteredPayments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return payments

    return payments.filter((payment) => (
      payment.movieTitle?.toLowerCase().includes(query) ||
      payment.id?.toLowerCase().includes(query) ||
      payment.bookingId?.toLowerCase().includes(query) ||
      payment.paymentId?.toLowerCase().includes(query)
    ))
  }, [payments, searchTerm])

  const methodOptions = useMemo(() => {
    const methods = new Set(payments.map((payment) => payment.paymentMethod).filter(Boolean))
    Object.keys(stats.methodCounts || {}).forEach((method) => methods.add(method))
    return Array.from(methods)
  }, [payments, stats.methodCounts])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'refunded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'visa':
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'bakong':
      case 'wallet':
        return <Wallet className="h-4 w-4" />
      case 'abapayway':
      case 'cash':
        return <Banknote className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const exportToCSV = () => {
    const headers = ['Payment ID', 'Booking ID', 'Movie', 'Seats', 'Amount', 'Payment Method', 'Status', 'Date']
    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.bookingId || '',
      payment.movieTitle,
      getSeatNumbers(payment.seats),
      Number(payment.totalPrice || 0),
      payment.paymentMethod,
      payment.status,
      payment.bookingDate,
    ])

    const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payments.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const updatePaymentStatus = async (payment: PaymentRecord, status: PaymentStatus) => {
    try {
      setIsSubmitting(true)
      setSubmittingStatus(status)
      setError(null)
      setSuccess(null)

      const response = await paymentsAPI.updateStatus(payment.id, status)
      if (response.success) {
        setPayments((current) => current.map((item) => (
          item.id === payment.id ? { ...item, status } : item
        )))
        setSelectedPayment((current) => current?.id === payment.id ? { ...current, status } : current)
        setSuccess(`Payment marked as ${getStatusLabel(status)}`)
        await loadPayments()
      } else {
        setError(response.message || 'Failed to update payment')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update payment')
    } finally {
      setIsSubmitting(false)
      setSubmittingStatus(null)
    }
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(Number(stats.totalRevenue || 0)),
      icon: DollarSign,
      tone: 'text-orange-400 bg-orange-500/10',
    },
    {
      label: 'Transactions',
      value: stats.totalTransactions,
      icon: CreditCard,
      tone: 'text-blue-400 bg-blue-500/10',
    },
    {
      label: 'Completed',
      value: stats.completedPayments,
      icon: CheckCircle,
      tone: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Pending',
      value: stats.pendingPayments,
      icon: Clock,
      tone: 'text-yellow-400 bg-yellow-500/10',
    },
    {
      label: 'Failed',
      value: stats.failedPayments,
      icon: XCircle,
      tone: 'text-red-400 bg-red-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="hover:text-emerald-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Payments</h1>
          <p className="mt-1 text-slate-400">Track and manage payment transactions from customer bookings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={loadPayments}
            disabled={loading}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={exportToCSV}
            disabled={filteredPayments.length === 0}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-slate-700/50 bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="truncate text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 p-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by movie, booking, or payment ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-slate-600/50 bg-slate-700/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-orange-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white outline-none transition focus:border-orange-500"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{getStatusLabel(status)}</option>
            ))}
          </select>

          <select
            value={selectedMethod}
            onChange={(event) => setSelectedMethod(event.target.value)}
            className="w-full rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white outline-none transition focus:border-orange-500"
          >
            <option value="">All Methods</option>
            {methodOptions.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-700/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Movie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Seats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={`${index % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/20'} border-b border-slate-700/30 transition hover:bg-slate-700/30`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-slate-300">{payment.id}</p>
                      {payment.paymentId && <p className="text-xs text-slate-500">Ticket: {payment.paymentId}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{payment.movieTitle}</p>
                      <p className="text-sm text-slate-500">{payment.showtime}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{getSeatNumbers(payment.seats)}</td>
                    <td className="px-6 py-4 font-semibold text-orange-400">{formatCurrency(Number(payment.totalPrice || 0))}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        {getMethodIcon(payment.paymentMethod)}
                        <span className="capitalize">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(payment.status)}>{getStatusLabel(payment.status)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(payment.bookingDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPayment(payment)}
                          className="text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard className="mx-auto mb-4 h-16 w-16 text-slate-600" />
              <p className="text-lg font-medium text-slate-400">No payments found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-slate-700 bg-slate-800">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment Details</h2>
                  <p className="text-sm text-slate-400">{selectedPayment.id}</p>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Movie</p>
                  <p className="font-medium text-white">{selectedPayment.movieTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Showtime</p>
                  <p className="font-medium text-white">{selectedPayment.showtime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Seats</p>
                  <p className="font-medium text-white">{getSeatNumbers(selectedPayment.seats)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Amount</p>
                  <p className="font-medium text-orange-400">{formatCurrency(Number(selectedPayment.totalPrice || 0))}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Method</p>
                  <p className="font-medium capitalize text-white">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <Badge className={getStatusColor(selectedPayment.status)}>{getStatusLabel(selectedPayment.status)}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Booking ID</p>
                  <p className="break-all font-mono text-sm text-white">{selectedPayment.bookingId || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="font-medium text-white">{formatDate(selectedPayment.bookingDate)}</p>
                </div>
              </div>

              <div className="grid gap-2 border-t border-slate-700 pt-4 sm:grid-cols-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    disabled={isSubmitting || selectedPayment.status === status}
                    onClick={() => updatePaymentStatus(selectedPayment, status)}
                    variant={status === 'completed' ? 'default' : 'outline'}
                    className={
                      status === 'completed'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  >
                    {submittingStatus === status ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Mark {getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
