'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.addColumn('Products', 'description', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'description');
  }
};
