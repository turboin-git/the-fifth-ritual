import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ConsentForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

 const [formData, setFormData] = useState({
  clientId: '',
  hasAllergies: false,
  allergyDetails: '',
  hasConditions: false,
  conditionsDetails: '',
  legalAgreed: false,
});

// Fetch client profile and check if consent already submitted
useEffect(() => {
  const loadProfile = async () => {
    try {
      const res = await api.get(`/clients/profile/${user.userId}`);
      setFormData(prev => ({ ...prev, clientId: res.data.clientId }));
      if (res.data.hasValidConsent) {
        setSubmitted(true);
      }
    } catch (err) {
      toast.error('Could not load your client profile.');
    } finally {
      setChecking(false);
    }
  };
  if (user?.userId) loadProfile();
  else setChecking(false);
}, [user]);

  const handleSubmit = async () => {
    if (!formData.legalAgreed) {
      toast.error('You must agree to the legal terms to proceed.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/consent-forms/submit', formData);
      setSubmitted(true);
      toast.success('Consent form submitted! You can now book a session.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit consent form';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-green-700">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">Consent Form Complete</h1>
        <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed max-w-sm">
          Your health and consent information is on file. You're all set to book a session.
        </p>
        <button
          onClick={() => navigate('/booking')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition w-full max-w-sm"
        >
          Continue to Booking →
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 text-sm mt-4 hover:text-gray-300 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-widest">CONSENT & HEALTH FORM</span>
      </div>

      <div className="px-5">

        {/* Title */}
        <h1 className="text-3xl font-bold mt-2 mb-2">Health & Consent</h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Before booking your session, please complete this health and consent form.
          This is a one-time requirement and your information is kept confidential.
        </p>

        {/* Prerequisite Notice */}
        <div className="flex items-start gap-3 bg-purple-600 bg-opacity-10 border border-purple-800 rounded-xl p-4 mb-6">
          <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-purple-300 text-xs leading-relaxed">
            This form must be completed before you can book an appointment with any of our artists.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['HEALTH INFO', 'ALLERGIES', 'AGREEMENT'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`text-xs font-bold tracking-widest ${
                step === i + 1 ? 'text-white border-b-2 border-purple-500 pb-1' : 'text-gray-600'
              }`}>
                {i + 1}. {label}
              </div>
              {i < 2 && <div className="w-4 h-px bg-gray-700" />}
            </div>
          ))}
        </div>

        {/* Step 1 - Health Conditions */}
        {step === 1 && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
            <h2 className="font-bold text-lg mb-1">Medical Conditions</h2>
            <p className="text-gray-500 text-xs mb-4">
              Do you have any medical conditions we should be aware of? (e.g. diabetes, heart conditions, blood disorders, epilepsy, pregnancy)
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setFormData({ ...formData, hasConditions: false })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition border ${
                  !formData.hasConditions
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                No
              </button>
              <button
                onClick={() => setFormData({ ...formData, hasConditions: true })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition border ${
                  formData.hasConditions
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                Yes
              </button>
            </div>

            {formData.hasConditions && (
              <textarea
                value={formData.conditionsDetails}
                onChange={(e) => setFormData({ ...formData, conditionsDetails: e.target.value })}
                placeholder="Please describe your condition(s)..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition mt-2"
            >
              CONTINUE →
            </button>
          </div>
        )}

        {/* Step 2 - Allergies */}
        {step === 2 && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
            <h2 className="font-bold text-lg mb-1">Allergies</h2>
            <p className="text-gray-500 text-xs mb-4">
              Do you have any known allergies? (e.g. latex, certain inks, antiseptics, adhesives)
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setFormData({ ...formData, hasAllergies: false })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition border ${
                  !formData.hasAllergies
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                No
              </button>
              <button
                onClick={() => setFormData({ ...formData, hasAllergies: true })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition border ${
                  formData.hasAllergies
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                Yes
              </button>
            </div>

            {formData.hasAllergies && (
              <textarea
                value={formData.allergyDetails}
                onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                placeholder="Please list your allergies..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                BACK
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Legal Agreement */}
        {step === 3 && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
            <h2 className="font-bold text-lg mb-1">Legal Agreement</h2>

            <div className="bg-gray-800 rounded-xl p-4 text-gray-400 text-xs leading-relaxed max-h-48 overflow-y-auto space-y-2">
              <p>
                I confirm that I am at least 18 years of age and am voluntarily choosing
                to receive a tattoo at The Fifth Ritual.
              </p>
              <p>
                I understand that tattooing involves the use of needles and that some
                discomfort, swelling, and redness is normal during the healing process.
              </p>
              <p>
                I confirm that the medical and allergy information I have provided is
                accurate and complete to the best of my knowledge.
              </p>
              <p>
                I release The Fifth Ritual and its artists from liability for any
                complications resulting from inaccurate information provided by me.
              </p>
              <p>
                I agree to follow the aftercare instructions provided by my artist to
                ensure proper healing.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.legalAgreed}
                onChange={(e) => setFormData({ ...formData, legalAgreed: e.target.checked })}
                className="mt-0.5 accent-purple-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-300 text-sm">
                I have read, understood, and agree to the terms above.
              </span>
            </label>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.legalAgreed}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT FORM'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}