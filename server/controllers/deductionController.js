const { Deduction, Employee, Department } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const deductions = await Deduction.findAll({
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [[{ model: Employee, as: 'employee' }, 'name', 'ASC']],
    });
    res.json(deductions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deductions', message: error.message });
  }
};

exports.getByEmployee = async (req, res) => {
  try {
    const deduction = await Deduction.findOne({
      where: { employeeId: req.params.employeeId },
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name'] }],
    });
    if (!deduction) return res.status(404).json({ error: 'No deduction record found' });
    res.json(deduction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deduction', message: error.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { employeeId, tax, pf, other } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
    if (tax === undefined || pf === undefined || other === undefined) {
      return res.status(400).json({ error: 'Tax, PF, and Other deduction fields are required' });
    }
    const emp = await Employee.findByPk(employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const [deduction, created] = await Deduction.findOrCreate({
      where: { employeeId },
      defaults: { tax: parseFloat(tax), pf: parseFloat(pf), other: parseFloat(other) },
    });
    if (!created) {
      await deduction.update({ tax: parseFloat(tax), pf: parseFloat(pf), other: parseFloat(other) });
    }
    const result = await Deduction.findByPk(deduction.id, {
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name'] }],
    });
    res.status(created ? 201 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save deduction', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deduction = await Deduction.findByPk(req.params.id);
    if (!deduction) return res.status(404).json({ error: 'Deduction record not found' });
    await deduction.destroy();
    res.json({ message: 'Deduction record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deduction', message: error.message });
  }
};
