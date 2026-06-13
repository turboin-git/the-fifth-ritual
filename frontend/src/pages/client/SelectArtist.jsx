import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const artists = [
  {
    id: 1,
    name: 'Elena Rostova',
    specialty: 'FINE LINE • MICRO REALISM',
    rating: 4.9,
    nextAvail: 'OCT 12',
    styles: ['Fine Line', 'Realism'],
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    specialty: 'TRADITIONAL • NEO-TRAD',
    rating: 5.0,
    nextAvail: 'NOV 05',
    styles: ['Traditional'],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    specialty: 'BLACKWORK • ABSTRACT',
    rating: 4.8,
    nextAvail: 'OCT 15',
    styles: ['Blackwork'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  },
];

const filters = ['ALL', 'FINE LINE', 'TRADITIONAL', 'REALISM', 'BLACKWORK'];

export default function SelectArtist() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = activeFilter === 'ALL'
    ? artists
    : artists.filter(a =>
        a.styles.some(s => s.toUpperCase() === activeFilter)
      );

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-700 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-base tracking-widest">THE FIFTH RITUAL</span>
        </div>
        <button className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      <div className="px-5">

        {/* Title */}
        <h1 className="text-3xl font-bold mt-2 mb-2">Select Artist</h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Browse our resident artists and find the perfect match for your vision.
          Filter by specialty to narrow down your choices.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border transition ${
                activeFilter === filter
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Artist Cards */}
        <div className="space-y-6">
          {filtered.map((artist) => (
            <div key={artist.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">

              {/* Artist Image */}
              <div className="relative w-full h-72">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = '#1f2937';
                  }}
                />
                {/* Availability Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-purple-600 bg-opacity-90 px-3 py-1 rounded-sm">
                  <div className="w-1.5 h-1.5 rounded-sm bg-white" />
                  <span className="text-white text-xs font-bold tracking-widest">
                    NEXT AVAIL: {artist.nextAvail}
                  </span>
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold">{artist.name}</h2>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold text-sm">{artist.rating}</span>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 text-xs font-bold tracking-widest mb-4">
                  {artist.specialty}
                </p>
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  VIEW PORTFOLIO →
                </button>
              </div>
            </div>
          ))}

          {/* Guest Artists Card */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-gray-700 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Guest Artists</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Discover visiting talent from around the globe.
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest px-8 py-3 rounded-xl text-xs transition"
            >
              VIEW SCHEDULE
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around">
        {[
          { label: 'Studio', path: '/dashboard', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )},
          { label: 'Booking', path: '/booking', active: true, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )},
          { label: 'Gallery', path: '/gallery', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )},
          { label: 'Care', path: '/care', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )},
          { label: 'Stock', path: '/stock', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )},
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest transition ${
              item.active ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
}