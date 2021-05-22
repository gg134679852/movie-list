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
    date: DataTypes.STRING,
    OrderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistoryOrderItem',
  });
  return HistoryOrderItem;
};