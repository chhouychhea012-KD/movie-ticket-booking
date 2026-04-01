import Joi from 'joi';

export const movieSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  synopsis: Joi.string().min(1).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  language: Joi.string().max(50).default('English'),
  duration: Joi.number().integer().min(1).required(),
  rating: Joi.number().min(0).max(10).default(0),
  ageRating: Joi.string().max(10).required(),
  releaseDate: Joi.date().iso().required(),
  trailerUrl: Joi.string().uri().optional().allow(''),
  poster: Joi.string().required(),
  director: Joi.string().max(255).required(),
  cast: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('now_showing', 'coming_soon', 'ended').default('coming_soon'),
  isFeatured: Joi.boolean().default(false),
});

export const updateMovieSchema = movieSchema.fork(
  ['title', 'synopsis', 'genre', 'duration', 'ageRating', 'releaseDate', 'poster', 'director'],
  (schema) => schema.optional()
);

export const movieQuerySchema = Joi.object({
  status: Joi.string().valid('now_showing', 'coming_soon', 'ended'),
  genre: Joi.string(),
  language: Joi.string(),
  search: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
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