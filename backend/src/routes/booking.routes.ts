import express from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate, authorizeStaff } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, idParamSchema } from '../validators/common.validator';
import { bookingQuerySchema, createBookingSchema, updateBookingStatusSchema } from '../validators/api.validator';
import Joi from 'joi';

const router = express.Router();

// Customer routes
router.post('/', authenticate, validateBody(createBookingSchema), bookingController.createBooking);
router.get('/', authenticate, validateQuery(bookingQuerySchema), bookingController.getBookings);

// Admin/staff routes
router.get('/all', authenticate, authorizeStaff, validateQuery(bookingQuerySchema), bookingController.getAllBookings);
router.get('/ticket/:ticketCode', authenticate, authorizeStaff, validateParams(Joi.object({ ticketCode: Joi.string().trim().required() })), bookingController.getBookingByTicketCode);
router.put('/:id/status', authenticate, authorizeStaff, validateParams(idParamSchema), validateBody(updateBookingStatusSchema), bookingController.updateBookingStatus);

// Customer detail routes must stay after fixed admin routes
router.get('/:id', authenticate, validateParams(idParamSchema), bookingController.getBookingById);
router.delete('/:id', authenticate, validateParams(idParamSchema), bookingController.cancelBooking);

export default router;
