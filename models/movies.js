'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Movies.init({
    movieImg: DataTypes.STRING,
    movieGenres: DataTypes.STRING,
    director: DataTypes.STRING,
    stars: DataTypes.STRING,
    date: DataTypes.STRING,
    movieTitle: DataTypes.STRING,
    subMovieTitle: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movies',
  });
  return Movies;
};