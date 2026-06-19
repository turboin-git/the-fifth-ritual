import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ContactMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact/all')
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
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
        <span className="font-bold text-sm tracking-widest">CONTACT MESSAGES</span>
      </div>

      <div className="px-5">
        <h1 className="text-3xl font-bold mt-2 mb-2">Messages</h1>
        <p className="text-gray-500 text-sm mb-6">Inquiries submitted via the Contact page.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-20">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className="w-full bg-gray-900 rounded-2xl border border-gray-800 hover:border-purple-500 p-4 text-left transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm truncate">{msg.name}</p>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-purple-400 text-xs font-bold tracking-widest mb-1">
                      {msg.subject || 'No Subject'}
                    </p>
                    <p className="text-gray-500 text-xs truncate">{msg.message}</p>
                  </div>
                  <p className="text-gray-600 text-xs flex-shrink-0">{formatDate(msg.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-gray-600 text-xs text-center mt-6">
          {messages.length} total message{messages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Message Detail Drawer */}
      {selected && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
         <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg truncate pr-4">{selected.subject || 'No Subject'}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">FROM</span>
                <span className="text-sm text-gray-200">{selected.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">EMAIL</span>
                <span className="text-sm text-gray-200">{selected.email}</span>
              </div>
              {selected.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs font-bold tracking-widest">PHONE</span>
                  <span className="text-sm text-gray-200">{selected.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-bold tracking-widest">DATE</span>
                <span className="text-sm text-gray-200">{formatDate(selected.createdAt)}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-3 tracking-widest text-gray-400">MESSAGE</h3>
            <div className="bg-gray-800 rounded-2xl p-4 mb-5">
              <p className="text-gray-200 text-sm leading-relaxed">{selected.message}</p>
            </div>

            
           <a
             href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Inquiry'}`}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-3 rounded-xl text-xs transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              REPLY VIA EMAIL
            </a>

          </div>
        </div>
      )}

    </div>
  );
}