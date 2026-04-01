import { Request, Response } from 'express';
import Movie from '../models/Movie';

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, genre, search, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (genre) {
      where.genre = { $contains: genre };
    }
    
    if (search) {
      where.$or = [
        { title: { $ilike: `%${search}%` } },
        { synopsis: { $ilike: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: movies } = await Movie.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        movies,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movies',
      error: error.message,
    });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
      return;
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error: any) {
    console.error('Get movie by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movie',
      error: error.message,
    });
  }
};

export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error: any) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      error: error.message,
    });
  }
};

export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
      return;
    }

    await movie.update(req.body);

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error: any) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message,
    });
  }
};

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
      return;
    }

    await movie.destroy();

    res.json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: error.message,
    });
  }
};

export const getNowShowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'now_showing' },
      order: [['releaseDate', 'DESC']],
    });

    res.json({
      success: true,
      data: movies,
    });
  } catch (error: any) {
    console.error('Get now showing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get now showing movies',
      error: error.message,
    });
  }
};

export const getComingSoon = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'coming_soon' },
      order: [['releaseDate', 'ASC']],
    });

    res.json({
      success: true,
      data: movies,
    });
  } catch (error: any) {
    console.error('Get coming soon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coming soon movies',
      error: error.message,
    });
  }
};

export const getFeaturedMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.findAll({
      where: { isFeatured: true },
      order: [['rating', 'DESC']],
    });

    res.json({
      success: true,
      data: movies,
    });
  } catch (error: any) {
    console.error('Get featured movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured movies',
      error: error.message,
    });
  }
};

export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, genre, language, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    
    if (q) {
      where.$or = [
        { title: { $ilike: `%${q}%` } },
        { synopsis: { $ilike: `%${q}%` } },
        { director: { $ilike: `%${q}%` } },
        { cast: { $contains: [q as string] } },
      ];
    }
    
    if (genre) {
      where.genre = { $contains: genre };
    }
    
    if (language) {
      where.language = language;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: movies } = await Movie.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['rating', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        movies,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search movies',
      error: error.message,
    });
  }
};