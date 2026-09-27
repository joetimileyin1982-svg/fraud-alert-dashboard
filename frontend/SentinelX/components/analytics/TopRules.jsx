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
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(13,27,42,0.75), rgba(5,11,24,0.9))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        borderRadius: '18px',
        padding: '20px',
        color: '#fff',
        height: '100%',
        boxSizing: 'border-box',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.03) inset,
          0 8px 32px rgba(0,0,0,0.35),
          0 0 24px rgba(0,229,255,0.08)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow accent in the corner */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(0,229,255,0.15), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff', lineHeight: '1.3' }}>
          Top Fraud Rules Triggered
        </h3>
        <span style={{ fontSize: '13px', color: '#00e5ff', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap', flexShrink: 0, textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
          View all →
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
        {rulesData.map((rule) => (
          <div key={rule.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: '500' }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: rule.color,
                    boxShadow: `0 0 6px ${rule.color}`,
                    flexShrink: 0,
                  }}
                />
                {rule.name}
              </span>
              <div>
                <strong style={{ color: '#fff', marginRight: '10px', fontWeight: '600' }}>{rule.count}</strong>
                <span style={{ color: '#64748b', fontSize: '12px' }}>{rule.percent}</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'rgba(13,27,42,0.6)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div
                style={{
                  width: rule.percent,
                  height: '100%',
                  background: `linear-gradient(90deg, ${rule.color}CC, ${rule.color})`,
                  borderRadius: '10px',
                  boxShadow: `0 0 10px ${rule.color}, 0 0 4px ${rule.color}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}