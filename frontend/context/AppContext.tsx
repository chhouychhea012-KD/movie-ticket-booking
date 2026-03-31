'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Movie, Cinema, Seat, Showtime, Booking, User, City, Analytics } from '@/types'

// Mock Data Store
const mockCities = [
  { id: '1', name: 'Phnom Penh', country: 'Cambodia', cinemas: ['1', '2', '3'] },
  { id: '2', name: 'Siem Reap', country: 'Cambodia', cinemas: ['4'] },
  { id: '3', name: 'Battambang', country: 'Cambodia', cinemas: ['5'] },
]

const mockCinemas: Cinema[] = [
  {
    id: '1',
    name: 'Legend Cinema - Phnom Penh',
    address: 'Russian Blvd, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 23 888 888',
    email: 'info@legend.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Food Court', 'VIP Lounge', '3D', 'IMAX'],
    screens: [],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'The Mall Cinema',
    address: 'Sihanouk Blvd, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 23 999 999',
    email: 'contact@themall.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Restaurant', '4DX', 'Dolby Atmos'],
    screens: [],
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Aeon Mall Cinema',
    city: 'Phnom Penh',
    address: 'Monivong Blvd, Phnom Penh',
    phone: '+855 23 777 777',
    email: 'support@aeon.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Shopping', 'VIP', 'IMAX'],
    screens: [],
    createdAt: '2024-01-03T00:00:00.000Z',
  },
]

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Quantum Paradox',
    synopsis: 'A thrilling journey through time and space. When a brilliant physicist discovers a way to manipulate time, she must race against a shadow organization to prevent a catastrophic future.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    rating: 8.5,
    ageRating: 'PG-13',
    releaseDate: '2024-12-15',
    trailerUrl: 'https://youtube.com/watch?v=example',
    poster: '/sci-fi-movie-poster.png',
    director: 'Sarah Chen',
    cast: ['Emma Watson', 'John Cho', 'Idris Elba'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Love in Paris',
    synopsis: 'A heartwarming tale of love and discovery. Two strangers meet in the city of lights and find themselves changed forever.',
    genre: ['Romance', 'Drama'],
    language: 'English',
    duration: 125,
    rating: 7.8,
    ageRating: 'PG',
    releaseDate: '2024-12-10',
    poster: '/romantic-movie-poster.png',
    director: 'Pierre Martin',
    cast: ['Sophie Turner', 'Timothée Chalamet'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-05T00:00:00.000Z',
    updatedAt: '2024-12-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Dark Shadows',
    synopsis: 'A suspenseful mystery that will keep you on edge. When a famous actress returns to her childhood home, dark secrets surface.',
    genre: ['Thriller', 'Mystery', 'Horror'],
    language: 'English',
    duration: 135,
    rating: 8.2,
    ageRating: 'R',
    releaseDate: '2024-12-12',
    poster: '/thriller-movie-poster.png',
    director: 'Guillermo del Toro',
    cast: ['Ana de Armas', 'Javier Bardem'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-10T00:00:00.000Z',
    updatedAt: '2024-12-03T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Laugh Out Loud',
    synopsis: 'Hilarious adventures that will make you laugh. A comedy about a dysfunctional family trying to plan the perfect vacation.',
    genre: ['Comedy', 'Family'],
    language: 'English',
    duration: 110,
    rating: 7.5,
    ageRating: 'PG-13',
    releaseDate: '2024-12-14',
    poster: '/comedy-movie-poster.png',
    director: 'Judd Apatow',
    cast: ['Kristen Wiig', 'Bill Hader'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-15T00:00:00.000Z',
    updatedAt: '2024-12-04T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Dragon Legends',
    synopsis: 'An epic adventure in a world of magic. A young warrior must unite the kingdom against an ancient evil.',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'English',
    duration: 155,
    rating: 8.7,
    ageRating: 'PG-13',
    releaseDate: '2024-12-16',
    poster: '/fantasy-movie-poster.png',
    director: 'James Cameron',
    cast: ['Henry Cavill', 'Charlize Theron'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-20T00:00:00.000Z',
    updatedAt: '2024-12-05T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Space Force',
    synopsis: 'Intense action sequences in the final frontier. The first human mission to Mars faces unexpected challenges.',
    genre: ['Action', 'Sci-Fi'],
    language: 'English',
    duration: 140,
    rating: 8.1,
    ageRating: 'PG-13',
    releaseDate: '2024-12-13',
    poster: '/action-movie-poster.png',
    director: 'Christopher Nolan',
    cast: ['Matt Damon', 'Jennifer Lawrence'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-25T00:00:00.000Z',
    updatedAt: '2024-12-06T00:00:00.000Z',
  },
]

const mockShowtimes = [
  { id: '1', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '10:00', endTime: '12:28', price: 8, availableSeats: 100, totalSeats: 120, status: 'selling' as const },
  { id: '2', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '13:30', endTime: '15:58', price: 10, availableSeats: 80, totalSeats: 120, status: 'selling' as const },
  { id: '3', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '16:00', endTime: '18:28', price: 12, availableSeats: 50, totalSeats: 120, status: 'selling' as const },
  { id: '4', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '19:00', endTime: '21:28', price: 14, availableSeats: 20, totalSeats: 120, status: 'selling' as const },
  { id: '5', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '21:30', endTime: '23:58', price: 14, availableSeats: 0, totalSeats: 120, status: 'sold_out' as const },
  { id: '6', movieId: '2', cinemaId: '1', screenId: '2', date: '2024-12-20', startTime: '11:00', endTime: '13:05', price: 8, availableSeats: 90, totalSeats: 100, status: 'selling' as const },
  { id: '7', movieId: '3', cinemaId: '2', screenId: '1', date: '2024-12-20', startTime: '12:00', endTime: '14:15', price: 9, availableSeats: 110, totalSeats: 150, status: 'selling' as const },
  { id: '8', movieId: '4', cinemaId: '2', screenId: '2', date: '2024-12-20', startTime: '14:00', endTime: '15:50', price: 8, availableSeats: 80, totalSeats: 100, status: 'selling' as const },
  { id: '9', movieId: '5', cinemaId: '3', screenId: '1', date: '2024-12-21', startTime: '10:30', endTime: '13:05', price: 12, availableSeats: 100, totalSeats: 120, status: 'selling' as const },
  { id: '10', movieId: '6', cinemaId: '3', screenId: '2', date: '2024-12-21', startTime: '15:00', endTime: '17:20', price: 10, availableSeats: 90, totalSeats: 100, status: 'selling' as const },
]

const mockCoupons = [
  { code: 'NEWUSER20', discountType: 'percentage' as const, discountValue: 20, minPurchase: 20, validUntil: '2025-12-31', maxUses: 100, usedCount: 45 },
  { code: 'MOVIE50', discountType: 'fixed' as const, discountValue: 5, minPurchase: 30, validUntil: '2025-06-30', maxUses: 200, usedCount: 120 },
  { code: 'WEEKEND30', discountType: 'percentage' as const, discountValue: 30, minPurchase: 25, validUntil: '2025-03-31', maxUses: 50, usedCount: 30 },
]

// Generate seat layout
const generateSeatLayout = (rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = []
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  for (let r = 0; r < rows; r++) {
    const row = rowLetters[r]
    const isVipRow = r < 2
    const isCoupleRow = r >= rows - 2
    
    for (let s = 1; s <= seatsPerRow; s++) {
      let type: Seat['type'] = 'regular'
      let priceModifier = 1
      
      if (isVipRow) {
        type = 'vip'
        priceModifier = 1.5
      } else if (isCoupleRow) {
        type = 'couple'
        priceModifier = 1.3
      }
      
      seats.push({
        id: `${row}${s}`,
        seatNumber: `${row}${s}`,
        type,
        priceModifier,
        status: Math.random() > 0.7 ? 'booked' : 'available',
      })
    }
  }
  
  return seats
}

// Context Types
interface AppContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: Partial<User>) => Promise<void>
  updateProfile: (data: Partial<User>) => void
  addFavoriteMovie: (movieId: string) => void
  removeFavoriteMovie: (movieId: string) => void
  movies: Movie[]
  nowShowing: Movie[]
  comingSoon: Movie[]
  getMovieById: (id: string) => Movie | undefined
  addMovie: (movie: Movie) => void
  updateMovie: (id: string, movie: Partial<Movie>) => void
  deleteMovie: (id: string) => void
  cities: typeof mockCities
  cinemas: Cinema[]
  getCinemaById: (id: string) => Cinema | undefined
  getCinemasByCity: (city: string) => Cinema[]
  showtimes: Showtime[]
  getShowtimes: (movieId: string, cinemaId?: string, date?: string) => Showtime[]
  getAvailableShowtimes: (movieId: string, date: string) => Showtime[]
  bookings: Booking[]
  currentBooking: Partial<Booking> | null
  createBooking: (booking: Partial<Booking>) => Promise<Booking>
  cancelBooking: (id: string) => void
  getUserBookings: (userId: string) => Booking[]
  getSeats: (showtimeId: string) => Seat[]
  reserveSeats: (showtimeId: string, seats: string[]) => void
  coupons: typeof mockCoupons
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number; message: string }
  analytics: Analytics
  searchMovies: (query: string, filters?: Partial<Movie>) => Movie[]
  selectedCity: string
  setSelectedCity: (city: string) => void
  selectedCinema: string
  setSelectedCinema: (cinema: string) => void
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [movies, setMovies] = useState<Movie[]>(mockMovies)
  const [cinemas, setCinemas] = useState<Cinema[]>(mockCinemas)
  const [showtimes, setShowtimes] = useState<Showtime[]>(mockShowtimes)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedCity, setSelectedCity] = useState('Phnom Penh')
  const [selectedCinema, setSelectedCinema] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)

  // Load bookings from localStorage on mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
  }, [])

  // Save bookings to localStorage
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings))
  }, [bookings])

  // User functions
  const login = async (email: string, _password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if admin login
    if (email === 'admin@cinemahub.com' || email === 'admin') {
      setUser({
        id: 'admin-1',
        email: 'admin@cinemahub.com',
        phone: '+85512345678',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      })
    } else {
      setUser({
        id: '1',
        email,
        phone: '+85512345678',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      })
    }
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (data: Partial<User>) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUser({
      id: Date.now().toString(),
      email: data.email || '',
      phone: data.phone || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      favoriteMovies: [],
      favoriteCinemas: [],
      notifications: { email: true, sms: true, push: true },
    })
    setIsLoading(false)
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const addFavoriteMovie = (movieId: string) => {
    if (user && !user.favoriteMovies.includes(movieId)) {
      setUser({ ...user, favoriteMovies: [...user.favoriteMovies, movieId] })
    }
  }

  const removeFavoriteMovie = (movieId: string) => {
    if (user) {
      setUser({ ...user, favoriteMovies: user.favoriteMovies.filter(id => id !== movieId) })
    }
  }

  // Movie functions
  const nowShowing = movies.filter(m => m.status === 'now_showing')
  const comingSoon = movies.filter(m => m.status === 'coming_soon')
  
  const getMovieById = (id: string) => movies.find(m => m.id === id)
  
  const addMovie = (movie: Movie) => {
    setMovies([...movies, movie])
  }
  
  const updateMovie = (id: string, data: Partial<Movie>) => {
    setMovies(movies.map(m => m.id === id ? { ...m, ...data } : m))
  }
  
  const deleteMovie = (id: string) => {
    setMovies(movies.filter(m => m.id !== id))
  }

  // Cinema functions
  const getCinemaById = (id: string) => cinemas.find(c => c.id === id)
  
  const getCinemasByCity = (city: string) => cinemas.filter(c => c.city === city)

  // Showtime functions
  const getShowtimes = (movieId: string, cinemaId?: string, date?: string) => {
    return showtimes.filter(s => {
      if (s.movieId !== movieId) return false
      if (cinemaId && s.cinemaId !== cinemaId) return false
      if (date && s.date !== date) return false
      return true
    })
  }

  const getAvailableShowtimes = (movieId: string, date: string) => {
    return showtimes.filter(s => 
      s.movieId === movieId && 
      s.date === date && 
      s.status !== 'sold_out' &&
      s.status !== 'cancelled'
    )
  }

  // Booking functions
  const createBooking = async (booking: Partial<Booking>): Promise<Booking> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      movieId: booking.movieId || '',
      movieTitle: booking.movieTitle || '',
      cinemaId: booking.cinemaId || '',
      cinemaName: booking.cinemaName || '',
      screenId: booking.screenId || '',
      showtimeId: booking.showtimeId || '',
      showtime: booking.showtime || '',
      seats: booking.seats || [],
      ticketPrice: booking.ticketPrice || 0,
      totalPrice: booking.totalPrice || 0,
      discount: booking.discount,
      couponCode: booking.couponCode,
      paymentMethod: booking.paymentMethod || 'card',
      paymentStatus: 'completed',
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      ticketCode: `TKT${Date.now()}`,
    }
    
    setBookings([...bookings, newBooking])
    setIsLoading(false)
    return newBooking
  }

  const cancelBooking = (id: string) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, status: 'cancelled' as const } : b
    ))
  }

  const getUserBookings = (_userId: string) => {
    return bookings.filter(b => b.userId === 'guest')
  }

  // Seat functions
  const getSeats = (_showtimeId: string): Seat[] => {
    return generateSeatLayout(10, 12).map(seat => ({
      ...seat,
      status: Math.random() > 0.7 ? 'booked' : 'available',
    }))
  }

  const reserveSeats = (_showtimeId: string, _seats: string[]) => {
    console.log('Reserving seats:', _seats)
  }

  // Coupon functions
  const validateCoupon = (code: string, amount: number): { valid: boolean; discount: number; message: string } => {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase())
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' }
    }
    
    if (new Date(coupon.validUntil) < new Date()) {
      return { valid: false, discount: 0, message: 'Coupon has expired' }
    }
    
    if (coupon.usedCount >= coupon.maxUses) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' }
    }
    
    if (amount < coupon.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of $${coupon.minPurchase} required` }
    }
    
    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = amount * (coupon.discountValue / 100)
    } else {
      discount = coupon.discountValue
    }
    
    return { valid: true, discount, message: `${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '$' + coupon.discountValue} discount applied!` }
  }

  // Analytics
  const analytics: Analytics = {
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    totalBookings: bookings.length,
    totalUsers: 1250,
    occupancyRate: 72,
    topMovies: [
      { movieId: '1', movieTitle: 'The Quantum Paradox', bookings: 450, revenue: 4500, occupancyRate: 85 },
      { movieId: '5', movieTitle: 'Dragon Legends', bookings: 380, revenue: 3800, occupancyRate: 78 },
      { movieId: '3', movieTitle: 'Dark Shadows', bookings: 320, revenue: 3200, occupancyRate: 70 },
    ],
    revenueByDate: [
      { date: '2024-12-14', revenue: 2500, bookings: 50 },
      { date: '2024-12-15', revenue: 3200, bookings: 64 },
      { date: '2024-12-16', revenue: 2800, bookings: 56 },
      { date: '2024-12-17', revenue: 3500, bookings: 70 },
      { date: '2024-12-18', revenue: 3100, bookings: 62 },
      { date: '2024-12-19', revenue: 4000, bookings: 80 },
      { date: '2024-12-20', revenue: 4500, bookings: 90 },
    ],
    peakHours: [
      { hour: 18, bookings: 120 },
      { hour: 19, bookings: 150 },
      { hour: 20, bookings: 180 },
      { hour: 21, bookings: 140 },
    ],
  }

  // Search
  const searchMovies = (query: string, filters?: Partial<Movie>): Movie[] => {
    return movies.filter(m => {
      const matchesQuery = !query || 
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.synopsis.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      
      const matchesFilters = !filters || 
        (!filters.genre || m.genre.some(g => filters.genre?.includes(g))) &&
        (!filters.language || m.language === filters.language) &&
        (!filters.status || m.status === filters.status)
      
      return matchesQuery && matchesFilters
    })
  }

  const cities = mockCities

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateProfile,
      addFavoriteMovie,
      removeFavoriteMovie,
      movies,
      nowShowing,
      comingSoon,
      getMovieById,
      addMovie,
      updateMovie,
      deleteMovie,
      cities,
      cinemas,
      getCinemaById,
      getCinemasByCity,
      showtimes,
      getShowtimes,
      getAvailableShowtimes,
      bookings,
      currentBooking,
      createBooking,
      cancelBooking,
      getUserBookings,
      getSeats,
      reserveSeats,
      coupons: mockCoupons,
      validateCoupon,
      analytics,
      searchMovies,
      selectedCity,
      setSelectedCity,
      selectedCinema,
      setSelectedCinema,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}