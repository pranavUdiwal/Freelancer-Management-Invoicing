'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Task title cannot be empty' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    tableName: 'tasks',
    underscored: true,
  });

  Task.associate = function (models) {
    Task.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
    Task.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignee',
    });
    Task.hasMany(models.TimeLog, {
      foreignKey: 'taskId',
      as: 'timeLogs',
    });
  };

  return Task;
};
