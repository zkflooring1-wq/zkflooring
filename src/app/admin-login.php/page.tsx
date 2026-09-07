'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MathChallenge {
  question: string;
  token: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@zkflooring.com');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [mathChallenge, setMathChallenge] = useState<MathChallenge | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch fresh math challenge on mount
  const fetchChallenge = async () => {
    setLoadingChallenge(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.success) {
        setMathChallenge({
          question: data.question,
          token: data.token,
        });
        setMathAnswer('');
      } else {
        setError('Could not initialize security challenge.');
      }
    } catch {
      setError('Network connection error while fetching security challenge.');
    } finally {
      setLoadingChallenge(false);
    }
  };

  useEffect(() => {
    window.location.href = 'http://localhost:3001/admin-login.php';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }
    if (!securityAnswer.trim()) {
      setError('Please provide the Master Security Authorization Answer.');
      return;
    }
    if (!mathAnswer.trim()) {
      setError('Please solve the verification math challenge.');
      return;
    }
    if (!mathChallenge?.token) {
      setError('Security challenge is missing. Refreshing...');
      fetchChallenge();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          securityAnswer: securityAnswer.trim(),
          mathToken: mathChallenge.token,
          mathAnswer: mathAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(data.redirect || '/admin');
          router.refresh();
        }, 800);
      } else {
        setError(data.message || 'Authentication failed. Please verify your credentials.');
        // Refresh challenge on error to prevent brute force
        fetchChallenge();
      }
    } catch {
      setError('A connection error occurred during authorization. Please retry.');
      fetchChallenge();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Ambient background glow effects */}
      <div style={styles.glowTopLeft} />
      <div style={styles.glowBottomRight} />

      <main style={styles.portalCard}>
        {/* Header Branding */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16120B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#goldGrad)" />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="50%" stopColor="#FCF6BA" />
                  <stop offset="100%" stopColor="#B38728" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 style={styles.title}>ZK FLOORING</h1>
          <div style={styles.subBadge}>
            <span style={styles.subBadgeDot} />
            <span style={styles.subtitle}>Executive Control Center</span>
          </div>
          <p style={styles.leadText}>Multi-Layer Protected Admin Portal</p>
        </header>

        {/* Error Alert */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div style={styles.successBanner}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span style={styles.successText}>Credentials verified. Launching Admin Console...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="admin-email">
              Admin Email Address
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AA771C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zkflooring.com"
                style={styles.input}
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="admin-password">
              Admin Password
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AA771C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{ ...styles.input, paddingRight: '42px' }}
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Security Question Input */}
          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label} htmlFor="admin-security">
                Master Security Authorization
              </label>
              <span style={styles.badgeHint}>Key Code</span>
            </div>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AA771C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <input
                id="admin-security"
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter Master Security Key..."
                style={styles.input}
                disabled={loading || success}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Dynamic Math Verification Challenge */}
          <div style={styles.mathCard}>
            <div style={styles.mathHeader}>
              <div style={styles.mathTitleRow}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="16" y1="14" x2="16" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
                <span style={styles.mathHeading}>Bot Defense Challenge</span>
              </div>

              <button
                type="button"
                onClick={fetchChallenge}
                disabled={loadingChallenge || loading || success}
                style={styles.refreshBtn}
                title="Refresh Math Challenge"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#BF953F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={loadingChallenge ? styles.spinning : {}}
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>New Problem</span>
              </button>
            </div>

            <div style={styles.mathActionRow}>
              <div style={styles.equationBadge}>
                {loadingChallenge ? 'Generating challenge...' : mathChallenge?.question || '12 + 8 = ?'}
              </div>
              <div style={styles.mathInputWrapper}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Answer"
                  style={styles.mathInput}
                  disabled={loadingChallenge || loading || success}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success || loadingChallenge}
            style={styles.submitBtn}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.buttonSpinner} />
                <span>Authenticating Credentials...</span>
              </span>
            ) : success ? (
              <span style={styles.buttonContent}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16120B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Access Granted</span>
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16120B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Authorize &amp; Enter Dashboard</span>
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <footer style={styles.footer}>
          <Link href="/" style={styles.backLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Return to Public Website</span>
          </Link>
          <div style={styles.securityMeta}>
            <span>TLS 1.3 Encrypted</span>
            <span>â€¢</span>
            <span>Supabase Auth Guard</span>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes zkSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes zkPulseGlow {
          0% { box-shadow: 0 0 20px rgba(191, 149, 63, 0.15); }
          50% { box-shadow: 0 0 40px rgba(191, 149, 63, 0.35); }
          100% { box-shadow: 0 0 20px rgba(191, 149, 63, 0.15); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0D0B08',
    backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(191, 149, 63, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(179, 135, 40, 0.08) 0%, transparent 40%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  glowTopLeft: {
    position: 'absolute',
    top: '-15%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(191, 149, 63, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: '-15%',
    right: '-10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(179, 135, 40, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  portalCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#16120B',
    borderRadius: '24px',
    border: '1.5px solid rgba(191, 149, 63, 0.35)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(191, 149, 63, 0.12)',
    padding: '36px 32px',
    position: 'relative',
    zIndex: 10,
    boxSizing: 'border-box',
    backdropFilter: 'blur(12px)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '26px',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    margin: '0 auto 16px auto',
    background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(179, 135, 40, 0.35)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '1.5px',
    margin: '0 0 6px 0',
    fontFamily: '"Manrope", sans-serif',
  },
  subBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(191, 149, 63, 0.12)',
    border: '1px solid rgba(191, 149, 63, 0.35)',
    borderRadius: '9999px',
    padding: '3px 12px',
    marginBottom: '8px',
  },
  subBadgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#BF953F',
  },
  subtitle: {
    color: '#FCF6BA',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  leadText: {
    color: '#8C8477',
    fontSize: '12.5px',
    margin: '4px 0 0 0',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '20px',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: '12.5px',
    fontWeight: 600,
    lineHeight: '1.35',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '20px',
  },
  successText: {
    color: '#6EE7B7',
    fontSize: '12.5px',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#DCD3C5',
    fontSize: '12.5px',
    fontWeight: 700,
    letterSpacing: '0.2px',
  },
  badgeHint: {
    color: '#BF953F',
    backgroundColor: 'rgba(191, 149, 63, 0.15)',
    border: '1px solid rgba(191, 149, 63, 0.3)',
    borderRadius: '6px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 2,
  },
  input: {
    width: '100%',
    height: '46px',
    backgroundColor: '#201A11',
    border: '1px solid rgba(191, 149, 63, 0.3)',
    borderRadius: '12px',
    padding: '0 14px 0 42px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mathCard: {
    backgroundColor: '#201A11',
    border: '1px solid rgba(191, 149, 63, 0.35)',
    borderRadius: '14px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mathHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mathTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  mathHeading: {
    color: '#FCF6BA',
    fontSize: '11.5px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: '#BF953F',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    borderRadius: '6px',
    transition: 'opacity 0.2s',
  },
  spinning: {
    animation: 'zkSpin 0.7s linear infinite',
  },
  mathActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  equationBadge: {
    flex: '1',
    backgroundColor: '#16120B',
    border: '1.5px dashed rgba(191, 149, 63, 0.45)',
    borderRadius: '10px',
    padding: '8px 12px',
    color: '#FCF6BA',
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.6px',
    textAlign: 'center',
    userSelect: 'none',
  },
  mathInputWrapper: {
    width: '110px',
  },
  mathInput: {
    width: '100%',
    height: '42px',
    backgroundColor: '#16120B',
    border: '1px solid rgba(191, 149, 63, 0.4)',
    borderRadius: '10px',
    padding: '0 12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    marginTop: '6px',
    width: '100%',
    height: '48px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
    color: '#16120B',
    fontSize: '13.5px',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(179, 135, 40, 0.35)',
    transition: 'all 0.2s ease',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonSpinner: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid rgba(22, 18, 11, 0.25)',
    borderTopColor: '#16120B',
    animation: 'zkSpin 0.7s linear infinite',
    display: 'inline-block',
  },
  footer: {
    marginTop: '26px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(191, 149, 63, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  backLink: {
    color: '#8C8477',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.2s ease',
  },
  securityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#575148',
    fontSize: '10.5px',
    fontWeight: 500,
    letterSpacing: '0.4px',
  },
};
