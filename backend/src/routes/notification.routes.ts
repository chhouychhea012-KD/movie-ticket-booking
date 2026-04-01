import express from 'express';
import * as notificationController from '../controllers/notification.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (for development)
router.get('/', notificationController.getNotifications);
router.get('/stats', notificationController.getNotificationStats);
router.post('/', notificationController.createNotification);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);

/*
// Protected routes (for production)
router.get('/', authenticate, authorizeAdmin, notificationController.getNotifications);
router.get('/stats', authenticate, authorizeAdmin, notificationController.getNotificationStats);
router.post('/', authenticate, authorizeAdmin, notificationController.createNotification);
router.put('/:id/read', authenticate, authorizeAdmin, notificationController.markAsRead);
router.put('/read-all', authenticate, authorizeAdmin, notificationController.markAllAsRead);
router.delete('/:id', authenticate, authorizeAdmin, notificationController.deleteNotification);
router.delete('/', authenticate, authorizeAdmin, notificationController.deleteAllNotifications);
*/

export default router;
