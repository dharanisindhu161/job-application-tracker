import React from 'react';
import { Briefcase, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo-badge">
          <div className="logo-icon-wrap">
            <Briefcase size={20} color="#fff" />
          </div>
          <div>
            <div>JobTracker</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', lineHeight: 1 }}>
              Application Pipeline
            </div>
          </div>
        </div>

        {/* User info & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
