'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Movie, Cinema, Seat, Showtime, Booking, User, UserRole, City, Analytics } from '@/types'
import { dataStore } from '@/lib/data-store'

// Mock Data Store - Cities (static)
const mockCities = [
  { id: '1', name: 'Phnom Penh', country: 'Cambodia', cinemas: ['1', '2', '3'] },
  { id: '2', name: 'Siem Reap', country: 'Cambodia', cinemas: ['4'] },
  { id: '3', name: 'Battambang', country: 'Cambodia', cinemas: ['5'] },
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
  coupons: any[]
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
  const [movies, setMovies] = useState<Movie[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedCity, setSelectedCity] = useState('Phnom Penh')
  const [selectedCinema, setSelectedCinema] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)

  // Initialize data store and load data
  useEffect(() => {
    dataStore.initialize()
    setMovies(dataStore.movies.getAll())
    setCinemas(dataStore.cinemas.getAll())
    setShowtimes(dataStore.showtimes.getAll())
    setBookings(dataStore.bookings.getAll())
  }, [])

  // User functions
  const login = async (email: string, _password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check users from dataStore
    const users = dataStore.users.getAll()
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (foundUser) {
      setUser(foundUser)
    } else if (email === 'admin@cinemahub.com' || email === 'admin') {
      // Default admin login
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
    } else if (email === 'staff@cinemahub.com' || email === 'staff') {
      // Staff login
      setUser({
        id: 'staff-1',
        email: 'staff@cinemahub.com',
        phone: '+85512345679',
        firstName: 'Staff',
        lastName: 'Member',
        role: 'staff',
        createdAt: new Date().toISOString(),
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      })
    } else if (email === 'owner@cinemahub.com' || email === 'owner') {
      // Owner login
      setUser({
        id: 'owner-1',
        email: 'owner@cinemahub.com',
        phone: '+85512345670',
        firstName: 'Owner',
        lastName: 'Manager',
        role: 'owner',
        createdAt: new Date().toISOString(),
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      })
    } else {
      // Default regular user
      setUser({
        id: '1',
        email,
        phone: '+85512345678',
        firstName: 'User',
        lastName: 'Customer',
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
  
  const getMovieById = (id: string) => dataStore.movies.getById(id)
  
  const addMovie = (movie: Movie) => {
    const newMovie = dataStore.movies.create(movie)
    setMovies([...movies, newMovie])
  }
  
  const updateMovie = (id: string, data: Partial<Movie>) => {
    const updated = dataStore.movies.update(id, data)
    if (updated) {
      setMovies(movies.map(m => m.id === id ? updated : m))
    }
  }
  
  const deleteMovie = (id: string) => {
    const success = dataStore.movies.delete(id)
    if (success) {
      setMovies(movies.filter(m => m.id !== id))
    }
  }

  // Cinema functions
  const getCinemaById = (id: string) => dataStore.cinemas.getById(id)
  
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
    await new Promise(resolve => setTimeout(resolve, 500))

    const newBooking = dataStore.bookings.create({
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
      status: 'confirmed',
    })
    
    setBookings([...bookings, newBooking])
    setIsLoading(false)
    return newBooking
  }

  const cancelBooking = (id: string) => {
    const updated = dataStore.bookings.update(id, { status: 'cancelled' })
    if (updated) {
      setBookings(bookings.map(b => b.id === id ? updated : b))
    }
  }

  const getUserBookings = (_userId: string) => {
    return bookings.filter(b => b.userId === 'guest' || b.userId === _userId)
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
    return dataStore.coupons.validate(code, amount)
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
      coupons: dataStore.coupons.getAll(),
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