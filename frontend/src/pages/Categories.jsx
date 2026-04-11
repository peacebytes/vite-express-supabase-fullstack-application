import { useState, useEffect } from 'react';
import { api } from '../api';

const EMPTY = { name: '', description: '', business_size: 'small' };
const truncate = (s, n = 100) => s && s.length > n ? s.slice(0, n) + '…' : s;

export default function Categories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const load = () => api.getCategories().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.updateCategory(editId, form);
    else await api.createCategory(form);
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description || '', business_size: item.business_size });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.deleteCategory(id);
    load();
  };

  return (
    <>
      <h1>Categories</h1>
      {isAdmin && !showForm && <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => setShowForm(true)}>Create new item</button>}
      {isAdmin && showForm && <form onSubmit={handleSubmit}>
        <div className="form-row-half">
          <label><span className="label-text">Name <span className="req">*</span></span><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        </div>
        <div className="form-row-full">
          <label><span className="label-text">Description <span className="req">*</span></span><textarea rows={10} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        </div>
        <div className="form-row">
          <label><span className="label-text">Business Size <span className="req">*</span></span>
            <select value={form.business_size} onChange={e => setForm({ ...form, business_size: e.target.value })}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="big">Big</option>
            </select>
          </label>
          <button className="btn-primary" type="submit">{editId ? 'Update' : 'Add'}</button>
          <button className="btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>}
      <table>
        <thead><tr><th>Name</th><th>Description</th><th>Size</th>{isAdmin && <th>Actions</th>}</tr></thead>
        <tbody>
          {items.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td><div className="desc-truncate">{truncate(c.description)}</div></td>
              <td><span className={`badge badge-${c.business_size}`}>{c.business_size}</span></td>
              {isAdmin && <td>
                <button className="btn-primary" onClick={() => handleEdit(c)}>Edit</button>{' '}
                <button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
