const { randomUUID } = require('crypto');
const pool = require('../../shared/db/pool');

exports.syncLogs = async (deviceId, logs) => {
  const deviceResult = await pool.query('SELECT * FROM biometric_devices WHERE id=$1 AND is_active=TRUE', [deviceId]);
  if (!deviceResult.rows.length) throw { status: 404, message: 'Device not registered' };

  const device = deviceResult.rows[0];
  let processed = 0;
  let errors = 0;

  for (const log of logs) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const rawLog = await client.query(
        `INSERT INTO biometric_logs(device_id, device_user_id, raw_timestamp)
         VALUES($1,$2,$3)
         ON CONFLICT DO NOTHING RETURNING id`,
        [deviceId, log.device_user_id, log.timestamp]
      );

      if (!rawLog.rows.length) { await client.query('ROLLBACK'); continue; }

      const logId = rawLog.rows[0].id;

      const mapping = await client.query(
        `SELECT student_id FROM biometric_mappings WHERE device_id=$1 AND device_user_id=$2`,
        [deviceId, log.device_user_id]
      );

      if (!mapping.rows.length) { await client.query('ROLLBACK'); errors++; continue; }

      const studentId = mapping.rows[0].student_id;
      const date = new Date(log.timestamp).toISOString().split('T')[0];

      const batchResult = await client.query(
        `SELECT be.batch_id FROM batch_enrollments be WHERE be.student_id=$1 AND be.is_active=TRUE LIMIT 1`,
        [studentId]
      );
      const batchId = batchResult.rows[0]?.batch_id || null;

      await client.query(
        `INSERT INTO attendance(institute_id, student_id, batch_id, date, status, source, biometric_log_id)
         SELECT institute_id, $2, $3, $4, 'present', 'biometric', $5 FROM students WHERE id=$2
         ON CONFLICT(student_id, batch_id, date) DO NOTHING`,
        [device.institute_id, studentId, batchId, date, logId]
      );

      await client.query('UPDATE biometric_logs SET processed=TRUE WHERE id=$1', [logId]);

      await client.query('COMMIT');
      processed++;
    } catch (err) {
      await client.query('ROLLBACK');
      errors++;
    } finally { client.release(); }
  }

  await pool.query('UPDATE biometric_devices SET last_sync_at=NOW() WHERE id=$1', [deviceId]);
  return { synced: processed, errors, total: logs.length };
};

exports.createDevice = async (instituteId, data) => {
  const apiKey = `${randomUUID()}${randomUUID()}`;
  const result = await pool.query(
    `INSERT INTO biometric_devices(institute_id,device_name,device_serial,location,api_key)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [instituteId, data.device_name, data.device_serial, data.location, apiKey]
  );
  return result.rows[0];
};

exports.createMapping = async (instituteId, data) => {
  const { device_id, device_user_id, student_id } = data;
  const result = await pool.query(
    `INSERT INTO biometric_mappings(institute_id,device_id,device_user_id,student_id)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [instituteId, device_id, device_user_id, student_id]
  );
  return result.rows[0];
};

exports.getMappings = async (instituteId) => {
  const result = await pool.query(
    `SELECT bm.*, s.name as student_name, bd.device_name
     FROM biometric_mappings bm
     JOIN students s ON bm.student_id = s.id
     JOIN biometric_devices bd ON bm.device_id = bd.id
     WHERE bm.institute_id = $1
     ORDER BY s.name`,
    [instituteId]
  );
  return result.rows;
};

exports.deleteMapping = async (instituteId, id) => {
  await pool.query('DELETE FROM biometric_mappings WHERE id=$1 AND institute_id=$2', [id, instituteId]);
};
