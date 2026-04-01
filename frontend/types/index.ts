// Core Data Types for Movie Ticket Booking System

// ==================== USER MODULE ====================
export type UserRole = 'user' | 'admin' | 'staff' | 'owner'

export interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  createdAt: string
  favoriteMovies: string[]
  favoriteCinemas: string[]
  notifications: NotificationPreference
}

export interface NotificationPreference {
  email: boolean
  sms: boolean
  push: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ==================== MOVIE MODULE ====================
export interface Movie {
  id: string
  title: string
  synopsis: string
  genre: string[]
  language: string
  duration: number // in minutes
  rating: number // 0-10
  ageRating: string // e.g., "PG-13", "R", "U"
  releaseDate: string
  trailerUrl?: string // YouTube link
  poster: string
  backdrop?: string
  director: string
  cast: string[]
  status: 'now_showing' | 'coming_soon' | 'ended'
  showtimes: Showtime[]
  createdAt: string
  updatedAt: string
}

export interface MovieFilter {
  genre?: string[]
  language?: string
  rating?: number
  status?: Movie['status']
  date?: string
}

// ==================== CINEMA/THEATER MODULE ====================
export interface Cinema {
  id: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  image: string
  facilities: string[] // Parking, Food Court, VIP Lounge, etc.
  screens: Screen[]
  createdAt: string
}

export interface Screen {
  id: string
  cinemaId: string
  name: string // Screen 1, Screen 2, etc.
  capacity: number
  screenType: 'standard' | 'imax' | '4dx' | 'dolby_atmos'
  seatLayout: SeatLayout
}

export interface SeatLayout {
  rows: SeatRow[]
  aislePositions: number[] // seat positions where aisle exists
}

export interface SeatRow {
  row: string // A, B, C, etc.
  seats: Seat[]
}

export interface Seat {
  id: string
  seatNumber: string // e.g., "A1", "A2"
  type: 'regular' | 'vip' | 'couple' | 'accessible'
  priceModifier: number // 1.0 for regular, 1.5 for VIP, etc.
  status: 'available' | 'booked' | 'reserved' | 'blocked'
  x?: number // For custom positioning
  y?: number
}

export interface SeatType {
  id: string
  name: string
  description: string
  priceModifier: number
  color: string
}

// ==================== SHOW SCHEDULING MODULE ====================
export interface Showtime {
  id: string
  movieId: string
  cinemaId: string
  screenId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // calculated from movie duration
  price: number // base price
  availableSeats: number
  totalSeats: number
  status: 'scheduled' | 'selling' | 'sold_out' | 'cancelled'
  dynamicPricing?: DynamicPricing
}

export interface DynamicPricing {
  enabled: boolean
  rules: PricingRule[]
}

export interface PricingRule {
  id: string
  type: 'day_of_week' | 'time_slot' | 'seat_type' | 'demand'
  condition: string // e.g., "weekend", "evening", "vip"
  multiplier: number // e.g., 1.5 for 50% increase
  description: string
}

export interface ShowtimeSchedule {
  cinemaId: string
  screenId: string
  date: string
  shows: Showtime[]
}

// ==================== BOOKING MODULE ====================
export interface Booking {
  id: string
  userId: string
  movieId: string
  movieTitle: string
  cinemaId: string
  cinemaName: string
  screenId: string
  showtimeId: string
  showtime: string // date and time
  seats: BookedSeat[]
  ticketPrice: number
  totalPrice: number
  discount?: number
  couponCode?: string
  paymentMethod: 'card' | 'wallet' | 'cash'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  bookingDate: string
  status: 'confirmed' | 'cancelled' | 'used' | 'expired'
  ticketCode: string // for QR generation
}

export interface BookedSeat {
  seatId: string
  seatNumber: string
  seatType: Seat['type']
  price: number
}

// ==================== PAYMENT MODULE ====================
export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: 'card' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: string
  completedAt?: string
}

export interface Coupon {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  validUntil: string
  maxUses: number
  usedCount: number
}

// ==================== TICKET MODULE ====================
export interface Ticket {
  id: string
  bookingId: string
  qrCode: string
  movieTitle: string
  cinemaName: string
  screenName: string
  showDate: string
  showTime: string
  seats: string[]
  seatType: string
  price: number
  status: 'valid' | 'used' | 'cancelled'
  validUntil: string
}

export interface TicketScan {
  ticketId: string
  scannedAt: string
  scannedBy: string
  location: string
  result: 'success' | 'already_used' | 'invalid' | 'expired'
}

// ==================== ANALYTICS MODULE ====================
export interface Analytics {
  totalRevenue: number
  totalBookings: number
  totalUsers: number
  occupancyRate: number
  topMovies: MovieAnalytics[]
  revenueByDate: RevenueData[]
  peakHours: PeakHour[]
}

export interface MovieAnalytics {
  movieId: string
  movieTitle: string
  bookings: number
  revenue: number
  occupancyRate: number
}

export interface RevenueData {
  date: string
  revenue: number
  bookings: number
}

export interface PeakHour {
  hour: number
  bookings: number
}

// ==================== LOCATION MODULE ====================
export interface City {
  id: string
  name: string
  country: string
  cinemas: string[] // cinema IDs
}

// ==================== SEARCH & FILTERS ====================
export interface SearchFilters {
  query?: string
  genre?: string[]
  language?: string
  city?: string
  cinema?: string
  date?: string
  time?: string
  priceMin?: number
  priceMax?: number
  rating?: number
}

export interface SearchResult {
  movies: Movie[]
  totalCount: number
  page: number
  pageSize: number
}

// ==================== RECOMMENDATIONS ====================
export interface Recommendation {
  id: string
  type: 'trending' | 'recommended' | 'similar' | 'because_you_watched'
  movie: Movie
  reason?: string
}

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string
  userId: string
  type: 'booking_confirmation' | 'reminder' | 'promotion' | 'update'
  title: string
  message: string
  read: boolean
  createdAt: string
  sentVia: ('email' | 'sms' | 'push')[]
}