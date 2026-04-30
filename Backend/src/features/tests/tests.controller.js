const service = require('./tests.service');
const { success, paginated, error } = require('../../shared/utils/response');

exports.create = async (req, res, next) => {
  try {
    const test = await service.create(req.user.institute_id, req.body);
    return success(res, test, 'Test created', 201);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.user.institute_id, req.query);
    return paginated(res, data, meta);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const test = await service.getById(req.user.institute_id, req.params.id);
    if (!test) return error(res, 'Test not found', 404, 'NOT_FOUND');
    return success(res, test);
  } catch (err) {
    next(err);
  }
};

exports.addResults = async (req, res, next) => {
  try {
    const results = Array.isArray(req.body.results) ? req.body.results : [];
    const saved = await service.addResults(req.user.institute_id, req.params.id, results.map((item) => ({
      ...item,
      entered_by: req.user.id,
    })));
    return success(res, saved, 'Results saved');
  } catch (err) {
    next(err);
  }
};

exports.getResults = async (req, res, next) => {
  try {
    const rows = await service.getResults(req.user.institute_id, req.params.id);
    return success(res, rows);
  } catch (err) {
    next(err);
  }
};