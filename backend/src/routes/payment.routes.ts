import express from 'express';
import Joi from 'joi';
import * as paymentController from '../controllers/payment.controller';
import { authenticate, authorizeStaff } from '../middleware/auth';
import { validateBody, validateParams, paymentStatusSchema } from '../validators/common.validator';

const router = express.Router();
const paymentIdParamSchema = Joi.object({
  id: Joi.string().trim().pattern(/^(PAY-)?[0-9a-fA-F-]{36}$/).required(),
});
const updatePaymentStatusSchema = Joi.object({
  status: paymentStatusSchema.required(),
});

// Admin routes
router.get('/', authenticate, authorizeStaff, paymentController.getAllPayments);
router.get('/stats', authenticate, authorizeStaff, paymentController.getPaymentStats);
router.get('/:id', authenticate, authorizeStaff, validateParams(paymentIdParamSchema), paymentController.getPaymentById);
router.put('/:id/status', authenticate, authorizeStaff, validateParams(paymentIdParamSchema), validateBody(updatePaymentStatusSchema), paymentController.updatePaymentStatus);

export default router;
