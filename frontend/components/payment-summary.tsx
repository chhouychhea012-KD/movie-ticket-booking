interface PaymentSummaryProps {
  movieTitle: string
  showtime: string
  seats: string[]
  totalAmount: number
}

export default function PaymentSummary({
  movieTitle,
  showtime,
  seats,
  totalAmount,
}: PaymentSummaryProps) {
  const ticketPrice = seats.length > 0 ? totalAmount / seats.length : 0

  return (
    <div className="bg-slate-800 rounded-lg p-6 sticky top-24 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-slate-400 text-sm">Movie</p>
          <p className="text-white font-semibold break-words">{movieTitle}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Showtime</p>
          <p className="text-white font-semibold">{showtime}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Seats</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {seats.map((seat) => (
              <span key={seat} className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                {seat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-600 pt-4 space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-slate-400">Price per ticket</span>
          <span className="text-white font-semibold">${ticketPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Number of tickets</span>
          <span className="text-white font-semibold">{seats.length}</span>
        </div>
      </div>

      <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
        <span className="text-slate-300 font-semibold">Total Amount</span>
        <span className="text-orange-500 font-bold text-2xl">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  )
}
