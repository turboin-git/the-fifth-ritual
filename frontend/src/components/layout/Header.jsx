import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ showBack = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-black sticky top-0 z-50">
      
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition mr-1"
          >
            ←
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-600 rounded-sm"></div>
          <span className="text-white font-bold text-lg tracking-wide">
            The Fifth Ritual
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="text-gray-400 hover:text-white transition text-xl">
          🔔
        </button>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="text-gray-500 text-xs hover:text-white transition"
          >
            Logout
          </button>
        )}

        {/* Avatar */}
        {user && (
          <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}