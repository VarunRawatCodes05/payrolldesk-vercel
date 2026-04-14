import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/employees', label: 'Employees', icon: '👥' },
  { path: '/departments', label: 'Departments', icon: '🏢' },
  { section: 'Compensation' },
  { path: '/salary', label: 'Salary', icon: '💰' },
  { path: '/deductions', label: 'Deductions', icon: '📋' },
  { section: 'Operations' },
  { path: '/attendance', label: 'Attendance', icon: '📅' },
  { path: '/payroll', label: 'Payroll', icon: '🧾' },
  { path: '/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('payroll_admin') || '{}');
  const isEmployee = user.role === 'employee';

  const visibleNavItems = isEmployee
    ? [{ path: '/', label: 'My Portal', icon: '📊' }]
    : navItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="modal-overlay" style={{ zIndex: 99 }} onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain' }} />
          <div>
            <h2>PayrollDesk</h2>
            <span>Employee Management</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {visibleNavItems.map((item, i) => {
            if (item.section) {
              return <div key={i} className="sidebar-section-label">{item.section}</div>;
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
