'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Movie.init({
    time: DataTypes.STRING,
    movieImg: DataTypes.TEXT,
    movieGenres: DataTypes.STRING,
    date: DataTypes.STRING,
    director: DataTypes.STRING,
    stars: DataTypes.STRING,
    movieTitle: DataTypes.STRING,
    subMovieTitle: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};