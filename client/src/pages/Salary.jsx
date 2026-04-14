import { useState, useEffect } from 'react';
import { getSalaryStructures, getEmployees, upsertSalary, deleteSalary } from '../services/api';
import { useNotification } from '../App';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const formatINR = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

export default function Salary() {
  const notify = useNotification();
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', basic: '', hra: '', bonus: '' });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const [sRes, eRes] = await Promise.all([getSalaryStructures(), getEmployees({ limit: 100 })]);
      setStructures(sRes.data);
      setEmployees(eRes.data.employees);
    } catch {
      notify('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const assignedIds = structures.map((s) => s.employeeId || s.employee_id);
  const unassigned = employees.filter((e) => !assignedIds.includes(e.id));

  const openCreate = () => {
    setForm({ employeeId: '', basic: '', hra: '', bonus: '' });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({
      employeeId: s.employeeId || s.employee_id,
      basic: s.basic,
      hra: s.hra,
      bonus: s.bonus,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.employeeId || form.basic === '' || form.hra === '' || form.bonus === '') {
      notify('All fields are required', 'error');
      return;
    }
    setSaving(true);
    try {
      await upsertSalary({
        employeeId: parseInt(form.employeeId),
        basic: parseFloat(form.basic),
        hra: parseFloat(form.hra),
        bonus: parseFloat(form.bonus),
      });
      notify('Salary structure saved');
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
      await deleteSalary(toDelete.id);
      notify('Salary structure removed');
      setConfirmOpen(false);
      fetch();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  const gross = (parseFloat(form.basic) || 0) + (parseFloat(form.hra) || 0) + (parseFloat(form.bonus) || 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Salary Management</h2>
          <p>Define and manage salary structures for employees</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Assign Salary</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? <div className="spinner" /> : structures.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <p>No salary structures defined yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="text-right">Basic (₹)</th>
                    <th className="text-right">HRA (₹)</th>
                    <th className="text-right">Bonus (₹)</th>
                    <th className="text-right">Gross (₹)</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map((s) => {
                    const g = parseFloat(s.basic) + parseFloat(s.hra) + parseFloat(s.bonus);
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{s.employee?.name}</td>
                        <td>{s.employee?.department?.name || '—'}</td>
                        <td className="text-right font-mono">{formatINR(s.basic)}</td>
                        <td className="text-right font-mono">{formatINR(s.hra)}</td>
                        <td className="text-right font-mono">{formatINR(s.bonus)}</td>
                        <td className="text-right font-mono" style={{ fontWeight: 600 }}>{formatINR(g)}</td>
                        <td>
                          <button className="btn-icon" title="Edit" onClick={() => openEdit(s)}>✏️</button>
                          <button className="btn-icon danger" title="Delete" onClick={() => { setToDelete(s); setConfirmOpen(true); }}>🗑️</button>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Salary Structure"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
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
            <label>Basic Pay (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 40000" value={form.basic} onChange={(e) => setForm({ ...form, basic: e.target.value })} />
          </div>
          <div className="form-group">
            <label>HRA (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 16000" value={form.hra} onChange={(e) => setForm({ ...form, hra: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bonus (₹)</label>
            <input className="form-control" type="number" placeholder="e.g. 4000" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
          </div>
        </div>
        {gross > 0 && (
          <div style={{ padding: 12, background: 'var(--primary-50)', borderRadius: 'var(--border-radius)', fontSize: '0.9rem', fontWeight: 600 }}>
            Monthly Gross Salary: {formatINR(gross)}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Remove Salary Structure" message={`Remove salary structure for ${toDelete?.employee?.name}?`} />
    </div>
  );
}
