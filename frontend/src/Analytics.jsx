import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseApi } from '../services/api';

export default function Analytics() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);

  const load = () => expenseApi.summary(year, now.getMonth() + 1).then(r => setData(r.data)).catch(() => {});
  useEffect(() => { load(); }, [year]);

  const barData = data?.categoryBreakdown
    ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, amount: Number(value) }))
    : [];

  return (
    <div>
      <h1 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Analytics</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Monthly spending breakdown</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Spent',    value: '₹' + Number(data?.totalSpent || 0).toLocaleString('en-IN'), color: '#0ea5e9' },
          { label: 'No. of Expenses', value: data?.expenseCount || 0, color: '#a78bfa' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: '4px solid ' + c.color }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Spending by Category (This Month)</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => '₹' + Number(v).toLocaleString('en-IN')} />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={{ color: '#94a3b8' }}>No data for selected period</p>}
      </div>
    </div>
  );
}
