import express from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import cinemaRoutes from './cinema.routes';
import showtimeRoutes from './showtime.routes';
import bookingRoutes from './booking.routes';
import analyticsRoutes from './analytics.routes';
import couponRoutes from './coupon.routes';
import userRoutes from './user.routes';
import paymentRoutes from './payment.routes';
import ticketRoutes from './ticket.routes';
import notificationRoutes from './notification.routes';

const router = express.Router();

// API v1 Routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/cinemas', cinemaRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/tickets', ticketRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
