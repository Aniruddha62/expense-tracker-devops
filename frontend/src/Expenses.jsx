import React, { useEffect, useState } from 'react';
import { expenseApi } from '../services/api';

const CATEGORIES = ['FOOD','TRANSPORT','SHOPPING','ENTERTAINMENT','HEALTH','UTILITIES','EDUCATION','OTHER'];
const METHODS    = ['CASH','CARD','UPI','NET_BANKING'];

const BADGE_COLORS = {
  FOOD: '#dcfce7', TRANSPORT: '#dbeafe', SHOPPING: '#fce7f3',
  ENTERTAINMENT: '#fef9c3', HEALTH: '#fee2e2', UTILITIES: '#e0e7ff',
  EDUCATION: '#ffedd5', OTHER: '#f1f5f9',
};

const emptyForm = { title: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'FOOD', paymentMethod: 'CASH', notes: '' };

export default function Expenses() {
  const [expenses, setExpenses]     = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editId, setEditId]         = useState(null);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('');

  const load = () => expenseApi.getAll().then(r => setExpenses(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await expenseApi.update(editId, form); }
      else        { await expenseApi.create(form); }
      setShowForm(false); setForm(emptyForm); setEditId(null); load();
    } catch { alert('Error saving expense'); }
  };

  const handleEdit = (exp) => {
    setForm({ title: exp.title, description: exp.description || '', amount: exp.amount,
      date: exp.date, category: exp.category, paymentMethod: exp.paymentMethod, notes: exp.notes || '' });
    setEditId(exp.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) { await expenseApi.delete(id); load(); }
  };

  const filtered = expenses.filter(e =>
    (!filterCat || e.category === filterCat) &&
    (!search    || e.title.toLowerCase().includes(search.toLowerCase()))
  );

  const s = {
    btn:   (c) => ({ background: c, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }),
    input: { padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#fff' },
    label: { color: '#475569', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem', fontWeight: '500' },
    fi:    { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '1rem', boxSizing: 'border-box', fontSize: '0.9rem' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#1e293b', margin: 0 }}>Expenses</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0' }}>{filtered.length} records</p>
        </div>
        <button style={s.btn('#0ea5e9')} onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>+ Add Expense</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input style={{ ...s.input, flex: 1 }} placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={s.input} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Title','Amount','Date','Category','Payment','Actions'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{e.title}</div>
                  {e.description && <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{e.description}</div>}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#e11d48', fontWeight: '600' }}>₹{Number(e.amount).toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.88rem' }}>{e.date}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: BADGE_COLORS[e.category] || '#f1f5f9', padding: '2px 8px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', color: '#334155' }}>{e.category}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{e.paymentMethod?.replace('_',' ')}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(e)} style={{ ...s.btn('#6366f1'), padding: '0.3rem 0.7rem' }}>Edit</button>
                    <button onClick={() => handleDelete(e.id)} style={{ ...s.btn('#e11d48'), padding: '0.3rem 0.7rem' }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No expenses found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '460px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'Add'} Expense</h2>
            <form onSubmit={handleSubmit}>
              {[['title','Title','text'],['description','Description','text'],['amount','Amount','number'],['date','Date','date']].map(([k,l,t]) => (
                <div key={k}>
                  <label style={s.label}>{l}</label>
                  <input style={s.fi} type={t} step={k==='amount'?'0.01':undefined} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required={['title','amount','date'].includes(k)} />
                </div>
              ))}
              <label style={s.label}>Category</label>
              <select style={s.fi} value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label style={s.label}>Payment Method</label>
              <select style={s.fi} value={form.paymentMethod} onChange={e => setForm({...form,paymentMethod:e.target.value})}>
                {METHODS.map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
              </select>
              <label style={s.label}>Notes</label>
              <input style={s.fi} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={s.btn('#0ea5e9')}>Save</button>
                <button type="button" style={s.btn('#94a3b8')} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
