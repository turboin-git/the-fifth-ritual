import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [role, setRole] = useState('CLIENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please agree to the Terms of Service.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi({ name, email, password, role, phone });
      const { token, role: userRole, name: userName, userId } = res.data;
      login({ name: userName, role: userRole, userId }, token);
      toast.success(`Welcome to The Fifth Ritual, ${userName}!`);
      if (userRole === 'ARTIST') navigate('/artist');
      else navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-10">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-7 h-7 bg-purple-600 rounded-md" />
        <span className="text-white font-bold text-lg tracking-wide">The Fifth Ritual</span>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-sm">

        <h1 className="text-3xl font-bold text-white mb-1">Join the Ritual</h1>
        <p className="text-gray-500 text-sm mb-8">
          Create your professional account to get started.
        </p>

        {/* Role Selector */}
        <p className="text-gray-400 text-sm mb-3">I am a...</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('ARTIST')}
            className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 transition ${
              role === 'ARTIST'
                ? 'border-purple-500 bg-purple-600 bg-opacity-20 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="font-semibold text-sm">Artist</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 transition ${
              role === 'CLIENT'
                ? 'border-purple-500 bg-purple-600 bg-opacity-20 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-semibold text-sm">Client</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1.5">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-purple-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="terms" className="text-gray-500 text-sm cursor-pointer">
              I agree to the{' '}
              <span className="text-white font-semibold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-white font-semibold">Privacy Policy</span>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-gray-600 text-center text-sm mt-6">
          Already part of the ritual?{' '}
          <Link to="/login" className="text-white font-bold hover:text-purple-400 transition">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}