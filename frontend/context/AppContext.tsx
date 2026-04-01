'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Movie, Cinema, Seat, Showtime, Booking, User, Analytics } from '@/types'

// API Base URL - change to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// Types
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  errors?: any
}

interface AuthResponse {
  user: User
  token: string
}

// API Helper
const api = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error',
      }
    }
  },

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  },

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  },
}

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
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>
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
  validateCoupon: (code: string, amount: number) => Promise<{ valid: boolean; discount: number; message: string }>
  analytics: Analytics
  searchMovies: (query: string, filters?: Partial<Movie>) => Movie[]
  selectedCity: string
  setSelectedCity: (city: string) => void
  selectedCinema: string
  setSelectedCinema: (city: string) => void
  isLoading: boolean
  isOnline: boolean
  fetchMovies: () => Promise<void>
  fetchCinemas: () => Promise<void>
  fetchShowtimes: () => Promise<void>
  fetchBookings: () => Promise<void>
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
  const [isOnline, setIsOnline] = useState(false)

  // Check if backend is available and load data
  useEffect(() => {
    // Load user from localStorage if exists
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user from localStorage')
      }
    }
    
    checkBackendConnection()
    fetchMovies()
    fetchCinemas()
    fetchShowtimes()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: controller.signal 
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        setIsOnline(true)
      }
    } catch {
      setIsOnline(false)
    }
  }

  // API Fetch functions
  const fetchMovies = async () => {
    try {
      const response = await api.get<{ movies: Movie[] }>('/movies')
      if (response.success && response.data?.movies) {
        setMovies(response.data.movies)
      }
    } catch {
      console.error('Failed to fetch movies from API')
    }
  }

  const fetchCinemas = async () => {
    try {
      const response = await api.get<{ cinemas: Cinema[] }>('/cinemas')
      if (response.success && response.data?.cinemas) {
        setCinemas(response.data.cinemas)
      }
    } catch {
      console.error('Failed to fetch cinemas from API')
    }
  }

  const fetchShowtimes = async () => {
    try {
      const response = await api.get<{ showtimes: Showtime[] }>('/showtimes')
      if (response.success && response.data?.showtimes) {
        setShowtimes(response.data.showtimes)
      }
    } catch {
      console.error('Failed to fetch showtimes from API')
    }
  }

  const fetchBookings = async () => {
    if (!user) return
    try {
      const response = await api.get<{ bookings: Booking[] }>('/bookings')
      if (response.success && response.data?.bookings) {
        setBookings(response.data.bookings)
      }
    } catch {
      console.error('Failed to fetch bookings from API')
    }
  }

  // User functions
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // Try API login first
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      
      if (response.success && response.data) {
        // Store token and user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser(response.data.user)
      } else {
        // Fallback to mock login
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      // Check if backend is online - if not, use mock login
      if (!isOnline) {
        // Mock login for offline mode
        const mockUser: User = {
          id: '1',
          email,
          phone: '+85512345678',
          firstName: email.split('@')[0],
          lastName: 'User',
          role: email.includes('admin') ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          favoriteMovies: [],
          favoriteCinemas: [],
          notifications: { email: true, sms: true, push: true },
        }
        localStorage.setItem('user', JSON.stringify(mockUser))
        setUser(mockUser)
      } else {
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear all authentication-related data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear user-specific data from localStorage
    localStorage.removeItem('bookings')
    localStorage.removeItem('cinemahub_bookings')
    
    // Reset state
    setUser(null)
    setBookings([])
    setCurrentBooking(null)
    
    // Force a page reload to ensure all state is cleared
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
  }

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    setIsLoading(true)
    
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        ...data,
        email: data.email.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        password: data.password.trim(),
      })
      
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser(response.data.user)
      } else {
        const errorMsg = response.errors?.join(', ') || response.message || 'Registration failed'
        throw new Error(errorMsg)
      }
    } catch (error: any) {
      if (!isOnline) {
        // Mock register for offline mode
        const mockUser: User = {
          id: Date.now().toString(),
          email: data.email,
          phone: data.phone || '',
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user',
          createdAt: new Date().toISOString(),
          favoriteMovies: [],
          favoriteCinemas: [],
          notifications: { email: true, sms: true, push: true },
        }
        setUser(mockUser)
      } else {
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    
    try {
      const response = await api.put<User>('/auth/profile', data)
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch {
      // Fallback to local update
      setUser({ ...user, ...data })
    }
  }

  const addFavoriteMovie = async (movieId: string) => {
    if (!user) return
    
    try {
      await api.post('/auth/favorites', { movieId })
    } catch {
      console.error('Failed to add favorite')
    }
    
    if (!user.favoriteMovies.includes(movieId)) {
      setUser({ ...user, favoriteMovies: [...user.favoriteMovies, movieId] })
    }
  }

  const removeFavoriteMovie = async (movieId: string) => {
    if (!user) return
    
    try {
      await api.delete(`/auth/favorites/${movieId}`)
    } catch {
      console.error('Failed to remove favorite')
    }
    
    setUser({ ...user, favoriteMovies: user.favoriteMovies.filter(id => id !== movieId) })
  }

  // Movie functions
  const nowShowing = movies.filter(m => m.status === 'now_showing')
  const comingSoon = movies.filter(m => m.status === 'coming_soon')
  
  const getMovieById = (id: string) => movies.find(m => m.id === id)
  
  const addMovie = async (movie: Movie) => {
    try {
      const response = await api.post<Movie>('/movies', movie)
      if (response.success && response.data) {
        setMovies([...movies, response.data])
      }
    } catch {
      console.error('Failed to add movie')
    }
  }
  
  const updateMovie = async (id: string, data: Partial<Movie>) => {
    try {
      const response = await api.put<Movie>(`/movies/${id}`, data)
      if (response.success && response.data) {
        setMovies(movies.map(m => m.id === id ? response.data! : m))
      }
    } catch {
      console.error('Failed to update movie')
    }
  }
  
  const deleteMovie = async (id: string) => {
    try {
      const response = await api.delete(`/movies/${id}`)
      if (response.success) {
        setMovies(movies.filter(m => m.id !== id))
      }
    } catch {
      console.error('Failed to delete movie')
    }
  }

  // Cinema functions
  const getCinemaById = (id: string) => cinemas.find(c => c.id === id)
  
  const getCinemasByCity = (city: string) => cinemas.filter(c => c.city === city)

  // Showtime functions
  const getShowtimes = (movieId: string, cinemaId?: string, date?: string) => {
    return showtimes.filter(s => {
      if (s.movieId !== movieId) return false
      if (cinemaId && s.cinemaId !== cinemaId) return false
      if (date && s.date !== date) return true
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

    // Ensure we have a userId
    if (!user?.id) {
      // Create a mock user ID for demo purposes or throw error
      console.warn('No user logged in, using demo user ID')
    }

    try {
      const response = await api.post<Booking>('/bookings', {
        ...booking,
        userId: user?.id || 'demo-user-id', // Fallback for demo
      })
      
      if (response.success && response.data) {
        setBookings([...bookings, response.data])
        setIsLoading(false)
        return response.data
      }
      throw new Error(response.message || 'Booking failed')
    } catch (error: any) {
      setIsLoading(false)
      throw error
    }
  }

  const cancelBooking = async (id: string) => {
    try {
      const response = await api.delete(`/bookings/${id}`)
      if (response.success) {
        setBookings(bookings.map(b => 
          b.id === id ? { ...b, status: 'cancelled' as const } : b
        ))
      }
    } catch {
      console.error('Failed to cancel booking')
    }
  }

  const getUserBookings = (_userId: string) => {
    return bookings
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
  const validateCoupon = async (code: string, amount: number): Promise<{ valid: boolean; discount: number; message: string }> => {
    try {
      const response = await api.post<{ valid: boolean; discount: number; message: string }>(
        '/coupons/validate',
        { code, amount }
      )
      if (response.success && response.data) {
        return response.data
      }
      return { valid: false, discount: 0, message: 'Invalid coupon' }
    } catch {
      return { valid: false, discount: 0, message: 'Failed to validate coupon' }
    }
  }

  // Analytics
  const analytics: Analytics = {
    totalRevenue: bookings.reduce((sum, b) => sum + (typeof b.totalPrice === 'number' ? b.totalPrice : 0), 0),
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
      const genreArray = Array.isArray(m.genre) ? m.genre : String(m.genre || '').split(',')
      const matchesQuery = !query || 
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.synopsis?.toLowerCase().includes(query.toLowerCase()) ||
        genreArray.some(g => g.toLowerCase().includes(query.toLowerCase()))
      
      const matchesFilters = !filters || 
        (!filters.genre || genreArray.some(g => filters.genre?.includes(g))) &&
        (!filters.language || m.language === filters.language) &&
        (!filters.status || m.status === filters.status)
      
      return matchesQuery && matchesFilters
    })
  }

  const cities = mockCities

  // Coupons (mock for now)
  const coupons = [
    { code: 'NEWUSER20', discountType: 'percentage' as const, discountValue: 20, minPurchase: 20, validUntil: '2025-12-31', maxUses: 100, usedCount: 45 },
    { code: 'MOVIE50', discountType: 'fixed' as const, discountValue: 5, minPurchase: 30, validUntil: '2025-06-30', maxUses: 200, usedCount: 120 },
    { code: 'WEEKEND30', discountType: 'percentage' as const, discountValue: 30, minPurchase: 25, validUntil: '2025-03-31', maxUses: 50, usedCount: 30 },
  ]

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
      coupons,
      validateCoupon,
      analytics,
      searchMovies,
      selectedCity,
      setSelectedCity,
      selectedCinema,
      setSelectedCinema: setSelectedCinema,
      isLoading,
      isOnline,
      fetchMovies,
      fetchCinemas,
      fetchShowtimes,
      fetchBookings,
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