'use client'

import { useState, useEffect, useCallback } from 'react'
import { moviesAPI, cinemasAPI, showtimesAPI, bookingsAPI, usersAPI, analyticsAPI, couponsAPI } from '@/lib/api'

// Type for loading state
type LoadingState = {
  [key: string]: boolean
}

// Type for error state
type ErrorState = {
  [key: string]: string | null
}

// Custom hook for Movies CRUD
export function useMovies() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await moviesAPI.getAll(params)
      if (response.success && response.data) {
        setMovies(response.data.movies)
      } else {
        // Fallback - use data from context
        setError(null)
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createMovie = async (data: any) => {
    setLoading(true)
    try {
      const response = await moviesAPI.create(data)
      if (response.success && response.data) {
        setMovies(prev => [...prev, response.data])
        return response.data
      }
      throw new Error(response.message || 'Failed to create movie')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMovie = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await moviesAPI.update(id, data)
      if (response.success && response.data) {
        setMovies(prev => prev.map(m => m.id === id ? response.data : m))
        return response.data
      }
      throw new Error(response.message || 'Failed to update movie')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMovie = async (id: string) => {
    setLoading(true)
    try {
      const response = await moviesAPI.delete(id)
      if (response.success) {
        setMovies(prev => prev.filter(m => m.id !== id))
      } else {
        throw new Error(response.message || 'Failed to delete movie')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { movies, loading, error, fetchMovies, createMovie, updateMovie, deleteMovie }
}

// Custom hook for Cinemas CRUD
export function useCinemas() {
  const [cinemas, setCinemas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCinemas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await cinemasAPI.getAll()
      if (response.success && response.data) {
        setCinemas(response.data.cinemas)
      }
    } catch (err: any) {
      console.error('Error fetching cinemas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCinema = async (data: any) => {
    setLoading(true)
    try {
      const response = await cinemasAPI.create(data)
      if (response.success && response.data) {
        setCinemas(prev => [...prev, response.data])
        return response.data
      }
      throw new Error(response.message || 'Failed to create cinema')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCinema = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await cinemasAPI.update(id, data)
      if (response.success && response.data) {
        setCinemas(prev => prev.map(c => c.id === id ? response.data : c))
        return response.data
      }
      throw new Error(response.message || 'Failed to update cinema')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCinema = async (id: string) => {
    setLoading(true)
    try {
      const response = await cinemasAPI.delete(id)
      if (response.success) {
        setCinemas(prev => prev.filter(c => c.id !== id))
      } else {
        throw new Error(response.message || 'Failed to delete cinema')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { cinemas, loading, error, fetchCinemas, createCinema, updateCinema, deleteCinema }
}

// Custom hook for Showtimes CRUD
export function useShowtimes() {
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchShowtimes = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await showtimesAPI.getAll(params)
      if (response.success && response.data) {
        setShowtimes(response.data.showtimes)
      }
    } catch (err: any) {
      console.error('Error fetching showtimes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createShowtime = async (data: any) => {
    setLoading(true)
    try {
      const response = await showtimesAPI.create(data)
      if (response.success && response.data) {
        setShowtimes(prev => [...prev, response.data])
        return response.data
      }
      throw new Error(response.message || 'Failed to create showtime')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateShowtime = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await showtimesAPI.update(id, data)
      if (response.success && response.data) {
        setShowtimes(prev => prev.map(s => s.id === id ? response.data : s))
        return response.data
      }
      throw new Error(response.message || 'Failed to update showtime')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteShowtime = async (id: string) => {
    setLoading(true)
    try {
      const response = await showtimesAPI.delete(id)
      if (response.success) {
        setShowtimes(prev => prev.filter(s => s.id !== id))
      } else {
        throw new Error(response.message || 'Failed to delete showtime')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { showtimes, loading, error, fetchShowtimes, createShowtime, updateShowtime, deleteShowtime }
}

// Custom hook for Bookings
export function useBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingsAPI.getAll(params)
      if (response.success && response.data) {
        setBookings(response.data.bookings)
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBookingStatus = async (id: string, status: string) => {
    setLoading(true)
    try {
      const response = await bookingsAPI.updateStatus(id, status)
      if (response.success && response.data) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
        return response.data
      }
      throw new Error(response.message || 'Failed to update booking status')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id: string) => {
    setLoading(true)
    try {
      const response = await bookingsAPI.cancel(id)
      if (response.success) {
        setBookings(prev => prev.filter(b => b.id !== id))
      } else {
        throw new Error(response.message || 'Failed to cancel booking')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { bookings, loading, error, fetchBookings, updateBookingStatus, cancelBooking }
}

// Custom hook for Users/Customers
export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await usersAPI.getAll(params)
      if (response.success && response.data) {
        setCustomers(response.data.users)
      }
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCustomer = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await usersAPI.update(id, data)
      if (response.success && response.data) {
        setCustomers(prev => prev.map(c => c.id === id ? response.data : c))
        return response.data
      }
      throw new Error(response.message || 'Failed to update customer')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (id: string) => {
    setLoading(true)
    try {
      const response = await usersAPI.delete(id)
      if (response.success) {
        setCustomers(prev => prev.filter(c => c.id !== id))
      } else {
        throw new Error(response.message || 'Failed to delete customer')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { customers, loading, error, fetchCustomers, updateCustomer, deleteCustomer }
}

// Custom hook for Analytics
export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await analyticsAPI.getDashboard()
      if (response.success && response.data) {
        setAnalytics(response.data)
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { analytics, loading, error, fetchAnalytics }
}

// Custom hook for Coupons
export function useCoupons() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await couponsAPI.getAll()
      if (response.success && response.data) {
        setCoupons(response.data.coupons)
      }
    } catch (err: any) {
      console.error('Error fetching coupons:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCoupon = async (data: any) => {
    setLoading(true)
    try {
      const response = await couponsAPI.create(data)
      if (response.success && response.data) {
        setCoupons(prev => [...prev, response.data])
        return response.data
      }
      throw new Error(response.message || 'Failed to create coupon')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCoupon = async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await couponsAPI.update(id, data)
      if (response.success && response.data) {
        setCoupons(prev => prev.map(c => c.id === id ? response.data : c))
        return response.data
      }
      throw new Error(response.message || 'Failed to update coupon')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCoupon = async (id: string) => {
    setLoading(true)
    try {
      const response = await couponsAPI.delete(id)
      if (response.success) {
        setCoupons(prev => prev.filter(c => c.id !== id))
      } else {
        throw new Error(response.message || 'Failed to delete coupon')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { coupons, loading, error, fetchCoupons, createCoupon, updateCoupon, deleteCoupon }
}