import { useState, useEffect } from 'react';
import { getAttendance, getEmployees, upsertAttendance, deleteAttendance } from '../services/api';
import { useNotification } from '../App';
import Modal from '../components/Modal';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Attendance() {
  const notify = useNotification();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', month: '', year: '', workingDays: '22', presentDays: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      const [aRes, eRes] = await Promise.all([getAttendance(params), getEmployees({ limit: 100 })]);
      setRecords(aRes.data);
      setEmployees(eRes.data.employees);
    } catch {
      notify('Failed to load attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterMonth, filterYear]);

  const openCreate = () => {
    setForm({ employeeId: '', month: String(filterMonth), year: String(filterYear), workingDays: '22', presentDays: '' });
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setForm({
      employeeId: r.employeeId || r.employee_id,
      month: String(r.month),
      year: String(r.year),
      workingDays: String(r.workingDays ?? r.working_days),
      presentDays: String(r.presentDays ?? r.present_days),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.employeeId || !form.month || !form.year || !form.workingDays || form.presentDays === '') {
      notify('All fields are required', 'error');
      return;
    }
    if (parseInt(form.presentDays) > parseInt(form.workingDays)) {
      notify('Present days cannot exceed working days', 'error');
      return;
    }
    setSaving(true);
    try {
      await upsertAttendance({
        employeeId: parseInt(form.employeeId),
        month: parseInt(form.month),
        year: parseInt(form.year),
        workingDays: parseInt(form.workingDays),
        presentDays: parseInt(form.presentDays),
      });
      notify('Attendance saved');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteAttendance(id);
      notify('Attendance record deleted');
      fetchData();
    } catch {
      notify('Failed to delete', 'error');
    }
  };

  const years = [];
  const curYear = new Date().getFullYear();
  for (let y = curYear - 2; y <= curYear + 1; y++) years.push(y);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Attendance</h2>
          <p>Monthly attendance tracking for all employees</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Record Attendance</button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select className="form-control" style={{ width: 160 }} value={filterMonth} onChange={(e) => setFilterMonth(parseInt(e.target.value))}>
          {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select className="form-control" style={{ width: 120 }} value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))}>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? <div className="spinner" /> : records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No attendance records for {monthNames[filterMonth - 1]} {filterYear}.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="text-right">Working Days</th>
                    <th className="text-right">Present Days</th>
                    <th className="text-right">Absent</th>
                    <th className="text-right">Attendance %</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const wd = r.workingDays ?? r.working_days;
                    const pd = r.presentDays ?? r.present_days;
                    const absent = wd - pd;
                    const pct = wd > 0 ? Math.round((pd / wd) * 100) : 0;
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 500 }}>{r.employee?.name}</td>
                        <td>{r.employee?.department?.name || '—'}</td>
                        <td className="text-right">{wd}</td>
                        <td className="text-right">{pd}</td>
                        <td className="text-right" style={{ color: absent > 0 ? 'var(--danger)' : 'var(--success)' }}>{absent}</td>
                        <td className="text-right">
                          <span className={`badge ${pct >= 90 ? 'badge-active' : 'badge-inactive'}`}>{pct}%</span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Edit" onClick={() => openEdit(r)}>✏️</button>
                          <button className="btn-icon danger" title="Delete" onClick={() => handleDeleteRecord(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Attendance"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        <div className="form-group">
          <label>Employee</label>
          <select className="form-control" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
            <option value="">Select employee</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Month</label>
            <select className="form-control" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
              <option value="">Select</option>
              {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select className="form-control" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Total Working Days</label>
            <input className="form-control" type="number" min="1" max="31" value={form.workingDays} onChange={(e) => setForm({ ...form, workingDays: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Days Present</label>
            <input className="form-control" type="number" min="0" max={form.workingDays || 31} value={form.presentDays} onChange={(e) => setForm({ ...form, presentDays: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
