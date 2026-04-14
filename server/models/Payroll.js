const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payroll = sequelize.define('Payroll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 12 },
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  basic: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  hra: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  bonus: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  grossSalary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'gross_salary',
  },
  tax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  pf: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  otherDeductions: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'other_deductions',
  },
  totalDeduction: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'total_deduction',
  },
  netSalary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'net_salary',
  },
  workingDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'working_days',
  },
  presentDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'present_days',
  },
}, {
  indexes: [
    { unique: true, fields: ['employee_id', 'month', 'year'] },
  ],
});

module.exports = Payroll;
