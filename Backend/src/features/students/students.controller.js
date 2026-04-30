const service = require('./students.service');
const { success, paginated, error } = require('../../shared/utils/response');

exports.create = async (req, res, next) => { try { const student = await service.create(req.user.institute_id, req.body); return success(res, student, 'Student created', 201); } catch (err) { next(err); } };
exports.getAll = async (req, res, next) => { try { const { data, meta } = await service.getAll(req.user.institute_id, req.query); return paginated(res, data, meta); } catch (err) { next(err); } };
exports.getById = async (req, res, next) => { try { const student = await service.getById(req.user.institute_id, req.params.id); if (!student) return error(res, 'Student not found', 404, 'NOT_FOUND'); return success(res, student); } catch (err) { next(err); } };
exports.update = async (req, res, next) => { try { const student = await service.update(req.user.institute_id, req.params.id, req.body); return success(res, student); } catch (err) { next(err); } };
exports.delete = async (req, res, next) => { try { await service.delete(req.user.institute_id, req.params.id); return success(res, null, 'Student deleted'); } catch (err) { next(err); } };
exports.enroll = async (req, res, next) => { try { await service.enrollBatch(req.user.institute_id, req.params.id, req.body.batch_id); return success(res, null, 'Enrolled'); } catch (err) { next(err); } };
