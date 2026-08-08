import { CalendarClock, MapPin, Ticket } from 'lucide-react'

interface PaymentSummaryProps {
  movieTitle: string
  showtime: string
  seats: string[]
  totalAmount: number
  moviePoster?: string
  cinemaName?: string
  hall?: string
}

export default function PaymentSummary({
  movieTitle,
  showtime,
  seats,
  totalAmount,
  moviePoster,
  cinemaName = 'Cinema',
  hall = 'Hall 1',
}: PaymentSummaryProps) {
  const validSeats = seats && seats.length > 0 ? seats : []
  const ticketCount = validSeats.length
  const ticketPrice = ticketCount > 0 ? totalAmount / ticketCount : totalAmount

  return (
    <div className="cinema-card p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f26] text-[#e50914]">
          <Ticket className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Order Summary</h3>
          <p className="text-xs text-slate-500">Review your ticket</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-[76px_1fr] gap-4">
        <div className="h-28 overflow-hidden rounded-xl bg-[#1b1f26]">
          {moviePoster ? (
            <img src={moviePoster} alt={movieTitle} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              <Ticket className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold text-white">{movieTitle}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {cinemaName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarClock className="h-3.5 w-3.5" />
            {showtime}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#252a32] bg-[#101318] p-4 text-sm">
        <SummaryRow label="Hall" value={hall} />
        <div>
          <p className="text-slate-500">Seats</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {validSeats.length > 0 ? (
              validSeats.map((seat) => (
                <span key={seat} className="rounded-lg bg-[#e50914] px-2.5 py-1 text-xs font-semibold text-white">
                  {seat}
                </span>
              ))
            ) : (
              <span className="text-slate-400">No seats selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Tickets</span>
          <span>{ticketCount}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Price per ticket</span>
          <span>${ticketPrice > 0 ? ticketPrice.toFixed(2) : '0.00'}</span>
        </div>
        <div className="border-t border-[#252a32] pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-2xl font-semibold text-[#f5c451]">${totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  )
}
