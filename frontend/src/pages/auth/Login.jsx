import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Step 1 — submit email + password, get OTP sent
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await loginApi({ email, password });

    // ADMIN or ARTIST — direct login, no OTP
    if (res.data.token) {
      const { token, role, name, userId } = res.data;
      login({ name, role, userId }, token);
      toast.success(`Welcome back, ${name}!`);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'ARTIST') navigate('/artist');
      else navigate('/dashboard');
      return;
    }

    // CLIENT — OTP flow
    if (res.data.otpSent) {
      setPendingEmail(res.data.email);
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    }
  } catch (err) {
    toast.error('Invalid email or password');
  } finally {
    setLoading(false);
  }
};

  // Step 2 — submit OTP, get JWT back
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setVerifying(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: pendingEmail, otp });
      const { token, role, name, userId } = res.data;
      login({ name, role, userId }, token);
      toast.success(`Welcome back, ${name}!`);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'ARTIST') navigate('/artist');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid or expired OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await loginApi({ email, password });
      toast.success('New OTP sent to your email!');
      setOtp('');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-white text-4xl font-serif font-bold tracking-wide">
          The Fifth Ritual
        </h1>
        <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">
          Studio Management
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800">

        {!otpSent ? (
          <>
            <h2 className="text-white text-2xl font-serif font-bold mb-8">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-gray-200 py-2 border-b border-gray-600 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
                  placeholder="artist@thefifthritual.studio"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-purple-400 text-xs cursor-pointer hover:text-purple-300 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-gray-200 py-2 border-b border-gray-600 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-4"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="text-gray-600 text-xs px-3 uppercase tracking-widest">Or sign in with</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toast('Google login coming soon!', { icon: '🔜' })}
                className="flex items-center justify-center gap-2 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-sm hover:border-gray-500 hover:text-white transition"
              >
                <span className="font-bold text-base">G</span>
                <span>Google</span>
              </button>
              <button
                onClick={() => toast('Facebook login coming soon!', { icon: '🔜' })}
                className="flex items-center justify-center gap-2 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-sm hover:border-gray-500 hover:text-white transition"
              >
                <span>Facebook</span>
              </button>
            </div>

            <p className="text-gray-600 text-center text-sm mt-6">
              Don't have a studio account?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 transition">
                Request Access
              </Link>
            </p>

            <div className="text-center mt-3">
              <Link to="/admin/login" className="text-gray-600 text-xs hover:text-gray-400 transition">
                Admin Login →
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* OTP Screen */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-900 bg-opacity-40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-serif font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-500 text-sm">
                We sent a 6-digit OTP to
              </p>
              <p className="text-purple-400 text-sm font-semibold mt-1">{pendingEmail}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-gray-800 text-white text-center text-2xl font-bold tracking-[0.5em] py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="text-center mt-6 space-y-3">
              <p className="text-gray-600 text-sm">Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                className="text-purple-400 text-sm hover:text-purple-300 transition font-semibold"
              >
                Resend OTP
              </button>
              <div>
                <button
                  onClick={() => { setOtpSent(false); setOtp(''); }}
                  className="text-gray-600 text-xs hover:text-gray-400 transition"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}