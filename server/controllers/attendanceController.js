const { Attendance, Employee, Department } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    const where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (employeeId) where.employeeId = parseInt(employeeId);

    const records = await Attendance.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [['year', 'DESC'], ['month', 'DESC'], [{ model: Employee, as: 'employee' }, 'name', 'ASC']],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance', message: error.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { employeeId, month, year, workingDays, presentDays } = req.body;
    if (!employeeId || !month || !year || workingDays === undefined || presentDays === undefined) {
      return res.status(400).json({ error: 'All fields required: employeeId, month, year, workingDays, presentDays' });
    }
    if (presentDays > workingDays) {
      return res.status(400).json({ error: 'Present days cannot exceed working days' });
    }
    const emp = await Employee.findByPk(employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const [record, created] = await Attendance.findOrCreate({
      where: { employeeId, month: parseInt(month), year: parseInt(year) },
      defaults: { workingDays: parseInt(workingDays), presentDays: parseInt(presentDays) },
    });
    if (!created) {
      await record.update({ workingDays: parseInt(workingDays), presentDays: parseInt(presentDays) });
    }
    const result = await Attendance.findByPk(record.id, {
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name'] }],
    });
    res.status(created ? 201 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save attendance', message: error.message });
  }
};

exports.bulkUpsert = async (req, res) => {
  try {
    const { records } = req.body; // array of { employeeId, month, year, workingDays, presentDays }
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Records array is required' });
    }
    const results = [];
    for (const rec of records) {
      const { employeeId, month, year, workingDays, presentDays } = rec;
      if (presentDays > workingDays) continue;
      const [record, created] = await Attendance.findOrCreate({
        where: { employeeId, month: parseInt(month), year: parseInt(year) },
        defaults: { workingDays: parseInt(workingDays), presentDays: parseInt(presentDays) },
      });
      if (!created) {
        await record.update({ workingDays: parseInt(workingDays), presentDays: parseInt(presentDays) });
      }
      results.push(record);
    }
    res.json({ message: `${results.length} attendance records saved`, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save attendance', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Attendance record not found' });
    await record.destroy();
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance', message: error.message });
  }
};
