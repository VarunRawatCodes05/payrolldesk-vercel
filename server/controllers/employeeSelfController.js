const { Employee, Department, SalaryStructure, Deduction, Attendance, Payroll, Leave } = require('../models');

// Get the logged-in employee's complete profile
exports.getMyProfile = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'phone', 'joinDate', 'status'],
      include: [
        { model: Department, as: 'department', attributes: ['name'] },
        { model: SalaryStructure, as: 'salaryStructure' },
        { model: Deduction, as: 'deduction' },
      ],
    });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
};

// Get the logged-in employee's attendance records
exports.getMyAttendance = async (req, res) => {
  try {
    const { year } = req.query;
    const where = { employeeId: req.userId };
    if (year) where.year = parseInt(year);

    const records = await Attendance.findAll({
      where,
      order: [['year', 'DESC'], ['month', 'DESC']],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance', message: error.message });
  }
};

// Get the logged-in employee's payroll records
exports.getMyPayroll = async (req, res) => {
  try {
    const { year } = req.query;
    const where = { employeeId: req.userId };
    if (year) where.year = parseInt(year);

    const records = await Payroll.findAll({
      where,
      order: [['year', 'DESC'], ['month', 'DESC']],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll', message: error.message });
  }
};

// Get employee dashboard summary
exports.getMyDashboard = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.userId, {
      attributes: ['id', 'name', 'joinDate'],
      include: [
        { model: Department, as: 'department', attributes: ['name'] },
        { model: SalaryStructure, as: 'salaryStructure' },
        { model: Deduction, as: 'deduction' },
      ],
    });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    // Latest payroll
    const latestPayroll = await Payroll.findOne({
      where: { employeeId: req.userId },
      order: [['year', 'DESC'], ['month', 'DESC']],
    });

    // Total earnings (all time)
    const allPayrolls = await Payroll.findAll({
      where: { employeeId: req.userId },
      attributes: ['netSalary', 'grossSalary', 'totalDeduction'],
    });
    const totalEarned = allPayrolls.reduce((s, p) => s + parseFloat(p.netSalary || 0), 0);
    const totalPayslips = allPayrolls.length;

    // Current year attendance stats
    const currentYear = new Date().getFullYear();
    const yearAttendance = await Attendance.findAll({
      where: { employeeId: req.userId, year: currentYear },
    });
    const totalWorkingDays = yearAttendance.reduce((s, a) => s + (a.workingDays || 0), 0);
    const totalPresentDays = yearAttendance.reduce((s, a) => s + (a.presentDays || 0), 0);

    res.json({
      employee: emp,
      latestPayroll,
      totalEarned,
      totalPayslips,
      totalWorkingDays,
      totalPresentDays,
      attendancePercent: totalWorkingDays > 0 ? Math.round((totalPresentDays / totalWorkingDays) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', message: error.message });
  }
};

// Get the logged-in employee's leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { employeeId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves', message: error.message });
  }
};

// Request a new leave
exports.requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      employeeId: req.userId,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request leave', message: error.message });
  }
};
