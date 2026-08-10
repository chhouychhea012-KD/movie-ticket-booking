'use client'

import { Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarClock, CheckCircle2, Download, MapPin, Ticket, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StoredBooking {
  id: string
  movieTitle: string
  moviePoster?: string
  cinemaName?: string
  hall?: string
  showtime: string
  seats: string[]
  ticketPrice: number | string
  totalPrice: number | string
  bookingDate: string
  status: 'confirmed' | 'cancelled' | 'used' | 'expired'
}

function BookingConfirmationPageContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState<StoredBooking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings && bookingId) {
      const bookings: StoredBooking[] = JSON.parse(storedBookings)
      setBooking(bookings.find((item) => item.id === bookingId) || null)
    }
    setLoading(false)
  }, [bookingId])

  if (loading) {
    return (
      <div className="cinema-page flex items-center justify-center pt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#252a32] border-t-[#e50914]" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="cinema-page flex items-center justify-center pt-20">
        <div className="cinema-card max-w-md p-8 text-center">
          <Ticket className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-4 text-xl font-semibold text-white">Booking not found</p>
          <p className="cinema-muted mt-2">The ticket may not have been saved in this browser.</p>
          <Link href="/" className="cinema-button-primary mt-6 w-full">Back Home</Link>
        </div>
      </div>
    )
  }

  const qrValue = JSON.stringify({
    bookingId: booking.id,
    movie: booking.movieTitle,
    cinema: booking.cinemaName || 'Cinema',
    showtime: booking.showtime,
    seats: booking.seats,
  })

  return (
    <div className="cinema-page pt-20">
      <div className="cinema-container max-w-5xl pb-16">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#122016] text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Booking Confirmed</h1>
          <p className="cinema-muted mt-2">Your digital ticket is ready.</p>
        </div>

        <div className="cinema-card overflow-hidden">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div className="min-h-[380px] bg-[#101318]">
              {booking.moviePoster ? (
                <img src={booking.moviePoster} alt={booking.movieTitle} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[380px] items-center justify-center text-slate-600">
                  <Ticket className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="cinema-chip border-emerald-500/40 text-emerald-300">Paid</span>
                  <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{booking.movieTitle}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {booking.cinemaName || 'Cinema'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <QRCodeSVG value={qrValue} size={118} level="H" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TicketInfo label="Hall" value={booking.hall || 'Hall 1'} />
                <TicketInfo label="Date & Time" value={booking.showtime} icon={<CalendarClock className="h-4 w-4" />} />
                <TicketInfo label="Seats" value={booking.seats.join(', ')} />
                <TicketInfo label="Booking ID" value={booking.id} mono />
              </div>

              <div className="my-6 border-t border-dashed border-[#3a414d]" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total payment</p>
                  <p className="text-3xl font-semibold text-[#f5c451]">{formatCurrency(booking.totalPrice)}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => window.print()} className="cinema-button-secondary">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="cinema-button-secondary">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </button>
                  <Link href="/bookings" className="cinema-button-primary">View Booking</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
          <Info text="Arrive 15 minutes before showtime." />
          <Info text="Bring a valid ID if required." />
          <Info text="Show the QR code at the cinema gate." />
        </div>
      </div>
    </div>
  )
}

function TicketInfo({ label, value, icon, mono }: { label: string; value: string; icon?: ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#252a32] bg-[#101318] p-4">
      <p className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </p>
      <p className={`mt-2 break-words font-semibold text-white ${mono ? 'font-mono text-sm' : ''}`}>{value}</p>
    </div>
  )
}

function Info({ text }: { text: string }) {
  return (
    <div className="cinema-card-soft p-4">
      {text}
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmationPageContent />
    </Suspense>
  )
}
