'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'genres', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'genres');
  }
};
