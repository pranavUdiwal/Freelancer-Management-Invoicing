'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Project title cannot be empty' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Budget must be a positive number' },
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'on_hold'),
      allowNull: false,
      defaultValue: 'not_started',
    },
  }, {
    tableName: 'projects',
    underscored: true,
  });

  Project.associate = function (models) {
    Project.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks',
    });
    Project.hasMany(models.Invoice, {
      foreignKey: 'projectId',
      as: 'invoices',
    });
  };

  return Project;
};
