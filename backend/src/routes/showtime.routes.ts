import express from 'express';
import * as showtimeController from '../controllers/showtime.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', showtimeController.getShowtimes);
router.get('/available', showtimeController.getAvailableShowtimes);
router.get('/:id', showtimeController.getShowtimeById);

// Admin routes (uncomment for production)
// router.post('/', authenticate, authorizeAdmin, showtimeController.createShowtime);
// router.put('/:id', authenticate, authorizeAdmin, showtimeController.updateShowtime);
// router.delete('/:id', authenticate, authorizeAdmin, showtimeController.deleteShowtime);

// Public for development
router.post('/', showtimeController.createShowtime);
router.put('/:id', showtimeController.updateShowtime);
router.delete('/:id', showtimeController.deleteShowtime);

export default router;