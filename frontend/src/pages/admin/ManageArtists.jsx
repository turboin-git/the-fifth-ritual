import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const emptyForm = {
  fullName: '', email: '', phone: '', password: '',
  bio: '', specialization: '', experienceYears: ''
};

export default function ManageArtists() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchArtists = () => {
    setLoading(true);
    api.get('/admin/artists')
      .then(res => setArtists(res.data))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArtists(); }, []);

  const openAdd = () => {
    setEditingArtist(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (artist) => {
    setEditingArtist(artist);
    setForm({
      fullName: artist.user?.name || '',
      email: artist.user?.email || '',
      phone: artist.user?.phone || '',
      password: '',
      bio: artist.bio || '',
      specialization: artist.specialization || '',
      experienceYears: artist.experienceYears?.toString() || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (!editingArtist && !form.password) {
      toast.error('Password is required for new artists');
      return;
    }
    setSaving(true);
    try {
      if (editingArtist) {
        await api.put(`/admin/artists/${editingArtist.id}`, form);
        toast.success('Artist updated');
      } else {
        await api.post('/admin/artists', form);
        toast.success('Artist created');
      }
      setShowModal(false);
      fetchArtists();
    } catch {
      toast.error('Failed to save artist');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleApproval = async (artist) => {
    setUpdatingId(artist.id);
    try {
      await api.put(`/admin/artists/${artist.id}/approval`, { isApproved: !artist.isApproved });
      toast.success(artist.isApproved ? 'Artist suspended' : 'Artist approved');
      fetchArtists();
    } catch {
      toast.error('Failed to update artist status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (artist) => {
    if (!window.confirm(`Permanently delete ${artist.user?.name}'s account? This cannot be undone.`)) return;
    setDeletingId(artist.id);
    try {
      await api.delete(`/admin/artists/${artist.id}`);
      toast.success('Artist deleted');
      fetchArtists();
    } catch {
      toast.error('Failed to delete artist');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-sm tracking-widest">MANAGE ARTISTS</span>
        </div>
        <button
          onClick={openAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-xl transition"
        >
          + ADD ARTIST
        </button>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(artist)}
                      className="text-xs font-bold tracking-widest px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
                    >
                      EDIT
                    </button>
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
                    <button
                      onClick={() => handleDelete(artist)}
                      disabled={deletingId === artist.id}
                      className="text-xs font-bold tracking-widest px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition disabled:opacity-50"
                    >
                      {deletingId === artist.id ? '...' : 'DELETE'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">{editingArtist ? 'Edit Artist' : 'Add New Artist'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">FULL NAME *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="Artist full name"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">EMAIL *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="artist@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">PHONE</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="98XXXXXXXX"
                />
              </div>
              {!editingArtist && (
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">PASSWORD *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                    placeholder="Set initial password"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">SPECIALIZATION</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="e.g. Fine Line, Blackwork"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">EXPERIENCE (YEARS)</label>
                <input
                  type="number"
                  value={form.experienceYears}
                  onChange={e => setForm({ ...form, experienceYears: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 block mb-1">BIO</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
                  placeholder="Short bio about the artist..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-700 text-gray-400 font-bold tracking-widest py-3 rounded-xl text-xs hover:bg-gray-800 transition"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition disabled:opacity-50"
              >
                {saving ? 'SAVING...' : editingArtist ? 'SAVE CHANGES' : 'CREATE ARTIST'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}