import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking';
import Movie from '../models/Movie';
import User from '../models/User';
import Cinema from '../models/Cinema';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawDays = Number(req.query.days || 30);
    const days = Number.isFinite(rawDays) ? Math.min(Math.max(Math.floor(rawDays), 1), 365) : 30;
    const today = new Date();
    const periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days + 1, 0, 0, 0);

    const revenueWhere: any = {
      paymentStatus: 'completed',
      status: { [Op.ne]: 'cancelled' },
      bookingDate: { [Op.gte]: periodStart },
    };
    const activeBookingWhere: any = {
      status: { [Op.ne]: 'cancelled' },
      bookingDate: { [Op.gte]: periodStart },
    };

    const totalRevenue = await Booking.sum('totalPrice', { where: revenueWhere });

    const totalBookings = await Booking.count({ where: activeBookingWhere });

    const totalUsers = await User.count({ where: { role: 'customer' } });
    const activeMovies = await Movie.count({ where: { status: 'now_showing' } });
    const activeCinemas = await Cinema.count({ where: { isActive: true } });

    const averageRatingResult = await Movie.findOne({
      attributes: [[Movie.sequelize!.fn('AVG', Movie.sequelize!.col('rating')), 'averageRating']],
      raw: true,
    }) as any;
    const averageRating = Number(averageRatingResult?.averageRating || 0);

    const chartDays = Math.min(days, 30);
    const trendDays: Array<{ date: string; day: string }> = [];
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trendDays.push({
        date: date.toISOString().split('T')[0],
        day: chartDays <= 10
          ? date.toLocaleDateString('en-US', { weekday: 'short' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }

    const weeklyRevenue = await Promise.all(
      trendDays.map(async ({ date, day }) => {
        const revenue = await Booking.sum('totalPrice', {
          where: {
            bookingDate: {
              [Op.gte]: `${date}T00:00:00`,
              [Op.lt]: `${date}T23:59:59`,
            },
            paymentStatus: 'completed',
            status: { [Op.ne]: 'cancelled' },
          },
        });

        const bookings = await Booking.count({
          where: {
            bookingDate: {
              [Op.gte]: `${date}T00:00:00`,
              [Op.lt]: `${date}T23:59:59`,
            },
            status: { [Op.ne]: 'cancelled' },
          },
        });

        return { day, date, revenue: Number(revenue || 0), bookings, expenses: 0 };
      })
    );

    const hourLabels = Array.from({ length: 14 }, (_, index) => index + 10);
    const hourlyBookings = await Promise.all(
      hourLabels.map(async (hour) => {
        const bookings = await Booking.count({
          where: {
            bookingDate: {
              [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0, 0),
              [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour + 1, 0, 0),
            },
            status: { [Op.ne]: 'cancelled' },
          },
        });

        const labelHour = hour > 12 ? hour - 12 : hour;
        return { hour: `${labelHour} ${hour >= 12 ? 'PM' : 'AM'}`, bookings };
      })
    );

    const statusColors: Record<string, string> = {
      confirmed: '#22c55e',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#38bdf8',
      used: '#8b5cf6',
      expired: '#64748b',
    };
    const statusLabels = ['confirmed', 'pending', 'cancelled', 'completed', 'used', 'expired'];
    const bookingsByStatus = await Promise.all(
      statusLabels.map(async (status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: await Booking.count({ where: { ...activeBookingWhere, status } }),
        color: statusColors[status],
      }))
    );

    const topMoviesData = await Booking.findAll({
      attributes: [
        'movieId',
        'movieTitle',
        [Booking.sequelize!.fn('SUM', Booking.sequelize!.col('totalPrice')), 'revenue'],
        [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'bookings'],
      ],
      where: revenueWhere,
      group: ['movieId', 'movieTitle'],
      order: [[Booking.sequelize!.literal('revenue'), 'DESC']],
      limit: 5,
    });

    const topMovieIds = topMoviesData.map((m: any) => m.movieId);
    const topMovieRows = topMovieIds.length > 0
      ? await Movie.findAll({ where: { id: { [Op.in]: topMovieIds } }, attributes: ['id', 'rating'] })
      : [];
    const ratingByMovieId = new Map(topMovieRows.map((movie: any) => [movie.id, Number(movie.rating || 0)]));

    const topMovies = topMoviesData.map((m: any) => ({
      movieId: m.movieId,
      title: m.movieTitle,
      movieTitle: m.movieTitle,
      revenue: parseFloat(m.dataValues.revenue) || 0,
      bookings: parseInt(m.dataValues.bookings) || 0,
      rating: ratingByMovieId.get(m.movieId) || 0,
      occupancyRate: 0,
    }));

    const paidBookings = await Booking.findAll({
      where: revenueWhere,
      include: [{ model: Movie, as: 'movie', attributes: ['genre', 'rating'] }],
    });

    const genreRevenue = new Map<string, number>();
    const genreBookings = new Map<string, number>();
    paidBookings.forEach((booking: any) => {
      const movie = booking.get('movie') as any;
      const genres = Array.isArray(movie?.genre) && movie.genre.length > 0 ? movie.genre : ['Other'];
      genres.forEach((genre: string) => {
        genreRevenue.set(genre, (genreRevenue.get(genre) || 0) + Number(booking.totalPrice || 0));
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

        const revenue = await Booking.sum('totalPrice', {
          where: {
            ...revenueWhere,
            bookingDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
          },
        });
        const bookings = await Booking.count({
          where: {
            ...activeBookingWhere,
            bookingDate: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
          },
        });

        return { month: monthFormatter.format(monthDate), revenue: Number(revenue || 0), bookings };
      })
    );

    const todayBookings = await Booking.count({
      where: {
        ...activeBookingWhere,
        bookingDate: {
          [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
          [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0),
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue || 0),
        totalBookings,
        totalUsers,
        activeMovies,
        activeCinemas,
        averageRating: Number(averageRating.toFixed(1)),
        todayBookings,
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
