// Legacy types for backwards compatibility - use types/index.ts for new code
export interface Booking {
  id: string
  movieTitle: string
  showtime: string
  seats: string[]
  ticketPrice: number
  totalPrice: number
  bookingDate: string
  status: 'confirmed' | 'cancelled' | 'used' | 'expired'
}
