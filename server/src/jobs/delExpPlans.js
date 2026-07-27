import cron from 'node-cron';
import { deleteExpiredPlans } from '../services/plans.service.js';

cron.schedule('*/10 * * * *', async () => {
  try {
    const deletedCount = await deleteExpiredPlans();
    console.log(`Deleted ${deletedCount} expired plans`);
  } catch (error) {
    console.error('Error deleting expired plans:', error);
  }
});
