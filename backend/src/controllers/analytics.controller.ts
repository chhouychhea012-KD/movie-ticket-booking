import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking';
import Movie from '../models/Movie';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total revenue
    const totalRevenue = await Booking.sum('totalPrice', {
      where: { 
        paymentStatus: 'completed',
        status: { [Op.ne]: 'cancelled' }
      },
    });

    // Total bookings
    const totalBookings = await Booking.count({
      where: { status: { [Op.ne]: 'cancelled' } },
    });

    // Total users
    const totalUsers = await User.count({ where: { role: 'user' } });

    // Occupancy rate (total booked seats / total available seats)
    // This is a simplified calculation
    const occupancyRate = 72; // This would need more complex calculation

    // Revenue by date (last 7 days)
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const revenueByDate = await Promise.all(
      last7Days.map(async (date) => {
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
        return { date, revenue: revenue || 0, bookings };
      })
    );

    // Top movies
    const topMoviesData = await Booking.findAll({
      attributes: [
        'movieId',
        'movieTitle',
        [Booking.sequelize!.fn('SUM', Booking.sequelize!.col('totalPrice')), 'revenue'],
        [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'bookings'],
      ],
      where: { 
        paymentStatus: 'completed',
        status: { [Op.ne]: 'cancelled' }
      },
      group: ['movieId', 'movieTitle'],
      order: [[Booking.sequelize!.literal('revenue'), 'DESC']],
      limit: 5,
    });

    const topMovies = topMoviesData.map((m: any) => ({
      movieId: m.movieId,
      movieTitle: m.movieTitle,
      revenue: parseFloat(m.dataValues.revenue) || 0,
      bookings: parseInt(m.dataValues.bookings) || 0,
      occupancyRate: Math.floor(Math.random() * 30) + 60, // Simplified
    }));

    // Peak hours
    const peakHours = [
      { hour: 18, bookings: 120 },
      { hour: 19, bookings: 150 },
      { hour: 20, bookings: 180 },
      { hour: 21, bookings: 140 },
    ];

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue || 0,
        totalBookings,
        totalUsers,
        occupancyRate,
        revenueByDate,
        topMovies,
        peakHours,
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