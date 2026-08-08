import { Request, Response } from 'express';
import Showtime from '../models/Showtime';
import Movie from '../models/Movie';
import Cinema from '../models/Cinema';
import Booking from '../models/Booking';

const hasValidSeatCounts = (availableSeats: number, totalSeats: number): boolean => {
  return availableSeats >= 0 && totalSeats > 0 && availableSeats <= totalSeats;
};

export const getShowtimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, cinemaId, date, page = 1, limit = 50 } = req.query;
    
    const where: any = {};
    
    if (movieId) where.movieId = movieId;
    if (cinemaId) where.cinemaId = cinemaId;
    if (date) where.date = date;

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: showtimes } = await Showtime.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    res.json({
      success: true,
      data: {
        showtimes,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get showtimes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get showtimes',
      error: error.message,
    });
  }
};

export const getShowtimeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);

    if (!showtime) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
      return;
    }

    res.json({
      success: true,
      data: showtime,
    });
  } catch (error: any) {
    console.error('Get showtime by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get showtime',
      error: error.message,
    });
  }
};

export const createShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const [movie, cinema] = await Promise.all([
      Movie.findByPk(req.body.movieId),
      Cinema.findByPk(req.body.cinemaId),
    ]);

    if (!movie || !cinema) {
      res.status(404).json({
        success: false,
        message: !movie ? 'Movie not found' : 'Cinema not found',
      });
      return;
    }

    const availableSeats = req.body.availableSeats ?? req.body.totalSeats;
    if (!hasValidSeatCounts(availableSeats, req.body.totalSeats)) {
      res.status(400).json({
        success: false,
        message: 'Available seats must be between 0 and total seats',
      });
      return;
    }

    const showtime = await Showtime.create({
      ...req.body,
      availableSeats,
      status: availableSeats === 0 ? 'sold_out' : req.body.status,
    });
    
    res.status(201).json({
      success: true,
      message: 'Showtime created successfully',
      data: showtime,
    });
  } catch (error: any) {
    console.error('Create showtime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create showtime',
      error: error.message,
    });
  }
};

export const updateShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);

    if (!showtime) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
      return;
    }

    if (req.body.movieId || req.body.cinemaId) {
      const [movie, cinema] = await Promise.all([
        req.body.movieId ? Movie.findByPk(req.body.movieId) : Promise.resolve(true),
        req.body.cinemaId ? Cinema.findByPk(req.body.cinemaId) : Promise.resolve(true),
      ]);

      if (!movie || !cinema) {
        res.status(404).json({
          success: false,
          message: !movie ? 'Movie not found' : 'Cinema not found',
        });
        return;
      }
    }

    const totalSeats = req.body.totalSeats ?? showtime.totalSeats;
    const availableSeats = req.body.availableSeats ?? showtime.availableSeats;
    if (!hasValidSeatCounts(Number(availableSeats), Number(totalSeats))) {
      res.status(400).json({
        success: false,
        message: 'Available seats must be between 0 and total seats',
      });
      return;
    }

    await showtime.update({
      ...req.body,
      totalSeats,
      availableSeats,
      status: availableSeats === 0 ? 'sold_out' : (req.body.status ?? showtime.status),
    });

    res.json({
      success: true,
      message: 'Showtime updated successfully',
      data: showtime,
    });
  } catch (error: any) {
    console.error('Update showtime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update showtime',
      error: error.message,
    });
  }
};

export const deleteShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findByPk(id);

    if (!showtime) {
      res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
      return;
    }

    const bookingCount = await Booking.count({ where: { showtimeId: id } });
    if (bookingCount > 0) {
      await showtime.update({ status: 'cancelled' });
      res.json({
        success: true,
        message: 'Showtime has bookings, so it was cancelled instead of deleted',
      });
      return;
    }

    await showtime.destroy();

    res.json({
      success: true,
      message: 'Showtime deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete showtime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete showtime',
      error: error.message,
    });
  }
};

export const getAvailableShowtimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, date } = req.query;
    const where: any = { status: 'selling' };

    if (typeof movieId === 'string') where.movieId = movieId;
    if (typeof date === 'string') where.date = date;
    
    const showtimes = await Showtime.findAll({
      where,
      order: [['startTime', 'ASC']],
    });

    res.json({
      success: true,
      data: showtimes,
    });
  } catch (error: any) {
    console.error('Get available showtimes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available showtimes',
      error: error.message,
    });
  }
};
