import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import UpcomingInterviewsCard from '../components/UpcomingInterviewsCard';
import FilterBar from '../components/FilterBar';
import KanbanBoard from '../components/KanbanBoard';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationModal from '../components/ApplicationModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage() {
  const { user } = useAuth();

  // Data state
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  // Filter / sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast-like notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Fetch applications ──────────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    setError('');
    try {
      const res = await api.applications.getAll({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search,
        sortBy,
        sortOrder
      });
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  }, [statusFilter, search, sortBy, sortOrder]);

  // ─── Fetch stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.applications.getStats();
      setStats(res.data || null);
    } catch (err) {
      console.error('Stats fetch failed:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ─── Stage counts from stats ──────────────────────────────────────────────────
  const stageCounts = stats?.stages || {};

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a)
    );
    try {
      await api.applications.updateStatus(id, newStatus);
      fetchStats();
      showToast(`Moved to "${newStatus}"`);
    } catch (err) {
      fetchApplications(); // revert
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await api.applications.create(formData);
      setApplications(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      fetchStats();
      showToast('Application created successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to create application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (formData) => {
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      const res = await api.applications.update(editTarget.id, formData);
      setApplications(prev => prev.map(a => a.id === editTarget.id ? res.data : a));
      setEditTarget(null);
      fetchStats();
      showToast('Application updated!');
    } catch (err) {
      showToast(err.message || 'Failed to update application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.applications.delete(deleteTarget.id);
      setApplications(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      fetchStats();
      showToast('Application removed.');
    } catch (err) {
      showToast(err.message || 'Failed to delete application', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="app-container" style={{ paddingTop: '28px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Job Application Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.875rem' }}>
              Welcome back, <span style={{ color: '#818cf8', fontWeight: 600 }}>{user?.name}</span> — track your entire hiring pipeline in one place.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { fetchApplications(); fetchStats(); }}
            disabled={loadingApps}
            title="Refresh data"
          >
            <RefreshCw size={14} style={{ animation: loadingApps ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fca5a5', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => { fetchApplications(); fetchStats(); }} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {loadingStats ? (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="glass-card" style={{ flex: '1 1 180px', height: 100, background: 'linear-gradient(90deg, #111827 25%, #172033 50%, #111827 75%)', backgroundSize: '200%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <StatsCards stats={stats} />
        )}

        {/* Upcoming interviews */}
        {stats?.upcomingInterviews?.length > 0 && (
          <UpcomingInterviewsCard interviews={stats.upcomingInterviews} />
        )}

        {/* Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenCreateModal={() => setShowCreateModal(true)}
          stageCounts={stageCounts}
        />

        {/* Applications Content */}
        {loadingApps ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading your applications...</span>
            </div>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            applications={applications}
            onStatusChange={handleStatusChange}
            onEdit={(app) => setEditTarget(app)}
            onDelete={(app) => setDeleteTarget(app)}
          />
        ) : (
          <ApplicationTable
            applications={applications}
            onStatusChange={handleStatusChange}
            onEdit={(app) => setEditTarget(app)}
            onDelete={(app) => setDeleteTarget(app)}
          />
        )}
      </div>

      {/* Modals */}
      <ApplicationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <ApplicationModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initialData={editTarget}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        application={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            background: toast.type === 'error' ? '#1a0a0a' : '#0a1a14',
            border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
            color: toast.type === 'error' ? '#fca5a5' : '#6ee7b7',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </>
  );
}
