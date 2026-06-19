import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const clientTabs = [
    { label: 'Studio', icon: '⊞', path: '/dashboard' },
    { label: 'Booking', icon: '📅', path: '/booking' },
    { label: 'Gallery', icon: '🎨', path: '/gallery' },
    { label: 'Care', icon: '🛡', path: '/care' },
  ];

  const artistTabs = [
    { label: 'Studio', icon: '⊞', path: '/artist' },
    { label: 'Booking', icon: '📅', path: '/artist/booking' },
    { label: 'Gallery', icon: '🎨', path: '/artist/gallery' },
    { label: 'Care', icon: '🛡', path: '/care' },
    { label: 'Stock', icon: '📦', path: '/operations' },
  ];

  const adminTabs = [
    { label: 'Studio', icon: '⊞', path: '/admin' },
    { label: 'Booking', icon: '📅', path: '/admin/bookings' },
    { label: 'Gallery', icon: '🎨', path: '/gallery' },
    { label: 'Stock', icon: '📦', path: '/operations' },
  ];

  const tabs =
    user?.role === 'ARTIST'
      ? artistTabs
      : user?.role === 'ADMIN'
      ? adminTabs
      : clientTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 flex justify-around items-center py-2 px-2 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {isActive ? (
              <div className="bg-purple-900 px-4 py-1.5 rounded-xl flex flex-col items-center gap-0.5">
                <span className="text-base">{tab.icon}</span>
                <span className="text-xs font-semibold text-purple-300">
                  {tab.label}
                </span>
              </div>
            ) : (
              <>
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}