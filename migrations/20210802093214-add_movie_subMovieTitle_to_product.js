'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'subMovieTitle', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'subMovieTitle');
  }
};
