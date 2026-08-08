import Joi from 'joi';
import {
  bookingStatusSchema,
  paginationSchema,
  paymentStatusSchema,
  seatTypeSchema,
  userRoleSchema,
} from './common.validator';

export const createUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().pattern(/^\+?[0-9]{9,15}$/).allow('', null).optional(),
  role: userRoleSchema.default('user'),
  isActive: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).optional(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  phone: Joi.string().pattern(/^\+?[0-9]{9,15}$/).allow('', null).optional(),
  role: userRoleSchema.optional(),
  isActive: Joi.boolean().optional(),
  emailVerified: Joi.boolean().optional(),
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
  }).optional(),
}).min(1);

export const userQuerySchema = Joi.object({
  ...paginationSchema,
  role: userRoleSchema.optional(),
  search: Joi.string().trim().max(100).optional(),
});

const seatSchema = Joi.object({
  seatId: Joi.string().trim().max(20).required(),
  seatNumber: Joi.string().trim().max(20).required(),
  seatType: seatTypeSchema.default('regular'),
  price: Joi.number().min(0).optional(),
});

export const createBookingSchema = Joi.object({
  movieId: Joi.string().uuid().required(),
  movieTitle: Joi.string().allow('', null).optional(),
  cinemaId: Joi.string().uuid().required(),
  cinemaName: Joi.string().allow('', null).optional(),
  screenId: Joi.string().allow('', null).optional(),
  showtimeId: Joi.string().uuid().required(),
  showtime: Joi.string().allow('', null).optional(),
  seats: Joi.array().items(seatSchema).min(1).max(12).required(),
  ticketPrice: Joi.number().min(0).optional(),
  totalPrice: Joi.number().min(0).optional(),
  couponCode: Joi.string().trim().max(50).uppercase().allow('', null).optional(),
  paymentMethod: Joi.string().valid('card', 'wallet', 'cash', 'visa', 'bakong', 'abapayway').default('card'),
});

export const bookingQuerySchema = Joi.object({
  ...paginationSchema,
  status: bookingStatusSchema.optional(),
});

export const updateBookingStatusSchema = Joi.object({
  status: bookingStatusSchema.required(),
  paymentStatus: paymentStatusSchema.optional(),
});

export const showtimeSchema = Joi.object({
  movieId: Joi.string().uuid().required(),
  cinemaId: Joi.string().uuid().required(),
  screenId: Joi.string().required(),
  date: Joi.date().iso().required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  price: Joi.number().min(0).required(),
  availableSeats: Joi.number().integer().min(0).optional(),
  totalSeats: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('selling', 'sold_out', 'cancelled').default('selling'),
});

export const updateShowtimeSchema = showtimeSchema.fork(
  ['movieId', 'cinemaId', 'screenId', 'date', 'startTime', 'endTime', 'price', 'totalSeats'],
  (schema) => schema.optional()
).min(1);

export const showtimeQuerySchema = Joi.object({
  ...paginationSchema,
  movieId: Joi.string().uuid().optional(),
  cinemaId: Joi.string().uuid().optional(),
  date: Joi.date().iso().optional(),
});

export const cinemaSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  address: Joi.string().trim().min(1).max(500).required(),
  city: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().trim().max(20).required(),
  email: Joi.string().trim().email().required(),
  image: Joi.string().uri().allow('', null).optional(),
  facilities: Joi.array().items(Joi.string().trim().max(100)).default([]),
  screens: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    cinemaId: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    capacity: Joi.number().integer().min(1).required(),
    screenType: Joi.string().required(),
    seatLayout: Joi.object({
      rows: Joi.number().integer().min(1).required(),
      seatsPerRow: Joi.number().integer().min(1).required(),
      aislePositions: Joi.array().items(Joi.number().integer().min(1)).default([]),
    }).required(),
  })).default([]),
  isActive: Joi.boolean().default(true),
});

export const updateCinemaSchema = cinemaSchema.fork(
  ['name', 'address', 'city', 'phone', 'email'],
  (schema) => schema.optional()
).min(1);

export const cinemaQuerySchema = Joi.object({
  ...paginationSchema,
  city: Joi.string().trim().max(100).optional(),
});

export const couponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50).required(),
  description: Joi.string().trim().max(500).allow('', null).optional(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().min(0).required(),
  minPurchase: Joi.number().min(0).default(0),
  validUntil: Joi.date().iso().required(),
  maxUses: Joi.number().integer().min(1).required(),
  usedCount: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
});

export const updateCouponSchema = couponSchema.fork(
  ['code', 'discountType', 'discountValue', 'validUntil', 'maxUses'],
  (schema) => schema.optional()
).min(1);

export const validateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50).required(),
  amount: Joi.number().min(0).required(),
});
