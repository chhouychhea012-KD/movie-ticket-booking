import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type TicketStatus = 'valid' | 'used' | 'cancelled';

interface TicketAttributes {
  id: string;
  bookingId: string;
  seatId: string;
  seatNumber: string;
  seatType: 'regular' | 'vip' | 'couple';
  price: number;
  status: TicketStatus;
  qrCode: string;
  validatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id' | 'validatedAt'> {}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: string;
  public bookingId!: string;
  public seatId!: string;
  public seatNumber!: string;
  public seatType!: 'regular' | 'vip' | 'couple';
  public price!: number;
  public status!: TicketStatus;
  public qrCode!: string;
  public validatedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    seatId: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    seatType: {
      type: DataTypes.ENUM('regular', 'vip', 'couple'),
      defaultValue: 'regular',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('valid', 'used', 'cancelled'),
      defaultValue: 'valid',
    },
    qrCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
  }
);

export default Ticket;