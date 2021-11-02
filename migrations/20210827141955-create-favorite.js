'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      subMovieTitle: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      backdrop: {
        type: Sequelize.STRING
      },
      genres: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      stars: {
        type: Sequelize.STRING
      },
      trailer: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  }
};