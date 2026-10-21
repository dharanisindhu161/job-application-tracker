import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Clock, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const COLUMNS = [
  { id: 'Applied', title: 'Applied', color: 'var(--applied-color)', bg: 'var(--applied-bg)' },
  { id: 'Interview', title: 'Interview', color: 'var(--interview-color)', bg: 'var(--interview-bg)' },
  { id: 'Offer', title: 'Offer', color: 'var(--offer-color)', bg: 'var(--offer-bg)' },
  { id: 'Rejected', title: 'Rejected', color: 'var(--rejected-color)', bg: 'var(--rejected-bg)' }
];

export default function KanbanBoard({ 
  applications = [], 
  onStatusChange, 
  onEdit, 
  onDelete 
}) {
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const formatCurrency = (amt) => {
    if (!amt) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return d;
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      const app = applications.find(a => a.id === appId);
      if (app && app.status !== colId) {
        onStatusChange(appId, colId);
      }
    }
    setDraggedAppId(null);
  };

  return (
    <div className="kanban-grid">
      {COLUMNS.map((column) => {
        const colApps = applications.filter(a => a.status === column.id);
        const isHovered = dragOverCol === column.id;

        return (
          <div
            key={column.id}
            className="kanban-col"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              transition: 'all 0.2s ease',
              borderColor: isHovered ? column.color : 'var(--border-color)',
              background: isHovered ? 'rgba(30, 41, 59, 0.7)' : '#0d1322'
            }}
          >
            {/* Column Header */}
            <div className="kanban-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: column.color
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                  {column.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: column.bg,
                  color: column.color,
                  border: `1px solid ${column.color}40`
                }}
              >
                {colApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="kanban-cards-wrap">
              {colApps.length === 0 ? (
                <div
                  style={{
                    padding: '30px 16px',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '10px',
                    margin: 'auto 0'
                  }}
                >
                  No applications in {column.title}
                  <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>Drag cards here to update stage</div>
                </div>
              ) : (
                colApps.map((app) => {
                  const salary = formatCurrency(app.salaryExpectation);
                  const hasInterviews = app.interviewDates && app.interviewDates.length > 0;
                  const nextInterview = hasInterviews
                    ? app.interviewDates.find(i => !i.completed) || app.interviewDates[0]
                    : null;

                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className="glass-card animate-fade-in"
                      style={{
                        padding: '16px',
                        cursor: 'grab',
                        background: '#111827',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      {/* Company & Role */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                              {app.company}
                            </span>
                            {app.jobLink && (
                              <a
                                href={app.jobLink}
                                target="_blank"
                                rel="noreferrer"
                                title="Open Job Posting"
                                style={{ color: 'var(--text-dim)', display: 'inline-flex' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
                            {app.role}
                          </div>
                        </div>

                        {/* Actions (Edit / Delete) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => onEdit(app)}
                            title="Edit"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(app)}
                            title="Delete"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Meta badges: Salary & Date */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.78rem' }}>
                        {salary && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 7px', borderRadius: '6px', fontWeight: 600 }}>
                            <DollarSign size={12} />
                            {salary}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
                          <Calendar size={12} />
                          {formatDate(app.applicationDate)}
                        </span>
                      </div>

                      {/* Upcoming interview reminder inside card */}
                      {nextInterview && (
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            color: 'var(--interview-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} />
                            <span style={{ fontWeight: 600 }}>{nextInterview.round || 'Interview'}</span>
                          </div>
                          <span>{formatDate(nextInterview.date)}</span>
                        </div>
                      )}

                      {/* Notes snippet */}
                      {app.notes && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-dim)',
                            background: '#090d16',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={app.notes}
                        >
                          {app.notes}
                        </div>
                      )}

                      {/* Workflow stage fast switcher */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          Move stage:
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => onStatusChange(app.id, e.target.value)}
                          className="select-field"
                          style={{
                            width: 'auto',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            background: '#1e293b'
                          }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
