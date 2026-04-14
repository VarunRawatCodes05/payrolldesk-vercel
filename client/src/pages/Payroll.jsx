import { useState, useEffect } from 'react';
import { getPayrolls, generatePayroll } from '../services/api';
import { useNotification } from '../App';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const formatINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

export default function Payroll() {
  const notify = useNotification();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      const { data } = await getPayrolls(params);
      setPayrolls(data);
    } catch {
      notify('Failed to load payroll records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayrolls(); }, [filterMonth, filterYear]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await generatePayroll({ month: genMonth, year: genYear });
      notify(data.message);
      if (data.errors?.length) {
        data.errors.forEach((err) => notify(err, 'error'));
      }
      setFilterMonth(String(genMonth));
      setFilterYear(String(genYear));
      fetchPayrolls();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to generate payroll', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const years = [];
  const curYear = new Date().getFullYear();
  for (let y = curYear - 2; y <= curYear + 1; y++) years.push(y);

  // Totals
  const totalGross = payrolls.reduce((s, p) => s + parseFloat(p.grossSalary || p.gross_salary || 0), 0);
  const totalDed = payrolls.reduce((s, p) => s + parseFloat(p.totalDeduction || p.total_deduction || 0), 0);
  const totalNet = payrolls.reduce((s, p) => s + parseFloat(p.netSalary || p.net_salary || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Payroll Processing</h2>
          <p>Generate and review monthly payroll for all employees</p>
        </div>
      </div>

      {/* Generate Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Generate Payroll</h3>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: 16 }}>
            Select the month and year, then click generate. The system will calculate: <strong>Gross Salary (Basic + HRA + Bonus)</strong> adjusted by attendance, minus <strong>Deductions (Tax + PF + Other)</strong> = <strong>Net Salary</strong>.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Month</label>
              <select className="form-control" style={{ width: 160 }} value={genMonth} onChange={(e) => setGenMonth(parseInt(e.target.value))}>
                {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Year</label>
              <select className="form-control" style={{ width: 120 }} value={genYear} onChange={(e) => setGenYear(parseInt(e.target.value))}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button className="btn btn-success" style={{ height: 38 }} onClick={handleGenerate} disabled={generating}>
              {generating ? '⏳ Generating…' : '⚡ Generate Payroll'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter & View */}
      <div className="filters-bar">
        <select className="form-control" style={{ width: 160 }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select className="form-control" style={{ width: 120 }} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? <div className="spinner" /> : payrolls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧾</div>
              <p>No payroll records. Generate payroll above to see results.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Period</th>
                      <th className="text-right">Gross (₹)</th>
                      <th className="text-right">Deductions (₹)</th>
                      <th className="text-right">Net Salary (₹)</th>
                      <th className="text-right">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 500 }}>{p.employee?.name}</td>
                        <td>{p.employee?.department?.name || '—'}</td>
                        <td>{monthNames[(p.month || 1) - 1]?.substring(0, 3)} {p.year}</td>
                        <td className="text-right font-mono">{formatINR(p.grossSalary || p.gross_salary)}</td>
                        <td className="text-right font-mono" style={{ color: 'var(--danger)' }}>
                          {formatINR(p.totalDeduction || p.total_deduction)}
                        </td>
                        <td className="text-right font-mono" style={{ fontWeight: 700 }}>
                          {formatINR(p.netSalary || p.net_salary)}
                        </td>
                        <td className="text-right">
                          {(p.presentDays ?? p.present_days) != null
                            ? `${p.presentDays ?? p.present_days}/${p.workingDays ?? p.working_days}`
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--slate-50)', fontWeight: 600 }}>
                      <td colSpan="3" style={{ padding: '12px 16px' }}>Total ({payrolls.length} employees)</td>
                      <td className="text-right font-mono" style={{ padding: '12px 16px' }}>{formatINR(totalGross)}</td>
                      <td className="text-right font-mono" style={{ padding: '12px 16px', color: 'var(--danger)' }}>{formatINR(totalDed)}</td>
                      <td className="text-right font-mono" style={{ padding: '12px 16px', fontWeight: 700 }}>{formatINR(totalNet)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
