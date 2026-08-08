import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

type RequestPart = 'body' | 'query' | 'params';

const validatePart = (schema: Joi.ObjectSchema, part: RequestPart) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[part], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    req[part] = value;
    next();
  };
};

export const validateBody = (schema: Joi.ObjectSchema) => validatePart(schema, 'body');
export const validateQuery = (schema: Joi.ObjectSchema) => validatePart(schema, 'query');
export const validateParams = (schema: Joi.ObjectSchema) => validatePart(schema, 'params');

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const paginationSchema = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
};

export const userRoleSchema = Joi.string().valid('customer', 'staff', 'admin', 'owner');
export const bookingStatusSchema = Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed', 'used', 'expired');
export const paymentStatusSchema = Joi.string().valid('pending', 'completed', 'failed', 'refunded');
export const seatTypeSchema = Joi.string().valid('regular', 'vip', 'couple', 'accessible');
