import { Request, Response } from 'express';
import Cinema from '../models/Cinema';
import { Op } from 'sequelize';

export const getCinemas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, page = 1, limit = 20 } = req.query;
    
    const where: any = { isActive: true };
    
    if (city) {
      where.city = city;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: cinemas } = await Cinema.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: {
        cinemas,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get cinemas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cinemas',
      error: error.message,
    });
  }
};

export const getCinemaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);

    if (!cinema) {
      res.status(404).json({
        success: false,
        message: 'Cinema not found',
      });
      return;
    }

    res.json({
      success: true,
      data: cinema,
    });
  } catch (error: any) {
    console.error('Get cinema by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cinema',
      error: error.message,
    });
  }
};

export const createCinema = async (req: Request, res: Response): Promise<void> => {
  try {
    const cinema = await Cinema.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Cinema created successfully',
      data: cinema,
    });
  } catch (error: any) {
    console.error('Create cinema error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create cinema',
      error: error.message,
    });
  }
};

export const updateCinema = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);

    if (!cinema) {
      res.status(404).json({
        success: false,
        message: 'Cinema not found',
      });
      return;
    }

    await cinema.update(req.body);

    res.json({
      success: true,
      message: 'Cinema updated successfully',
      data: cinema,
    });
  } catch (error: any) {
    console.error('Update cinema error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cinema',
      error: error.message,
    });
  }
};

export const deleteCinema = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByPk(id);

    if (!cinema) {
      res.status(404).json({
        success: false,
        message: 'Cinema not found',
      });
      return;
    }

    await cinema.destroy();

    res.json({
      success: true,
      message: 'Cinema deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete cinema error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete cinema',
      error: error.message,
    });
  }
};

export const getCinemasByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.params;
    
    const cinemas = await Cinema.findAll({
      where: {
        city: city,
        isActive: true,
      },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: cinemas,
    });
  } catch (error: any) {
    console.error('Get cinemas by city error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cinemas',
      error: error.message,
    });
  }
};

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cinemas = await Cinema.findAll({
      attributes: ['city'],
      where: { isActive: true },
      group: ['city'],
    });

    const cities = cinemas.map(c => c.city);

    res.json({
      success: true,
      data: cities,
    });
  } catch (error: any) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cities',
      error: error.message,
    });
  }
};