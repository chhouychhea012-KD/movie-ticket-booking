import express from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
// @route   POST /api/v1/coupons/validate
// @desc    Validate coupon
// @access  Public
router.post('/validate', couponController.validateCoupon);

// @route   GET /api/v1/coupons/:code
// @desc    Get coupon by code
// @access  Public
router.get('/:code', couponController.getCouponByCode);

// Admin routes
router.get('/', authenticate, authorizeAdmin, couponController.getCoupons);
router.post('/', authenticate, authorizeAdmin, couponController.createCoupon);
router.put('/:id', authenticate, authorizeAdmin, couponController.updateCoupon);
router.delete('/:id', authenticate, authorizeAdmin, couponController.deleteCoupon);

export default router;