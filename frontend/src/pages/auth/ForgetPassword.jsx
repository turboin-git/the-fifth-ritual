import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
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

        {!sent ? (
          <>
            {/* Icon */}
            <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center mb-6 border border-purple-700">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>

            <h2 className="text-white text-2xl font-serif font-bold mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              No worries. Enter your email and we'll send you a reset link valid for 30 minutes.
            </p>

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
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-700">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Check Your Email</h2>
              <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                We sent a password reset link to:
              </p>
              <p className="text-purple-400 font-semibold text-sm mb-6">{email}</p>
              <p className="text-gray-600 text-xs mb-8">
                The link expires in 30 minutes. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-gray-500 text-sm hover:text-gray-300 transition"
              >
                Try a different email
              </button>
            </div>
          </>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-600 text-xs hover:text-gray-400 transition"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}