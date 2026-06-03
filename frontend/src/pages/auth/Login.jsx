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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-purple-500 rounded-sm"></div>
            <span className="text-white font-bold text-xl">The Fifth Ritual</span>
          </div>
          <p className="text-gray-400 text-sm">Studio Management</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-white text-2xl font-bold mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">Welcome back to your studio</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="studio@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-400 text-xs uppercase tracking-wider">Password</label>
                <span className="text-purple-400 text-xs cursor-pointer">Forgot Password?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="text-gray-500 text-xs px-3">OR SIGN IN WITH</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm transition border border-gray-700">
              <span>G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm transition border border-gray-700">
              <span>🍎</span> Apple
            </button>
          </div>

          <p className="text-gray-400 text-center text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:underline">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}