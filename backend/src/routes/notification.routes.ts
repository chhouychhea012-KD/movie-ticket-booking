import express from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Admin routes
router.get('/', authenticate, authorizeAdmin, notificationController.getNotifications);
router.get('/stats', authenticate, authorizeAdmin, notificationController.getNotificationStats);
router.post('/', authenticate, authorizeAdmin, notificationController.createNotification);
router.put('/read-all', authenticate, authorizeAdmin, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, authorizeAdmin, notificationController.markAsRead);
router.delete('/:id', authenticate, authorizeAdmin, notificationController.deleteNotification);
router.delete('/', authenticate, authorizeAdmin, notificationController.deleteAllNotifications);

export default router;
