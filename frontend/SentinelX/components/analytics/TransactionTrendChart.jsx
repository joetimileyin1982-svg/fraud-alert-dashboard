import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: 'Apr 28', Legitimate: 4000, Fraudulent: 1200 },
  { time: 'Apr 28', Legitimate: 5500, Fraudulent: 1800 },
  { time: 'Apr 29', Legitimate: 7200, Fraudulent: 2200 },
  { time: 'Apr 29', Legitimate: 6000, Fraudulent: 1900 },
  { time: 'Apr 30', Legitimate: 6100, Fraudulent: 2000 },
  { time: 'May 1',  Legitimate: 7900, Fraudulent: 3400 },
  { time: 'May 2',  Legitimate: 8600, Fraudulent: 4200 },
  { time: 'May 3',  Legitimate: 7200, Fraudulent: 4800 },
  { time: 'May 4',  Legitimate: 11000, Fraudulent: 6000 },
];

const cardStyle = (isActive) => ({
  background: '#050b18',
  border: `1px solid ${isActive ? '#00e5ff' : '#1e293b'}`,
  borderRadius: '16px',
  padding: '20px',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: isActive ? '0 0 20px rgba(0,229,255,0.35)' : 'none',
});

const tooltipStyle = {
  background: 'rgba(7,20,35,0.85)',
  backdropFilter: 'blur(6px)',
  border: '1px solid #00e5ff',
  borderRadius: '10px',
  padding: '12px 16px',
  boxShadow: '0 0 12px rgba(0,229,255,0.5), 0 0 24px rgba(255,0,127,0.15)',
  minWidth: '140px',
};

function GlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={tooltipStyle}>
      <p style={{ margin: '0 0 8px', color: '#00e5ff', fontWeight: 'bold', fontSize: '13px' }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', marginBottom: '4px' }}>
          <span style={{ color: entry.color }}>● {entry.dataKey}</span>
          <strong style={{ color: '#fff' }}>{entry.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}

export default function TransactionTrendChart() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div onClick={() => setIsActive(!isActive)} style={cardStyle(isActive)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Fraud vs Legitimate Transactions</h3>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
          <span><strong style={{ color: '#00e5ff' }}>●</strong> Legitimate</span>
          <span><strong style={{ color: '#ff007f' }}>●</strong> Fraudulent</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 15 }}>
            <defs>
              <linearGradient id="colorLegitimate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFraudulent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff007f" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#ff007f" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} dy={10} style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} domain={[0, 16000]} ticks={[0, 4000, 8000, 12000, 16000]} style={{ fontSize: '12px' }} />
            <Tooltip cursor={{ stroke: '#00e5ff', strokeWidth: 1, strokeDasharray: '4 4' }} content={<GlowTooltip />} />
            <Area type="monotone" dataKey="Legitimate" stroke="#00e5ff" strokeWidth={2.5} fill="url(#colorLegitimate)" />
            <Area type="monotone" dataKey="Fraudulent" stroke="#ff007f" strokeWidth={2.5} fill="url(#colorFraudulent)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}