import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Ticket from '../models/Ticket';

export const validateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      res.status(400).json({
        success: false,
        message: 'Ticket code is required',
      });
      return;
    }

    const booking = await Booking.findOne({
      where: { ticketCode },
      include: ['tickets', 'user', 'movie', 'cinema'],
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        status: 'error',
        message: 'Ticket not found. Please check the ticket code.',
      });
      return;
    }

    // Check if ticket has already been used
    if (booking.status === 'used') {
      res.status(400).json({
        success: false,
        status: 'warning',
        message: 'This ticket has already been used.',
        ticket: booking,
      });
      return;
    }

    // Check if ticket is cancelled
    if (booking.status === 'cancelled') {
      res.status(400).json({
        success: false,
        status: 'error',
        message: 'This ticket has been cancelled.',
        ticket: booking,
      });
      return;
    }

    // Check if ticket is expired (showtime has passed)
    const showtimeDate = new Date(booking.showtime);
    const now = new Date();
    if (showtimeDate < now) {
      // Mark as expired
      await booking.update({ status: 'expired' });
      res.status(400).json({
        success: false,
        status: 'warning',
        message: 'This ticket has expired.',
        ticket: booking,
      });
      return;
    }

    // Success - mark as used
    await booking.update({ status: 'used' });
    
    // Update all tickets for this booking
    const tickets = await Ticket.findAll({ where: { bookingId: booking.id } });
    for (const ticket of tickets) {
      await ticket.update({ status: 'used' });
    }

    res.json({
      success: true,
      status: 'success',
      message: 'Ticket validated successfully!',
      ticket: booking,
    });
  } catch (error: any) {
    console.error('Validate ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate ticket',
      error: error.message,
    });
  }
};

export const getRecentValidations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20 } = req.query;

    const bookings = await Booking.findAll({
      where: {
        status: 'used',
      },
      limit: Number(limit),
      order: [['updatedAt', 'DESC']],
      include: ['user', 'movie'],
    });

    res.json({
      success: true,
      data: {
        validations: bookings,
        total: bookings.length,
      },
    });
  } catch (error: any) {
    console.error('Get recent validations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent validations',
      error: error.message,
    });
  }
};

export const getValidationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalBookings = await Booking.count();
    const usedTickets = await Booking.count({ where: { status: 'used' } });
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });
    
    // Get tickets that are valid
    const validTickets = await Ticket.count({ where: { status: 'valid' } });
    const usedTicketCount = await Ticket.count({ where: { status: 'used' } });

    res.json({
      success: true,
      data: {
        totalBookings,
        usedTickets,
        confirmedBookings,
        cancelledBookings,
        validTickets,
        usedTicketCount,
        validationRate: totalBookings > 0 ? (usedTickets / totalBookings * 100).toFixed(2) : 0,
      },
    });
  } catch (error: any) {
    console.error('Get validation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get validation stats',
      error: error.message,
    });
  }
};
