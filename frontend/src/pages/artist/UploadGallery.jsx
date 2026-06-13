import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadGallery() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedStyles, setSelectedStyles] = useState(['Blackwork', 'Dotwork']);
  const [timeLogged, setTimeLogged] = useState('');
  const [needles, setNeedles] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [notes, setNotes] = useState('');

  const styles = ['Fine Line', 'Blackwork', 'Traditional', 'Realism', 'Dotwork', '+ Custom'];

  const toggleStyle = (style) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* Hero Image Upload Area */}
      <div
        className="relative w-full h-72 bg-gray-900 overflow-hidden cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('imageInput').click()}
      >
        {image ? (
          <img src={image} alt="upload" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-700">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">Tap to upload image</p>
          </div>
        )}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-bold">Upload to Gallery</h1>
        <p className="text-gray-500 text-sm -mt-4">
          Document your latest piece for the public portfolio.
        </p>

        {/* Project Title */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
            PROJECT TITLE
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Serpent & Rose"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
            BASE PRICE (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="850"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Style & Technique */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-3">
            STYLE & TECHNIQUE
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  selectedStyles.includes(style)
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Time Logged */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            TIME LOGGED
          </label>
          <input
            type="text"
            value={timeLogged}
            onChange={(e) => setTimeLogged(e.target.value)}
            placeholder="6h 15m"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Needles Used */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            NEEDLES USED
          </label>
          <input
            type="text"
            value={needles}
            onChange={(e) => setNeedles(e.target.value)}
            placeholder="3RL, 5RL, 9M"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Tag Client */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
            TAG CLIENT (OPTIONAL)
          </label>
          <div className="relative">
            <svg className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Search client database..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* Artist Notes */}
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
            ARTIST NOTES
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the concept, placement, or technical challenges..."
            rows={4}
            className="w-full bg-transparent border-0 text-gray-400 text-sm placeholder-gray-700 focus:outline-none resize-none"
          />
        </div>

        {/* Gallery Preview */}
        {(image || title) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold tracking-widest text-gray-500">
                GALLERY PREVIEW
              </label>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>

            <div className="rounded-2xl overflow-hidden relative">
              {image && (
                <img src={image} alt="preview" className="w-full h-64 object-cover" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
                <div className="flex gap-2 mb-2">
                  {selectedStyles.filter(s => s !== '+ Custom').map((style) => (
                    <span
                      key={style}
                      className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide"
                    >
                      {style}
                    </span>
                  ))}
                </div>
                <p className="text-white text-xl font-bold">{title || 'Serpent & Rose'}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeLogged || '6.25h'}
                  </span>
                  <span className="text-white text-sm font-bold">
                    ${price || '850'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button className="w-full text-white font-bold tracking-widest py-4 text-sm border-t border-gray-800 hover:text-purple-400 transition">
            PUBLISH TO PORTFOLIO
          </button>
          <button className="w-full text-gray-500 font-bold tracking-widest py-4 text-sm border-t border-gray-800 hover:text-gray-300 transition">
            SAVE DRAFT
          </button>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-6 py-3 flex justify-around">
        {[
          { label: 'Studio', path: '/artist', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )},
          { label: 'Booking', path: '/booking', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )},
          { label: 'Gallery', path: '/artist/gallery', active: true, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )},
          { label: 'Care', path: '/care', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )},
          { label: 'Stock', path: '/stock', active: false, icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )},
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest transition ${
              item.active ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
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