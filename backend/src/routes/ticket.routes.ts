import express from 'express';
import * as ticketController from '../controllers/ticket.controller';
import { authenticate, authorizeStaff } from '../middleware/auth';

const router = express.Router();

// Staff/admin ticket scanner route
router.post('/validate', authenticate, authorizeStaff, ticketController.validateTicket);

// Admin routes
router.get('/recent', authenticate, authorizeStaff, ticketController.getRecentValidations);
router.get('/stats', authenticate, authorizeStaff, ticketController.getValidationStats);

export default router;
