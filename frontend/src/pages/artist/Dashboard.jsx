import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ArtistDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [stateOfMind, setStateOfMind] = useState({
    cognitive: 'OPTIMAL',
    strain: 'ELEVATED',
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const schedule = [
    {
      time: '10:00', period: 'AM',
      title: 'Geometric Sleeve Continuation',
      client: 'Marcus R.', session: 'Session 3 of 5',
      status: 'IN PROGRESS', statusColor: 'bg-purple-600',
    },
    {
      time: '13:30', period: 'PM',
      title: 'Open Slot',
      client: null, session: '90 MIN',
      status: 'OPEN SLOT', statusColor: 'bg-gray-700',
    },
    {
      time: '16:00', period: 'PM',
      title: 'Custom Lettering Ribs',
      client: 'Sarah J.', session: 'First Session',
      status: 'PREP REQ', statusColor: 'bg-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <span className="font-bold text-lg tracking-wide">The Fifth Ritual</span>
        <button onClick={() => { logout(); navigate('/login'); }}>
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </button>
      </div>

      <div className="px-5 space-y-4">

        {/* Artist Pulse */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">Artist Pulse</h2>
              <p className="text-gray-500 text-xs mt-0.5">Real-time studio telemetry.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1 rounded-full border border-purple-700">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold text-purple-400 tracking-widest">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Session Time', value: formatTime(time), sub: 'CURRENT PIECE', color: 'text-white' },
              { label: 'Revenue', value: '$1.2K', sub: 'TODAY EST.', color: 'text-purple-400' },
              { label: 'Needles', value: '14', sub: 'DEPLETED', color: 'text-white' },
              { label: 'Next Break', value: '15m', sub: 'SCHEDULED', color: 'text-white' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-600 text-xs mt-1 tracking-widest">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Canvas */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Today's Canvas</h2>
            <button className="border border-gray-700 text-xs font-bold tracking-widest text-gray-300 px-3 py-2 rounded-lg hover:border-gray-500 transition">
              VIEW FULL SCHEDULE
            </button>
          </div>

          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="border-l-2 border-purple-600 pl-4 py-1">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-bold">{item.time}</span>
                  <span className="text-gray-500 text-xs">{item.period}</span>
                </div>
                {item.client ? (
                  <>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Client: {item.client} • {item.session}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`${item.statusColor} text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full`}>
                        {item.status}
                      </span>
                      <button className="text-gray-500 hover:text-white transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm font-semibold tracking-widest">
                    {item.status} — {item.session}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AR Stencil Sync */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
          <div className="w-12 h-12 rounded-full border border-purple-700 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <h2 className="font-bold text-lg mb-1">AR Stencil Sync</h2>
          <p className="text-gray-500 text-sm mb-4">Project current design to iPad.</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest py-3 rounded-xl transition text-sm">
            LAUNCH PREVIEW
          </button>
        </div>

        {/* State of Mind */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="font-bold text-base">State of Mind</h2>
          </div>
          <p className="text-gray-500 text-xs mb-4">
            Track physical and mental load to prevent burnout. Your precision depends on it.
          </p>

          {[
            { label: 'Cognitive Focus', value: stateOfMind.cognitive, width: '85%', color: 'bg-purple-500' },
            { label: 'Hand/Back Strain', value: stateOfMind.strain, width: '60%', color: 'bg-yellow-500' },
          ].map((item) => (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-bold tracking-widest text-gray-300">{item.value}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1">
                <div className={`${item.color} h-1 rounded-full`} style={{ width: item.width }} />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="border border-gray-700 text-xs font-bold tracking-widest text-gray-300 py-3 rounded-xl hover:border-gray-500 transition">
              LOG BREAK
            </button>
            <button className="border border-gray-700 text-xs font-bold tracking-widest text-gray-300 py-3 rounded-xl hover:border-gray-500 transition">
              STRETCH PROMPT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}