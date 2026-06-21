import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const imageOverrides = {
  'Serpent & Flora': 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=500&q=80',
  'Nexus Frame': 'https://images.unsplash.com/photo-1604374125777-592bb994d27f?w=500&q=80',
  'Iron Swallow': 'https://images.unsplash.com/photo-1541411780127-15d88bd3476d?w=500&q=80',
  'Void Structure': 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?w=500&q=80',
};

const faqs = [
  {
    q: 'Do I need to book a consultation first?',
    a: 'For custom pieces, yes — we recommend a free consultation. For flash designs, you can book directly.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Khalti, eSewa, and cash. A deposit is required to confirm any booking.',
  },
  {
    q: 'Is there an age requirement?',
    a: 'Yes, you must be at least 18 years old, or have parental consent where permitted by law.',
  },
  {
    q: 'How do I prepare for my session?',
    a: 'Stay hydrated, eat beforehand, avoid alcohol 24 hours prior, and wear comfortable clothing.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [artists, setArtists] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    api.get('/designs').then(res => setDesigns(res.data.slice(0, 4))).catch(() => setDesigns([]));
    api.get('/artists/approved').then(res => setArtists(res.data.slice(0, 3))).catch(() => setArtists([]));
  }, []);

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
            <button onClick={() => navigate('/gallery')} className="hover:text-white transition">Designs</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-gray-400 hover:text-white text-sm font-medium transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-lg transition"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
        <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
          Premium Tattoo Studio
        </p>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
          Where Ink Becomes<br />
          <span className="text-purple-400">Ritual.</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Book sessions with resident artists, browse curated flash designs, and
          experience tattooing with studio-grade care from consultation to aftercare.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest px-8 py-4 rounded-xl text-sm transition"
          >
            BOOK APPOINTMENT
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className="border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest px-8 py-4 rounded-xl text-sm transition"
          >
            EXPLORE DESIGNS
          </button>
        </div>
      </section>

      {/* Hero Image */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="aspect-video rounded-3xl overflow-hidden border border-gray-800">
          <img
            src="https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1200&q=80"
            alt="Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Featured Designs</h2>
          <button onClick={() => navigate('/gallery')} className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition">
            View All →
          </button>
        </div>
        {designs.length === 0 ? (
          <p className="text-gray-500 text-sm">No designs available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {designs.map((design) => (
              <div key={design.id} className="group cursor-pointer" onClick={() => navigate('/gallery')}>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-3">
                  <img
                    src={imageOverrides[design.title] || design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.style.opacity = '0.2'; }}
                  />
                </div>
                <p className="font-semibold text-sm truncate">{design.title}</p>
                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{design.style}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FEATURED ARTISTS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">Featured Artists</h2>
        {artists.length === 0 ? (
          <p className="text-gray-500 text-sm">No artists available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {artist.name?.charAt(0) || 'A'}
                </div>
                <p className="font-bold text-lg">{artist.name}</p>
                <p className="text-purple-400 text-xs font-bold tracking-widest mt-1 mb-3">
                  {artist.specialization || 'Resident Artist'}
                </p>
                <p className="text-gray-500 text-xs mb-5">
                  {artist.experienceYears ? `${artist.experienceYears} years experience` : 'Studio artist'}
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest py-2.5 rounded-xl text-xs transition"
                >
                  BOOK THIS ARTIST
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { icon: '🖋️', title: 'Professional Artists', desc: 'Vetted, experienced resident and guest artists.' },
            { icon: '🛡️', title: 'Safe Environment', desc: 'Strict sterilization and health & safety protocols.' },
            { icon: '📅', title: 'Digital Booking', desc: 'Real-time availability with instant confirmation.' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Khalti and eSewa integration with deposit protection.' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-bold text-sm mb-2">{item.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-center">What Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Marcus R.', text: 'The booking process was seamless and the aftercare tracking actually helped me heal faster.' },
            { name: 'Sarah J.', text: 'My artist understood exactly what I wanted. The consent form process felt very professional.' },
            { name: 'Aiden K.', text: 'Paid my deposit through Khalti in seconds. No back and forth, just a clean experience.' },
          ].map((item) => (
            <div key={item.name} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{item.text}"</p>
              <p className="text-purple-400 text-xs font-bold tracking-widest">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

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