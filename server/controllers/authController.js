const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Employee, Department } = require('../models');

// Fallback for Vercel environments where users forget to set the env var
const JWT_SECRET = process.env.JWT_SECRET || 'payroll_desk_ultra_secret_2026_pulse';

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      user: { id: admin.id, username: admin.username, fullName: admin.fullName, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

exports.employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const employee = await Employee.findOne({
      where: { email: email.toLowerCase().trim() },
      include: [{ model: Department, as: 'department', attributes: ['name'] }],
    });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!employee.password) {
      return res.status(401).json({ error: 'Employee account not set up. Contact your administrator.' });
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (employee.status !== 'active') {
      return res.status(403).json({ error: 'Your account is inactive. Contact your administrator.' });
    }
    const token = jwt.sign(
      { id: employee.id, email: employee.email, role: 'employee' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department?.name,
        role: 'employee',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (req.userRole === 'admin') {
      const admin = await Admin.findByPk(req.userId, { attributes: ['id', 'username', 'fullName'] });
      if (!admin) return res.status(404).json({ error: 'Admin not found' });
      res.json({ ...admin.toJSON(), role: 'admin' });
    } else {
      const employee = await Employee.findByPk(req.userId, {
        attributes: ['id', 'name', 'email', 'phone', 'joinDate', 'status'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      });
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json({ ...employee.toJSON(), role: 'employee' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile', message: error.message });
  }
};
