import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ClientDashboard() {
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
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-white">
            Logout
          </button>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome back,</h1>
          <h1 className="text-2xl font-bold text-purple-400">{user?.name} 👋</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/book" className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-4 transition">
            <p className="text-2xl mb-2">📅</p>
            <p className="text-white font-semibold text-sm">Book Appointment</p>
            <p className="text-purple-200 text-xs">Schedule a session</p>
          </Link>
          <Link to="/catalog" className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-4 border border-gray-700 transition">
            <p className="text-2xl mb-2">🎨</p>
            <p className="text-white font-semibold text-sm">Flash Gallery</p>
            <p className="text-gray-400 text-xs">Browse designs</p>
          </Link>
        </div>

        {/* My Appointments */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">My Appointments</h2>
            <span className="text-purple-400 text-xs">View All</span>
          </div>

          <div className="border border-gray-700 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm font-semibold">No upcoming appointments</p>
                <p className="text-gray-400 text-xs mt-1">Book your first session!</p>
              </div>
              <span className="text-2xl">🖋️</span>
            </div>
          </div>

          <Link to="/book"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center transition">
            Book Now →
          </Link>
        </div>

        {/* Recent Designs */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Flash Collection</h2>
            <Link to="/catalog" className="text-purple-400 text-xs">Browse All</Link>
          </div>
          <p className="text-gray-400 text-sm">
            Curated high-contrast designs ready for booking.
          </p>
          <Link to="/catalog"
            className="mt-4 w-full border border-purple-500 text-purple-400 text-sm font-semibold py-3 rounded-xl flex items-center justify-center hover:bg-purple-900 transition">
            View Gallery →
          </Link>
        </div>
      </div>
    </div>
  );
}