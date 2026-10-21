import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, DollarSign, Building, Briefcase, Link, FileText } from 'lucide-react';

export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [status, setStatus] = useState('Applied');
  const [interviewDates, setInterviewDates] = useState([]);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setRole(initialData.role || '');
      setJobLink(initialData.jobLink || '');
      setSalaryExpectation(initialData.salaryExpectation || '');
      setApplicationDate(initialData.applicationDate ? initialData.applicationDate.split('T')[0] : '');
      setStatus(initialData.status || 'Applied');
      setInterviewDates(
        Array.isArray(initialData.interviewDates)
          ? initialData.interviewDates.map(item => ({
              id: item.id || `int-${Date.now()}-${Math.random()}`,
              date: item.date ? item.date.slice(0, 16) : '',
              round: item.round || 'Technical Round',
              notes: item.notes || '',
              completed: Boolean(item.completed)
            }))
          : []
      );
      setNotes(initialData.notes || '');
    } else {
      setCompany('');
      setRole('');
      setJobLink('');
      setSalaryExpectation('');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setStatus('Applied');
      setInterviewDates([]);
      setNotes('');
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddInterview = () => {
    setInterviewDates([
      ...interviewDates,
      {
        id: `int-${Date.now()}-${interviewDates.length}`,
        date: new Date().toISOString().slice(0, 16),
        round: 'Technical Interview',
        notes: '',
        completed: false
      }
    ]);
  };

  const handleUpdateInterview = (index, field, value) => {
    const updated = [...interviewDates];
    updated[index] = { ...updated[index], [field]: value };
    setInterviewDates(updated);
  };

  const handleRemoveInterview = (index) => {
    setInterviewDates(interviewDates.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim()) {
      setValidationError('Company name is required.');
      return;
    }
    if (!role.trim()) {
      setValidationError('Role / job title is required.');
      return;
    }

    const payload = {
      company: company.trim(),
      role: role.trim(),
      jobLink: jobLink.trim(),
      salaryExpectation: salaryExpectation ? Number(salaryExpectation) : null,
      applicationDate: applicationDate || new Date().toISOString().split('T')[0],
      status,
      interviewDates: interviewDates.map(item => ({
        ...item,
        date: item.date ? new Date(item.date).toISOString() : new Date().toISOString()
      })),
      notes: notes.trim()
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              {initialData ? 'Edit Job Application' : 'Track New Application'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {initialData ? 'Update application progress and interview rounds' : 'Add details to monitor and progress your job pipeline'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {validationError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem' }}>
              {validationError}
            </div>
          )}

          {/* Row 1: Company & Role */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Company Name *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Google, Stripe, Netflix"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Job Role / Title *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2: Status & Application Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Status / Stage
              </label>
              <select
                className="select-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Application Date
              </label>
              <input
                type="date"
                className="input-field"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Salary Expectation & Job Link */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Salary Expectation (USD / Year)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 150000"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Job Posting URL
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://company.com/jobs/..."
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
              />
            </div>
          </div>

          {/* Interview Rounds Section */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  Interview Dates & Rounds ({interviewDates.length})
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Schedule technical rounds, recruiter screens, and take-homes
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddInterview}
              >
                <Plus size={14} />
                <span>Add Interview</span>
              </button>
            </div>

            {interviewDates.length === 0 ? (
              <div style={{ background: '#090d16', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                No interviews scheduled yet. Click "+ Add Interview" to log upcoming rounds.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {interviewDates.map((interview, index) => (
                  <div
                    key={interview.id || index}
                    style={{
                      background: '#090d16',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ flex: '1 1 180px', padding: '6px 10px', fontSize: '0.8rem' }}
                        placeholder="Round (e.g. Recruiter Call, DSA, System Design)"
                        value={interview.round}
                        onChange={(e) => handleUpdateInterview(index, 'round', e.target.value)}
                      />
                      <input
                        type="datetime-local"
                        className="input-field"
                        style={{ flex: '1 1 180px', padding: '6px 10px', fontSize: '0.8rem' }}
                        value={interview.date}
                        onChange={(e) => handleUpdateInterview(index, 'date', e.target.value)}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={interview.completed}
                          onChange={(e) => handleUpdateInterview(index, 'completed', e.target.checked)}
                        />
                        Completed
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterview(index)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                        title="Remove Round"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="input-field"
                      style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      placeholder="Round notes / topics / meeting link..."
                      value={interview.notes}
                      onChange={(e) => handleUpdateInterview(index, 'notes', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Notes & Feedback
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. Referral by Alex, tech stack highlights, negotiation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
