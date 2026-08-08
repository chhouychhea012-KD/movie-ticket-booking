import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const protectedRoles = ['admin', 'owner'];

const canManageRole = (actorRole: string | undefined, targetRole: string): boolean => {
  if (actorRole === 'owner') return true;
  if (actorRole === 'admin') return ['customer', 'staff'].includes(targetRole);
  return false;
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    const requestedRole = role || 'customer';

    if (!canManageRole(req.userRole, requestedRole)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to create a user with this role',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Password hashing is handled by the User model hook.
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: requestedRole,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        users,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (req.body.role && !canManageRole(req.userRole, req.body.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to assign this role',
      });
      return;
    }

    if (protectedRoles.includes(user.role) && req.userRole !== 'owner') {
      res.status(403).json({
        success: false,
        message: 'Only the owner can update admin or owner accounts',
      });
      return;
    }

    if (user.role === 'owner' && req.body.role && req.body.role !== 'owner') {
      const ownerCount = await User.count({ where: { role: 'owner', isActive: true } });
      if (ownerCount <= 1) {
        res.status(400).json({
          success: false,
          message: 'Cannot demote the last active owner',
        });
        return;
      }
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'role', 'isActive', 'emailVerified', 'notifications'];
    const updates: any = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await user.update(updates);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        favoriteMovies: user.favoriteMovies,
        favoriteCinemas: user.favoriteCinemas,
        notifications: user.notifications,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (req.userId === user.id) {
      res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
      return;
    }

    if (user.role === 'owner') {
      res.status(403).json({
        success: false,
        message: 'Owner accounts cannot be deleted',
      });
      return;
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { role: 'admin' } });
    const regularUsers = await User.count({ where: { role: 'customer' } });
    const activeUsers = await User.count({ where: { isActive: true } });

    res.json({
      success: true,
      data: {
        totalUsers,
        adminUsers,
        customerUsers: regularUsers,
        regularUsers,
        activeUsers,
      },
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats',
      error: error.message,
    });
  }
};
