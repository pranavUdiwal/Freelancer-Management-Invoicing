'use strict';

module.exports = (sequelize, DataTypes) => {
  const TimeLog = sequelize.define('TimeLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: 'Hours must be greater than 0' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isBilled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id',
      },
    },
  }, {
    tableName: 'time_logs',
    underscored: true,
  });

  TimeLog.associate = function (models) {
    TimeLog.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });
    TimeLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    TimeLog.belongsTo(models.Invoice, {
      foreignKey: 'invoiceId',
      as: 'invoice',
    });
  };

  return TimeLog;
};
