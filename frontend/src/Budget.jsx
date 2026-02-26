import React, { useEffect, useState } from 'react';
import { budgetApi } from '../services/api';

const CATEGORIES = ['FOOD','TRANSPORT','SHOPPING','ENTERTAINMENT','HEALTH','UTILITIES','EDUCATION','OTHER'];

export default function Budget() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const [data,  setData]  = useState(null);
  const [form,  setForm]  = useState({ category: 'FOOD', monthlyLimit: '', month, year });

  const load = () => budgetApi.vsActual(month, year).then(r => setData(r.data)).catch(() => {});
  useEffect(() => { load(); }, [month, year]);

  const handleSave = async (e) => {
    e.preventDefault();
    await budgetApi.save({ ...form, month, year, monthlyLimit: Number(form.monthlyLimit) });
    setForm({ category: 'FOOD', monthlyLimit: '', month, year });
    load();
  };

  const s = {
    btn: (c) => ({ background: c, color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }),
    input: { padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' },
  };

  return (
    <div>
      <h1 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Budget Tracker</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Set and track monthly budgets</p>

      {/* Month picker */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <select style={s.input} value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({length:12},(_,i) => <option key={i+1} value={i+1}>{new Date(0,i).toLocaleString('default',{month:'long'})}</option>)}
        </select>
        <input style={s.input} type="number" value={year} onChange={e => setYear(Number(e.target.value))} min="2020" max="2030" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem' }}>
        {/* Add Budget Form */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Set Budget</h3>
          <form onSubmit={handleSave}>
            <label style={{ color: '#475569', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Category</label>
            <select style={{ ...s.input, width: '100%', marginBottom: '1rem', display: 'block' }} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ color: '#475569', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Monthly Limit (₹)</label>
            <input style={{ ...s.input, width: '100%', marginBottom: '1rem', boxSizing: 'border-box' }} type="number" min="1" value={form.monthlyLimit} onChange={e => setForm({...form, monthlyLimit: e.target.value})} required placeholder="e.g. 5000" />
            <button type="submit" style={s.btn('#0ea5e9')}>Save Budget</button>
          </form>
        </div>

        {/* Budget vs Actual */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Budget vs Actual</h3>
          {(data?.budgetComparison || []).length === 0
            ? <p style={{ color: '#94a3b8' }}>No budgets set for this month.</p>
            : (data.budgetComparison || []).map(b => (
              <div key={b.category} style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>{b.category}</span>
                  <span style={{ fontSize: '0.85rem', color: b.overBudget ? '#e11d48' : '#64748b' }}>
                    ₹{Number(b.spent).toLocaleString('en-IN')} / ₹{Number(b.budget).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: Math.min(b.percentage, 100) + '%', background: b.overBudget ? '#e11d48' : '#0ea5e9', borderRadius: '999px', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: b.overBudget ? '#e11d48' : '#64748b', marginTop: '0.2rem' }}>
                  {b.overBudget ? '⚠️ Over budget by ₹' + Number(Math.abs(b.remaining)).toLocaleString('en-IN') : b.percentage + '% used'}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
