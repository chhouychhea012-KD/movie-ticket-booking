import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().pattern(/^\+?[0-9]{9,15}$/).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

export const googleLoginSchema = Joi.object({
  credential: Joi.string().trim().required(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  phone: Joi.string().pattern(/^\+?[0-9]{9,15}$/).allow('', null).optional(),
  avatar: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().pattern(/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/)
  ).optional(),
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
  }).optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail: any) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    next();
  };
};
