import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Singapore', 'United Arab Emirates', 'Japan', 'China', 'Brazil',
  'South Africa', 'New Zealand', 'Netherlands', 'Other',
];

export function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [step, setStep] = useState(1); // 1 = credentials, 2 = profile details
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    status: 'student', // 'student' | 'professional'
    organization: '',
    detail: '', // course/degree or job title
    country: '',
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // --- Step 1 ---
  const handleSignIn = () => {
    if (!validateEmail(form.email)) return setError('Please enter a valid email.');
    if (!form.password) return setError('Please enter your password.');
    setError('');
    onAuth({ name: form.email.split('@')[0], email: form.email });
  };

  const handleSignUpContinue = () => {
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!validateEmail(form.email)) return setError('Please enter a valid email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setError('');
    setStep(2);
  };

  const handleGoogle = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setForm((f) => ({ ...f, name: decoded.name || f.name, email: decoded.email || f.email }));
    setError('');
    if (mode === 'signup') {
      setStep(2);
    } else {
      onAuth({ name: decoded.name, email: decoded.email });
    }
  };

  // --- Step 2 ---
  const handleFinish = () => {
    if (!form.age || Number(form.age) <= 0) return setError('Please enter a valid age.');
    if (!form.organization.trim()) return setError(`Please enter your ${orgLabel.toLowerCase()}.`);
    if (!form.detail.trim()) return setError(`Please enter your ${detailLabel.toLowerCase()}.`);
    if (!form.country) return setError('Please select your country.');
    setError('');
    onAuth({
      name: form.name,
      email: form.email,
      age: form.age,
      status: form.status,
      organization: form.organization,
      detail: form.detail,
      country: form.country,
    });
  };

  const switchMode = (next) => {
    setMode(next);
    setStep(1);
    setError('');
  };

  const orgLabel = form.status === 'student' ? 'School / College / University' : 'Company / Organization';
  const detailLabel = form.status === 'student' ? 'Course / Degree' : 'Job Title / Role';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>CF</div>
        <h1 style={styles.title}>CareerForge</h1>
        <p style={styles.sub}>
          {step === 2
            ? 'Tell us a bit about yourself'
            : mode === 'signin'
            ? 'Welcome back — sign in to continue'
            : 'Create your account to get started'}
        </p>

        {mode === 'signup' && (
          <div style={styles.stepRow}>
            <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepDotActive : {}) }} />
            <div style={styles.stepLine} />
            <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepDotActive : {}) }} />
          </div>
        )}

        {step === 1 && (
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(mode === 'signin' ? styles.tabActive : {}) }}
              onClick={() => switchMode('signin')}
            >
              Sign In
            </button>
            <button
              style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
              onClick={() => switchMode('signup')}
            >
              Create Account
            </button>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {/* STEP 1: credentials */}
        {step === 1 && (
          <>
            {mode === 'signup' && (
              <input
                style={styles.input}
                placeholder="Full Name"
                value={form.name}
                onChange={update('name')}
              />
            )}

            <input
              style={styles.input}
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={update('email')}
            />

            <div style={styles.passwordWrap}>
              <input
                style={{ ...styles.input, marginBottom: 0, paddingRight: '44px' }}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {mode === 'signup' && (
              <input
                style={styles.input}
                placeholder="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
              />
            )}

            {mode === 'signin' && (
              <div style={styles.forgotRow}>
                <a href="#forgot" style={styles.link}>Forgot password?</a>
              </div>
            )}

            <button
              style={styles.btn}
              onClick={mode === 'signin' ? handleSignIn : handleSignUpContinue}
            >
              {mode === 'signin' ? 'Sign In' : 'Continue'}
            </button>

            <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

            <div style={styles.googleWrap}>
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => setError('Google sign-in failed. Try again.')}
              />
            </div>

            <p style={styles.switchText}>
              {mode === 'signin' ? (
                <>Don't have an account?{' '}
                  <span style={styles.link} onClick={() => switchMode('signup')}>Create one</span>
                </>
              ) : (
                <>Already have an account?{' '}
                  <span style={styles.link} onClick={() => switchMode('signin')}>Sign in</span>
                </>
              )}
            </p>
          </>
        )}

        {/* STEP 2: profile details */}
        {step === 2 && (
          <>
            <input
              style={styles.input}
              placeholder="Age"
              type="number"
              min="1"
              value={form.age}
              onChange={update('age')}
            />

            <div style={styles.radioGroup}>
              <button
                style={{ ...styles.radioCard, ...(form.status === 'student' ? styles.radioCardActive : {}) }}
                onClick={() => setForm((f) => ({ ...f, status: 'student' }))}
              >
                🎓 Student
              </button>
              <button
                style={{ ...styles.radioCard, ...(form.status === 'professional' ? styles.radioCardActive : {}) }}
                onClick={() => setForm((f) => ({ ...f, status: 'professional' }))}
              >
                💼 Working Professional
              </button>
            </div>

            <input
              style={styles.input}
              placeholder={orgLabel}
              value={form.organization}
              onChange={update('organization')}
            />

            <input
              style={styles.input}
              placeholder={detailLabel}
              value={form.detail}
              onChange={update('detail')}
            />

            <select
              style={{ ...styles.input, color: form.country ? '#0f172a' : '#94a3b8' }}
              value={form.country}
              onChange={update('country')}
            >
              <option value="" disabled>Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div style={styles.btnRow}>
              <button style={styles.backBtn} onClick={() => setStep(1)}>Back</button>
              <button style={{ ...styles.btn, flex: 1 }} onClick={handleFinish}>Finish</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.5 18.5 0 014.22-5.27M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    fontFamily: "'Inter', sans-serif",
    padding: '24px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
    border: '1px solid #bfdbfe',
  },
  logoBadge: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 4px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
  },
  title: {
    color: '#1d4ed8',
    fontSize: '28px',
    fontWeight: '800',
    textAlign: 'center',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  sub: {
    color: '#64748b',
    textAlign: 'center',
    margin: '0 0 4px',
    fontSize: '14px',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    margin: '0 0 4px',
  },
  stepDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#dbeafe',
    transition: 'background 0.2s',
  },
  stepDotActive: {
    background: '#2563eb',
  },
  stepLine: {
    width: '32px',
    height: '2px',
    background: '#dbeafe',
  },
  tabs: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px',
    marginBottom: '4px',
  },
  tab: {
    flex: 1,
    padding: '9px',
    border: 'none',
    borderRadius: '9px',
    background: 'transparent',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '13.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#ffffff',
    color: '#1d4ed8',
    boxShadow: '0 1px 4px rgba(37,99,235,0.15)',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #bfdbfe',
    background: '#f8fafc',
    color: '#0f172a',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  forgotRow: {
    textAlign: 'right',
    marginTop: '-6px',
  },
  btn: {
    padding: '13px',
    borderRadius: '10px',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background 0.2s',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },
  backBtn: {
    padding: '13px 18px',
    borderRadius: '10px',
    background: '#f1f5f9',
    color: '#475569',
    fontWeight: '700',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
  },
  divider: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '13px',
    margin: '6px 0',
    position: 'relative',
    borderTop: '1px solid #e2e8f0',
  },
  dividerText: {
    position: 'relative',
    top: '-9px',
    background: '#ffffff',
    padding: '0 10px',
  },
  googleWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
  },
  radioCard: {
    flex: 1,
    padding: '14px 10px',
    borderRadius: '10px',
    border: '1.5px solid #bfdbfe',
    background: '#f8fafc',
    color: '#475569',
    fontWeight: '600',
    fontSize: '13.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  radioCardActive: {
    border: '1.5px solid #2563eb',
    background: '#eff6ff',
    color: '#1d4ed8',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 0',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
    margin: 0,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '8px 12px',
  },
};