const path = require('path');
const Tesseract = require('tesseract.js');
const XLSX = require('xlsx');
const service = require('./institutes.service');
const { success, error } = require('../../shared/utils/response');

const canAccessInstitute = (req, instituteId) => req.user.role === 'super_admin' || req.user.institute_id === instituteId;
const canManageInstituteUsers = (req, instituteId) => canAccessInstitute(req, instituteId) && ['owner', 'super_admin'].includes(req.user.role);

const normalizeImportedRow = (row) => Object.fromEntries(
  Object.entries(row).map(([key, value]) => [
    String(key).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    typeof value === 'string' ? value.trim() : value,
  ])
);

const normalizeKey = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const parseDelimitedLine = (line, delimiter) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  cells.push(current.trim());
  return cells;
};

const detectDelimiter = (line = '') => {
  const candidates = ['\t', '|', ';', ','];
  return candidates.reduce((best, candidate) => {
    const score = line.split(candidate).length - 1;
    return score > best.score ? { candidate, score } : best;
  }, { candidate: ',', score: 0 }).candidate;
};

const parseFreeformRow = (line, defaultRole) => {
  const emailMatch = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!emailMatch) return null;

  const email = emailMatch[0].toLowerCase();
  const roleMatch = line.match(/\b(teacher|student)\b/i);
  const phoneMatch = line.match(/(?:phone|mobile|contact)[:\s-]*([+()0-9\-\s]{6,})/i);
  const firstNameMatch = line.match(/(?:first[_\s-]*name)[:\s-]*([A-Za-z][A-Za-z\s'-]*)/i);
  const lastNameMatch = line.match(/(?:last[_\s-]*name)[:\s-]*([A-Za-z][A-Za-z\s'-]*)/i);
  const nameMatch = line.match(/(?:name)[:\s-]*([A-Za-z][A-Za-z\s'.-]*)/i);

  let name = '';
  if (firstNameMatch || lastNameMatch) {
    name = [firstNameMatch?.[1], lastNameMatch?.[1]].filter(Boolean).join(' ').trim();
  } else if (nameMatch) {
    name = nameMatch[1].trim();
  } else {
    name = line
      .replace(emailMatch[0], '')
      .replace(/\b(teacher|student)\b/i, '')
      .replace(/(?:email|phone|mobile|contact|role)[:\s-]*/gi, '')
      .replace(/[|,;]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return {
    name,
    first_name: firstNameMatch?.[1] || '',
    last_name: lastNameMatch?.[1] || '',
    email,
    phone: phoneMatch?.[1]?.trim() || '',
    role: (roleMatch?.[1] || defaultRole || '').toLowerCase(),
  };
};

const parseTextRows = (text, defaultRole) => {
  const lines = String(text || '')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  const headerCandidate = lines[0];
  const delimiter = detectDelimiter(headerCandidate);
  const headerCells = parseDelimitedLine(headerCandidate, delimiter).map(normalizeKey);
  const hasHeader = headerCells.some((cell) => ['email', 'name', 'first_name', 'last_name', 'role', 'phone'].includes(cell));

  if (hasHeader) {
    return lines.slice(1).map((line) => {
      const cells = parseDelimitedLine(line, delimiter);
      return headerCells.reduce((accumulator, key, index) => {
        if (key) {
          accumulator[key] = cells[index] || '';
        }
        return accumulator;
      }, {});
    }).filter((row) => row.email);
  }

  return lines.map((line) => {
    const delimited = line.includes('\t') || line.includes('|') || line.includes(',') || line.includes(';');
    if (delimited) {
      const cells = parseDelimitedLine(line, detectDelimiter(line)).map((value) => value.trim());
      if (cells.length >= 2 && /@/.test(cells.join(' '))) {
        const [name = '', email = '', role = '', phone = ''] = cells;
        return { name, email, role: role || defaultRole || '', phone };
      }
    }

    return parseFreeformRow(line, defaultRole);
  }).filter(Boolean);
};

const parseImageRows = async (file, defaultRole) => {
  const { data } = await Tesseract.recognize(file.buffer, 'eng');
  return parseTextRows(data.text, defaultRole);
};

const parseSpreadsheetRows = (file) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const workbook = extension === '.csv'
    ? XLSX.read(file.buffer.toString('utf8'), { type: 'string' })
    : XLSX.read(file.buffer, { type: 'buffer' });

  if (!workbook.SheetNames?.length) {
    return [];
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' }).map(normalizeImportedRow);
};

exports.getById = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const institute = await service.getById(req.params.id);
    if (!institute) return error(res, 'Institute not found', 404, 'NOT_FOUND');

    return success(res, institute);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const institute = await service.update(req.params.id, req.body);
    if (!institute) return error(res, 'Institute not found', 404, 'NOT_FOUND');

    return success(res, institute, 'Institute updated');
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const stats = await service.getStats(req.params.id);
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    if (!canManageInstituteUsers(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const users = await service.getUsers(req.params.id, { role: req.query.role });
    return success(res, users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    if (!canManageInstituteUsers(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const user = await service.createUser(req.params.id, req.body);
    return success(res, user, 'User created', 201);
  } catch (err) {
    next(err);
  }
};

exports.importUsers = async (req, res, next) => {
  try {
    if (!canManageInstituteUsers(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    let rows = [];

    if (req.file) {
      if (req.file.mimetype?.startsWith('image/')) {
        rows = await parseImageRows(req.file, req.body.role);
      } else {
        rows = parseSpreadsheetRows(req.file);
      }
    } else if (req.body.text) {
      rows = parseTextRows(req.body.text, req.body.role);
    } else {
      return error(res, 'Upload a spreadsheet, image, or paste text to import users', 400, 'FILE_REQUIRED');
    }

    const result = await service.importUsers(req.params.id, rows, req.body.role);
    return success(res, result, 'Users imported', 201);
  } catch (err) {
    next(err);
  }
};

exports.exportUsers = async (req, res, next) => {
  try {
    if (!canManageInstituteUsers(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const result = await service.exportUsers(req.params.id, {
      role: req.query.role,
      format: req.query.format,
    });

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.status(200).send(result.buffer);
  } catch (err) {
    next(err);
  }
};