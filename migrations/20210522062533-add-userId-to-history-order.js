'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('HistoryOrders', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('HistoryOrders', 'UserId')
  }
};
