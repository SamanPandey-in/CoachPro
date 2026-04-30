const paginateMeta = (total, page, limit) => ({
  total: Number(total) || 0,
  page: Number(page) || 1,
  limit: Number(limit) || 20,
  totalPages: Math.ceil((Number(total) || 0) / (Number(limit) || 20)),
});

module.exports = { paginateMeta };