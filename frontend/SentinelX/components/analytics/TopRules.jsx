import React from 'react';

const rulesData = [
  { name: 'Velocity Check', count: 612, percent: '31.5%', color: '#ff007f' },
  { name: 'High Risk Location', count: 438, percent: '22.5%', color: '#ff9100' },
  { name: 'Device Mismatch', count: 287, percent: '14.8%', color: '#ffea00' },
  { name: 'Amount Threshold', count: 231, percent: '11.9%', color: '#00e5ff' },
  { name: 'Multiple Accounts', count: 154, percent: '7.9%', color: '#0070ff' },
];

export default function TopRules() {
  return (
    <div style={{ background: '#050b18', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>
          Top Fraud Rules Triggered
        </h3>
        <span style={{ fontSize: '13px', color: '#00e5ff', cursor: 'pointer', fontWeight: '500' }}>
          View all →
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rulesData.map((rule) => (
          <div key={rule.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{rule.name}</span>
              <div>
                <strong style={{ color: '#fff', marginRight: '10px', fontWeight: '600' }}>{rule.count}</strong>
                <span style={{ color: '#64748b', fontSize: '12px' }}>{rule.percent}</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', background: '#0d1b2a', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: rule.percent,
                  height: '100%',
                  background: rule.color,
                  borderRadius: '10px',
                  boxShadow: `0 0 8px ${rule.color}80`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}