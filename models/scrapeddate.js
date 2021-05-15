'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScrapedDate extends Model {
    static associate(models) {
    }
  };
  ScrapedDate.init({
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ScrapedDate',
  });
  return ScrapedDate;
};