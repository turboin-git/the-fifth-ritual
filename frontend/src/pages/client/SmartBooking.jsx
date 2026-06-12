import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SmartBooking() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [placement, setPlacement] = useState('');
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const painLevel = placement.toLowerCase().includes('forearm') ? 3
    : placement.toLowerCase().includes('rib') ? 8
    : placement.toLowerCase().includes('spine') ? 9
    : placement.toLowerCase().includes('shoulder') ? 4
    : placement.toLowerCase().includes('thigh') ? 3
    : 5;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
            TF
          </div>
          <span className="font-semibold text-sm tracking-wide">The Fifth Ritual</span>
        </div>
        <button className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      <div className="px-5">

        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 mb-2 leading-tight">Smart Booking</h1>
        <p className="text-gray-400 text-sm mb-6">
          Let our AI match your vision with the perfect artist.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { num: '01', label: 'VISION' },
            { num: '02', label: 'DETAILS' },
            { num: '03', label: 'MATCH' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`text-xs font-bold tracking-widest ${
                step === i + 1 ? 'text-white border-b-2 border-purple-500 pb-1' : 'text-gray-600'
              }`}>
                {s.num}. {s.label}
              </div>
              {i < 2 && <div className="w-6 h-px bg-gray-700" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Vision */}
        {step >= 1 && (
          <div className="bg-gray-900 rounded-2xl p-5 mb-4 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold">Reference Images</h2>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Upload inspiration. Our AI analyzes style, shading, and linework.
            </p>

            {/* Drop Zone */}
            <label
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition mb-4"
            >
              <input type="file" accept="image/*" className="hidden" onChange={handleImageDrop} />
              <svg className="w-8 h-8 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs font-bold tracking-widest text-gray-400">DRAG & DROP OR CLICK</p>
              <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 10MB</p>
            </label>

            {/* Preview */}
            {image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-700">
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Details */}
        <div className="mb-4">
          {/* Placement */}
          <div className="mb-4">
            <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
              PLACEMENT
            </label>
            <input
              type="text"
              value={placement}
              onChange={(e) => { setPlacement(e.target.value); setStep(2); }}
              placeholder="e.g. Inner forearm, left shoulder"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Concept */}
          <div className="mb-5">
            <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
              CONCEPT DESCRIPTION
            </label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Describe your idea briefly..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !placement}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>ANALYZE & MATCH →</>
            )}
          </button>
        </div>

        {/* Pain Estimator */}
        {placement.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-5 mb-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-sm">Pain Estimator</span>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Based on placement ({placement || 'Unknown'}) and estimated duration (3 hrs).
            </p>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xs font-bold tracking-widest text-gray-500">INTENSITY</span>
              <span className="text-3xl font-bold">{painLevel}<span className="text-gray-500 text-lg">/10</span></span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${painLevel * 10}%` }}
              />
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              </div>
              <p className="text-gray-500 text-xs">
                {painLevel <= 4
                  ? `${placement} placements are generally low discomfort. Suitable for longer sessions.`
                  : painLevel <= 7
                  ? `${placement} placements have moderate discomfort. Breaks recommended.`
                  : `${placement} placements are high intensity. Short sessions recommended.`}
              </p>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs font-bold tracking-widest text-gray-500">SYSTEM STATUS</span>
          </div>
          <p className="text-gray-500 text-xs">
            {step === 3
              ? 'Analysis complete. Artist matches ready.'
              : 'Awaiting sufficient reference data to generate artist matches.'}
          </p>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around">
        {[
          { icon: '⊞', label: 'STUDIO', path: '/dashboard' },
          { icon: '📅', label: 'BOOKING', path: '/booking', active: true },
          { icon: '⊞', label: 'GALLERY', path: '/gallery' },
          { icon: '🛡', label: 'CARE', path: '/care' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs font-bold tracking-widest ${
              item.active ? 'text-purple-400' : 'text-gray-600'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
}