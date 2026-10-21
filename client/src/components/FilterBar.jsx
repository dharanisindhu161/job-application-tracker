import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, Plus } from 'lucide-react';

const STAGES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
  stageCounts = {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
      {/* Top action row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px', maxWidth: '420px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search company, role, or notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Controls right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sort By Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              className="select-field"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                onSortByChange(sb);
                onSortOrderChange(so);
              }}
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
            >
              <option value="applicationDate-desc">Date (Newest)</option>
              <option value="applicationDate-asc">Date (Oldest)</option>
              <option value="company-asc">Company (A-Z)</option>
              <option value="company-desc">Company (Z-A)</option>
              <option value="salaryExpectation-desc">Salary (Highest)</option>
              <option value="salaryExpectation-asc">Salary (Lowest)</option>
            </select>
          </div>

          {/* View toggle (Kanban vs Table) */}
          <div style={{ display: 'flex', background: '#0d1322', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '3px' }}>
            <button
              onClick={() => onViewModeChange('kanban')}
              style={{
                border: 'none',
                background: viewMode === 'kanban' ? '#1e293b' : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : 'var(--text-dim)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Kanban Board View"
            >
              <LayoutGrid size={15} />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              style={{
                border: 'none',
                background: viewMode === 'table' ? '#1e293b' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-dim)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Table List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>

          {/* Create Application Button */}
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={13} /> Filter:
        </span>
        {STAGES.map((st) => {
          const isActive = statusFilter === st;
          const count = st === 'All' 
            ? Object.values(stageCounts).reduce((a, b) => a + b, 0) 
            : (stageCounts[st] || 0);

          return (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              style={{
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                background: isActive ? 'rgba(99, 102, 241, 0.18)' : '#0d1322',
                color: isActive ? '#fff' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{st}</span>
              <span
                style={{
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  fontWeight: 700
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
