'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'freelancer'),
      allowNull: false,
      defaultValue: 'freelancer',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  });

  User.associate = function (models) {
    User.hasMany(models.Task, {
      foreignKey: 'assignedTo',
      as: 'tasks',
    });
    User.hasMany(models.TimeLog, {
      foreignKey: 'userId',
      as: 'timeLogs',
    });
  };

  return User;
};
