'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
          id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          email: {
              type: Sequelize.STRING,
              AllowNull: false,
              unique: true, 
          },
          password_hash: {
            type: Sequelize.STRING,
            aloowNull: false,  
          },
          provider: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          create_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          update_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
   }
};