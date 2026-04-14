import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('payroll_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('payroll_token');
      localStorage.removeItem('payroll_admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const employeeLogin = (data) => api.post('/auth/employee-login', data);
export const getProfile = () => api.get('/auth/profile');

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

// Departments
export const getDepartments = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (data) => api.post('/departments', data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// Employees
export const getEmployees = (params) => api.get('/employees', { params });
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Salary Structures
export const getSalaryStructures = () => api.get('/salary-structures');
export const getSalaryByEmployee = (empId) => api.get(`/salary-structures/employee/${empId}`);
export const upsertSalary = (data) => api.post('/salary-structures', data);
export const deleteSalary = (id) => api.delete(`/salary-structures/${id}`);

// Deductions
export const getDeductions = () => api.get('/deductions');
export const getDeductionByEmployee = (empId) => api.get(`/deductions/employee/${empId}`);
export const upsertDeduction = (data) => api.post('/deductions', data);
export const deleteDeduction = (id) => api.delete(`/deductions/${id}`);

// Attendance
export const getAttendance = (params) => api.get('/attendance', { params });
export const upsertAttendance = (data) => api.post('/attendance', data);
export const bulkUpsertAttendance = (records) => api.post('/attendance/bulk', { records });
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);

// Payroll
export const getPayrolls = (params) => api.get('/payroll', { params });
export const generatePayroll = (data) => api.post('/payroll/generate', data);
export const deletePayroll = (id) => api.delete(`/payroll/${id}`);

// Reports
export const getPayrollHistory = (params) => api.get('/reports/payroll-history', { params });
export const getExportCSVUrl = (params) => {
  const query = new URLSearchParams(params).toString();
  return `/api/reports/export-csv?${query}`;
};

export default api;
