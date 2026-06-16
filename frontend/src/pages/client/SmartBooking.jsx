import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const imageOverrides = {
  'Serpent & Flora': 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
  'Nexus Frame': 'https://images.unsplash.com/photo-1604374125777-592bb994d27f?w=400&q=80',
  'Iron Swallow': 'https://images.unsplash.com/photo-1541411780127-15d88bd3476d?w=400&q=80',
  'Void Structure': 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?w=400&q=80',
};

const ALL_SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export default function SmartBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [clientId, setClientId] = useState(null);

  const [artists, setArtists] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(
    location.state?.designId ? { id: location.state.designId } : null
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  // Check consent form first
  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await api.get(`/clients/profile/${user.userId}`);
        setClientId(profileRes.data.clientId);
        setHasConsent(profileRes.data.hasValidConsent);
      } catch (err) {
        toast.error('Could not load your profile.');
      } finally {
        setCheckingConsent(false);
      }
    };
    if (user?.userId) init();
    else setCheckingConsent(false);
  }, [user]);

  // Load artists for step 1
  useEffect(() => {
    if (step === 1 && hasConsent) {
      setLoadingArtists(true);
      api.get('/artists/approved')
        .then(res => setArtists(res.data))
        .catch(() => setArtists([]))
        .finally(() => setLoadingArtists(false));
    }
  }, [step, hasConsent]);

  // Load designs for step 2
  useEffect(() => {
    if (step === 2) {
      setLoadingDesigns(true);
      api.get('/designs')
        .then(res => setDesigns(res.data))
        .catch(() => setDesigns([]))
        .finally(() => setLoadingDesigns(false));
    }
  }, [step]);

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate && selectedArtist) {
      setLoadingSlots(true);
      setSelectedSlot('');
      api.get('/appointments/available-slots', {
        params: { artistId: selectedArtist.id, date: selectedDate }
      })
        .then(res => setAvailableSlots(res.data))
        .catch(() => setAvailableSlots(ALL_SLOTS))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, selectedArtist]);

  const handleConfirmBooking = async () => {
    setBooking(true);
    try {
      const res = await api.post('/appointments/book', {
        clientId,
        artistId: selectedArtist.id,
        designId: selectedDesign?.id || null,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      });
      setConfirmed(res.data);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Booking failed';
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  // ===== LOADING STATE =====
  if (checkingConsent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ===== CONSENT GATE =====
  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-yellow-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-yellow-700">
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-center">Consent Form Required</h1>
        <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed max-w-sm">
          You must complete the health and consent form before booking an appointment.
        </p>
        <button
          onClick={() => navigate('/consent-form')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition w-full max-w-sm"
        >
          Complete Consent Form →
        </button>
      </div>
    );
  }

  // ===== CONFIRMATION SCREEN =====
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-green-700">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm text-center mb-2 leading-relaxed max-w-sm">
          Your appointment with <span className="text-purple-400 font-semibold">{selectedArtist?.name}</span> is set for
        </p>
        <p className="text-white font-bold mb-8">{selectedDate} at {selectedSlot}</p>
        <p className="text-gray-600 text-xs text-center mb-8 max-w-sm">
          A confirmation email has been sent to you. You can manage this booking from your Dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition w-full max-w-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ===== MAIN WIZARD =====
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <span className="font-bold text-sm tracking-widest">BOOK APPOINTMENT</span>
      </div>

      <div className="px-5">

        <h1 className="text-3xl font-bold mt-2 mb-6">Smart Booking</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {['ARTIST', 'DESIGN', 'DATE & TIME', 'CONFIRM'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={`text-xs font-bold tracking-widest ${
                step === i + 1 ? 'text-white border-b-2 border-purple-500 pb-1' : 'text-gray-600'
              }`}>
                {i + 1}. {label}
              </div>
              {i < 3 && <div className="w-4 h-px bg-gray-700" />}
            </div>
          ))}
        </div>

        {/* STEP 1 — SELECT ARTIST */}
        {step === 1 && (
          <div className="space-y-3">
            {loadingArtists ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : artists.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">No approved artists available yet.</p>
            ) : (
              artists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => { setSelectedArtist(artist); setStep(2); }}
                  className={`w-full text-left bg-gray-900 rounded-2xl p-4 border transition flex items-center gap-4 ${
                    selectedArtist?.id === artist.id ? 'border-purple-500' : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {artist.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base">{artist.name}</p>
                    <p className="text-purple-400 text-xs font-bold tracking-widest mt-0.5">
                      {artist.specialization || 'General Artist'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {artist.experienceYears ? `${artist.experienceYears} years experience` : 'Resident Artist'}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}

        {/* STEP 2 — SELECT DESIGN */}
        {step === 2 && (
          <div>
            <button
              onClick={() => { setSelectedDesign(null); setStep(3); }}
              className="w-full mb-4 border border-gray-700 hover:border-gray-500 text-gray-300 font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              SKIP — CUSTOM DESIGN / CONSULTATION
            </button>
            {loadingDesigns ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => { setSelectedDesign(design); setStep(3); }}
                    className={`text-left rounded-2xl overflow-hidden border transition ${
                      selectedDesign?.id === design.id ? 'border-purple-500' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="aspect-square bg-gray-900">
                      <img
                        src={imageOverrides[design.title] || design.imageUrl}
                        alt={design.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.opacity = '0.2'; }}
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold truncate">{design.title}</p>
                      <p className="text-purple-400 text-xs font-bold">${design.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — DATE & TIME */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
                SELECT DATE
              </label>
              <input
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
                  AVAILABLE TIME SLOTS
                </label>
                {loadingSlots ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No slots available for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl text-sm font-bold transition border ${
                          selectedSlot === slot
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-gray-700 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">
                NOTES (OPTIONAL)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requests or details..."
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!selectedDate || !selectedSlot}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              REVIEW BOOKING →
            </button>
          </div>
        )}

        {/* STEP 4 — CONFIRM */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">ARTIST</span>
                <span className="font-semibold text-sm">{selectedArtist?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">DESIGN</span>
                <span className="font-semibold text-sm">{selectedDesign?.title || 'Custom / Consultation'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">DATE</span>
                <span className="font-semibold text-sm">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs font-bold tracking-widest">TIME</span>
                <span className="font-semibold text-sm">{selectedSlot}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={booking}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              {booking ? 'CONFIRMING...' : 'CONFIRM BOOKING'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}