const Admin = require('./Admin');
const Department = require('./Department');
const Employee = require('./Employee');
const SalaryStructure = require('./SalaryStructure');
const Deduction = require('./Deduction');
const Attendance = require('./Attendance');
const Payroll = require('./Payroll');
const Leave = require('./Leave');

function setupAssociations() {
  // Department <-> Employee
  Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });
  Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

  // Employee <-> SalaryStructure (1:1)
  Employee.hasOne(SalaryStructure, { foreignKey: 'employeeId', as: 'salaryStructure' });
  SalaryStructure.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // Employee <-> Deduction (1:1)
  Employee.hasOne(Deduction, { foreignKey: 'employeeId', as: 'deduction' });
  Deduction.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // Employee <-> Attendance (1:many)
  Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances' });
  Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // Employee <-> Payroll (1:many)
  Employee.hasMany(Payroll, { foreignKey: 'employeeId', as: 'payrolls' });
  Payroll.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // Employee <-> Leave (1:many)
  Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });
  Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
}

module.exports = {
  Admin,
  Department,
  Employee,
  SalaryStructure,
  Deduction,
  Attendance,
  Payroll,
  Leave,
  setupAssociations,
};
