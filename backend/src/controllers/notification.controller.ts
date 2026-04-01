import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for notifications (in production, use a database)
let notifications: Notification[] = [];

export interface Notification {
  id: string;
  type: 'booking' | 'alert' | 'success' | 'system';
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  createdAt: Date;
}

// Initialize with some default notifications
const initializeNotifications = () => {
  if (notifications.length === 0) {
    notifications = [
      {
        id: uuidv4(),
        type: 'booking',
        title: 'New Booking Received',
        message: 'John Doe booked 3 tickets for Dune: Part Two at Legend Cinema - Screen 1',
        time: '5 min ago',
        date: new Date().toISOString().split('T')[0],
        read: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'alert',
        title: 'Low Seat Availability',
        message: 'Only 15 seats remaining for Oppenheimer - 7PM show today',
        time: '15 min ago',
        date: new Date().toISOString().split('T')[0],
        read: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'success',
        title: 'Booking Confirmed',
        message: 'Booking #BK-2847 for "The Batman" has been successfully paid - $45.00',
        time: '1 hour ago',
        date: new Date().toISOString().split('T')[0],
        read: true,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: uuidv4(),
        type: 'system',
        title: 'System Update',
        message: 'Server maintenance scheduled for tonight at 2:00 AM',
        time: '2 hours ago',
        date: new Date().toISOString().split('T')[0],
        read: true,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: uuidv4(),
        type: 'booking',
        title: 'Booking Cancelled',
        message: 'Customer Sarah Lee cancelled booking #BK-2845 for "Barbie"',
        time: '3 hours ago',
        date: new Date().toISOString().split('T')[0],
        read: true,
        createdAt: new Date(Date.now() - 10800000),
      },
      {
        id: uuidv4(),
        type: 'success',
        title: 'Payment Received',
        message: 'Payment of $120.00 received for booking #BK-2850',
        time: '4 hours ago',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        read: true,
        createdAt: new Date(Date.now() - 14400000),
      },
    ];
  }
};

initializeNotifications();

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let filtered = [...notifications];

    // Filter by type
    if (type && type !== 'all') {
      filtered = filtered.filter(n => n.type === type);
    }

    // Filter by read status
    if (read !== undefined) {
      const isRead = read === 'true';
      filtered = filtered.filter(n => n.read === isRead);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + Number(limit));

    res.json({
      success: true,
      data: {
        notifications: paginated,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        unreadCount: filtered.filter(n => !n.read).length,
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
    const { type, title, message } = req.body;

    const notification: Notification = {
      id: uuidv4(),
      type: type || 'system',
      title,
      message,
      time: 'Just now',
      date: new Date().toISOString().split('T')[0],
      read: false,
      createdAt: new Date(),
    };

    notifications.unshift(notification);

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

    const notification = notifications.find(n => n.id === id);
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    notification.read = true;

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
    notifications.forEach(n => {
      n.read = true;
    });

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

    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    notifications.splice(index, 1);

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
    notifications = [];

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
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const read = notifications.filter(n => n.read).length;

    const typeCounts: Record<string, number> = {
      booking: 0,
      alert: 0,
      success: 0,
      system: 0,
    };

    notifications.forEach(n => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });

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
