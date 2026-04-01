import express from 'express';
import * as showtimeController from '../controllers/showtime.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
// @route   GET /api/v1/showtimes
// @desc    Get all showtimes
// @access  Public
router.get('/', showtimeController.getShowtimes);

// @route   GET /api/v1/showtimes/available
// @desc    Get available showtimes for a movie on a date
// @access  Public
router.get('/available', showtimeController.getAvailableShowtimes);

// @route   GET /api/v1/showtimes/:id
// @desc    Get showtime by ID
// @access  Public
router.get('/:id', showtimeController.getShowtimeById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, showtimeController.createShowtime);
router.put('/:id', authenticate, authorizeAdmin, showtimeController.updateShowtime);
router.delete('/:id', authenticate, authorizeAdmin, showtimeController.deleteShowtime);

export default router;