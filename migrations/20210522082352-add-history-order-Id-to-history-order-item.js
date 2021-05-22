'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('HistoryOrderItems', 'OrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'HistoryOrder',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
