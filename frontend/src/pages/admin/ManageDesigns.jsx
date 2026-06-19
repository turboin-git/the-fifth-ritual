import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STYLES = ['Fine Line', 'Traditional', 'Blackwork', 'Cyber-Sigilism', 'Geometric', 'Realism', 'Tribal', 'Japanese', 'Minimalist'];

export default function ManageDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    artistId: '', title: '', description: '', style: '', size: '',
    theme: '', price: '', durationHours: '',
  });

  const fetchDesigns = () => {
    setLoading(true);
    api.get('/designs').then(res => setDesigns(res.data)).catch(() => setDesigns([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDesigns();
    api.get('/artists/approved').then(res => setArtists(res.data)).catch(() => setArtists([]));
  }, []);

  const resetForm = () => {
    setFormData({ artistId: '', title: '', description: '', style: '', size: '', theme: '', price: '', durationHours: '' });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (design) => {
    setFormData({
      artistId: design.artist?.id || '',
      title: design.title || '',
      description: design.description || '',
      style: design.style || '',
      size: design.size || '',
      theme: design.theme || '',
      price: design.price || '',
      durationHours: design.durationHours || '',
    });
    setEditingId(design.id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design permanently?')) return;
    try {
      await api.delete(`/designs/${id}`);
      toast.success('Design deleted');
      fetchDesigns();
    } catch (err) {
      toast.error('Failed to delete design');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      if (formData.title) data.append('title', formData.title);
      if (formData.description) data.append('description', formData.description);
      if (formData.style) data.append('style', formData.style);
      if (formData.size) data.append('size', formData.size);
      if (formData.theme) data.append('theme', formData.theme);
      if (formData.price) data.append('price', formData.price);
      if (formData.durationHours) data.append('durationHours', formData.durationHours);
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await api.put(`/designs/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Design updated');
      } else {
        data.append('artistId', formData.artistId);
        await api.post('/designs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Design created');
      }
      resetForm();
      fetchDesigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save design');
    } finally {
      setSaving(false);
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
          <span className="font-bold text-sm tracking-widest">MANAGE DESIGNS</span>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-lg transition"
        >
          + ADD DESIGN
        </button>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-6">Tattoo Designs</h1>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end sm:items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg">{editingId ? 'Edit Design' : 'New Design'}</h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingId && (
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">ARTIST</label>
                    <select
                      required value={formData.artistId}
                      onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select artist</option>
                      {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">TITLE</label>
                  <input
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">STYLE</label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select style</option>
                      {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">SIZE</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="SMALL / MEDIUM / LARGE"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">THEME</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="e.g. Nature, Geometric, Bird"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">PRICE ($)</label>
                    <input
                      type="number" step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">DURATION (HRS)</label>
                    <input
                      type="number" step="0.5"
                      value={formData.durationHours}
                      onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
                    IMAGE {editingId && '(leave blank to keep current)'}
                  </label>
                  <input
                    type="file" accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 file:bg-purple-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:mr-3 file:text-xs file:font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
                >
                  {saving ? 'SAVING...' : editingId ? 'UPDATE DESIGN' : 'CREATE DESIGN'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DESIGNS LIST */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : designs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-20">No designs yet. Add your first one.</p>
        ) : (
          <div className="space-y-3">
            {designs.map((design) => (
              <div key={design.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                  {design.imageUrl && (
                    <img src={design.imageUrl} alt={design.title} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{design.title}</p>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{design.style || 'No style'}</p>
                  <p className="text-purple-400 text-xs font-bold mt-0.5">${design.price} • {design.durationHours}h</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(design)}
                    className="w-9 h-9 rounded-lg border border-gray-700 hover:border-purple-500 flex items-center justify-center text-gray-400 hover:text-purple-400 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="w-9 h-9 rounded-lg border border-gray-700 hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-400 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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