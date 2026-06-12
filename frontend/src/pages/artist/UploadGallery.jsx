import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';

import { uploadFile } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import BottomNav from '../../components/layout/BottomNav';

const styles = ['Fine Line', 'Blackwork', 'Traditional', 'Realism', 'Dotwork'];

export default function UploadGallery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [timeLogged, setTimeLogged] = useState('');
  const [needlesUsed, setNeedlesUsed] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleStyle = (style) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleSubmit = async (publish = true) => {
    if (!title) { toast.error('Please enter a project title'); return; }
    if (!image) { toast.error('Please upload an image'); return; }

    setLoading(true);
    try {
      // Upload image first
      const uploadResult = await uploadFile(image, 'design');
      if (uploadResult.error) {
        toast.error(uploadResult.error);
        return;
      }

      // Create design in database
      const formData = new FormData();
      formData.append('artistId', user.userId);
      formData.append('title', title);
      formData.append('style', selectedStyles.join(', '));
      formData.append('description', notes);
      formData.append('image', image);

      await api.post('/designs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(publish ? 'Published to portfolio!' : 'Saved as draft!');
      navigate('/artist');
    } catch (err) {
      toast.error('Failed to upload. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Header showBack={true} />

      <div className="px-4 py-6 max-w-md mx-auto">
        <h1 className="text-white text-3xl font-serif font-bold mb-1">
          Upload to Gallery
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Document your latest piece for the public portfolio.
        </p>

        {/* Image Upload */}
        <div
          className="relative bg-gray-900 rounded-2xl overflow-hidden mb-6 cursor-pointer border-2 border-dashed border-gray-700 hover:border-purple-500 transition"
          onClick={() => document.getElementById('imageInput').click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center">
              <span className="text-4xl mb-3">📸</span>
              <p className="text-gray-400 text-sm">Tap to upload image</p>
              <p className="text-gray-600 text-xs mt-1">JPG, PNG up to 10MB</p>
            </div>
          )}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Project Title */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
            placeholder="Serpent & Rose"
          />
        </div>

        {/* Base Price */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">
            Base Price (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
            placeholder="850"
          />
        </div>

        {/* Style & Technique */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-3">
            Style & Technique
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-xl text-sm border transition ${
                  selectedStyles.includes(style)
                    ? 'bg-white text-black border-white font-semibold'
                    : 'border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {style}
              </button>
            ))}
            <button className="px-4 py-2 rounded-xl text-sm border border-gray-700 text-gray-400">
              + Custom
            </button>
          </div>
        </div>

        {/* Time Logged */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
            ⏱ Time Logged
          </label>
          <input
            type="text"
            value={timeLogged}
            onChange={(e) => setTimeLogged(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
            placeholder="6h 15m"
          />
        </div>

        {/* Needles Used */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
            ✏ Needles Used
          </label>
          <input
            type="text"
            value={needlesUsed}
            onChange={(e) => setNeedlesUsed(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
            placeholder="3RL, 5RL, 9M"
          />
        </div>

        {/* Artist Notes */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">
            Artist Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-transparent text-gray-300 text-sm focus:outline-none h-20 resize-none"
            placeholder="Describe the concept, placement, or technical challenges..."
          />
        </div>

        {/* Gallery Preview */}
        {imagePreview && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                Gallery Preview
              </label>
              <span className="text-gray-500">👁</span>
            </div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black">
                <div className="flex gap-2 mb-1">
                  {selectedStyles.slice(0, 2).map(s => (
                    <span key={s} className="border border-gray-500 text-white text-xs px-2 py-0.5 rounded">
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
                <p className="text-white font-bold">{title || 'Project Title'}</p>
                <div className="flex justify-between mt-1">
                  {timeLogged && (
                    <span className="text-gray-400 text-xs">⏱ {timeLogged}</span>
                  )}
                  {price && (
                    <span className="text-white text-xs">${price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="w-full border border-gray-500 text-white text-sm font-semibold py-3 rounded-xl hover:border-purple-500 transition uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish to Portfolio'}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="w-full border border-gray-700 text-gray-400 text-sm font-semibold py-3 rounded-xl hover:border-gray-500 transition uppercase tracking-wider disabled:opacity-50"
          >
            Save Draft
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}