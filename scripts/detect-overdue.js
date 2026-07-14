require('dotenv').config();
const { Invoice } = require('../src/models');
const { Op } = require('sequelize');

async function detectOverdue() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [affectedCount] = await Invoice.update(
      { status: 'overdue' },
      {
        where: {
          status: 'sent',
          dueDate: {
            [Op.lt]: today,
          },
        },
      }
    );

    console.log(`✅ Success: ${affectedCount} invoices updated to overdue.`);
  } catch (error) {
    console.error('❌ Error updating overdue status:', error.message);
  }
}

detectOverdue();
