import sequelize from '../config/database';
import User from './User';
import Movie from './Movie';
import Cinema from './Cinema';
import Showtime from './Showtime';
import Booking from './Booking';
import Ticket from './Ticket';
import Coupon from './Coupon';

// User - Booking associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Movie - Booking associations
Movie.hasMany(Booking, { foreignKey: 'movieId', as: 'bookings' });
Booking.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// Cinema - Booking associations
Cinema.hasMany(Booking, { foreignKey: 'cinemaId', as: 'bookings' });
Booking.belongsTo(Cinema, { foreignKey: 'cinemaId', as: 'cinema' });

// Booking - Ticket associations
Booking.hasMany(Ticket, { foreignKey: 'bookingId', as: 'tickets' });
Ticket.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Movie - Showtime associations
Movie.hasMany(Showtime, { foreignKey: 'movieId', as: 'showtimes' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// Cinema - Showtime associations
Cinema.hasMany(Showtime, { foreignKey: 'cinemaId', as: 'showtimes' });
Showtime.belongsTo(Cinema, { foreignKey: 'cinemaId', as: 'cinema' });

// Showtime - Booking associations
Showtime.hasMany(Booking, { foreignKey: 'showtimeId', as: 'showtimeBookings' });
Booking.belongsTo(Showtime, { foreignKey: 'showtimeId', as: 'showtimeRelation' });

// Export all models
export {
  sequelize,
  User,
  Movie,
  Cinema,
  Showtime,
  Booking,
  Ticket,
  Coupon,
};

// Export models for convenience
export const models = {
  User,
  Movie,
  Cinema,
  Showtime,
  Booking,
  Ticket,
  Coupon,
};

export default models;