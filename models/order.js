'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsToMany(models.Product, {
        as: 'items',
        through: {
          model: models.OrderItem, unique: false
        },
        foreignKey: 'OrderId'
      });
      Order.hasMany(models.Payment)
      Order.belongsTo(models.User)
    }
  };
  Order.init({
    sn: DataTypes.BIGINT(20),
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};