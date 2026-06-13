import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      toast.success('Password reset successful!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Reset failed. Link may have expired.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
          <div className="w-12 h-12 bg-red-600 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-700">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Invalid Link</h2>
          <p className="text-gray-500 text-sm mb-6">
            This reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition"
          >
            Request a new link →
          </Link>
        </div>
      </div>
    );
  }

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

        {!success ? (
          <>
            {/* Icon */}
            <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center mb-6 border border-purple-700">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h2 className="text-white text-2xl font-serif font-bold mb-2">
              Create New Password
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Your new password must be at least 6 characters.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* New Password */}
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-gray-200 py-2 border-b border-gray-600 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition pr-8"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-2 text-gray-600 hover:text-gray-400 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-gray-200 py-2 border-b border-gray-600 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
                  placeholder="Repeat your password"
                  required
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-green-400 text-xs mt-1">Passwords match ✓</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-700">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Password Reset!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}