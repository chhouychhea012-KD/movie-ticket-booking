import express from 'express';
import * as authController from '../controllers/auth.controller';
import { registerSchema, loginSchema, updateProfileSchema, validate } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), authController.register);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), authController.login);

// @route   GET /api/v1/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, authController.getProfile);

// @route   PUT /api/v1/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

// @route   PUT /api/v1/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', authenticate, authController.changePassword);

// @route   POST /api/v1/auth/favorites
// @desc    Add movie to favorites
// @access  Private
router.post('/favorites', authenticate, authController.addFavoriteMovie);

// @route   DELETE /api/v1/auth/favorites/:movieId
// @desc    Remove movie from favorites
// @access  Private
router.delete('/favorites/:movieId', authenticate, authController.removeFavoriteMovie);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, authController.logout);

export default router;