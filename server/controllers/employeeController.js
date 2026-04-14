const { Employee, Department, SalaryStructure, Deduction } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }
    if (department) where.departmentId = department;
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Employee.findAndCountAll({
      where,
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset,
    });
    res.json({
      employees: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees', message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: SalaryStructure, as: 'salaryStructure' },
        { model: Deduction, as: 'deduction' },
      ],
    });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, departmentId, joinDate } = req.body;
    if (!name || !email || !phone || !departmentId || !joinDate) {
      return res.status(400).json({ error: 'All fields are required: name, email, phone, departmentId, joinDate' });
    }
    const existingEmail = await Employee.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'An employee with this email already exists' });
    }
    const dept = await Department.findByPk(departmentId);
    if (!dept) {
      return res.status(400).json({ error: 'Invalid department' });
    }
    const emp = await Employee.create({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), departmentId, joinDate });
    const result = await Employee.findByPk(emp.id, {
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee', message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const { name, email, phone, departmentId, joinDate, status } = req.body;
    if (email && email !== emp.email) {
      const existingEmail = await Employee.findOne({ where: { email, id: { [Op.ne]: emp.id } } });
      if (existingEmail) return res.status(409).json({ error: 'Email already in use' });
    }
    await emp.update({
      name: name?.trim() || emp.name,
      email: email?.trim().toLowerCase() || emp.email,
      phone: phone?.trim() || emp.phone,
      departmentId: departmentId || emp.departmentId,
      joinDate: joinDate || emp.joinDate,
      status: status || emp.status,
    });
    const result = await Employee.findByPk(emp.id, {
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    await emp.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee', message: error.message });
  }
};
