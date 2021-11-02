'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
    }
  };
  Favorite.init({
    userId: DataTypes.STRING,
    date: DataTypes.STRING,
    name: DataTypes.STRING,
    subMovieTitle: DataTypes.STRING,
    poster: DataTypes.STRING,
    backdrop: DataTypes.STRING,
    genres: DataTypes.STRING,
    director: DataTypes.STRING,
    stars: DataTypes.STRING,
    trailer: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};