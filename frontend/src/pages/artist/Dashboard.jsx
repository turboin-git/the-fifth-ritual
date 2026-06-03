import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ArtistDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-500 rounded-sm"></div>
          <span className="font-bold">The Fifth Ritual</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 text-sm">🔔</button>
          <button
            onClick={handleLogout}
            className="text-gray-400 text-sm hover:text-white"
          >
            Logout
          </button>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Artist Pulse */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-4 border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold text-lg">Artist Pulse</h2>
            <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              LIVE
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-4">Real-time studio telemetry.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-white">04:12</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Session Time</p>
              <p className="text-gray-400 text-xs">CURRENT PIECE</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$1.2K</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Revenue</p>
              <p className="text-gray-400 text-xs">TODAY EST.</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">14</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Needles</p>
              <p className="text-gray-400 text-xs">DEPLETED</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">15m</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Next Break</p>
              <p className="text-gray-400 text-xs">SCHEDULED</p>
            </div>
          </div>
        </div>

        {/* Today's Canvas */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Today's Canvas</h2>
            <button className="border border-gray-600 text-gray-300 text-xs px-3 py-1.5 rounded-lg hover:border-purple-500 transition">
              VIEW FULL SCHEDULE
            </button>
          </div>

          {/* Appointment 1 */}
          <div className="border border-purple-800 rounded-xl p-4 mb-3 bg-gray-800">
            <p className="text-white text-sm font-bold">10:00</p>
            <p className="text-gray-400 text-xs mb-2">AM</p>
            <p className="text-white text-sm font-semibold">Geometric Sleeve Continuation</p>
            <p className="text-gray-400 text-xs mb-3">Client: Marcus R. • Session 3 of 5</p>
            <div className="flex items-center gap-2">
              <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded-full">
                IN PROGRESS
              </span>
              <span className="text-gray-500 text-xs">👁</span>
            </div>
          </div>

          {/* Appointment 2 */}
          <div className="border border-gray-700 rounded-xl p-4 mb-3">
            <p className="text-white text-sm font-bold">14:30</p>
            <p className="text-gray-400 text-xs mb-2">PM</p>
            <p className="text-gray-400 text-xs">OPEN SLOT — 90 MIN</p>
          </div>

          {/* Appointment 3 */}
          <div className="border border-gray-700 rounded-xl p-4">
            <p className="text-white text-sm font-bold">16:00</p>
            <p className="text-gray-400 text-xs mb-2">PM</p>
            <p className="text-white text-sm font-semibold">Custom Lettering Ribs</p>
            <p className="text-gray-400 text-xs">Client: Sarah J. • First Session</p>
          </div>
        </div>

        {/* AR Stencil Sync */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mt-4">
          <h2 className="text-white font-bold mb-1">AR Stencil Sync</h2>
          <p className="text-gray-400 text-xs mb-4">Project current design to iPad</p>
          <button className="border border-purple-500 text-purple-400 text-sm px-4 py-2 rounded-lg hover:bg-purple-900 transition">
            LAUNCH PREVIEW
          </button>
        </div>
      </div>
    </div>
  );
}