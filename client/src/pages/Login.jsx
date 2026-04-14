import { useState } from 'react';
import { login, employeeLogin } from '../services/api';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin'); // 'admin' or 'employee'
  const [identifier, setIdentifier] = useState(''); // username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        const { data } = await login({ username: identifier, password });
        if (!data.token || !data.user) throw new Error('Invalid API response');
        onLogin(data.token, data.user);
      } else {
        const { data } = await employeeLogin({ email: identifier, password });
        if (!data.token || !data.user) throw new Error('Invalid API response');
        onLogin(data.token, data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <img src="/logo.png" alt="PayrollDesk Logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'contain' }} />
        </div>
        <h1>PayrollDesk</h1>
        <p className="subtitle">Sign in to manage your organization's payroll</p>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: role === 'admin' ? '2px solid var(--primary)' : 'none' }}
            onClick={() => { setRole('admin'); setError(''); setIdentifier(''); setPassword(''); }}
          >
            Admin
          </button>
          <button
            type="button"
            className={`btn ${role === 'employee' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: role === 'employee' ? '2px solid var(--primary)' : 'none' }}
            onClick={() => { setRole('employee'); setError(''); setIdentifier(''); setPassword(''); }}
          >
            Employee
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-identifier">{role === 'admin' ? 'Username' : 'Email Address'}</label>
            <input
              id="login-identifier"
              className="form-control"
              type={role === 'admin' ? 'text' : 'email'}
              placeholder={role === 'admin' ? 'Enter admin username' : 'Enter your email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Signing in…' : `Sign In as ${role === 'admin' ? 'Admin' : 'Employee'}`}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--slate-400)' }}>
          {role === 'admin' ? 'Admin defaults: admin / admin123' : 'Employee defaults: <email> / employee123'}
        </p>
      </div>
    </div>
  );
}
