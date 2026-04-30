const cron = require('node-cron');
const pool = require('../../shared/db/pool');
const notifService = require('./notifications.service');
const logger = require('../../shared/utils/logger');

// Run every day at 19:00 server time — find students not marked present today and send alerts
cron.schedule('0 19 * * *', async () => {
  logger.info('Running daily absent notification job...');

  const today = new Date().toISOString().split('T')[0];

  const result = await pool.query(
    `SELECT DISTINCT be.student_id, b.institute_id
     FROM batch_enrollments be
     JOIN batches b ON be.batch_id = b.id
     WHERE be.is_active = TRUE
       AND be.student_id NOT IN (
         SELECT student_id FROM attendance
         WHERE date = $1 AND status = 'present'
       )`,
    [today]
  );

  logger.info(`Found ${result.rows.length} absent students`);

  for (const row of result.rows) {
    try {
      await notifService.sendAttendanceAbsentAlert(row.institute_id, row.student_id, today);
    } catch (err) {
      logger.error(`Failed to send alert for student ${row.student_id}: ${err.message}`);
    }
  }
});

logger.info('Notification jobs registered');
