'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.addColumn('Products', 'backdrop', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('Products', 'backdrop');
  }
};
