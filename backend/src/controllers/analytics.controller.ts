import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking';
import Movie from '../models/Movie';
import User from '../models/User';
import Cinema from '../models/Cinema';

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

const formatDateKey = (date: Date): string => date.toISOString().split('T')[0];

const parseGenres = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    const genres = value.map((genre) => String(genre).trim()).filter(Boolean);
    return genres.length > 0 ? genres : ['Other'];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const genres = parsed.map((genre) => String(genre).trim()).filter(Boolean);
        return genres.length > 0 ? genres : ['Other'];
      }
    } catch {
      const genres = value.split(',').map((genre) => genre.trim()).filter(Boolean);
      return genres.length > 0 ? genres : ['Other'];
    }
  }

  return ['Other'];
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawDays = Number(req.query.days || 30);
    const days = Number.isFinite(rawDays) ? Math.min(Math.max(Math.floor(rawDays), 1), 365) : 30;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
    const periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days + 1, 0, 0, 0);
    const sixMonthStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const activeBookingWhere: any = {
      status: { [Op.ne]: 'cancelled' },
      bookingDate: { [Op.gte]: sixMonthStart },
    };

    const [analyticsBookings, movies, totalUsers, activeCinemas] = await Promise.all([
      Booking.findAll({
        where: activeBookingWhere,
        attributes: ['id', 'movieId', 'movieTitle', 'totalPrice', 'paymentStatus', 'status', 'bookingDate'],
        raw: true,
      }) as Promise<any[]>,
      Movie.findAll({
        attributes: ['id', 'title', 'genre', 'rating', 'status'],
        raw: true,
      }) as Promise<any[]>,
      User.count({ where: { role: 'customer' } }),
      Cinema.count({ where: { isActive: true } }),
    ]);

    const movieById = new Map(movies.map((movie) => [movie.id, movie]));
    const periodBookings = analyticsBookings.filter((booking) => toDate(booking.bookingDate) >= periodStart);
    const paidBookings = periodBookings.filter((booking) => booking.paymentStatus === 'completed');
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + toNumber(booking.totalPrice), 0);
    const totalBookings = periodBookings.length;
    const activeMovies = movies.filter((movie) => movie.status === 'now_showing').length;
    const movieRatings = movies.map((movie) => toNumber(movie.rating)).filter((rating) => rating > 0);
    const averageRating = movieRatings.length > 0
      ? movieRatings.reduce((sum, rating) => sum + rating, 0) / movieRatings.length
      : 0;

    const chartDays = Math.min(days, 30);
    const trendDays: Array<{ date: string; day: string }> = [];
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trendDays.push({
        date: formatDateKey(date),
        day: chartDays <= 10
          ? date.toLocaleDateString('en-US', { weekday: 'short' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }

    const bookingsByDate = new Map<string, { revenue: number; bookings: number }>();
    periodBookings.forEach((booking) => {
      const dateKey = formatDateKey(toDate(booking.bookingDate));
      const current = bookingsByDate.get(dateKey) || { revenue: 0, bookings: 0 };
      current.bookings += 1;
      if (booking.paymentStatus === 'completed') {
        current.revenue += toNumber(booking.totalPrice);
      }
      bookingsByDate.set(dateKey, current);
    });

    const weeklyRevenue = trendDays.map(({ date, day }) => {
      const totals = bookingsByDate.get(date) || { revenue: 0, bookings: 0 };
      return { day, date, revenue: totals.revenue, bookings: totals.bookings, expenses: 0 };
    });

    const hourLabels = Array.from({ length: 14 }, (_, index) => index + 10);
    const todayBookingsList = periodBookings.filter((booking) => {
      const bookingDate = toDate(booking.bookingDate);
      return bookingDate >= todayStart && bookingDate < tomorrowStart;
    });
    const bookingsByHour = new Map<number, number>();
    todayBookingsList.forEach((booking) => {
      const hour = toDate(booking.bookingDate).getHours();
      bookingsByHour.set(hour, (bookingsByHour.get(hour) || 0) + 1);
    });
    const hourlyBookings = hourLabels.map((hour) => {
      const labelHour = hour > 12 ? hour - 12 : hour;
      return { hour: `${labelHour} ${hour >= 12 ? 'PM' : 'AM'}`, bookings: bookingsByHour.get(hour) || 0 };
    });

    const statusColors: Record<string, string> = {
      confirmed: '#22c55e',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#38bdf8',
      used: '#8b5cf6',
      expired: '#64748b',
    };
    const statusLabels = ['confirmed', 'pending', 'cancelled', 'completed', 'used', 'expired'];
    const bookingsByStatus = statusLabels.map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: periodBookings.filter((booking) => booking.status === status).length,
        color: statusColors[status],
      }));

    const topMovieMap = new Map<string, { movieId: string; title: string; revenue: number; bookings: number }>();
    paidBookings.forEach((booking) => {
      const movieId = booking.movieId || 'unknown';
      const current = topMovieMap.get(movieId) || {
        movieId,
        title: booking.movieTitle || movieById.get(movieId)?.title || 'Unknown Movie',
        revenue: 0,
        bookings: 0,
      };
      current.revenue += toNumber(booking.totalPrice);
      current.bookings += 1;
      topMovieMap.set(movieId, current);
    });
    const topMovies = Array.from(topMovieMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((movie) => ({
        ...movie,
        movieTitle: movie.title,
        rating: toNumber(movieById.get(movie.movieId)?.rating),
        occupancyRate: 0,
      }));

    const genreRevenue = new Map<string, number>();
    const genreBookings = new Map<string, number>();
    paidBookings.forEach((booking: any) => {
      const movie = movieById.get(booking.movieId);
      const genres = parseGenres(movie?.genre);
      genres.forEach((genre: string) => {
        genreRevenue.set(genre, (genreRevenue.get(genre) || 0) + toNumber(booking.totalPrice));
        genreBookings.set(genre, (genreBookings.get(genre) || 0) + 1);
      });
    });

    const palette = ['#ef4444', '#38bdf8', '#f59e0b', '#8b5cf6', '#22c55e', '#f97316'];
    const revenueByGenre = Array.from(genreRevenue.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], index) => ({ name, value, color: palette[index % palette.length] }));

    const totalGenreBookings = Array.from(genreBookings.values()).reduce((sum, value) => sum + value, 0);
    const topGenres = Array.from(genreBookings.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([genre, bookings], index) => ({
        genre,
        bookings,
        percentage: totalGenreBookings > 0 ? Math.round((bookings / totalGenreBookings) * 100) : 0,
        color: palette[index % palette.length],
      }));

    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const monthlyTrend = await Promise.all(
      Array.from({ length: 6 }, (_, index) => {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
        return monthDate;
      }).map(async (monthDate) => {
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
        const monthBookings = analyticsBookings.filter((booking) => {
          const bookingDate = toDate(booking.bookingDate);
          return bookingDate >= monthStart && bookingDate < monthEnd;
        });
        const revenue = monthBookings
          .filter((booking) => booking.paymentStatus === 'completed')
          .reduce((sum, booking) => sum + toNumber(booking.totalPrice), 0);

        return { month: monthFormatter.format(monthDate), revenue, bookings: monthBookings.length };
      })
    );

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        totalUsers,
        activeMovies,
        activeCinemas,
        averageRating: Number(averageRating.toFixed(1)),
        todayBookings: todayBookingsList.length,
        occupancyRate: 0,
        weeklyRevenue,
        hourlyBookings,
        bookingsByStatus,
        revenueByGenre,
        topMovies,
        topGenres,
        monthlyTrend,
        revenueByDate: weeklyRevenue,
        peakHours: hourlyBookings,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: error.message,
    });
  }
};

export const getRevenueReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const where: any = {
      paymentStatus: 'completed',
      status: { [Op.ne]: 'cancelled' },
    };

    if (startDate && endDate) {
      where.bookingDate = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    const bookings = await Booking.findAll({
      where,
      attributes: ['bookingDate', 'totalPrice'],
    });

    // Group by day
    const dailyRevenue: { [key: string]: number } = {};
    bookings.forEach((booking: any) => {
      const date = new Date(booking.bookingDate).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(booking.totalPrice);
    });

    const report = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
      bookings: bookings.filter((b: any) => 
        new Date(b.bookingDate).toISOString().split('T')[0] === date
      ).length,
    }));

    res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue report',
      error: error.message,
    });
  }
};

export const getMovieAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params;

    const bookings = await Booking.findAll({
      where: { 
        movieId,
        paymentStatus: 'completed',
        status: { [Op.ne]: 'cancelled' }
      },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.totalPrice as any), 0);
    const totalBookings = bookings.length;
    const avgTicketPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    res.json({
      success: true,
      data: {
        movieId,
        totalRevenue,
        totalBookings,
        avgTicketPrice,
      },
    });
  } catch (error: any) {
    console.error('Get movie analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movie analytics',
      error: error.message,
    });
  }
};

export const getBookingAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};

    if (startDate && endDate) {
      where.bookingDate = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    const totalBookings = await Booking.count({ where });
    const confirmedBookings = await Booking.count({ where: { ...where, status: 'confirmed' } });
    const cancelledBookings = await Booking.count({ where: { ...where, status: 'cancelled' } });
    const completedPayments = await Booking.count({ where: { ...where, paymentStatus: 'completed' } });
    const totalRevenue = await Booking.sum('totalPrice', {
      where: {
        ...where,
        paymentStatus: 'completed',
        status: { [Op.ne]: 'cancelled' },
      },
    });

    res.json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedPayments,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (error: any) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking analytics',
      error: error.message,
    });
  }
};
