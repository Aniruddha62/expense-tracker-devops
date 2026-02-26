import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseApi } from '../services/api';

const COLORS = ['#0ea5e9','#a78bfa','#4ade80','#fb923c','#f472b6','#facc15','#34d399','#94a3b8'];

const Card = ({ title, value, sub, color }) => (
  <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: '4px solid ' + color }}>
    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{title}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>{value}</div>
    {sub && <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expenseApi.dashboard()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: '#64748b', padding: '2rem' }}>Loading dashboard...</div>;

  const pieData = data?.categoryBreakdown
    ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  return (
    <div>
      <h1 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your spending overview</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Card title="Spent This Month" value={'₹' + Number(data?.totalThisMonth || 0).toLocaleString('en-IN')} color="#0ea5e9" />
        <Card title="Spent This Week"  value={'₹' + Number(data?.totalThisWeek  || 0).toLocaleString('en-IN')} color="#a78bfa" />
        <Card title="Total Expenses"   value={data?.totalExpenses || 0} sub="all time" color="#4ade80" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Pie Chart */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Spending by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => '₹' + Number(v).toLocaleString('en-IN')} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#94a3b8' }}>No expenses yet</p>}
        </div>

        {/* Recent Expenses */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Recent Expenses</h3>
          {(data?.recentExpenses || []).map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ color: '#1e293b', fontWeight: '500', fontSize: '0.9rem' }}>{e.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{e.category} · {e.date}</div>
              </div>
              <div style={{ color: '#e11d48', fontWeight: '600' }}>-₹{Number(e.amount).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
