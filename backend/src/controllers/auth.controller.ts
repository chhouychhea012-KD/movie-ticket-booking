import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../models/User';
import { generateToken } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<Response> => {
  console.log('Register attempt - body:', JSON.stringify(req.body, null, 2));
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'user',
      isActive: true,
      emailVerified: false,
      favoriteMovies: [],
      favoriteCinemas: [],
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error: any) {
    console.error('Register failed:', error);
    
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e: any) => e.message),
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { firstName, lastName, phone, avatar, notifications } = req.body;

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      avatar: avatar || user.avatar,
      notifications: notifications || user.notifications,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON(),
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

export const changePassword = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Check current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

export const addFavoriteMovie = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { movieId } = req.body;
    const favoriteMovies = user.favoriteMovies || [];

    if (!favoriteMovies.includes(movieId)) {
      favoriteMovies.push(movieId);
      await user.update({ favoriteMovies });
    }

    res.json({
      success: true,
      message: 'Movie added to favorites',
      data: user.toJSON(),
    });
  } catch (error: any) {
    console.error('Add favorite movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite movie',
      error: error.message,
    });
  }
};

export const removeFavoriteMovie = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { movieId } = req.params;
    const favoriteMovies = (user.favoriteMovies || []).filter((id: string) => id !== movieId);
    await user.update({ favoriteMovies });

    res.json({
      success: true,
      message: 'Movie removed from favorites',
      data: user.toJSON(),
    });
  } catch (error: any) {
    console.error('Remove favorite movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite movie',
      error: error.message,
    });
  }
};

export const logout = async (req: any, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};