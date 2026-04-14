const { Payroll, Employee, SalaryStructure, Deduction, Attendance, Department } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const payrolls = await Payroll.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [['year', 'DESC'], ['month', 'DESC'], [{ model: Employee, as: 'employee' }, 'name', 'ASC']],
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll', message: error.message });
  }
};

exports.generate = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    // Get employees to process
    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.findAll({ where: { id: employeeIds, status: 'active' } });
    } else {
      employees = await Employee.findAll({ where: { status: 'active' } });
    }

    if (employees.length === 0) {
      return res.status(400).json({ error: 'No active employees found' });
    }

    const results = [];
    const errors = [];

    for (const emp of employees) {
      try {
        // Get salary structure
        const salary = await SalaryStructure.findOne({ where: { employeeId: emp.id } });
        if (!salary) {
          errors.push(`${emp.name}: No salary structure defined`);
          continue;
        }

        // Get deductions
        const deduction = await Deduction.findOne({ where: { employeeId: emp.id } });

        // Get attendance
        const attendance = await Attendance.findOne({
          where: { employeeId: emp.id, month: parseInt(month), year: parseInt(year) },
        });

        // Calculate gross salary (prorated by attendance if available)
        const basic = parseFloat(salary.basic) || 0;
        const hra = parseFloat(salary.hra) || 0;
        const bonus = parseFloat(salary.bonus) || 0;
        const fullGross = basic + hra + bonus;

        let attendanceFactor = 1;
        let workingDays = null;
        let presentDays = null;
        if (attendance) {
          workingDays = attendance.workingDays;
          presentDays = attendance.presentDays;
          attendanceFactor = workingDays > 0 ? presentDays / workingDays : 1;
        }

        const grossSalary = Math.round(fullGross * attendanceFactor * 100) / 100;

        // Calculate deductions
        const tax = deduction ? parseFloat(deduction.tax) || 0 : 0;
        const pf = deduction ? parseFloat(deduction.pf) || 0 : 0;
        const otherDed = deduction ? parseFloat(deduction.other) || 0 : 0;
        const totalDeduction = Math.round((tax + pf + otherDed) * 100) / 100;

        // Net salary
        const netSalary = Math.round((grossSalary - totalDeduction) * 100) / 100;

        // Upsert payroll record
        const [payroll, created] = await Payroll.findOrCreate({
          where: { employeeId: emp.id, month: parseInt(month), year: parseInt(year) },
          defaults: {
            basic: Math.round(basic * attendanceFactor * 100) / 100,
            hra: Math.round(hra * attendanceFactor * 100) / 100,
            bonus: Math.round(bonus * attendanceFactor * 100) / 100,
            grossSalary,
            tax,
            pf,
            otherDeductions: otherDed,
            totalDeduction,
            netSalary,
            workingDays,
            presentDays,
          },
        });

        if (!created) {
          await payroll.update({
            basic: Math.round(basic * attendanceFactor * 100) / 100,
            hra: Math.round(hra * attendanceFactor * 100) / 100,
            bonus: Math.round(bonus * attendanceFactor * 100) / 100,
            grossSalary,
            tax,
            pf,
            otherDeductions: otherDed,
            totalDeduction,
            netSalary,
            workingDays,
            presentDays,
          });
        }

        results.push(payroll);
      } catch (empError) {
        errors.push(`${emp.name}: ${empError.message}`);
      }
    }

    // Return generated payrolls with employee info
    const generatedPayrolls = await Payroll.findAll({
      where: { month: parseInt(month), year: parseInt(year) },
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [[{ model: Employee, as: 'employee' }, 'name', 'ASC']],
    });

    res.json({
      message: `Payroll generated for ${results.length} employee(s)`,
      errors: errors.length > 0 ? errors : undefined,
      payrolls: generatedPayrolls,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate payroll', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll record not found' });
    await payroll.destroy();
    res.json({ message: 'Payroll record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payroll', message: error.message });
  }
};
