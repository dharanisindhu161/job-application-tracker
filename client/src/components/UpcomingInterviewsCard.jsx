import React from 'react';
import { Calendar, Clock, ChevronRight, Video, FileText } from 'lucide-react';

export default function UpcomingInterviewsCard({ interviews = [], onSelectApplication }) {
  if (!interviews || interviews.length === 0) return null;

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '28px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(17, 24, 39, 1) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--interview-color)' }}>
            <Calendar size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              Upcoming Interview Schedule ({interviews.length})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Stay prepared for your next rounds
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {interviews.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: '#0d1322',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                {item.company}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'var(--interview-bg)', color: 'var(--interview-color)', fontWeight: 600 }}>
                {item.round || 'Interview'}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {item.role}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#38bdf8', marginTop: '2px' }}>
              <Clock size={13} />
              <span>{formatDate(item.date)}</span>
            </div>

            {item.notes && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '6px' }}>
                "{item.notes}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
