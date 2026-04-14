const { Employee, Department, Payroll, SalaryStructure, Deduction } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.count({ where: { status: 'active' } });
    const totalDepartments = await Department.count();

    // Total salary paid (sum of all netSalary in Payroll)
    const salaryResult = await Payroll.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('net_salary')), 'totalPaid']],
      raw: true,
    });
    const totalSalaryPaid = parseFloat(salaryResult.totalPaid) || 0;

    // Current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Pending payroll: active employees without a payroll record for this month
    const processedCount = await Payroll.count({
      where: { month: currentMonth, year: currentYear },
    });
    const pendingPayroll = totalEmployees - processedCount;

    // Recent payrolls
    const recentPayrolls = await Payroll.findAll({
      include: [{ model: Employee, as: 'employee', attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 8,
    });

    // Recent employees
    const recentEmployees = await Employee.findAll({
      include: [{ model: Department, as: 'department', attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    res.json({
      totalEmployees,
      totalDepartments,
      totalSalaryPaid,
      pendingPayroll: Math.max(pendingPayroll, 0),
      currentMonth,
      currentYear,
      recentPayrolls,
      recentEmployees,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard', message: error.message });
  }
};
