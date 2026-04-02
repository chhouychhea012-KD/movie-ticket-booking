import express from 'express';
import * as movieController from '../controllers/movie.controller';
import { movieSchema, updateMovieSchema, validate } from '../validators/movie.validator';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', movieController.getMovies);
router.get('/now-showing', movieController.getNowShowing);
router.get('/coming-soon', movieController.getComingSoon);
router.get('/featured', movieController.getFeaturedMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

// Admin routes (uncomment for production)
// router.post('/', authenticate, authorizeAdmin, validate(movieSchema), movieController.createMovie);
// router.put('/:id', authenticate, authorizeAdmin, validate(updateMovieSchema), movieController.updateMovie);
// router.delete('/:id', authenticate, authorizeAdmin, movieController.deleteMovie);

// Public for development
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

export default router;