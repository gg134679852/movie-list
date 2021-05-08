'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Oder extends Model {
    static associate(models) {
      Order.belongsToMany(models.Product, {
        as: 'items',
        through: {
          model: models.OrderItem, unique: false
        },
        foreignKey: 'OrderId'
      });
      Order.belongsTo(models.User)
      Order.hasMany(models.Payment)
    }
  };
  Oder.init({
    sn: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Oder',
  });
  return Oder;
};