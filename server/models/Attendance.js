const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
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
  workingDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'working_days',
  },
  presentDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'present_days',
  },
}, {
  indexes: [
    { unique: true, fields: ['employee_id', 'month', 'year'] },
  ],
});

module.exports = Attendance;
