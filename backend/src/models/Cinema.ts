import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ScreenAttributes {
  id: string;
  cinemaId: string;
  name: string;
  capacity: number;
  screenType: string;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
    aislePositions: number[];
  };
}

interface CinemaAttributes {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  image?: string;
  facilities: string[];
  screens: ScreenAttributes[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CinemaCreationAttributes extends Optional<CinemaAttributes, 'id' | 'image' | 'screens' | 'isActive'> {}

class Cinema extends Model<CinemaAttributes, CinemaCreationAttributes> implements CinemaAttributes {
  public id!: string;
  public name!: string;
  public address!: string;
  public city!: string;
  public phone!: string;
  public email!: string;
  public image?: string;
  public facilities!: string[];
  public screens!: ScreenAttributes[];
  public isActive!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Cinema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    facilities: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    screens: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Cinema',
    tableName: 'cinemas',
  }
);

export default Cinema;