import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const pidx = searchParams.get('pidx');
      if (!pidx) {
        setStatus('error');
        return;
      }
      try {
        const res = await api.post('/payments/khalti/verify', { pidx });
        setPayment(res.data);
        if (res.data.status === 'SUCCESS') {
          setStatus('success');
          toast.success('Payment successful!');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        setStatus('error');
        toast.error('Could not verify payment');
      }
    };
    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      {status === 'verifying' && (
        <>
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-gray-400 text-sm">Verifying your payment...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-green-700">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-gray-500 text-sm text-center mb-2">
            Amount paid: <span className="text-purple-400 font-bold">${payment?.amount}</span>
          </p>
          <p className="text-gray-600 text-xs text-center mb-8 max-w-sm">
            Your appointment deposit has been confirmed.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition w-full max-w-sm"
          >
            Back to Dashboard
          </button>
        </>
      )}

      {(status === 'failed' || status === 'error') && (
        <>
          <div className="w-16 h-16 bg-red-600 bg-opacity-20 rounded-full flex items-center justify-center mb-6 border border-red-700">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">Payment Failed</h1>
          <p className="text-gray-500 text-sm text-center mb-8 max-w-sm">
            We couldn't verify your payment. Please try again or contact support.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition w-full max-w-sm"
          >
            Back to Dashboard
          </button>
        </>
      )}

    </div>
  );
}