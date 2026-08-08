import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import Movie from '../models/Movie';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '900896751182-351tedmbt8jq69acpbip5fmvir10092h.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response): Promise<void> => {
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

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      res.status(401).json({
        success: false,
        message: 'Google account email is not verified',
      });
      return;
    }

    const email = payload.email.toLowerCase();
    const fallbackName = email.split('@')[0] || 'Google';
    const firstName = payload.given_name || payload.name?.split(' ')[0] || fallbackName;
    const lastName = payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User';

    let user = await User.findOne({ where: { email } });

    if (user && !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
      return;
    }

    if (!user) {
      user = await User.create({
        email,
        password: crypto.randomBytes(32).toString('hex'),
        firstName,
        lastName,
        phone: '',
        avatar: payload.picture,
        role: 'user',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      });
    } else {
      await user.update({
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
        avatar: payload.picture || user.avatar,
        emailVerified: true,
        lastLogin: new Date(),
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(401).json({
      success: false,
      message: 'Google login failed',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
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

    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;
    if (notifications !== undefined) updates.notifications = { ...user.notifications, ...notifications };

    await user.update(updates);

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
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
      return;
    }

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
