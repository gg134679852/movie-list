'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieImg: {
        type: Sequelize.STRING
      },
      movieGenres: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      stars: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      movieTitle: {
        type: Sequelize.STRING
      },
      subMovieTitle: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Movies');
  }
};