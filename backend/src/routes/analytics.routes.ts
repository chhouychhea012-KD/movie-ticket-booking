import express from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/v1/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', authenticate, authorizeAdmin, analyticsController.getDashboardStats);

// @route   GET /api/v1/analytics/revenue
// @desc    Get revenue report
// @access  Private (Admin)
router.get('/revenue', authenticate, authorizeAdmin, analyticsController.getRevenueReport);

// @route   GET /api/v1/analytics/movies/:movieId
// @desc    Get movie analytics
// @access  Private (Admin)
router.get('/movies/:movieId', authenticate, authorizeAdmin, analyticsController.getMovieAnalytics);

export default router;