import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type MovieStatus = 'now_showing' | 'coming_soon' | 'ended';

interface MovieAttributes {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  language: string;
  duration: number;
  rating: number;
  ageRating: string;
  releaseDate: Date;
  trailerUrl?: string;
  poster: string;
  director: string;
  cast: string[];
  status: MovieStatus;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id' | 'trailerUrl' | 'isFeatured' | 'status'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: string;
  public title!: string;
  public synopsis!: string;
  public genre!: string[];
  public language!: string;
  public duration!: number;
  public rating!: number;
  public ageRating!: string;
  public releaseDate!: Date;
  public trailerUrl?: string;
  public poster!: string;
  public director!: string;
  public cast!: string[];
  public status!: MovieStatus;
  public isFeatured!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Movie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    genre: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      defaultValue: 'English',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    },
    ageRating: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    trailerUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    poster: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cast: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('now_showing', 'coming_soon', 'ended'),
      defaultValue: 'coming_soon',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies',
  }
);

export default Movie;