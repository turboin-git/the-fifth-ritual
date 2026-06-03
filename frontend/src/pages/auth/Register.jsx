import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'CLIENT', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerApi(form);
      const { token, role, name, userId } = res.data;
      login({ name, role, userId }, token);
      toast.success(`Welcome, ${name}!`);
      if (role === 'ARTIST') navigate('/artist');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Registration failed. Try again.');
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
          <p className="text-gray-400 text-sm">Join the Flow</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm({...form, role: 'ARTIST'})}
            className={`py-3 rounded-xl text-sm font-medium transition border ${
              form.role === 'ARTIST'
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-gray-900 border-gray-700 text-gray-400'
            }`}
          >
            🎨 Artist
          </button>
          <button
            type="button"
            onClick={() => setForm({...form, role: 'CLIENT'})}
            className={`py-3 rounded-xl text-sm font-medium transition border ${
              form.role === 'CLIENT'
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-gray-900 border-gray-700 text-gray-400'
            }`}
          >
            👤 Client
          </button>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-white text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-gray-400 text-sm mb-6">Create your professional account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="98XXXXXXXX"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-gray-400 text-center text-sm mt-6">
            Already part of the flow?{' '}
            <Link to="/login" className="text-purple-400 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}