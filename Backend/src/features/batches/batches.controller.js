const service = require('./batches.service');
const { success, paginated, error } = require('../../shared/utils/response');

exports.create = async (req, res, next) => {
  try { const batch = await service.create(req.user.institute_id, req.body); return success(res, batch, 'Batch created', 201); } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.user.institute_id, req.query); return paginated(res, data, meta); } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => { try { const batch = await service.getById(req.user.institute_id, req.params.id); if (!batch) return error(res, 'Batch not found', 404, 'NOT_FOUND'); return success(res, batch); } catch (err) { next(err); } };

exports.update = async (req, res, next) => { try { const batch = await service.update(req.user.institute_id, req.params.id, req.body); return success(res, batch); } catch (err) { next(err); } };

exports.delete = async (req, res, next) => { try { await service.delete(req.user.institute_id, req.params.id); return success(res, null, 'Batch deleted'); } catch (err) { next(err); } };

exports.getStudents = async (req, res, next) => { try { const students = await service.getStudents(req.user.institute_id, req.params.id); return success(res, students); } catch (err) { next(err); } };
