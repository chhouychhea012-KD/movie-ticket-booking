'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { QrCode, Download, Mail, Phone, Calendar, Clock, MapPin, Film, Ticket, Check, X } from 'lucide-react'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { bookings, getMovieById, getCinemaById } = useApp()
  
  const bookingId = params.id as string
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      const foundBooking = bookings.find(b => b.id === bookingId)
      setBooking(foundBooking)
    }
    setLoading(false)
  }, [bookingId, bookings])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Loading ticket...</span>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Ticket not found</p>
          <Link href="/bookings" className="text-orange-500 hover:text-orange-400">
            Go to My Bookings
          </Link>
        </div>
      </div>
    )
  }

  const movie = getMovieById(booking.movieId)
  const cinema = getCinemaById(booking.cinemaId)

  // Generate QR code placeholder (in real app, use a QR library)
  const qrCodeData = `TICKET-${booking.id}-${booking.ticketCode}`

  const handleDownload = () => {
    // In real app, generate PDF
    alert('Download functionality - would generate PDF ticket')
  }

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${booking.movieTitle}`,
        text: `My ticket for ${booking.movieTitle} at ${booking.showtime}`,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/bookings" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Bookings
        </Link>

        {/* Ticket Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">{booking.movieTitle}</h1>
            <p className="text-orange-100">E-Ticket</p>
          </div>

          {/* QR Code Section */}
          <div className="p-8 border-b border-slate-700/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-white rounded-2xl p-4 flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <p className="text-center text-slate-500 text-xs mt-2">Scan at theater</p>
              </div>

              {/* Booking Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Booking ID</p>
                    <p className="text-white font-mono text-sm">{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Ticket Code</p>
                    <p className="text-white font-mono text-sm">{booking.ticketCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-white">{new Date(booking.showtime.split(' ')[0]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-white">{booking.showtime.split(' ')[1]}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-white">{cinema?.name || booking.cinemaName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seats Section */}
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Seats</h3>
            <div className="flex flex-wrap gap-3">
              {booking.seats.map((seat: any, index: number) => (
                <div 
                  key={index}
                  className="bg-slate-700/50 rounded-xl px-4 py-3 text-center min-w-20"
                >
                  <p className="text-white font-bold text-lg">{seat.seatNumber}</p>
                  <p className="text-slate-400 text-xs capitalize">{seat.seatType}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">Ticket Price</p>
                <p className="text-white">${booking.ticketPrice.toFixed(2)} × {booking.seats.length} seats</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Total Paid</p>
                <p className="text-orange-500 text-2xl font-bold">${booking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
            {booking.discount && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm">Discount applied: -${booking.discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
            <button
              onClick={handleShareTicket}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Important Info */}
        <div className="mt-6 bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Important Information</h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Please arrive at least 15 minutes before the showtime</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Bring a valid ID for verification at the theater</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Your booking confirmation has been sent to your email</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-400 mt-0.5" />
              <span>Cancellations must be made at least 2 hours before showtime</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">Need help? Contact us at</p>
          <p className="text-orange-500">support@cinemahub.com or +855 23 888 888</p>
        </div>
      </div>
    </div>
  )
}