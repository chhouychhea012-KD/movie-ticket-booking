import express from 'express';
import * as bookingController from '../controllers/booking.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (for development)
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);
router.delete('/:id', bookingController.cancelBooking);
router.get('/all', bookingController.getAllBookings);
router.get('/ticket/:ticketCode', bookingController.getBookingByTicketCode);
router.put('/:id/status', bookingController.updateBookingStatus);

/*
// Protected routes (for production)
router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.delete('/:id', authenticate, bookingController.cancelBooking);
router.get('/all', authenticate, authorizeAdmin, bookingController.getAllBookings);
router.get('/ticket/:ticketCode', bookingController.getBookingByTicketCode);
router.put('/:id/status', authenticate, authorizeAdmin, bookingController.updateBookingStatus);
*/

export default router;