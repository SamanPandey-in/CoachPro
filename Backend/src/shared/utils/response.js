const success = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({ success: true, data, message });
};

const paginated = (res, data, meta) => {
  return res.status(200).json({ success: true, data, meta });
};

const error = (res, message, status = 400, code = 'ERROR') => {
  return res.status(status).json({ success: false, error: { code, message } });
};

module.exports = { success, paginated, error };
