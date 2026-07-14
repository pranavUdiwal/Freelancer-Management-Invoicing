'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('clients', [
      {
        id: queryInterface.sequelize.literal('gen_random_uuid()'),
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        company: 'Acme Corp',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: queryInterface.sequelize.literal('gen_random_uuid()'),
        name: 'TechStart Inc',
        email: 'hello@techstart.io',
        phone: '+1-555-0200',
        company: 'TechStart Inc',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: queryInterface.sequelize.literal('gen_random_uuid()'),
        name: 'Design Studio Pro',
        email: 'info@designstudiopro.com',
        phone: '+1-555-0300',
        company: 'Design Studio Pro LLC',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', {
      email: ['contact@acme.com', 'hello@techstart.io', 'info@designstudiopro.com'],
    });
  },
};
