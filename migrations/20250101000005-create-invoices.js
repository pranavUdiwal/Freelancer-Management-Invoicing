'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      total_hours: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.00,
      },
      final_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
      },
      issued_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invoices');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_invoices_status";');
  },
};
