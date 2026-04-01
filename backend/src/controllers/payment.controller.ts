import { Request, Response } from 'express';
import Booking from '../models/Booking';

export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, method } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.paymentStatus = status;
    if (method) where.paymentMethod = method;

    const { count, rows: payments } = await Booking.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['bookingDate', 'DESC']],
    });

    // Transform bookings to payment format
    const transformedPayments = payments.map(booking => ({
      id: `PAY-${booking.id}`,
      bookingId: booking.id,
      movieTitle: booking.movieTitle,
      showtime: booking.showtime,
      seats: booking.seats,
      ticketPrice: booking.ticketPrice,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      status: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      paymentId: booking.ticketCode,
    }));

    res.json({
      success: true,
      data: {
        payments: transformedPayments,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get all payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message,
    });
  }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bookingId = id.replace('PAY-', '');
    
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
      return;
    }

    const payment = {
      id: `PAY-${booking.id}`,
      bookingId: booking.id,
      movieTitle: booking.movieTitle,
      showtime: booking.showtime,
      seats: booking.seats,
      ticketPrice: booking.ticketPrice,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      status: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      paymentId: booking.ticketCode,
    };

    res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error('Get payment by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment',
      error: error.message,
    });
  }
};

export const getPaymentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.findAll();

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const completedPayments = bookings.filter(b => b.paymentStatus === 'completed').length;
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
    const failedPayments = bookings.filter(b => b.paymentStatus === 'failed').length;

    // By payment method
    const methodCounts: Record<string, number> = {};
    bookings.forEach(b => {
      const method = b.paymentMethod || 'unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions: bookings.length,
        completedPayments,
        pendingPayments,
        failedPayments,
        methodCounts,
      },
    });
  } catch (error: any) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment stats',
      error: error.message,
    });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const bookingId = id.replace('PAY-', '');
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
      return;
    }

    await booking.update({ paymentStatus: status });

    res.json({
      success: true,
      message: 'Payment status updated',
      data: booking,
    });
  } catch (error: any) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};
