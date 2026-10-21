import React from 'react';
import { 
  Briefcase, 
  Send, 
  CalendarClock, 
  Trophy, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Award 
} from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const { total = 0, stages = {}, metrics = {} } = stats;

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      {/* Total Applications */}
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Pipeline
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Briefcase size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          {total}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Active job targets tracked
        </div>
      </div>

      {/* Applied */}
      <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid var(--applied-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Applied
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--applied-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--applied-color)' }}>
            <Send size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>
          {stages.Applied || 0}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Awaiting recruiter response
        </div>
      </div>

      {/* Interview */}
      <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid var(--interview-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interviews
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--interview-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--interview-color)' }}>
            <CalendarClock size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>
            {stages.Interview || 0}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--interview-color)', fontWeight: 600 }}>
            {metrics.interviewRate || 0}% rate
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Active rounds in progress
        </div>
      </div>

      {/* Offers */}
      <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid var(--offer-color)', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 24, 39, 1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--offer-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Offers
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--offer-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--offer-color)' }}>
            <Trophy size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>
            {stages.Offer || 0}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--offer-color)', fontWeight: 600 }}>
            {metrics.offerRate || 0}% win rate
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Job offers secured 🎉
        </div>
      </div>

      {/* Average Salary */}
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Target Salary
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <DollarSign size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff' }}>
          {formatCurrency(metrics.averageSalary)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Across {metrics.salaryCount || 0} reported roles
        </div>
      </div>
    </div>
  );
}
