import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      toast.success('Secure session established.');
      navigate('/admin');
    } catch (err) {
      toast.error('Invalid credentials or unauthorized access.');
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

        <h2 className="text-white text-2xl font-serif font-bold mb-2">
          Admin Login
        </h2>
        <p className="text-gray-500 text-xs mb-8">
          Authorized personnel only.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Studio ID */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Studio ID
            </label>
            <div className="flex items-center gap-3 border-b border-gray-600 pb-2 focus-within:border-purple-500 transition">
              <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <input
                type="text"
                value={studioId}
                onChange={(e) => setStudioId(e.target.value)}
                placeholder="e.g. TFR-NP-01"
                className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Admin Credentials
            </label>
            <div className="flex items-center gap-3 border-b border-gray-600 pb-2 focus-within:border-purple-500 transition">
              <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thefifthritual.studio"
                className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                Password
              </label>
              <button
                type="button"
                className="text-purple-400 text-xs font-bold tracking-widest hover:text-purple-300 transition"
              >
                Hardware Token?
              </button>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-600 pb-2 focus-within:border-purple-500 transition">
              <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Secure Login
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </>
            )}
          </button>

        </form>

        {/* Return Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 text-gray-600 text-xs font-bold tracking-widest hover:text-gray-400 transition mx-auto"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Return to Public Login
          </button>
        </div>

      </div>
    </div>
  );
}