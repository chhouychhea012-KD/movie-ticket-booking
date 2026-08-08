import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorizeAdmin, authorizeOwner } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, idParamSchema } from '../validators/common.validator';
import { createUserSchema, updateUserSchema, userQuerySchema } from '../validators/api.validator';

const router = express.Router();

// Admin routes
router.get('/', authenticate, authorizeAdmin, validateQuery(userQuerySchema), userController.getUsers);
router.get('/stats', authenticate, authorizeAdmin, userController.getUserStats);
router.get('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), userController.getUserById);
router.post('/', authenticate, authorizeAdmin, validateBody(createUserSchema), userController.createUser);
router.put('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), validateBody(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, authorizeOwner, validateParams(idParamSchema), userController.deleteUser);

export default router;
