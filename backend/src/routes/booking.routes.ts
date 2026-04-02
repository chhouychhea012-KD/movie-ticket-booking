import express from 'express';
import * as bookingController from '../controllers/booking.controller';

const router = express.Router();

// Public routes (for development)
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/all', bookingController.getAllBookings);
router.get('/ticket/:ticketCode', bookingController.getBookingByTicketCode);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.cancelBooking);

export default router;