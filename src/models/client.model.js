'use strict';

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Client name cannot be empty' },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'clients',
    underscored: true,
  });

  Client.associate = function (models) {
    Client.hasMany(models.Project, {
      foreignKey: 'clientId',
      as: 'projects',
    });
    Client.hasMany(models.Invoice, {
      foreignKey: 'clientId',
      as: 'invoices',
    });
  };

  return Client;
};
