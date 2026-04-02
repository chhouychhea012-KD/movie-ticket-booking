import express from 'express';
import * as cinemaController from '../controllers/cinema.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', cinemaController.getCinemas);
router.get('/cities', cinemaController.getCities);
router.get('/:id', cinemaController.getCinemaById);
router.get('/city/:city', cinemaController.getCinemasByCity);

// Admin routes (uncomment for production)
// router.post('/', authenticate, authorizeAdmin, cinemaController.createCinema);
// router.put('/:id', authenticate, authorizeAdmin, cinemaController.updateCinema);
// router.delete('/:id', authenticate, authorizeAdmin, cinemaController.deleteCinema);

// Public for development
router.post('/', cinemaController.createCinema);
router.put('/:id', cinemaController.updateCinema);
router.delete('/:id', cinemaController.deleteCinema);

export default router;