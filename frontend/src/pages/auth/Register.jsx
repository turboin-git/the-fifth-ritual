import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT',
    phone: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please agree to Terms of Service');
      return;
    }
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-10">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-purple-600 rounded-sm"></div>
        <span className="text-white text-sm font-semibold tracking-wide">
          The Fifth Ritual
        </span>
      </div>

      <div className="w-full max-w-sm">

        {/* Heading */}
        <h1 className="text-white text-3xl font-serif font-bold mb-1">
          Join the Ritual
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Create your professional account to get started.
        </p>

        {/* Role Selector */}
        <p className="text-gray-400 text-sm mb-3">I am a...</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm({...form, role: 'ARTIST'})}
            className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition ${
              form.role === 'ARTIST'
                ? 'border-purple-500 bg-purple-950 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
            }`}
          >
            <span className="text-xl">✏️</span>
            <span className="text-sm font-medium">Artist</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({...form, role: 'CLIENT'})}
            className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition ${
              form.role === 'CLIENT'
                ? 'border-purple-500 bg-purple-950 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-sm font-medium">Client</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
              placeholder="name@domain.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm placeholder-gray-600 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-purple-500 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-gray-400 text-xs leading-relaxed cursor-pointer"
            >
              I agree to the{' '}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Privacy Policy
              </span>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-gray-500 text-center text-sm mt-6">
          Already part of the ritual?{' '}
          <Link
            to="/login"
            className="text-white font-semibold hover:text-purple-400 transition"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}