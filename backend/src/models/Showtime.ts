import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type ShowtimeStatus = 'selling' | 'sold_out' | 'cancelled';

interface ShowtimeAttributes {
  id: string;
  movieId: string;
  cinemaId: string;
  screenId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: ShowtimeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShowtimeCreationAttributes extends Optional<ShowtimeAttributes, 'id' | 'status'> {}

class Showtime extends Model<ShowtimeAttributes, ShowtimeCreationAttributes> implements ShowtimeAttributes {
  public id!: string;
  public movieId!: string;
  public cinemaId!: string;
  public screenId!: string;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public price!: number;
  public availableSeats!: number;
  public totalSeats!: number;
  public status!: ShowtimeStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Showtime.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'id',
      },
    },
    cinemaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cinemas',
        key: 'id',
      },
    },
    screenId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    availableSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('selling', 'sold_out', 'cancelled'),
      defaultValue: 'selling',
    },
  },
  {
    sequelize,
    modelName: 'Showtime',
    tableName: 'showtimes',
  }
);

export default Showtime;