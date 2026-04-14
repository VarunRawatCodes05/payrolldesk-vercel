import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/salary': 'Salary Management',
  '/deductions': 'Deductions',
  '/attendance': 'Attendance',
  '/payroll': 'Payroll Processing',
  '/reports': 'Reports',
};

export default function Topbar({ onMenuToggle, onLogout }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'PayrollDesk';
  const admin = JSON.parse(localStorage.getItem('payroll_admin') || '{}');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>☰</button>
        <h1>{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-admin">
          <div className="topbar-avatar">
            {admin.role === 'employee' && admin.name
              ? admin.name.split(' ').map(n => n[0]).join('').substring(0,2)
              : admin.fullName
                ? admin.fullName.split(' ').map(n => n[0]).join('')
                : 'U'}
          </div>
          <div>
            <div className="topbar-admin-name">{admin.role === 'employee' ? admin.name : admin.fullName || 'Admin'}</div>
            <div className="topbar-admin-role">{admin.role === 'employee' ? admin.department : 'Administrator'}</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
