import express from 'express';
import * as ticketController from '../controllers/ticket.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (for development)
router.post('/validate', ticketController.validateTicket);
router.get('/recent', ticketController.getRecentValidations);
router.get('/stats', ticketController.getValidationStats);

/*
// Protected routes (for production)
router.get('/recent', authenticate, authorizeAdmin, ticketController.getRecentValidations);
router.get('/stats', authenticate, authorizeAdmin, ticketController.getValidationStats);
*/

export default router;
