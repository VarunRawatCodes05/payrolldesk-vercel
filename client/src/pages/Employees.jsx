import { useState, useEffect } from 'react';
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import { useNotification } from '../App';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';

const emptyForm = { name: '', email: '', phone: '', departmentId: '', joinDate: '' };

export default function Employees() {
  const notify = useNotification();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterDept) params.department = filterDept;
      if (filterStatus) params.status = filterStatus;
      const { data } = await getEmployees(params);
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      notify('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartments().then((r) => setDepartments(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [page, search, filterDept, filterStatus]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      departmentId: emp.departmentId || emp.department_id,
      joinDate: emp.joinDate || emp.join_date,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.departmentId || !form.joinDate) {
      notify('Please fill in all fields', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateEmployee(editing.id, form);
        notify('Employee updated successfully');
      } else {
        await createEmployee(form);
        notify('Employee added successfully');
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to save employee', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(toDelete.id);
      notify('Employee deleted');
      setConfirmOpen(false);
      setToDelete(null);
      fetchEmployees();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p>{total} total employee{total !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Employee</button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="form-control search-input"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="form-control" style={{ width: 180 }} value={filterDept} onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="form-control" style={{ width: 140 }} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="spinner" />
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 500 }}>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.department?.name || '—'}</td>
                      <td>{new Date(emp.joinDate || emp.join_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td><span className={`badge badge-${emp.status}`}>{emp.status}</span></td>
                      <td>
                        <button className="btn-icon" title="Edit" onClick={() => openEdit(emp)}>✏️</button>
                        <button className="btn-icon danger" title="Delete" onClick={() => { setToDelete(emp); setConfirmOpen(true); }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Employee' : 'Add New Employee'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Add Employee'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label htmlFor="emp-name">Full Name</label>
          <input id="emp-name" className="form-control" placeholder="e.g. Rajesh Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-email">Email Address</label>
            <input id="emp-email" className="form-control" type="email" placeholder="e.g. rajesh@company.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="emp-phone">Phone Number</label>
            <input id="emp-phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-dept">Department</label>
            <select id="emp-dept" className="form-control" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="emp-date">Joining Date</label>
            <input id="emp-date" className="form-control" type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${toDelete?.name}? This will remove all related salary, deduction, attendance, and payroll records.`}
      />
    </div>
  );
}
