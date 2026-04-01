import express from 'express';
import * as paymentController from '../controllers/payment.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (for development)
router.get('/', paymentController.getAllPayments);
router.get('/stats', paymentController.getPaymentStats);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id/status', paymentController.updatePaymentStatus);

/*
// Protected routes (for production)
router.get('/', authenticate, authorizeAdmin, paymentController.getAllPayments);
router.get('/stats', authenticate, authorizeAdmin, paymentController.getPaymentStats);
router.get('/:id', authenticate, authorizeAdmin, paymentController.getPaymentById);
router.put('/:id/status', authenticate, authorizeAdmin, paymentController.updatePaymentStatus);
*/

export default router;
