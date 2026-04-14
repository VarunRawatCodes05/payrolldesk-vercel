const { Department, Employee } = require('../models');
const sequelize = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{ model: Employee, as: 'employees', attributes: ['id'] }],
      order: [['name', 'ASC']],
    });
    const result = departments.map((d) => ({
      ...d.toJSON(),
      employeeCount: d.employees ? d.employees.length : 0,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments', message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [{ model: Employee, as: 'employees', attributes: ['id', 'name', 'email'] }],
    });
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    const existing = await Department.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(409).json({ error: 'Department already exists' });
    }
    const dept = await Department.create({ name: name.trim(), description: description?.trim() || null });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department', message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    await dept.update({ name: name.trim(), description: description?.trim() || null });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    const empCount = await Employee.count({ where: { departmentId: dept.id } });
    if (empCount > 0) {
      return res.status(400).json({ error: `Cannot delete department with ${empCount} employee(s). Reassign them first.` });
    }
    await dept.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department', message: error.message });
  }
};
