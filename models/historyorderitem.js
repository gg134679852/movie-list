'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoryOrderItem extends Model { 
    static associate(models) {
      HistoryOrderItem.belongsTo(models.HistoryOrder)
    }
  };
  HistoryOrderItem.init({
    name: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HistoryOrderItem',
  });
  return HistoryOrderItem;
};