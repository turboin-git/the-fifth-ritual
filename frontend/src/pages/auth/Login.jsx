import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
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
      login({ name, role, userId }, token);
      toast.success(`Welcome back, ${name}!`);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'ARTIST') navigate('/artist');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
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

        <h2 className="text-white text-2xl font-serif font-bold mb-8">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
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

          {/* Password */}
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

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="text-gray-600 text-xs px-3 uppercase tracking-widest">
            Or sign in with
          </span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Social Buttons */}
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

        {/* Register Link */}
        <p className="text-gray-600 text-center text-sm mt-6">
          Don't have a studio account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 transition">
            Request Access
          </Link>
        </p>

        {/* Admin Link */}
        <div className="text-center mt-3">
          <Link
            to="/admin/login"
            className="text-gray-600 text-xs hover:text-gray-400 transition"
          >
            Admin Login →
          </Link>
        </div>

      </div>
    </div>
  );
}