import { Request, Response } from 'express';
import Showtime from '../models/Showtime';

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
    const showtime = await Showtime.create(req.body);
    
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

    await showtime.update(req.body);

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
    
    const showtimes = await Showtime.findAll({
      where: {
        movieId,
        date,
        status: 'selling',
      },
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