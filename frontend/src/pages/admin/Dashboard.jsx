import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Studio');

  const stats = [
    {
      label: 'TOTAL REVENUE (MTD)',
      value: '$142,850',
      change: '+12.4%',
      changeColor: 'text-green-400',
      bars: [30, 45, 35, 60, 75, 65, 90],
    },
    {
      label: 'STUDIO CAPACITY',
      value: '75%',
      sub: '12/16 STATIONS ACTIVE',
      type: 'circle',
    },
    {
      label: 'CLIENT RETENTION',
      value: '88.2%',
      sub: 'Highest peak in Q3',
    },
  ];

  const artists = [
    {
      name: 'Elena Rostova',
      specialty: 'BLACKWORK SPECIALIST',
      bookedHours: '38.5 / 40',
      revenue: '$8.2k',
      active: true,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
    },
    {
      name: 'Marcus Vance',
      specialty: 'NEO-TRADITIONAL',
      bookedHours: '32.0 / 40',
      revenue: '$6.4k',
      active: true,
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    },
  ];

  const compliance = [
    { label: 'Autoclave Spore Test', sub: 'LOC #8821-B', status: 'PASSED', color: 'bg-green-500', textColor: 'text-green-400', borderColor: 'border-green-600' },
    { label: 'Station Sterilization', sub: 'ZONE 4 - PENDING', status: 'REQUIRED', color: 'bg-red-500', textColor: 'text-red-400', borderColor: 'border-red-600' },
    { label: 'Bio-Waste Disposal', sub: 'SCHEDULED 14:00', status: 'ON-TRACK', color: 'bg-yellow-500', textColor: 'text-yellow-400', borderColor: 'border-yellow-600' },
  ];

  const stockAlerts = [
    { item: 'Needles (RL-03)', count: '12 left', urgent: true },
    { item: 'Obsidian Ink (500ml)', count: '2 left', urgent: true },
    { item: 'Nitrile Gloves (M)', count: '42 packs', urgent: false },
  ];

  const guestArtists = [
    { name: 'Julian Kovic', dates: 'OCT 12 — OCT 15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { name: 'Sana Oh', dates: 'OCT 22 — OCT 28', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  ];

  const navItems = [
    { label: 'Studio', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { label: 'Schedule', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: 'Artists', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { label: 'Safety', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { label: 'Inventory', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-gray-800">
        <button className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-widest">THEFIFTHRITUAL</span>
        <button onClick={() => { logout(); navigate('/login'); }}>
          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Revenue Card */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">
            TOTAL REVENUE (MTD)
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">$142,850</p>
            </div>
            <span className="text-green-400 text-sm font-bold">+12.4%</span>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-1.5 mt-4 h-12">
            {[30, 45, 35, 60, 75, 65, 90].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i === 6 ? 'bg-purple-500' : 'bg-gray-700'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Studio Capacity */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-4">
            STUDIO CAPACITY
          </p>
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#7c3aed" strokeWidth="8"
                  strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">75%</span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs font-bold tracking-widest">
            12/16 STATIONS ACTIVE
          </p>
        </div>

        {/* Client Retention */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">
            CLIENT RETENTION
          </p>
          <p className="text-3xl font-bold">88.2%</p>
          <p className="text-gray-500 text-xs italic mt-1">Highest peak in Q3</p>
        </div>

        {/* Artist Productivity */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold">Artist Productivity</h2>
          </div>

          <div className="space-y-4">
            {artists.map((artist, i) => (
              <div key={i} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                {/* Artist Image */}
                <div className="relative h-48 w-full">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.parentElement.style.background = '#1f2937'; }}
                  />
                  {/* Online dot */}
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base">{artist.name}</h3>
                  <p className="text-purple-400 text-xs font-bold tracking-widest mb-3">
                    {artist.specialty}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest mb-0.5">BOOKED HOURS</p>
                      <p className="text-white font-bold">{artist.bookedHours}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest mb-0.5">REVENUE</p>
                      <p className="text-white font-bold">{artist.revenue}</p>
                    </div>
                  </div>

                  <button className="w-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition">
                    VIEW PORTFOLIO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-sm font-bold tracking-widest">SAFETY & COMPLIANCE</h2>
          </div>

          <div className="space-y-3">
            {compliance.map((item, i) => (
              <div key={i} className={`flex items-center justify-between border-l-2 ${item.borderColor} pl-3 py-1`}>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
                <span className={`text-xs font-bold tracking-widest px-2 py-1 rounded-sm border ${item.borderColor} ${item.textColor}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-sm font-bold tracking-widest">STOCK ALERTS</h2>
          </div>

          <div className="space-y-3 mb-4">
            {stockAlerts.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{item.item}</span>
                <div className="flex items-center gap-3">
                  {i === 2 && (
                    <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-purple-500 rounded-full" />
                    </div>
                  )}
                  <span className={`text-xs font-bold ${item.urgent ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition">
            ORDER SUPPLIES
          </button>
        </div>

        {/* Guest Artists */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-sm font-bold tracking-widest">GUEST ARTISTS</h2>
          </div>

          <div className="space-y-4">
            {guestArtists.map((artist, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{artist.name}</p>
                  <p className="text-gray-500 text-xs">{artist.dates}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 py-3 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest transition ${
              activeTab === item.label ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
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