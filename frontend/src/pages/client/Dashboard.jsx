import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/clients/profile/${user.userId}`);
        const cid = profileRes.data.clientId;
        setClientId(cid);

        const apptRes = await api.get(`/appointments/client/${cid}`);
        const all = apptRes.data;

        const now = new Date();
        const upcoming = all
          .filter(a => a.status !== 'CANCELLED' && new Date(a.scheduledAt) >= now)
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0] || null;

        const recent = all
          .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
          .slice(0, 5);

        setUpcomingAppointment(upcoming);
        setRecentAppointments(recent);
      } catch (err) {
        console.error('Could not fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) fetchData();
  }, [user]);

  const downloadReport = async () => {
    if (!clientId) { toast.error('Client ID not found'); return; }
    try {
      const res = await api.get(`/reports/client/${clientId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'my_booking_history.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Report downloaded!');
    } catch {
      toast.error('Failed to download report');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const statusColor = (status) => {
    if (status === 'CONFIRMED') return 'bg-green-900 text-green-300';
    if (status === 'PENDING') return 'bg-yellow-900 text-yellow-300';
    if (status === 'CANCELLED') return 'bg-red-900 text-red-300';
    if (status === 'COMPLETED') return 'bg-blue-900 text-blue-300';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <span className="font-bold text-lg tracking-widest">THE FIFTH RITUAL</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:border-purple-500 transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:border-red-500 transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 space-y-5">

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, <span className="text-purple-400 font-semibold">{user?.name}</span>
          </p>
        </div>

        {/* Upcoming Session */}
        {loading ? (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : upcomingAppointment ? (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full ${statusColor(upcomingAppointment.status)}`}>
                {upcomingAppointment.status}
              </span>
              <span className="text-gray-500 text-xs font-bold tracking-widest">UPCOMING SESSION</span>
            </div>
            <h2 className="text-xl font-bold mb-2 leading-tight">
              {upcomingAppointment.design?.title || 'Custom Session'}
            </h2>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>with {upcomingAppointment.artist?.user?.name || 'Artist'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">DATE</p>
                <p className="text-white font-semibold text-sm">{formatDate(upcomingAppointment.scheduledAt)}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">TIME</p>
                <p className="text-white font-semibold text-sm">{formatTime(upcomingAppointment.scheduledAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/consent-form')}
                className="border border-purple-700 text-purple-400 hover:bg-purple-600 hover:text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                CONSENT FORM
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                VIEW ALL
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
            <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-semibold mb-1">No upcoming sessions</p>
            <p className="text-gray-600 text-sm mb-4">Book your next tattoo appointment</p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest px-6 py-2.5 rounded-xl text-xs transition"
            >
              BOOK NOW
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/booking')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-4 rounded-xl text-xs transition flex flex-col items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            BOOK SESSION
          </button>
          <button
            onClick={() => navigate('/my-appointments')}
            className="bg-gray-900 border border-gray-800 hover:border-purple-500 text-white font-bold tracking-widest py-4 rounded-xl text-xs transition flex flex-col items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            MY BOOKINGS
          </button>
        </div>

        {/* Download Report */}
        <button
          onClick={downloadReport}
          className="w-full border border-purple-700 text-purple-400 hover:bg-purple-600 hover:text-white font-bold tracking-widest py-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          DOWNLOAD BOOKING HISTORY (PDF)
        </button>

        {/* Recent Bookings */}
        {recentAppointments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Bookings</h2>
              <button
                onClick={() => navigate('/my-appointments')}
                className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition"
              >
                VIEW ALL
              </button>
            </div>
            <div className="space-y-0">
              {recentAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {appt.design?.title || 'Custom Session'}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {appt.artist?.user?.name || 'Artist'} — {formatDate(appt.scheduledAt)}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Flash Collection</h2>
            <button
              onClick={() => navigate('/gallery')}
              className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition"
            >
              BROWSE
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              'https://images.unsplash.com/photo-1542856204-00101eb6def4?w=200&q=80',
              'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80',
              'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&q=80',
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around">
        {[
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: 'Home', path: '/dashboard' },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Book', path: '/booking' },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, label: 'Bookings', path: '/my-appointments' },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Gallery', path: '/gallery' },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Profile', path: '/profile' },
        ].map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 text-xs font-bold tracking-widest text-gray-600 hover:text-gray-400 transition">
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}