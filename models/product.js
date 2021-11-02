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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    date: DataTypes.STRING,
    poster: DataTypes.TEXT,
    description: DataTypes.TEXT,
    genres: DataTypes.TEXT,
    director:DataTypes.TEXT,
    stars:DataTypes.TEXT,
    subMovieTitle:DataTypes.STRING,
    trailer:DataTypes.TEXT,
    backdrop:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};