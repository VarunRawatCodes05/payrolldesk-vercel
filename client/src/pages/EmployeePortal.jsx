import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../App';

const formatINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');
const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function EmployeePortal() {
  const notify = useNotification();
  const [data, setData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leave form state
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);

  const fetchData = async () => {
    try {
      const [dashRes, attRes, payRes, leaveRes] = await Promise.all([
        api.get('/my/dashboard'),
        api.get('/my/attendance'),
        api.get('/my/payroll'),
        api.get('/my/leaves').catch(() => ({ data: [] })) // Graceful fail if API not available right away
      ]);
      setData(dashRes.data);
      setAttendance(attRes.data);
      setPayroll(payRes.data);
      setLeaves(leaveRes.data);
    } catch (err) {
      notify('Failed to load portal data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrintPayslip = (p) => {
    // A quick way to print a payslip is opening a raw HTML window and calling print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${monthNames[p.month]} ${p.year}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
            .table th { background: #f8fafc; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>PayrollDesk - Payslip</h1>
          <p><strong>Employee:</strong> ${data?.employee?.name}</p>
          <p><strong>Department:</strong> ${data?.employee?.department?.name}</p>
          <p><strong>Period:</strong> ${monthNames[p.month]} ${p.year}</p>
          
          <table class="table">
            <tr>
              <th>Earnings</th>
              <th class="right">Amount</th>
            </tr>
            <tr>
              <td>Basic Salary</td>
              <td class="right">${formatINR(p.basic)}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td class="right">${formatINR(p.hra)}</td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td class="right">${formatINR(p.bonus)}</td>
            </tr>
            <tr>
              <td class="bold">Gross Salary</td>
              <td class="right bold">${formatINR(p.grossSalary || p.gross_salary)}</td>
            </tr>
          </table>

          <table class="table" style="margin-top: 20px;">
            <tr>
              <th>Deductions</th>
              <th class="right">Amount</th>
            </tr>
            <tr>
              <td>Provident Fund (PF)</td>
              <td class="right">${formatINR(p.pf)}</td>
            </tr>
            <tr>
              <td>Taxes (TDS)</td>
              <td class="right">${formatINR(p.tax)}</td>
            </tr>
            <tr>
              <td>Other Deductions</td>
              <td class="right">${formatINR(p.otherDeductions || p.other_deductions)}</td>
            </tr>
            <tr>
              <td class="bold">Total Deductions</td>
              <td class="right bold">${formatINR(p.totalDeduction || p.total_deduction)}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <h2 style="margin: 0; color: #166534; display: flex; justify-content: space-between;">
              <span>Net Salary</span>
              <span>${formatINR(p.netSalary || p.net_salary)}</span>
            </h2>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    setSubmittingLeave(true);
    try {
      await api.post('/my/leaves', { startDate: leaveStart, endDate: leaveEnd, reason: leaveReason });
      notify('Leave request submitted successfully!', 'success');
      setLeaveModalOpen(false);
      setLeaveStart(''); setLeaveEnd(''); setLeaveReason('');
      fetchData(); // refresh leaves
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to request leave', 'error');
    } finally {
      setSubmittingLeave(false);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto', marginTop: 100 }} />;
  if (!data) return <div>Data not found</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>My Portal</h2>
          <p>Welcome back, {data.employee.name}!</p>
        </div>
        <button className="btn btn-primary" onClick={() => setLeaveModalOpen(true)}>Request Leave</button>
      </div>

      <div className="dashboard-grid">
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}>💰</div>
          <div className="summary-info">
            <span className="summary-label">Total Earned</span>
            <span className="summary-value">{formatINR(data.totalEarned)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--success-100)', color: 'var(--success)' }}>🧾</div>
          <div className="summary-info">
            <span className="summary-label">Total Payslips</span>
            <span className="summary-value">{data.totalPayslips}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--warning-100)', color: 'var(--warning)' }}>📅</div>
          <div className="summary-info">
            <span className="summary-label">Attendance (YTD)</span>
            <span className="summary-value">{data.attendancePercent}%</span>
          </div>
        </div>
      </div>

      {leaveModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request Time Off</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setLeaveModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleRequestLeave} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" className="form-control" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" className="form-control" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea className="form-control" rows="3" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} required placeholder="I need time off because..." />
              </div>
              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLeaveModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submittingLeave}>
                  {submittingLeave ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslips and Leave sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Recent Payslips</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {payroll.length === 0 ? (
              <p style={{ padding: 20, textAlign: 'center', color: 'var(--slate-500)' }}>No payslips available.</p>
            ) : (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Month</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', textAlign: 'right' }}>Gross</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', textAlign: 'right' }}>Net Salary</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }}>{monthNames[p.month]} {p.year}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'right' }} className="font-mono">{formatINR(p.grossSalary || p.gross_salary)}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'right', fontWeight: 600 }} className="font-mono">{formatINR(p.netSalary || p.net_salary)}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'center' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handlePrintPayslip(p)} title="Download / Print PDF">📄 PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Leave Requests</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {leaves.length === 0 ? (
              <p style={{ padding: 20, textAlign: 'center', color: 'var(--slate-500)' }}>No leave requests found.</p>
            ) : (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Date Range</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Reason</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-200)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }}>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }} title={l.reason}>
                        {l.reason.length > 20 ? l.reason.substring(0, 20) + '...' : l.reason}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500,
                          backgroundColor: l.status === 'Approved' ? 'var(--success-100)' : l.status === 'Rejected' ? 'var(--danger-100)' : 'var(--warning-100)',
                          color: l.status === 'Approved' ? 'var(--success)' : l.status === 'Rejected' ? 'var(--danger)' : 'var(--warning-700)'
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
