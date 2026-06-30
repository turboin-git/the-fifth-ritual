import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/clients/profile/${user.userId}`);
        const cid = profileRes.data.clientId;
        setClientId(cid);
        const res = await api.get(`/appointments/client/${cid}`);
        setAppointments(res.data.sort((a, b) =>
          new Date(b.scheduledAt) - new Date(a.scheduledAt)
        ));
      } catch {
        toast.error('Could not load appointments');
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) fetchData();
  }, [user]);

  const handleCancel = async (apptId) => {
    if (!window.confirm('Cancel this appointment? This cannot be undone.')) return;
    setCancellingId(apptId);
    try {
      await api.put(`/appointments/${apptId}/status`, { status: 'CANCELLED' });
      toast.success('Appointment cancelled');
      setAppointments(prev =>
        prev.map(a => a.id === apptId ? { ...a, status: 'CANCELLED' } : a)
      );
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
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

  const filters = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const filtered = filter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-sm tracking-widest">MY APPOINTMENTS</span>
        </div>
        <button
          onClick={() => navigate('/booking')}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-xl transition"
        >
          + BOOK
        </button>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-6">My Bookings</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments found.</p>
            {filter === 'ALL' && (
              <button
                onClick={() => navigate('/booking')}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest px-6 py-3 rounded-xl text-xs transition"
              >
                BOOK YOUR FIRST SESSION
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((appt) => (
              <div key={appt.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base">
                      {appt.design?.title || 'Custom Session'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      with {appt.artist?.user?.name || 'Artist'}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${statusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">DATE</p>
                    <p className="text-white text-sm font-semibold">{formatDate(appt.scheduledAt)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">TIME</p>
                    <p className="text-white text-sm font-semibold">{formatTime(appt.scheduledAt)}</p>
                  </div>
                </div>

                {appt.notes && (
                  <div className="bg-gray-800 rounded-xl p-3 mb-4">
                    <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">NOTES</p>
                    <p className="text-gray-300 text-sm">{appt.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">Booking #{appt.id}</span>
                  {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={cancellingId === appt.id}
                      className="text-xs font-bold tracking-widest px-4 py-2 rounded-lg border border-red-800 text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition disabled:opacity-50"
                    >
                      {cancellingId === appt.id ? 'CANCELLING...' : 'CANCEL'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}