import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/api';

const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (val) => {
  return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (!data) return <div className="empty-state"><p>Failed to load dashboard data.</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your organization's payroll status</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon blue">👥</div>
          <div className="summary-info">
            <h4>Total Employees</h4>
            <div className="value">{data.totalEmployees}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon green">💰</div>
          <div className="summary-info">
            <h4>Total Salary Paid</h4>
            <div className="value">{formatCurrency(data.totalSalaryPaid)}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon orange">⏳</div>
          <div className="summary-info">
            <h4>Pending Payroll</h4>
            <div className="value">{data.pendingPayroll}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon blue">🏢</div>
          <div className="summary-info">
            <h4>Departments</h4>
            <div className="value">{data.totalDepartments}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid-2">
        {/* Recent Payrolls */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Payroll Activity</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {data.recentPayrolls?.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Period</th>
                      <th className="text-right">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentPayrolls.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 500 }}>{p.employee?.name}</td>
                        <td>{monthNames[p.month]} {p.year}</td>
                        <td className="text-right font-mono">{formatCurrency(p.netSalary)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No payroll records yet. Generate payroll from the Payroll section.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="card">
          <div className="card-header">
            <h3>Recently Added Employees</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {data.recentEmployees?.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEmployees.map((e) => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 500 }}>{e.name}</td>
                        <td>
                          <span className="badge badge-active">{e.department?.name}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state"><p>No employees added yet.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
