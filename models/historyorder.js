'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoryOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HistoryOrder.belongsTo(models.User)
      HistoryOrder.hasMany(models.HistoryOrderItem)
    }
  };
  HistoryOrder.init({
    sn: DataTypes.STRING,
    date: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistoryOrder',
  });
  return HistoryOrder;
};