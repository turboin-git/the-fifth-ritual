import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [studioId, setStudioId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const { token, role, name, userId } = res.data;
      if (role !== 'ADMIN') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      login({ name, role, userId }, token);
      toast.success('Admin session started.');
      navigate('/admin');
    } catch (err) {
      toast.error('Invalid credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Logo */}
      <div style={s.logoWrap}>
        <span style={s.logoIcon}>✦</span>
        <span style={s.logoText}>The Fifth Ritual</span>
      </div>

      {/* Card */}
      <div style={s.card}>
        <h1 style={s.heading}>Studio{'\n'}Management</h1>
        <p style={s.subheading}>
          Authorized personnel only. Please authenticate your administrative session.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Studio ID */}
          <div style={s.fieldGroup}>
            <label style={s.label}>STUDIO ID</label>
            <div style={s.inputWrap}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              <input
                type="text"
                placeholder="e.g. IF-NY-01"
                value={studioId}
                onChange={(e) => setStudioId(e.target.value)}
                style={s.input}
              />
            </div>
          </div>

          {/* Admin Credentials */}
          <div style={s.fieldGroup}>
            <label style={s.label}>ADMIN CREDENTIALS</label>
            <div style={s.inputWrap}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                placeholder="user@thefifthritual.studio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={s.fieldGroup}>
            <div style={s.passwordHeader}>
              <label style={s.label}>PASSWORD</label>
              <span style={s.hardwareToken}>HARDWARE TOKEN?</span>
            </div>
            <div style={s.inputWrap}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={s.input}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={s.primaryBtn}>
            {loading ? 'Authenticating...' : (
              <span style={s.btnInner}>
                SECURE LOGIN
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Back link */}
        <Link to="/login" style={s.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          RETURN TO PUBLIC LOGIN
        </Link>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    fontFamily: "'Inter', sans-serif",
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  logoIcon: {
    color: '#9D50FF',
    fontSize: 18,
  },
  logoText: {
    color: '#fff',
    fontFamily: "'Newsreader', serif",
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 4,
    padding: '36px 28px',
    width: '100%',
    maxWidth: 340,
  },
  heading: {
    fontFamily: "'Newsreader', serif",
    fontSize: 38,
    fontWeight: 400,
    color: '#fff',
    margin: '0 0 12px 0',
    lineHeight: 1.15,
    whiteSpace: 'pre-line',
  },
  subheading: {
    color: '#666',
    fontSize: 13,
    margin: '0 0 28px 0',
    lineHeight: 1.6,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    display: 'block',
    color: '#666',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    marginBottom: 10,
  },
  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hardwareToken: {
    color: '#9D50FF',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    cursor: 'pointer',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #2e2e2e',
    paddingBottom: 8,
    gap: 10,
  },
  inputIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#9D50FF',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '15px',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: 8,
    fontFamily: "'Inter', sans-serif",
  },
  btnInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#555',
    fontSize: 11,
    letterSpacing: '0.08em',
    textDecoration: 'none',
    marginTop: 24,
    fontWeight: 500,
  },
};