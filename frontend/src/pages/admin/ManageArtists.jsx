import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageArtists() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchArtists = () => {
    setLoading(true);
    api.get('/admin/artists').then(res => setArtists(res.data)).catch(() => setArtists([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleToggleApproval = async (artist) => {
    setUpdatingId(artist.id);
    try {
      await api.put(`/admin/artists/${artist.id}/approval`, { isApproved: !artist.isApproved });
      toast.success(artist.isApproved ? 'Artist suspended' : 'Artist approved');
      fetchArtists();
    } catch (err) {
      toast.error('Failed to update artist status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-widest">MANAGE ARTISTS</span>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-6">Artists</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : artists.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-20">No artists registered yet.</p>
        ) : (
          <div className="space-y-3">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-base font-bold flex-shrink-0">
                  {artist.user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{artist.user?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs truncate">{artist.user?.email}</p>
                  <p className="text-purple-400 text-xs font-bold tracking-widest mt-0.5">
                    {artist.specialization || 'No specialization set'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full ${
                    artist.isApproved ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {artist.isApproved ? 'APPROVED' : 'PENDING'}
                  </span>
                  <button
                    onClick={() => handleToggleApproval(artist)}
                    disabled={updatingId === artist.id}
                    className={`text-xs font-bold tracking-widest px-3 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                      artist.isApproved
                        ? 'border-red-700 text-red-400 hover:bg-red-900 hover:bg-opacity-30'
                        : 'border-green-700 text-green-400 hover:bg-green-900 hover:bg-opacity-30'
                    }`}
                  >
                    {updatingId === artist.id ? '...' : artist.isApproved ? 'SUSPEND' : 'APPROVE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}