import React from 'react';
import { ExternalLink, Edit3, Trash2, Calendar, DollarSign, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ApplicationTable({
  applications = [],
  onStatusChange,
  onEdit,
  onDelete
}) {
  const formatCurrency = (amt) => {
    if (!amt) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const formatDate = (d) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return d;
    }
  };

  if (applications.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
        No applications match your current filters.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Expected Salary</th>
            <th>Applied Date</th>
            <th>Interviews</th>
            <th>Notes</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const hasInterviews = app.interviewDates && app.interviewDates.length > 0;
            const salary = formatCurrency(app.salaryExpectation);

            return (
              <tr key={app.id}>
                {/* Company */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{app.company}</span>
                    {app.jobLink && (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        title="Job Link"
                        style={{ color: 'var(--text-dim)' }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </td>

                {/* Role */}
                <td>
                  <span style={{ color: 'var(--text-muted)' }}>{app.role}</span>
                </td>

                {/* Status with switcher */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className="select-field"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        width: 'auto',
                        background: '#1e293b'
                      }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </td>

                {/* Salary */}
                <td>
                  <span style={{ color: app.salaryExpectation ? '#38bdf8' : 'var(--text-dim)', fontWeight: 600 }}>
                    {salary}
                  </span>
                </td>

                {/* Applied Date */}
                <td>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {formatDate(app.applicationDate)}
                  </span>
                </td>

                {/* Interviews */}
                <td>
                  {hasInterviews ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--interview-color)', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--interview-bg)', padding: '3px 8px', borderRadius: '6px' }}>
                      <Clock size={12} />
                      {app.interviewDates.length} round{app.interviewDates.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>
                  )}
                </td>

                {/* Notes */}
                <td style={{ maxWidth: '240px' }}>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}
                    title={app.notes}
                  >
                    {app.notes || '-'}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEdit(app)}
                      title="Edit"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(app)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
