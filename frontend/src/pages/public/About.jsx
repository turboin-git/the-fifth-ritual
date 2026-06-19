import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function About() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    api.get('/artists/approved').then(res => setArtists(res.data)).catch(() => setArtists([]));
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
            <button onClick={() => navigate('/about')} className="text-white">About</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition">Designs</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-lg transition"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-16 md:py-20 max-w-4xl mx-auto text-center">
        <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
          Our Story
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
          More Than Ink.<br />
          <span className="text-purple-400">A Ritual.</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
          The Fifth Ritual was founded on the belief that getting tattooed should feel
          like a considered, sacred process — not a transaction. Every session is built
          around safety, artistry, and genuine care for the person beneath the needle.
        </p>
      </section>

      {/* Studio Image */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-gray-800">
          <img
            src="https://images.unsplash.com/photo-1590246814883-57c511e76523?w=1200&q=80"
            alt="Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold mb-3">Our Mission</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              To provide a studio environment where every client feels informed, safe,
              and genuinely heard — combining technical excellence with real human care
              from consultation through aftercare.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold mb-3">Our Vision</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              To be the studio people trust first — known not just for the work on the
              wall, but for raising the standard of what a tattoo booking experience
              should feel like.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM MEMBERS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Meet The Artists</h2>
        {artists.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">Artist profiles coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {artist.name?.charAt(0) || 'A'}
                </div>
                <p className="font-bold text-lg">{artist.name}</p>
                <p className="text-purple-400 text-xs font-bold tracking-widest mt-1 mb-3">
                  {artist.specialization || 'Resident Artist'}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {artist.bio || `${artist.experienceYears || 'Several'} years of dedicated craft, focused on precision and client comfort.`}
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

      {/* STUDIO PHOTOS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Inside The Studio</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
            'https://images.unsplash.com/photo-1604374125777-592bb994d27f?w=400&q=80',
            'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?w=400&q=80',
            'https://images.unsplash.com/photo-1541411780127-15d88bd3476d?w=400&q=80',
            'https://images.unsplash.com/photo-1590246814883-57c511e76523?w=400&q=80',
            'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
          ].map((url, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-800">
              <img src={url} alt={`Studio ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Ready to Begin?</h2>
        <p className="text-gray-400 mb-8">Book a consultation or browse our flash collection today.</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest px-8 py-4 rounded-xl text-sm transition"
        >
          GET STARTED
        </button>
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