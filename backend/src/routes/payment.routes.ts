import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate, authorizeStaff } from '../middleware/auth';
import { validateParams, idParamSchema } from '../validators/common.validator';

const router = express.Router();

// Admin routes
router.get('/', authenticate, authorizeStaff, paymentController.getAllPayments);
router.get('/stats', authenticate, authorizeStaff, paymentController.getPaymentStats);
router.get('/:id', authenticate, authorizeStaff, validateParams(idParamSchema), paymentController.getPaymentById);
router.put('/:id/status', authenticate, authorizeStaff, validateParams(idParamSchema), paymentController.updatePaymentStatus);

export default router;
