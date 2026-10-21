import React, { useState } from 'react';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await demoLogin();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setDemoLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at 60% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 0% 80%, rgba(139,92,246,0.08) 0%, transparent 60%), #090d16'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Briefcase size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            JobTracker
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Your complete job application pipeline dashboard
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="glass-card"
          style={{ padding: '28px', borderColor: 'rgba(99,102,241,0.2)' }}
        >
          {/* Mode Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#0d1322',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px',
              border: '1px solid var(--border-color)'
            }}
          >
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  border: 'none',
                  background: mode === m ? '#1e293b' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-dim)',
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                marginBottom: '16px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Name field (register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Dharani Sindhu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password {mode === 'register' && <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(min. 6 chars)</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '42px' }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-dim)', padding: 2
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '4px', padding: '11px 0', width: '100%', fontSize: '0.9rem' }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                : mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            disabled={demoLoading}
            style={{ width: '100%', padding: '11px 0', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8', fontSize: '0.875rem' }}
          >
            {demoLoading
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading demo...</>
              : <><Sparkles size={15} /> Try Demo Account — 6 sample applications preloaded</>
            }
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '18px' }}>
            Demo credentials: <code style={{ color: '#818cf8', fontSize: '0.78rem' }}>demo@jobtracker.com</code> / <code style={{ color: '#818cf8', fontSize: '0.78rem' }}>demo1234</code>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
