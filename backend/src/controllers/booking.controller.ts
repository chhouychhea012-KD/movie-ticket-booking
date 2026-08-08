import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middleware/auth';
import Booking from '../models/Booking';
import Showtime from '../models/Showtime';
import Ticket from '../models/Ticket';
import Coupon from '../models/Coupon';
import Movie from '../models/Movie';
import Cinema from '../models/Cinema';
import sequelize from '../config/database';

const activeBookingStatuses = ['pending', 'confirmed', 'completed', 'used'];

const seatMultiplier = (seatType: string): number => {
  switch (seatType) {
    case 'vip':
      return 1.5;
    case 'couple':
      return 1.3;
    default:
      return 1;
  }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      movieId, cinemaId,
      showtimeId, seats,
      couponCode, paymentMethod
    } = req.body;

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: 'Please log in before creating a booking',
      });
      return;
    }

    const userId = req.userId;

    const showtimeData = await Showtime.findByPk(showtimeId);
    if (!showtimeData) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
      return;
    }

    if (showtimeData.movieId !== movieId || showtimeData.cinemaId !== cinemaId) {
      res.status(400).json({
        success: false,
        message: 'Showtime does not match the selected movie or cinema',
      });
      return;
    }

    if (showtimeData.status !== 'selling') {
      res.status(400).json({
        success: false,
        message: 'Showtime is not available for booking',
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

    const requestedSeatNumbers = seats.map((seat: any) => String(seat.seatNumber).trim().toUpperCase());
    const uniqueSeatNumbers = new Set(requestedSeatNumbers);
    if (uniqueSeatNumbers.size !== requestedSeatNumbers.length) {
      res.status(400).json({
        success: false,
        message: 'Duplicate seats are not allowed in one booking',
      });
      return;
    }

    const existingBookings = await Booking.findAll({
      where: {
        showtimeId,
        status: { [Op.in]: activeBookingStatuses },
      },
      attributes: ['seats'],
    });

    const bookedSeats = new Set<string>();
    existingBookings.forEach((booking) => {
      (booking.seats || []).forEach((seat: any) => bookedSeats.add(String(seat.seatNumber).trim().toUpperCase()));
    });

    const unavailableSeat = requestedSeatNumbers.find((seatNumber: string) => bookedSeats.has(seatNumber));
    if (unavailableSeat) {
      res.status(409).json({
        success: false,
        message: `Seat ${unavailableSeat} is already booked`,
      });
      return;
    }

    const movie = await Movie.findByPk(movieId);
    const cinema = await Cinema.findByPk(cinemaId);
    if (!movie || !cinema) {
      res.status(404).json({
        success: false,
        message: !movie ? 'Movie not found' : 'Cinema not found',
      });
      return;
    }

    const basePrice = Number(showtimeData.price);
    const normalizedSeats = seats.map((seat: any) => {
      const seatType = seat.seatType || 'regular';
      return {
        seatId: String(seat.seatId).trim(),
        seatNumber: String(seat.seatNumber).trim().toUpperCase(),
        seatType,
        price: Number((basePrice * seatMultiplier(seatType)).toFixed(2)),
      };
    });

    const subtotal = Number(normalizedSeats.reduce((sum: number, seat: any) => sum + seat.price, 0).toFixed(2));

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (coupon) {
        const validation = coupon.isValid(subtotal);
        if (validation.valid) {
          discount = Math.min(Number(validation.discount), subtotal);
          await coupon.update({ usedCount: coupon.usedCount + 1 });
        }
      }
    }

    const finalTotal = Number(Math.max(subtotal - discount, 0).toFixed(2));
    const ticketCode = `TKT${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const booking = await sequelize.transaction(async (transaction) => {
      const createdBooking = await Booking.create({
        userId,
        movieId,
        movieTitle: movie.title,
        cinemaId,
        cinemaName: cinema.name,
        screenId: showtimeData.screenId,
        showtimeId,
        showtime: `${showtimeData.date} ${showtimeData.startTime}`,
        seats: normalizedSeats,
        ticketPrice: basePrice,
        totalPrice: finalTotal,
        discount: discount > 0 ? discount : undefined,
        couponCode: couponCode || undefined,
        paymentMethod,
        paymentStatus: 'completed',
        status: 'confirmed',
        ticketCode,
        bookingDate: new Date(),
      }, { transaction });

      await showtimeData.update({
        availableSeats: Math.max(showtimeData.availableSeats - normalizedSeats.length, 0),
        status: showtimeData.availableSeats - normalizedSeats.length <= 0 ? 'sold_out' : showtimeData.status,
      }, { transaction });

      for (const seat of normalizedSeats) {
        await Ticket.create({
          bookingId: createdBooking.id,
          seatId: seat.seatId,
          seatNumber: seat.seatNumber,
          seatType: seat.seatType,
          price: seat.price,
          status: 'valid',
          qrCode: `${ticketCode}-${seat.seatId}`,
        }, { transaction });
      }

      return createdBooking;
    });

    const bookingWithTickets = await Booking.findByPk(booking.id, {
      include: ['tickets'],
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookingWithTickets || booking,
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

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
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

    await sequelize.transaction(async (transaction) => {
      await booking.update({ status: 'cancelled', paymentStatus: 'refunded' }, { transaction });

      await Ticket.update(
        { status: 'cancelled' },
        { where: { bookingId: booking.id }, transaction }
      );

      const showtime = await Showtime.findByPk(booking.showtimeId, { transaction });
      if (showtime) {
        const restoredSeats = Math.min(showtime.availableSeats + booking.seats.length, showtime.totalSeats);
        await showtime.update({
          availableSeats: restoredSeats,
          status: showtime.status === 'sold_out' && restoredSeats > 0 ? 'selling' : showtime.status,
        }, { transaction });
      }
    });

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
      include: ['tickets', 'user'],
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
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    await sequelize.transaction(async (transaction) => {
      const updates: any = { status };
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      if (status === 'cancelled') updates.paymentStatus = 'refunded';

      await booking.update(updates, { transaction });

      if (status === 'cancelled') {
        await Ticket.update(
          { status: 'cancelled' },
          { where: { bookingId: booking.id }, transaction }
        );

        const showtime = await Showtime.findByPk(booking.showtimeId, { transaction });
        if (showtime) {
          const restoredSeats = Math.min(showtime.availableSeats + booking.seats.length, showtime.totalSeats);
          await showtime.update({
            availableSeats: restoredSeats,
            status: showtime.status === 'sold_out' && restoredSeats > 0 ? 'selling' : showtime.status,
          }, { transaction });
        }
      }

      if (status === 'used' || status === 'completed') {
        await Ticket.update(
          { status: 'used', validatedAt: new Date() },
          { where: { bookingId: booking.id }, transaction }
        );
      }
    });

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
