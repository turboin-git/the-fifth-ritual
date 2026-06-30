import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const imageOverrides = {
  'Serpent & Flora': 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
  'Nexus Frame': 'https://images.unsplash.com/photo-1604374125777-592bb994d27f?w=400&q=80',
  'Iron Swallow': 'https://images.unsplash.com/photo-1541411780127-15d88bd3476d?w=400&q=80',
  'Void Structure': 'https://images.unsplash.com/photo-1604374376934-2df6fad6519b?w=400&q=80',
};

const DEPOSIT_AMOUNT = 50;

const STEPS = ['TYPE', 'ARTIST', 'DATE & TIME', 'DESIGN', 'REVIEW', 'PAYMENT'];

export default function SmartBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [clientId, setClientId] = useState(null);

  const [bookingType, setBookingType] = useState(null); // 'flash' | 'custom'
  const [artists, setArtists] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [redirectingToPay, setRedirectingToPay] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await api.get(`/clients/profile/${user.userId}`);
        setClientId(profileRes.data.clientId);
        setHasConsent(profileRes.data.hasValidConsent);
      } catch {
        toast.error('Could not load your profile.');
      } finally {
        setCheckingConsent(false);
      }
    };
    if (user?.userId) init();
    else setCheckingConsent(false);
  }, [user]);

  useEffect(() => {
    if (step === 2) {
      setLoadingArtists(true);
      api.get('/artists/approved')
        .then(res => setArtists(res.data))
        .catch(() => setArtists([]))
        .finally(() => setLoadingArtists(false));
    }
  }, [step]);

  useEffect(() => {
    if (step === 4 && bookingType === 'flash') {
      setLoadingDesigns(true);
      api.get('/designs')
        .then(res => setDesigns(res.data))
        .catch(() => setDesigns([]))
        .finally(() => setLoadingDesigns(false));
    }
  }, [step, bookingType]);

  useEffect(() => {
    if (selectedDate && selectedArtist) {
      setLoadingSlots(true);
      setSelectedSlot('');
      api.get('/appointments/available-slots', {
        params: { artistId: selectedArtist.id, date: selectedDate }
      })
        .then(res => setAvailableSlots(res.data))
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, selectedArtist]);

  const handleCreateBooking = async () => {
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
      setCreatedAppointment(res.data);
      setStep(6);
      toast.success('Slot reserved! Complete deposit to confirm.');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Booking failed';
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  const handlePayDeposit = async () => {
    setRedirectingToPay(true);
    try {
      const res = await api.post('/payments/khalti/initiate', {
        appointmentId: createdAppointment.id,
        amount: DEPOSIT_AMOUNT,
        type: 'DEPOSIT',
      });
      window.location.href = res.data.paymentUrl;
    } catch {
      toast.error('Could not start payment. Please try again.');
      setRedirectingToPay(false);
    }
  };

  const goBack = () => {
    if (step === 1) navigate('/dashboard');
    else if (step === 4 && bookingType === 'custom') setStep(3); // skip design for custom
    else setStep(step - 1);
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (checkingConsent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-yellow-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-yellow-700">
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-center">Consent Form Required</h1>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-sm leading-relaxed">
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

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={goBack} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-widest">BOOK APPOINTMENT</span>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-2">Smart Booking</h1>
        <p className="text-gray-500 text-sm mb-6">Step {step} of {bookingType === 'custom' ? 5 : 6}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
          <div
            className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / (bookingType === 'custom' ? 5 : 6)) * 100}%` }}
          />
        </div>

        {/* STEP 1 — BOOKING TYPE */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">What type of session?</h2>

            <button
              onClick={() => { setBookingType('flash'); setStep(2); }}
              className="w-full bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-purple-500 text-left transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900 bg-opacity-40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">Flash Design</p>
                  <p className="text-gray-500 text-sm mt-0.5">Choose from our existing tattoo designs catalog</p>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => { setBookingType('custom'); setStep(2); }}
              className="w-full bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-purple-500 text-left transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">Custom Design</p>
                  <p className="text-gray-500 text-sm mt-0.5">Bring your own idea or book a consultation</p>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* STEP 2 — SELECT ARTIST */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-6">Choose your artist</h2>
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
                  onClick={() => { setSelectedArtist(artist); setStep(3); }}
                  className="w-full text-left bg-gray-900 rounded-2xl p-4 border border-gray-800 hover:border-purple-500 transition flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {artist.user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base">{artist.user?.name || 'Artist'}</p>
                    <p className="text-purple-400 text-xs font-bold tracking-widest mt-0.5">
                      {artist.specialization || 'General Artist'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {artist.experienceYears ? `${artist.experienceYears} yrs experience` : 'Resident Artist'}
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

        {/* STEP 3 — DATE & TIME */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-6">Pick a date & time</h2>

            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">SELECT DATE</label>
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
                <label className="text-xs font-bold tracking-widest text-gray-500 block mb-3">AVAILABLE SLOTS</label>
                {loadingSlots ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No slots available for this date. Try another day.</p>
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

            <button
              onClick={() => bookingType === 'custom' ? setStep(5) : setStep(4)}
              disabled={!selectedDate || !selectedSlot}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              {bookingType === 'custom' ? 'SKIP TO REVIEW →' : 'CHOOSE DESIGN →'}
            </button>
          </div>
        )}

        {/* STEP 4 — SELECT DESIGN (flash only) */}
        {step === 4 && bookingType === 'flash' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Choose a design</h2>
            {loadingDesigns ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => { setSelectedDesign(design); setStep(5); }}
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
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{design.title}</p>
                      <p className="text-purple-400 text-xs font-bold mt-0.5">${design.price}</p>
                      <p className="text-gray-600 text-xs">{design.style}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — REVIEW */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Review your booking</h2>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">TYPE</span>
                <span className="font-semibold text-sm capitalize">{bookingType === 'flash' ? 'Flash Design' : 'Custom / Consultation'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">ARTIST</span>
                <span className="font-semibold text-sm">{selectedArtist?.user?.name || 'Artist'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">DATE</span>
                <span className="font-semibold text-sm">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-gray-500 text-xs font-bold tracking-widest">TIME</span>
                <span className="font-semibold text-sm">{selectedSlot}</span>
              </div>
              {selectedDesign && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs font-bold tracking-widest">DESIGN</span>
                  <span className="font-semibold text-sm">{selectedDesign.title}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 block mb-2">NOTES (OPTIONAL)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requests, placement ideas, or questions..."
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            <div className="flex items-start gap-3 bg-purple-600 bg-opacity-10 border border-purple-800 rounded-xl p-4">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-purple-300 text-xs leading-relaxed">
                A ${DEPOSIT_AMOUNT} deposit via Khalti is required to confirm your slot.
              </p>
            </div>

            <button
              onClick={handleCreateBooking}
              disabled={booking}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-4 rounded-xl text-xs transition"
            >
              {booking ? 'RESERVING SLOT...' : 'CONFIRM & PAY DEPOSIT →'}
            </button>
          </div>
        )}

        {/* STEP 6 — PAYMENT */}
        {step === 6 && createdAppointment && (
          <div className="space-y-5">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
              <div className="w-14 h-14 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-1">Slot Reserved!</h2>
              <p className="text-gray-500 text-sm mb-5">
                Booking #{createdAppointment.id} · {selectedDate} at {selectedSlot}
              </p>
              <div className="bg-gray-800 rounded-xl p-4 mb-5">
                <p className="text-gray-500 text-xs font-bold tracking-widest mb-1">DEPOSIT DUE</p>
                <p className="text-3xl font-bold text-purple-400">${DEPOSIT_AMOUNT}</p>
                <p className="text-gray-600 text-xs mt-1">Secured via Khalti</p>
              </div>
              <button
                onClick={handlePayDeposit}
                disabled={redirectingToPay}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold tracking-widest py-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {redirectingToPay ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    REDIRECTING TO KHALTI...
                  </>
                ) : 'PAY DEPOSIT WITH KHALTI →'}
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="w-full mt-3 border border-gray-700 text-gray-400 font-bold tracking-widest py-3 rounded-xl text-xs hover:bg-gray-800 transition"
              >
                PAY LATER — VIEW MY BOOKINGS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}