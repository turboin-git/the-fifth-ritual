import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AfterCare() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Care');
  const [regimen, setRegimen] = useState({
    cleanse: true,
    ointment: true,
    saniderm: false,
  });

  const [photos] = useState([
    { day: 'Day 3', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80' },
    { day: 'Day 2', image: 'https://images.unsplash.com/photo-1542856204-00101eb6def4?w=200&q=80' },
    { day: 'Day 1', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&q=80' },
  ]);

  const healthChecks = [
    { icon: '💧', label: 'Redness', status: 'Subiding' },
    { icon: '🌡', label: 'Swelling', status: 'Minimal' },
    { icon: '🩹', label: 'Peeling', status: 'Expected' },
    { icon: '🛡', label: 'Infection Risk', status: 'Low' },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Hero Section */}
      <div className="px-5 pt-12 pb-8 border-b border-gray-800">
        <p className="text-gray-500 text-xs font-bold tracking-widest mb-3">
          Session Completed: Oct 24, 2023
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-4">
          Post-Session<br />Protocol
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          Meticulous aftercare is essential for optimal healing. Monitor your progress
          and adhere strictly to the schedule below.
        </p>

        {/* Healing Track Badge */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 w-fit">
          <div className="w-2 h-2 rounded-sm bg-green-400" />
          <span className="text-green-400 text-xs font-bold tracking-widest">
            Healing Track: Nominal
          </span>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* Health Check */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Health Check</h2>
            <span className="text-xs font-bold tracking-widest text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              Day 4 of 14
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {healthChecks.map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <p className="text-gray-500 text-xs tracking-widest mb-1">{item.label}</p>
                <p className="text-white font-bold text-sm">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Photographic Log */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Daily Photographic Log</h2>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-xl transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Upload Entry
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={photo.image}
                    alt={photo.day}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-gray-500 text-xs text-center mt-1 font-bold">{photo.day}</p>
              </div>
            ))}

            {/* Pending Slot */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gray-500 transition">
                <span className="text-gray-600 text-2xl">+</span>
                <span className="text-gray-600 text-xs font-bold">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regimen Alerts */}
        <div>
          <h2 className="text-lg font-bold mb-4">Regimen Alerts</h2>
          <div className="space-y-2">

            {/* Cleanse Area */}
            <div className="bg-gray-900 rounded-2xl px-5 py-4 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Cleanse Area</p>
                <p className="text-gray-500 text-xs mt-0.5">2x Daily (AM/PM)</p>
              </div>
              <button
                onClick={() => setRegimen(r => ({ ...r, cleanse: !r.cleanse }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  regimen.cleanse ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  regimen.cleanse ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Apply Ointment */}
            <div className="bg-gray-900 rounded-2xl px-5 py-4 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Apply Ointment</p>
                <p className="text-gray-500 text-xs mt-0.5">Light Layer, 3x Daily</p>
              </div>
              <button
                onClick={() => setRegimen(r => ({ ...r, ointment: !r.ointment }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  regimen.ointment ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  regimen.ointment ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Remove Saniderm */}
            <div className="bg-gray-900 rounded-2xl px-5 py-4 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Remove Saniderm</p>
                <p className="text-gray-500 text-xs mt-0.5">Completed (Day 3)</p>
              </div>
              <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* Urgent Inquiries */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-3">
            Urgent Inquiries
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            If you notice excessive heat, prolonged redness spreading beyond the area,
            or irregular discharge, contact the studio immediately.
          </p>
          <button className="w-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition">
            CONTACT ARTIST
          </button>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveTab(item.label); navigate(item.path); }}
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