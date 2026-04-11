import { useState, useEffect } from 'react';
import { api } from '../api';

const EMPTY = { name: '', description: '', url: '', subscription: 'free', category_id: '', learning_notes: '', youtube_link: '', how_to_article: '' };
const truncate = (s, n = 100) => s && s.length > n ? s.slice(0, n) + '…' : s;

export default function AiTools() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const load = () => {
    api.getAiTools(filter || undefined).then(setItems);
    api.getCategories().then(setCategories);
  };
  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, category_id: form.category_id || null, learning_notes: form.learning_notes || null, youtube_link: form.youtube_link || null, how_to_article: form.how_to_article || null, url: form.url || null };
    if (editId) await api.updateAiTool(editId, body);
    else await api.createAiTool(body);
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description || '', url: item.url || '', subscription: item.subscription, category_id: item.category_id || '', learning_notes: item.learning_notes || '', youtube_link: item.youtube_link || '', how_to_article: item.how_to_article || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tool?')) return;
    await api.deleteAiTool(id);
    load();
  };

  return (
    <>
      <h1>AI Tools</h1>
      {isAdmin && !showForm && <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => setShowForm(true)}>Create new item</button>}
      {isAdmin && showForm && <form onSubmit={handleSubmit}>
        <div className="form-row-half">
          <label><span className="label-text">Name <span className="req">*</span></span><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        </div>
        <div className="form-row-full">
          <label><span className="label-text">Description <span className="req">*</span></span><textarea rows={10} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        </div>
        <div className="form-row-full">
          <label><span className="label-text">URL <span className="req">*</span></span><input required value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></label>
        </div>
        <div className="form-row-full">
          <label>Learning Notes<input value={form.learning_notes} onChange={e => setForm({ ...form, learning_notes: e.target.value })} placeholder="https://..." /></label>
        </div>
        <div className="form-row-full">
          <label>Youtube<input value={form.youtube_link} onChange={e => setForm({ ...form, youtube_link: e.target.value })} placeholder="https://..." /></label>
        </div>
        <div className="form-row-full">
          <label>How-to article<input value={form.how_to_article} onChange={e => setForm({ ...form, how_to_article: e.target.value })} placeholder="https://..." /></label>
        </div>
        <div className="form-row">
          <label><span className="label-text">Subscription <span className="req">*</span></span>
            <select value={form.subscription} onChange={e => setForm({ ...form, subscription: e.target.value })}>
              <option value="free">Free</option>
              <option value="pay-as-you-go">Pay-as-you-go</option>
            </select>
          </label>
          <label><span className="label-text">Category <span className="req">*</span></span>
            <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">None</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <button className="btn-primary" type="submit">{editId ? 'Update' : 'Add'}</button>
          <button className="btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>}
      <div style={{ marginBottom: '0.75rem' }}>
        <label>Filter by category:{' '}
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Description</th><th>Notes</th><th>Youtube</th><th>Article</th><th>Subscription</th><th>Category</th>{isAdmin && <th>Actions</th>}</tr></thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id}>
              <td>{t.url ? <a href={t.url} target="_blank" rel="noreferrer">{t.name}</a> : t.name}</td>
              <td><div className="desc-truncate">{truncate(t.description)}</div></td>
              <td>{t.learning_notes && <a href={t.learning_notes} target="_blank" rel="noreferrer">Takeaway</a>}</td>
              <td>{t.youtube_link && <a href={t.youtube_link} target="_blank" rel="noreferrer">Youtube</a>}</td>
              <td>{t.how_to_article && <a href={t.how_to_article} target="_blank" rel="noreferrer">Article</a>}</td>
              <td><span className={`badge ${t.subscription === 'free' ? 'badge-free' : 'badge-pay'}`}>{t.subscription}</span></td>
              <td>{t.categories?.name || '—'}</td>
              {isAdmin && <td>
                <button className="btn-primary" onClick={() => handleEdit(t)}>Edit</button>{' '}
                <button className="btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
