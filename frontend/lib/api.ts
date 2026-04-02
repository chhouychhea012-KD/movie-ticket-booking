'use client'

import { Movie, Cinema, Showtime, Booking, User, Coupon } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Create headers with auth
const getHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Handle API response
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json()
  return data
}

// ============ AUTH API ============
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ user: User; token: string }>(response)
  },

  register: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse<{ user: User; token: string }>(response)
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    })
    return handleResponse<User>(response)
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<User>(response)
  },
}

// ============ MOVIES API ============
export const moviesAPI = {
  getAll: async (params?: { status?: string; genre?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.genre) searchParams.set('genre', params.genre)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/movies?${searchParams.toString()}`)
    return handleResponse<{ movies: Movie[]; total: number; page: number; totalPages: number }>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`)
    return handleResponse<Movie>(response)
  },

  create: async (data: Partial<Movie>) => {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Movie>(response)
  },

  update: async (id: string, data: Partial<Movie>) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Movie>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },

  getNowShowing: async () => {
    const response = await fetch(`${API_BASE_URL}/movies/now-showing`)
    return handleResponse<Movie[]>(response)
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/movies/featured`)
    return handleResponse<Movie[]>(response)
  },
}

// ============ CINEMAS API ============
export const cinemasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/cinemas`)
    return handleResponse<{ cinemas: Cinema[] }>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cinemas/${id}`)
    return handleResponse<Cinema>(response)
  },

  create: async (data: Partial<Cinema>) => {
    const response = await fetch(`${API_BASE_URL}/cinemas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Cinema>(response)
  },

  update: async (id: string, data: Partial<Cinema>) => {
    const response = await fetch(`${API_BASE_URL}/cinemas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Cinema>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cinemas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },
}

// ============ SHOWTIMES API ============
export const showtimesAPI = {
  getAll: async (params?: { movieId?: string; cinemaId?: string; date?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.movieId) searchParams.set('movieId', params.movieId)
    if (params?.cinemaId) searchParams.set('cinemaId', params.cinemaId)
    if (params?.date) searchParams.set('date', params.date)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/showtimes?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<{ showtimes: Showtime[]; total: number; page: number; totalPages: number }>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/showtimes/${id}`)
    return handleResponse<Showtime>(response)
  },

  create: async (data: Partial<Showtime>) => {
    const response = await fetch(`${API_BASE_URL}/showtimes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Showtime>(response)
  },

  update: async (id: string, data: Partial<Showtime>) => {
    const response = await fetch(`${API_BASE_URL}/showtimes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Showtime>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/showtimes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },
}

// ============ BOOKINGS API ============
export const bookingsAPI = {
  getAll: async (params?: { status?: string; userId?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.userId) searchParams.set('userId', params.userId)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/bookings?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<{ bookings: Booking[]; total: number; page: number; totalPages: number }>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getHeaders(),
    })
    return handleResponse<Booking>(response)
  },

  create: async (data: Partial<Booking>) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Booking>(response)
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return handleResponse<Booking>(response)
  },

  cancel: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },
}

// ============ USERS API ============
export const usersAPI = {
  getAll: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.role) searchParams.set('role', params.role)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/users?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<{ users: User[]; total: number; page: number; totalPages: number }>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(),
    })
    return handleResponse<User>(response)
  },

  create: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; role?: string }) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<User>(response)
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<User>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },
}

// ============ COUPONS API ============
export const couponsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      headers: getHeaders(),
    })
    return handleResponse<{ coupons: Coupon[] }>(response)
  },

  create: async (data: Partial<Coupon>) => {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Coupon>(response)
  },

  update: async (id: string, data: Partial<Coupon>) => {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<Coupon>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },

  validate: async (code: string, amount: number) => {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount }),
    })
    return handleResponse<{ valid: boolean; discount: number; message: string }>(response)
  },
}

// ============ ANALYTICS API ============
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getRevenue: async (params?: { startDate?: string; endDate?: string; groupBy?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.groupBy) searchParams.set('groupBy', params.groupBy)
    
    const response = await fetch(`${API_BASE_URL}/analytics/revenue?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getBookings: async (params?: { startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    
    const response = await fetch(`${API_BASE_URL}/analytics/bookings?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },
}

// ============ TICKETS API ============
export const ticketsAPI = {
  validate: async (ticketCode: string) => {
    const response = await fetch(`${API_BASE_URL}/tickets/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode }),
    })
    return handleResponse<any>(response)
  },

  getRecent: async (limit?: number) => {
    const searchParams = new URLSearchParams()
    if (limit) searchParams.set('limit', limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/tickets/recent?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/tickets/stats`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },
}

// ============ PAYMENTS API ============
export const paymentsAPI = {
  getAll: async (params?: { status?: string; method?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.method) searchParams.set('method', params.method)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/payments?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/stats`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return handleResponse<any>(response)
  },
}

// ============ NOTIFICATIONS API ============
export const notificationsAPI = {
  getAll: async (params?: { type?: string; read?: boolean; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.read !== undefined) searchParams.set('read', params.read.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/notifications?${searchParams.toString()}`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  create: async (data: { type: string; title: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<any>(response)
  },

  markAsRead: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  deleteAll: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
      headers: getHeaders(),
    })
    return handleResponse<any>(response)
  },
}

export default {
  auth: authAPI,
  movies: moviesAPI,
  cinemas: cinemasAPI,
  showtimes: showtimesAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  coupons: couponsAPI,
  analytics: analyticsAPI,
  tickets: ticketsAPI,
  payments: paymentsAPI,
  notifications: notificationsAPI,
}