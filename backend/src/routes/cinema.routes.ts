import express from 'express';
import * as cinemaController from '../controllers/cinema.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody, validateParams, validateQuery, idParamSchema } from '../validators/common.validator';
import { cinemaQuerySchema, cinemaSchema, updateCinemaSchema } from '../validators/api.validator';
import Joi from 'joi';

const router = express.Router();

// Public routes
router.get('/', validateQuery(cinemaQuerySchema), cinemaController.getCinemas);
router.get('/cities', cinemaController.getCities);
router.get('/city/:city', validateParams(Joi.object({ city: Joi.string().trim().max(100).required() })), cinemaController.getCinemasByCity);
router.get('/:id', validateParams(idParamSchema), cinemaController.getCinemaById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, validateBody(cinemaSchema), cinemaController.createCinema);
router.put('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), validateBody(updateCinemaSchema), cinemaController.updateCinema);
router.delete('/:id', authenticate, authorizeAdmin, validateParams(idParamSchema), cinemaController.deleteCinema);

export default router;
