interface PaymentSummaryProps {
  movieTitle: string
  showtime: string
  seats: string[]
  totalAmount: number
  moviePoster?: string
}

export default function PaymentSummary({
  movieTitle,
  showtime,
  seats,
  totalAmount,
  moviePoster,
}: PaymentSummaryProps) {
  // Handle edge cases
  const validSeats = seats && seats.length > 0 ? seats : []
  const ticketCount = validSeats.length
  const ticketPrice = ticketCount > 0 ? totalAmount / ticketCount : totalAmount > 0 ? totalAmount : 12.99

  return (
    <div className="bg-slate-800 rounded-2xl p-6 sticky top-24 border border-slate-700 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order Summary
      </h3>

      {/* Movie Poster */}
      <div className="w-full h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
        {moviePoster ? (
          <img src={moviePoster} alt={movieTitle} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Movie</p>
          <p className="text-white font-semibold break-words">{movieTitle}</p>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Showtime</p>
          <p className="text-white font-semibold">{showtime}</p>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Selected Seats</p>
          <div className="flex flex-wrap gap-2">
            {validSeats.length === 0 ? (
              <p className="text-slate-500 text-sm">No seats selected</p>
            ) : (
              validSeats.map((seat) => (
                <span 
                  key={seat} 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium shadow-lg"
                >
                  {seat}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-slate-600 pt-4 space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Price per ticket</span>
          <span className="text-white font-medium">${ticketPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Number of tickets</span>
          <span className="text-white font-medium">{ticketCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-white font-medium">${(ticketPrice * ticketCount).toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
        <span className="text-white font-semibold text-lg">Total Amount</span>
        <div className="text-right">
          <span className="text-orange-500 font-bold text-3xl">${totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}</span>
          <p className="text-slate-500 text-xs">USD</p>
        </div>
      </div>

      {/* Cinema Info */}
      <div className="mt-6 pt-4 border-t border-slate-600">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span>Valid for selected showtime only</span>
        </div>
      </div>
    </div>
  )
}
