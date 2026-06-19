import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = () => {
    setLoading(true);
    api.get('/admin/clients')
      .then(res => setClients(res.data))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const openClient = async (client) => {
    setSelectedClient(client);
    setLoadingAppts(true);
    try {
      const res = await api.get(`/appointments/client/${client.id}`);
      setAppointments(res.data);
    } catch {
      setAppointments([]);
    } finally {
      setLoadingAppts(false);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${apptId}/status`, { status: 'CANCELLED' });
      toast.success('Appointment cancelled');
      openClient(selectedClient);
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleDeleteClient = async () => {
    if (!window.confirm(`Permanently delete ${selectedClient.user?.name}'s account? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/clients/${selectedClient.id}`);
      toast.success('Client account deleted');
      setSelectedClient(null);
      fetchClients();
    } catch {
      toast.error('Failed to delete client');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = clients.filter(c =>
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-widest">MANAGE CLIENTS</span>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-6">Clients</h1>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-20">
            {search ? 'No clients match your search.' : 'No clients registered yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => (
              <button
                key={client.id}
                onClick={() => openClient(client)}
                className="w-full bg-gray-900 rounded-2xl border border-gray-800 hover:border-purple-500 p-4 flex items-center gap-4 text-left transition"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-base font-bold flex-shrink-0">
                  {client.user?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{client.user?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs truncate">{client.user?.email}</p>
                  {client.user?.phone && (
                    <p className="text-gray-600 text-xs mt-0.5">{client.user.phone}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-bold tracking-widest px-3 py-1 rounded-full bg-blue-900 text-blue-300">
                    CLIENT
                  </span>
                  <span className="text-gray-600 text-xs">ID #{client.id}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && (
          <p className="text-gray-600 text-xs text-center mt-6">
            {filtered.length} of {clients.length} clients
          </p>
        )}
      </div>

      {/* Client Detail Drawer */}
      {selectedClient && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{selectedClient.user?.name}</h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">EMAIL</span>
                <span className="text-sm text-gray-200">{selectedClient.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">PHONE</span>
                <span className="text-sm text-gray-200">{selectedClient.user?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">CLIENT ID</span>
                <span className="text-sm text-gray-200">#{selectedClient.id}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-3 tracking-widest text-gray-400">BOOKING HISTORY</h3>
            {loadingAppts ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No bookings yet.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {appointments.map((appt) => (
                  <div key={appt.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        with {appt.artist?.user?.name || 'Unknown Artist'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        appt.status === 'CONFIRMED' ? 'bg-green-900 text-green-300' :
                        appt.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                        appt.status === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {appt.status}
                      </span>
                      {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-2 py-1 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-800 pt-5">
              <p className="text-gray-500 text-xs mb-3">Danger Zone — this action cannot be undone.</p>
              <button
                onClick={handleDeleteClient}
                disabled={deleting}
                className="w-full border border-red-800 hover:bg-red-900 hover:bg-opacity-30 text-red-400 font-bold tracking-widest py-3 rounded-xl text-xs transition disabled:opacity-50"
              >
                {deleting ? 'DELETING...' : 'DELETE CLIENT ACCOUNT'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

