const nodemailer = require('nodemailer');
const pool = require('../../shared/db/pool');
const env = require('../../shared/config/env');
const logger = require('../../shared/utils/logger');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
    logger.info(`Email sent to ${to}`);
    return true;
  } catch (err) {
    logger.error(`Email failed: ${err.message}`);
    return false;
  }
};

let twilioClient = null;
if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

exports.sendWhatsApp = async ({ to, message }) => {
  if (!twilioClient) { logger.warn('WhatsApp not configured'); return false; }
  try {
    await twilioClient.messages.create({ from: `whatsapp:${env.TWILIO_WHATSAPP_FROM}`, to: `whatsapp:${to}`, body: message });
    logger.info(`WhatsApp sent to ${to}`);
    return true;
  } catch (err) { logger.error(`WhatsApp failed: ${err.message}`); return false; }
};

exports.renderTemplate = (template, vars) => template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);

exports.sendAttendanceAbsentAlert = async (instituteId, studentId, date) => {
  const result = await pool.query(
    `SELECT s.name as student_name, p.phone as parent_phone, p.name as parent_name, i.name as institute_name
     FROM students s
     JOIN student_parents sp ON s.id = sp.student_id AND sp.is_primary = TRUE
     JOIN parents p ON sp.parent_id = p.id
     JOIN institutes i ON s.institute_id = i.id
     WHERE s.id = $1 AND s.institute_id = $2`,
    [studentId, instituteId]
  );
  if (!result.rows.length) return;
  const { student_name, parent_phone, parent_name, institute_name } = result.rows[0];
  const message = `Dear ${parent_name}, your ward ${student_name} was marked ABSENT on ${new Date(date).toLocaleDateString() } at ${institute_name}.`;
  const sent = await exports.sendWhatsApp({ to: parent_phone, message });
  await pool.query(`INSERT INTO notification_logs(institute_id,channel,event_type,recipient_phone,content,status,sent_at) VALUES($1,'whatsapp','attendance.absent',$2,$3,$4,NOW())`, [instituteId, parent_phone, message, sent ? 'sent' : 'failed']);
};

exports.sendMonthlyReport = async (instituteId, studentId, month, year) => {
  const result = await pool.query(
    `SELECT s.name, s.email, p.email as parent_email, p.name as parent_name,
            COUNT(a.id) FILTER (WHERE a.status = 'present') as present,
            COUNT(a.id) as total
     FROM students s
     LEFT JOIN student_parents sp ON s.id = sp.student_id AND sp.is_primary = TRUE
     LEFT JOIN parents p ON sp.parent_id = p.id
     LEFT JOIN attendance a ON a.student_id = s.id AND EXTRACT(MONTH FROM a.date) = $3 AND EXTRACT(YEAR FROM a.date) = $4
     WHERE s.id = $2 AND s.institute_id = $1
     GROUP BY s.name, s.email, p.email, p.name`,
    [instituteId, studentId, month, year]
  );
  if (!result.rows.length) return;
  const row = result.rows[0];
  const pct = row.total > 0 ? Math.round((row.present / row.total) * 100) : 0;
  const emailTo = row.parent_email || row.email;
  if (!emailTo) return;
  const html = `<h2>Monthly Attendance Report — ${row.name}</h2><p>Month: ${month}/${year}</p><p>Present: ${row.present} / ${row.total} days</p><p>Attendance: <strong>${pct}%</strong></p>`;
  await exports.sendEmail({ to: emailTo, subject: `Monthly Report — ${row.name}`, html });
};
