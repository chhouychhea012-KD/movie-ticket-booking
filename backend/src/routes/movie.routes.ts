import express from 'express';
import * as movieController from '../controllers/movie.controller';
import { movieSchema, updateMovieSchema, validate } from '../validators/movie.validator';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateParams, idParamSchema } from '../validators/common.validator';

const router = express.Router();

// Public routes
router.get('/', movieController.getMovies);
router.get('/now-showing', movieController.getNowShowing);
router.get('/coming-soon', movieController.getComingSoon);
router.get('/featured', movieController.getFeaturedMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', validateParams(idParamSchema), movieController.getMovieById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, validate(movieSchema), movieController.createMovie);
router.put('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), validate(updateMovieSchema), movieController.updateMovie);
router.delete('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), movieController.deleteMovie);

export default router;
