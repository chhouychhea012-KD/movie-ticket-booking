import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (read !== undefined) {
      where.read = read === 'true';
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const unreadCount = await Notification.count({
      where: { read: false },
    });

    res.json({
      success: true,
      data: {
        notifications,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        unreadCount,
      },
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message,
    });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, title, message, userId } = req.body;

    const notification = await Notification.create({
      type: type || 'system',
      title,
      message,
      userId,
      read: false,
    });

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification,
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    await notification.update({ read: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.update(
      { read: true },
      { where: { read: false } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message,
    });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.destroy({ where: {} });

    res.json({
      success: true,
      message: 'All notifications deleted',
    });
  } catch (error: any) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications',
      error: error.message,
    });
  }
};

export const getNotificationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Notification.count();
    const unread = await Notification.count({ where: { read: false } });
    const read = await Notification.count({ where: { read: true } });

    const typeCounts: Record<string, number> = {
      booking: await Notification.count({ where: { type: 'booking' } }),
      alert: await Notification.count({ where: { type: 'alert' } }),
      success: await Notification.count({ where: { type: 'success' } }),
      system: await Notification.count({ where: { type: 'system' } }),
    };

    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        typeCounts,
      },
    });
  } catch (error: any) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification stats',
      error: error.message,
    });
  }
};