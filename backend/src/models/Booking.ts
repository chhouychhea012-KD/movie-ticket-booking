import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'used' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface SeatInfo {
  seatId: string;
  seatNumber: string;
  seatType: 'regular' | 'vip' | 'couple';
  price: number;
}

interface BookingAttributes {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  cinemaId: string;
  cinemaName: string;
  screenId: string;
  showtimeId: string;
  showtime: string;
  seats: SeatInfo[];
  ticketPrice: number;
  totalPrice: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  ticketCode: string;
  bookingDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'discount' | 'couponCode' | 'bookingDate'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public userId!: string;
  public movieId!: string;
  public movieTitle!: string;
  public cinemaId!: string;
  public cinemaName!: string;
  public screenId!: string;
  public showtimeId!: string;
  public showtime!: string;
  public seats!: SeatInfo[];
  public ticketPrice!: number;
  public totalPrice!: number;
  public discount?: number;
  public couponCode?: string;
  public paymentMethod!: string;
  public paymentStatus!: PaymentStatus;
  public status!: BookingStatus;
  public ticketCode!: string;
  public bookingDate!: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'id',
      },
    },
    movieTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cinemaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cinemas',
        key: 'id',
      },
    },
    cinemaName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    screenId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    showtimeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'showtimes',
        key: 'id',
      },
    },
    showtime: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    seats: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    ticketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    couponCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'card',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'used', 'expired'),
      defaultValue: 'pending',
    },
    ticketCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    bookingDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
  }
);

export default Booking;