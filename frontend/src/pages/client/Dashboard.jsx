import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');

  const upcomingSession = {
    title: 'Geometric Sleeve - Session 3',
    artist: 'Silas Gray',
    date: 'Oct 24, 2023',
    time: '14:00 - 18:00',
    status: 'CONFIRMED',
  };

  const aftercare = {
    day: 4,
    title: 'Minimalist Forearm Band',
    steps: [
      { icon: '💧', text: 'Wash gently with unscented antibacterial soap 2x daily.' },
      { icon: '🧴', text: 'Apply a paper-thin layer of provided aftercare balm.' },
      { icon: '☀️', text: 'Avoid direct sunlight and submerged water.' },
    ],
  };

  const bookingHistory = [
    { title: 'Abstract Linework', artist: 'Silas Gray', date: 'SEP 12, 2023', status: 'Completed' },
    { title: 'Consultation', artist: 'Elena Rostova', date: 'AUG 05, 2023', status: 'Completed' },
    { title: 'Dotwork Mandala', artist: 'Silas Gray', date: 'MAR 22, 2023', status: 'Completed' },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1542856204-00101eb6def4?w=200&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80',
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&q=80',
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg tracking-widest">THE FIFTH RITUAL</span>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>

      <div className="px-5 space-y-5">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your upcoming sessions and recent activity.
          </p>
        </div>

        {/* Upcoming Session Card */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-600 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-sm">
              ▪ {upcomingSession.status}
            </span>
            <span className="text-gray-500 text-xs font-bold tracking-widest">
              UPCOMING SESSION
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2 leading-tight">
            {upcomingSession.title}
          </h2>

          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>with Artist {upcomingSession.artist}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">DATE</p>
              <p className="text-white font-semibold text-sm">{upcomingSession.date}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">TIME</p>
              <p className="text-white font-semibold text-sm">{upcomingSession.time}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
           <button
           onClick={() => navigate('/consent-form')}
            className="w-full mt-3 border border-purple-700 text-purple-400 hover:bg-purple-600 hover:text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              COMPLETE HEALTH & CONSENT FORM
              </button>
            <button className="border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition">
              VIEW DETAILS
            </button>
          </div>
        </div>

        {/* Aftercare Card */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Aftercare</h2>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <p className="text-green-400 text-xs font-bold tracking-widest mb-1">
            ACTIVE HEALING: DAY {aftercare.day}
          </p>
          <p className="text-white font-semibold mb-4">{aftercare.title}</p>

          <div className="space-y-3 mb-4">
            {aftercare.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border border-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
                <p className="text-gray-400 text-sm">{step.text}</p>
              </div>
            ))}
          </div>

          <button className="w-full border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition">
            FULL CARE GUIDE
          </button>
        </div>

        {/* Booking History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Booking History</h2>
            <button className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-0">
            {bookingHistory.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0"
              >
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {item.artist} — {item.status}
                  </p>
                </div>
                <span className="text-gray-600 text-xs font-bold tracking-widest">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inspiration Gallery */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Inspiration Gallery</h2>
            <button className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition">
              MANAGE
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                <img
                  src={img}
                  alt={`gallery-${i}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
            <button
              onClick={() => navigate('/booking')}
              className="aspect-square rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 flex flex-col items-center justify-center gap-2 transition"
            >
              <span className="text-3xl text-gray-500">+</span>
              <span className="text-xs font-bold tracking-widest text-gray-500">SAVE NEW</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around">
        {[
          { icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ), label: 'Studio', path: '/dashboard', active: false },
          { icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ), label: 'Booking', path: '/booking', active: true },
          { icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ), label: 'Gallery', path: '/gallery', active: false },
          { icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ), label: 'Care', path: '/care', active: false },
         { icon: (
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
), label: 'Artists', path: '/select-artist', active: false },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest ${
              item.active ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
            } transition`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
}