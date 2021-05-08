'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.Cart, {
        as: 'carts',
        through: {
          model: models.CartItem, unique: false
        },
        foreignKey: 'ProductId'
      });
      Product.belongsToMany(models.Order, {
        as: 'orders',
        through: {
          model: models.OrderItem, unique: false
        },
        foreignKey: 'ProductId'
      });
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};