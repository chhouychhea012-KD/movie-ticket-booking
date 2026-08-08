import express from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody, validateParams, idParamSchema } from '../validators/common.validator';
import { couponSchema, updateCouponSchema, validateCouponSchema } from '../validators/api.validator';
import Joi from 'joi';

const router = express.Router();

// Public routes
// @route   POST /api/v1/coupons/validate
// @desc    Validate coupon
// @access  Public
router.post('/validate', validateBody(validateCouponSchema), couponController.validateCoupon);

// @route   GET /api/v1/coupons/:code
// @desc    Get coupon by code
// @access  Public
router.get('/:code', validateParams(Joi.object({ code: Joi.string().trim().uppercase().max(50).required() })), couponController.getCouponByCode);

// Admin routes
router.get('/', authenticate, authorizeAdmin, couponController.getCoupons);
router.post('/', authenticate, authorizeAdmin, validateBody(couponSchema), couponController.createCoupon);
router.put('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), validateBody(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), couponController.deleteCoupon);

export default router;
