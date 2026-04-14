const { Payroll, Employee, Department } = require('../models');
const { Op } = require('sequelize');

exports.getPayrollHistory = async (req, res) => {
  try {
    const { employeeId, month, year, page = 1, limit = 20 } = req.query;
    const where = {};
    if (employeeId) where.employeeId = parseInt(employeeId);
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Payroll.findAndCountAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [['year', 'DESC'], ['month', 'DESC'], [{ model: Employee, as: 'employee' }, 'name', 'ASC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      records: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports', message: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    const where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (employeeId) where.employeeId = parseInt(employeeId);

    const payrolls = await Payroll.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [['year', 'DESC'], ['month', 'DESC']],
    });

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    let csv = 'Employee Name,Email,Department,Month,Year,Basic (₹),HRA (₹),Bonus (₹),Gross Salary (₹),Tax (₹),PF (₹),Other Deductions (₹),Total Deduction (₹),Net Salary (₹),Working Days,Present Days\n';
    for (const p of payrolls) {
      const row = [
        `"${p.employee?.name || ''}"`,
        `"${p.employee?.email || ''}"`,
        `"${p.employee?.department?.name || ''}"`,
        monthNames[p.month],
        p.year,
        p.basic,
        p.hra,
        p.bonus,
        p.grossSalary,
        p.tax,
        p.pf,
        p.otherDeductions,
        p.totalDeduction,
        p.netSalary,
        p.workingDays || '',
        p.presentDays || '',
      ];
      csv += row.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payroll_report_${month || 'all'}_${year || 'all'}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CSV', message: error.message });
  }
};
