'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@freelancer.com',
        password: hashedPassword,
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@freelancer.com' });
  },
};
