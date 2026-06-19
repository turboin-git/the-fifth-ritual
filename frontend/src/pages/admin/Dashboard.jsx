import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => setStats(null)).finally(() => setLoading(false));
    api.get('/appointments/all').then(res => setRecentAppointments(res.data.slice(-5).reverse())).catch(() => setRecentAppointments([]));
  }, []);

  const managementLinks = [
    {
      label: 'Manage Designs', path: '/admin/designs',
      desc: 'Add, edit, or remove tattoo designs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Manage Artists', path: '/admin/artists',
      desc: 'Approve, suspend, or review artists',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Manage Clients', path: '/admin/clients',
      desc: 'View and search client records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: 'Contact Messages', path: '/admin/messages',
      desc: 'View inquiries from the contact form',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
            TF
          </div>
          <span className="font-bold text-base tracking-wide">Admin Console</span>
        </div>
        <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition text-xs font-bold tracking-widest">
          LOGOUT
        </button>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-6">Dashboard</h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !stats ? (
          <p className="text-gray-500 text-sm text-center py-10">Could not load stats.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">TOTAL CLIENTS</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">TOTAL ARTISTS</p>
              <p className="text-3xl font-bold">{stats.totalArtists}</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">TOTAL BOOKINGS</p>
              <p className="text-3xl font-bold">{stats.totalAppointments}</p>
              <p className="text-purple-400 text-xs font-bold mt-1">{stats.pendingAppointments} pending</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-gray-500 text-xs font-bold tracking-widest mb-2">REVENUE</p>
              <p className="text-3xl font-bold">${stats.totalRevenue}</p>
            </div>
          </div>
        )}

        {/* Management Links */}
        <h2 className="font-bold text-lg mb-4">Management</h2>
        <div className="space-y-3 mb-8">
          {managementLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full bg-gray-900 rounded-2xl p-4 border border-gray-800 hover:border-purple-500 transition flex items-center gap-4 text-left"
            >
              <div className="w-10 h-10 bg-purple-600 bg-opacity-20 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                {link.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{link.label}</p>
                <p className="text-gray-500 text-xs">{link.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Recent Appointments */}
        <h2 className="font-bold text-lg mb-4">Recent Bookings</h2>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((appt) => (
              <div key={appt.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{appt.client?.user?.name || 'Unknown Client'}</p>
                  <p className="text-gray-500 text-xs">with {appt.artist?.user?.name || 'Unknown Artist'}</p>
                </div>
                <span className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full ${
                  appt.status === 'CONFIRMED' ? 'bg-green-900 text-green-300' :
                  appt.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                  appt.status === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}