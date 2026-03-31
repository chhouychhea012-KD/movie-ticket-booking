'use client'

import { useState, useEffect } from 'react'

interface SeatMapProps {
  movieId: string
  showtime: string
  onSeatsChange: (seats: string[]) => void
}

type SeatStatus = 'available' | 'selected' | 'booked'

export default function SeatMap({ movieId, showtime, onSeatsChange }: SeatMapProps) {
  const [seats, setSeats] = useState<Record<string, SeatStatus>>({})
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  useEffect(() => {
    // Initialize seats (10 rows, 12 seats per row)
    const newSeats: Record<string, SeatStatus> = {}
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    
    rows.forEach((row) => {
      for (let i = 1; i <= 12; i++) {
        const seatId = `${row}${i}`
        // Randomly mark some seats as booked
        newSeats[seatId] = Math.random() > 0.7 ? 'booked' : 'available'
      }
    })

    setSeats(newSeats)
  }, [movieId, showtime])

  const handleSeatClick = (seatId: string) => {
    if (seats[seatId] === 'booked') return

    const newSeats = [...selectedSeats]
    const index = newSeats.indexOf(seatId)

    if (index > -1) {
      newSeats.splice(index, 1)
    } else {
      newSeats.push(seatId)
    }

    setSelectedSeats(newSeats)
    onSeatsChange(newSeats)

    // Update seat status
    setSeats(prev => ({
      ...prev,
      [seatId]: index > -1 ? 'available' : 'selected'
    }))
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  return (
    <div className="bg-slate-800 rounded-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Select Your Seats</h2>
        <div className="flex justify-center mb-6">
          <div className="text-white text-center">
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-2"></div>
            <p className="text-sm text-slate-400">SCREEN</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-slate-700 rounded-lg p-6 overflow-x-auto">
          <div className="min-w-max">
            {rows.map((row) => (
              <div key={row} className="flex gap-2 mb-2 justify-center">
                <span className="w-6 text-slate-400 flex items-center justify-center text-sm font-bold">
                  {row}
                </span>
                {Array.from({ length: 12 }).map((_, i) => {
                  const seatId = `${row}${i + 1}`
                  const status = seats[seatId]

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={`w-7 h-7 rounded transition-all ${
                        status === 'booked'
                          ? 'bg-slate-600 cursor-not-allowed opacity-50'
                          : status === 'selected'
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                      title={seatId}
                    />
                  )
                })}
                <span className="w-6 text-slate-400 flex items-center justify-center text-sm font-bold">
                  {row}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-slate-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-600 rounded"></div>
          <span className="text-slate-300">Booked</span>
        </div>
      </div>
    </div>
  )
}
