import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const filters = ['ALL', 'FINE LINE', 'TRADITIONAL', 'BLACKWORK', 'CYBER-SIGILISM'];

const imageOverrides = {
  'Serpent & Flora': 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80',
  'Nexus Frame': 'https://images.unsplash.com/photo-1604374125777-592bb994d27f?w=600&q=80',
  'Iron Swallow': 'https://images.unsplash.com/photo-1541411780127-15d88bd3476d?w=600&q=80',
  'Void Structure': 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?w=600&q=80',
};

export default function Gallery() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Gallery');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const url = activeFilter === 'ALL'
          ? '/designs'
          : `/designs/style/${encodeURIComponent(toStyleParam(activeFilter))}`;
        const res = await api.get(url);
        setDesigns(res.data);
      } catch (err) {
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, [activeFilter]);

  const toStyleParam = (filter) => {
    const map = {
      'FINE LINE': 'Fine Line',
      'TRADITIONAL': 'Traditional',
      'BLACKWORK': 'Blackwork',
      'CYBER-SIGILISM': 'Cyber-Sigilism',
    };
    return map[filter] || filter;
  };

  const navItems = [
    { label: 'Studio', path: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { label: 'Booking', path: '/booking', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: 'Gallery', path: '/gallery', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: 'Care', path: '/care', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { label: 'Artists', path: '/select-artist', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
            TF
          </div>
          <span className="font-bold text-base tracking-wide">The Fifth Ritual</span>
        </div>
        <button className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      <div className="px-5">

        {/* Title */}
        <h1 className="text-3xl font-serif font-bold mt-2 mb-2">Flash Collection</h1>
        <p className="text-gray-400 text-sm mb-6">
          Curated high-contrast designs ready for booking.
        </p>

        {/* AR Try-On Banner */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-widest border transition whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No designs found for this style.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => navigate('/booking', { state: { designId: design.id } })}
                className="cursor-pointer group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 mb-3">
                  <img
                    src={imageOverrides[design.title] || design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.style.opacity = '0.2'; }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-base">{design.title}</p>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-0.5">
                      {design.style}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-bold text-sm">${design.price}</p>
                    <p className="text-gray-500 text-xs">{design.durationHours} HOURS</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 py-3 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveTab(item.label); navigate(item.path); }}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest transition ${
              item.label === 'Gallery' ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
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