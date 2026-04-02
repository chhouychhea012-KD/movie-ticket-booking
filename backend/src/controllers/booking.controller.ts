import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/Booking';
import Showtime from '../models/Showtime';
import Ticket from '../models/Ticket';
import Coupon from '../models/Coupon';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      movieId, movieTitle, cinemaId, cinemaName, screenId, 
      showtimeId, showtime, seats, ticketPrice, totalPrice, 
      couponCode, paymentMethod, userId: bodyUserId 
    } = req.body;

    // Use userId from auth middleware or from request body (for demo/offline mode)
    const userId = req.userId || bodyUserId || 'demo-user-id';

    // Validate showtime
    const showtimeData = await Showtime.findByPk(showtimeId);
    if (!showtimeData) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
      return;
    }

    if (showtimeData.availableSeats < seats.length) {
      res.status(400).json({
        success: false,
        message: 'Not enough available seats',
      });
      return;
    }

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (coupon) {
        const validation = coupon.isValid(totalPrice);
        if (validation.valid) {
          discount = validation.discount;
          // Increment coupon usage
          await coupon.update({ usedCount: coupon.usedCount + 1 });
        }
      }
    }

    // Generate ticket code
    const ticketCode = `TKT${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create booking
    const booking = await Booking.create({
      userId,
      movieId,
      movieTitle,
      cinemaId,
      cinemaName,
      screenId,
      showtimeId,
      showtime,
      seats,
      ticketPrice,
      totalPrice: totalPrice - discount,
      discount: discount > 0 ? discount : undefined,
      couponCode,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'confirmed',
      ticketCode,
      bookingDate: new Date(),
    });

    // Update available seats
    await showtimeData.update({
      availableSeats: showtimeData.availableSeats - seats.length,
    });

    // Create tickets
    for (const seat of seats) {
      await Ticket.create({
        bookingId: booking.id,
        seatId: seat.seatId,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price,
        status: 'valid',
        qrCode: `${ticketCode}-${seat.seatId}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // If userId is provided, filter by user, otherwise return all
    const where: any = req.userId ? { userId: req.userId } : {};

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['bookingDate', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        bookings,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message,
    });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      where: req.userId ? { id, userId: req.userId } : { id },
      include: ['tickets'],
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Get booking by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message,
    });
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      where: req.userId ? { id, userId: req.userId } : { id },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Booking already cancelled',
      });
      return;
    }

    // Update booking status
    await booking.update({ status: 'cancelled', paymentStatus: 'refunded' });

    // Restore available seats
    const showtime = await Showtime.findByPk(booking.showtimeId);
    if (showtime) {
      await showtime.update({
        availableSeats: showtime.availableSeats + booking.seats.length,
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

// Admin controllers
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['bookingDate', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        bookings,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message,
    });
  }
};

export const getBookingByTicketCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketCode } = req.params;
    const booking = await Booking.findOne({
      where: { ticketCode },
      include: ['tickets', 'user', 'movie', 'cinema'],
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Get booking by ticket code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    await booking.update({ status });

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};