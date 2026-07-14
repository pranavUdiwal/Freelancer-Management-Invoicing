'use strict';

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    totalHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
    },
    issuedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'invoices',
    underscored: true,
  });

  Invoice.associate = function (models) {
    Invoice.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
    Invoice.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
    Invoice.hasMany(models.TimeLog, {
      foreignKey: 'invoiceId',
      as: 'timeLogs',
    });
  };

  return Invoice;
};
