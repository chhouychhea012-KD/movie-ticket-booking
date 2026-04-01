import express from 'express';
import * as cinemaController from '../controllers/cinema.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
// @route   GET /api/v1/cinemas
// @desc    Get all cinemas
// @access  Public
router.get('/', cinemaController.getCinemas);

// @route   GET /api/v1/cinemas/cities
// @desc    Get all cities
// @access  Public
router.get('/cities', cinemaController.getCities);

// @route   GET /api/v1/cinemas/:id
// @desc    Get cinema by ID
// @access  Public
router.get('/:id', cinemaController.getCinemaById);

// @route   GET /api/v1/cinemas/city/:city
// @desc    Get cinemas by city
// @access  Public
router.get('/city/:city', cinemaController.getCinemasByCity);

// Admin routes
router.post('/', authenticate, authorizeAdmin, cinemaController.createCinema);
router.put('/:id', authenticate, authorizeAdmin, cinemaController.updateCinema);
router.delete('/:id', authenticate, authorizeAdmin, cinemaController.deleteCinema);

export default router;