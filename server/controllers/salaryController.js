const { SalaryStructure, Employee, Department } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const structures = await SalaryStructure.findAll({
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      }],
      order: [[{ model: Employee, as: 'employee' }, 'name', 'ASC']],
    });
    res.json(structures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary structures', message: error.message });
  }
};

exports.getByEmployee = async (req, res) => {
  try {
    const structure = await SalaryStructure.findOne({
      where: { employeeId: req.params.employeeId },
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name'] }],
    });
    if (!structure) return res.status(404).json({ error: 'No salary structure found for this employee' });
    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary structure', message: error.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { employeeId, basic, hra, bonus } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
    if (basic === undefined || hra === undefined || bonus === undefined) {
      return res.status(400).json({ error: 'Basic, HRA, and Bonus are required' });
    }
    const emp = await Employee.findByPk(employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const [structure, created] = await SalaryStructure.findOrCreate({
      where: { employeeId },
      defaults: { basic: parseFloat(basic), hra: parseFloat(hra), bonus: parseFloat(bonus) },
    });
    if (!created) {
      await structure.update({ basic: parseFloat(basic), hra: parseFloat(hra), bonus: parseFloat(bonus) });
    }
    const result = await SalaryStructure.findByPk(structure.id, {
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name'] }],
    });
    res.status(created ? 201 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save salary structure', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const structure = await SalaryStructure.findByPk(req.params.id);
    if (!structure) return res.status(404).json({ error: 'Salary structure not found' });
    await structure.destroy();
    res.json({ message: 'Salary structure deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete salary structure', message: error.message });
  }
};
