import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';
import { useNotification } from '../App';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Departments() {
  const notify = useNotification();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data } = await getDepartments();
      setDepartments(data);
    } catch {
      notify('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({ name: d.name, description: d.description || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      notify('Department name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDepartment(editing.id, form);
        notify('Department updated');
      } else {
        await createDepartment(form);
        notify('Department created');
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to save department', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(toDelete.id);
      notify('Department deleted');
      setConfirmOpen(false);
      setToDelete(null);
      fetchDepartments();
    } catch (err) {
      notify(err.response?.data?.error || 'Cannot delete department', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Departments</h2>
          <p>Manage your organization's departments</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Department</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="spinner" />
          ) : departments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <p>No departments yet. Create your first department.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Description</th>
                    <th>Employees</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 500 }}>{d.name}</td>
                      <td style={{ color: 'var(--slate-500)' }}>{d.description || '—'}</td>
                      <td>
                        <span className="badge badge-active">{d.employeeCount} member{d.employeeCount !== 1 ? 's' : ''}</span>
                      </td>
                      <td>
                        <button className="btn-icon" title="Edit" onClick={() => openEdit(d)}>✏️</button>
                        <button className="btn-icon danger" title="Delete" onClick={() => { setToDelete(d); setConfirmOpen(true); }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Department' : 'Add Department'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label htmlFor="dept-name">Department Name</label>
          <input id="dept-name" className="form-control" placeholder="e.g. Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="dept-desc">Description (Optional)</label>
          <input id="dept-desc" className="form-control" placeholder="Brief description of the department" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Delete "${toDelete?.name}"? Departments with employees cannot be deleted.`}
      />
    </div>
  );
}
