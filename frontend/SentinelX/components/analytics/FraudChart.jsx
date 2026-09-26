import React from 'react';

export default function StatCard({ icon, statTitle, statNumber, color }) {
  // Format numbers nicely (e.g., 12000 -> 12,000)
  const formattedNumber = typeof statNumber === 'number' 
    ? statNumber.toLocaleString() 
    : statNumber;

  return (
    <div
      style={{
        background: '#050b18',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '16px 20px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color || '#00e5ff',
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
          {statTitle}
        </span>
      </div>

      <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
        {formattedNumber}
      </div>
    </div>
  );
}