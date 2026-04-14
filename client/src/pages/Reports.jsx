import { useState, useEffect } from 'react';
import { getPayrollHistory, getEmployees, getExportCSVUrl } from '../services/api';
import { useNotification } from '../App';
import Pagination from '../components/Pagination';

const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const formatINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

export default function Reports() {
  const notify = useNotification();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterEmployee) params.employeeId = filterEmployee;
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      const { data } = await getPayrollHistory(params);
      setRecords(data.records);
      setTotalPages(data.totalPages);
    } catch {
      notify('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees({ limit: 100 }).then((r) => setEmployees(r.data.employees)).catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [page, filterEmployee, filterMonth, filterYear]);

  const handleExportCSV = () => {
    const params = {};
    if (filterEmployee) params.employeeId = filterEmployee;
    if (filterMonth) params.month = filterMonth;
    if (filterYear) params.year = filterYear;
    const url = getExportCSVUrl(params);
    window.open(url, '_blank');
    notify('CSV export started', 'info');
  };

  const years = [];
  const curYear = new Date().getFullYear();
  for (let y = curYear - 2; y <= curYear + 1; y++) years.push(y);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Payroll Reports</h2>
          <p>View payroll history and export data</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportCSV}>📥 Export CSV</button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select className="form-control" style={{ width: 200 }} value={filterEmployee} onChange={(e) => { setFilterEmployee(e.target.value); setPage(1); }}>
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select className="form-control" style={{ width: 160 }} value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }}>
          <option value="">All Months</option>
          {monthNames.slice(1).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select className="form-control" style={{ width: 120 }} value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}>
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? <div className="spinner" /> : records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <p>No payroll records found for the selected filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th className="text-right">Basic (₹)</th>
                    <th className="text-right">HRA (₹)</th>
                    <th className="text-right">Bonus (₹)</th>
                    <th className="text-right">Gross (₹)</th>
                    <th className="text-right">Deductions (₹)</th>
                    <th className="text-right">Net Salary (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.employee?.name}</td>
                      <td>{r.employee?.department?.name || '—'}</td>
                      <td>{monthNames[r.month]?.substring(0, 3)}</td>
                      <td>{r.year}</td>
                      <td className="text-right font-mono">{formatINR(r.basic)}</td>
                      <td className="text-right font-mono">{formatINR(r.hra)}</td>
                      <td className="text-right font-mono">{formatINR(r.bonus)}</td>
                      <td className="text-right font-mono">{formatINR(r.grossSalary || r.gross_salary)}</td>
                      <td className="text-right font-mono" style={{ color: 'var(--danger)' }}>{formatINR(r.totalDeduction || r.total_deduction)}</td>
                      <td className="text-right font-mono" style={{ fontWeight: 700 }}>{formatINR(r.netSalary || r.net_salary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
