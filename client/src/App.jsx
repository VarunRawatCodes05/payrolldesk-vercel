import { useState, createContext, useContext, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Salary from './pages/Salary';
import Attendance from './pages/Attendance';
import DeductionsPage from './pages/Deductions';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import EmployeePortal from './pages/EmployeePortal';

// Notification context
export const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

function App() {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('payroll_token'));

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  }, []);

  const handleLogin = (newToken, admin) => {
    localStorage.setItem('payroll_token', newToken);
    localStorage.setItem('payroll_admin', JSON.stringify(admin));
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('payroll_token');
    localStorage.removeItem('payroll_admin');
    setToken(null);
  };

  const isAuthenticated = !!token;
  const user = JSON.parse(localStorage.getItem('payroll_admin') || '{}');
  const isEmployee = user.role === 'employee';

  return (
    <NotificationContext.Provider value={notify}>
      {/* Notifications */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.type === 'success' && '✓ '}
            {n.type === 'error' && '✕ '}
            {n.type === 'info' && 'ℹ '}
            {n.message}
          </div>
        ))}
      </div>

      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        {/* We want the root path to either show the dashboard (if logged in) or the landing page (if logged out) */}
        <Route path="/" element={
          isAuthenticated ? <Layout onLogout={handleLogout} /> : <Landing />
        }>
          <Route index element={isEmployee ? <EmployeePortal /> : <Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
          <Route path="salary" element={<Salary />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="deductions" element={<DeductionsPage />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationContext.Provider>
  );
}

export default App;
