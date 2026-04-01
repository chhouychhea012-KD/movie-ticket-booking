import express from 'express';
import * as userController from '../controllers/user.controller';
// import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (for development - in production, add authentication)
router.get('/', userController.getUsers);
router.get('/stats', userController.getUserStats);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

/*
// Protected routes (uncomment for production)
router.get('/', authenticate, authorizeAdmin, userController.getUsers);
router.get('/stats', authenticate, authorizeAdmin, userController.getUserStats);
router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);
router.post('/', authenticate, authorizeAdmin, userController.createUser);
router.put('/:id', authenticate, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);
*/

export default router;
