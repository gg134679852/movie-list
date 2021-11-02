'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.addColumn('Products', 'poster', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'poster');
  }
};
