import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact/submit', formData);
      setSent(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error('Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-gray-950 bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 bg-purple-600 rounded-md flex items-center justify-center text-xs font-bold">
              TF
            </div>
            <span className="font-serif font-bold text-base tracking-wide">The Fifth Ritual</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm text-gray-400">
            <button onClick={() => navigate('/about')} className="hover:text-white transition">About</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition">Designs</button>
            <button onClick={() => navigate('/contact')} className="text-white">Contact</button>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-lg transition"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4 text-center">
          Get In Touch
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-center mb-4">
          Contact Us
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-md mx-auto">
          Questions about booking, designs, or aftercare? Reach out and we'll get back to you.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Email</p>
                <p className="text-gray-500 text-sm">contact@thefifthritual.com</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Phone</p>
                <p className="text-gray-500 text-sm">+977 980-0000000</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Studio Address</p>
                <p className="text-gray-500 text-sm">Thamel, Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-800 aspect-video">
              <iframe
                title="Studio Location"
                src="https://maps.google.com/maps?q=Thamel%2C%20Kathmandu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">NAME</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">EMAIL</label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">PHONE (OPTIONAL)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    placeholder="98XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">SUBJECT</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">MESSAGE</label>
                  <textarea
                    required rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-6 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-600 rounded-md" />
            <span className="font-bold text-sm">The Fifth Ritual</span>
          </div>
          <p className="text-gray-600 text-xs">© 2026 The Fifth Ritual. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}