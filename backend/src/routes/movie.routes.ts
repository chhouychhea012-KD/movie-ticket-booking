import express from 'express';
import * as movieController from '../controllers/movie.controller';
import { movieSchema, updateMovieSchema, validate } from '../validators/movie.validator';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
// @route   GET /api/v1/movies
// @desc    Get all movies with pagination
// @access  Public
router.get('/', movieController.getMovies);

// @route   GET /api/v1/movies/now-showing
// @desc    Get now showing movies
// @access  Public
router.get('/now-showing', movieController.getNowShowing);

// @route   GET /api/v1/movies/coming-soon
// @desc    Get coming soon movies
// @access  Public
router.get('/coming-soon', movieController.getComingSoon);

// @route   GET /api/v1/movies/featured
// @desc    Get featured movies
// @access  Public
router.get('/featured', movieController.getFeaturedMovies);

// @route   GET /api/v1/movies/search
// @desc    Search movies
// @access  Public
router.get('/search', movieController.searchMovies);

// @route   GET /api/v1/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', movieController.getMovieById);

// Admin routes (protected)
router.post('/', authenticate, authorizeAdmin, validate(movieSchema), movieController.createMovie);
router.put('/:id', authenticate, authorizeAdmin, validate(updateMovieSchema), movieController.updateMovie);
router.delete('/:id', authenticate, authorizeAdmin, movieController.deleteMovie);

export default router;