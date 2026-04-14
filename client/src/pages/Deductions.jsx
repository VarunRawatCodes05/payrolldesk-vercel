import { useState, useEffect } from 'react';
import { getDeductions, getEmployees, upsertDeduction, deleteDeduction } from '../services/api';
import { useNotification } from '../App';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const formatINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

export default function DeductionsPage() {
  const notify = useNotification();
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', tax: '', pf: '', other: '' });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const [dRes, eRes] = await Promise.all([getDeductions(), getEmployees({ limit: 100 })]);
      setDeductions(dRes.data);
      setEmployees(eRes.data.employees);
    } catch {
      notify('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setForm({ employeeId: '', tax: '', pf: '', other: '' });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setForm({ employeeId: d.employeeId || d.employee_id, tax: d.tax, pf: d.pf, other: d.other });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.employeeId || form.tax === '' || form.pf === '' || form.other === '') {
      notify('All fields are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await upsertDeduction({
        employeeId: parseInt(form.employeeId),
        tax: parseFloat(form.tax),
        pf: parseFloat(form.pf),
        other: parseFloat(form.other),
      });
      notify('Deduction saved');
      setModalOpen(false);
      fetch();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDeduction(toDelete.id);
      notify('Deduction removed');
      setConfirmOpen(false);
      fetch();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  const totalDed = (parseFloat(form.tax) || 0) + (parseFloat(form.pf) || 0) + (parseFloat(form.other) || 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Deductions</h2>
          <p>Manage tax, provident fund, and other deductions</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Set Deduction</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? <div className="spinner" /> : deductions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No deductions configured.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="text-right">Tax (₹)</th>
                    <th className="text-right">PF (₹)</th>
                    <th className="text-right">Other (₹)</th>
                    <th className="text-right">Total (₹)</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.map((d) => {
                    const total = parseFloat(d.tax) + parseFloat(d.pf) + parseFloat(d.other);
                    return (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 500 }}>{d.employee?.name}</td>
                        <td>{d.employee?.department?.name || '—'}</td>
                        <td className="text-right font-mono">{formatINR(d.tax)}</td>
                        <td className="text-right font-mono">{formatINR(d.pf)}</td>
                        <td className="text-right font-mono">{formatINR(d.other)}</td>
                        <td className="text-right font-mono" style={{ fontWeight: 600, color: 'var(--danger)' }}>{formatINR(total)}</td>
                        <td>
                          <button className="btn-icon" title="Edit" onClick={() => openEdit(d)}>✏️</button>
                          <button className="btn-icon danger" title="Delete" onClick={() => { setToDelete(d); setConfirmOpen(true); }}>🗑️</button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Employee Deductions"
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
        <div className="form-row-3">
          <div className="form-group">
            <label>Income Tax (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 4500" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Provident Fund (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 5400" value={form.pf} onChange={(e) => setForm({ ...form, pf: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Other (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 500" value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} />
          </div>
        </div>
        {totalDed > 0 && (
          <div style={{ padding: 12, background: 'var(--danger-bg)', borderRadius: 'var(--border-radius)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)' }}>
            Total Monthly Deduction: {formatINR(totalDed)}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Remove Deduction" message={`Remove deduction record for ${toDelete?.employee?.name}?`} />
    </div>
  );
}
