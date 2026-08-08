import express from 'express';
import * as showtimeController from '../controllers/showtime.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, idParamSchema } from '../validators/common.validator';
import { showtimeQuerySchema, showtimeSchema, updateShowtimeSchema } from '../validators/api.validator';

const router = express.Router();

// Public routes
router.get('/', validateQuery(showtimeQuerySchema), showtimeController.getShowtimes);
router.get('/available', validateQuery(showtimeQuerySchema), showtimeController.getAvailableShowtimes);
router.get('/:id', validateParams(idParamSchema), showtimeController.getShowtimeById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, validateBody(showtimeSchema), showtimeController.createShowtime);
router.put('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), validateBody(updateShowtimeSchema), showtimeController.updateShowtime);
router.delete('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), showtimeController.deleteShowtime);

export default router;
