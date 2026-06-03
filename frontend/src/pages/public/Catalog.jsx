import { useNavigate } from 'react-router-dom';

const designs = [
  { id: 1, name: 'Serpent & Flora', style: 'FINE LINE', price: '$350', hours: '3 HOURS', emoji: '🌸' },
  { id: 2, name: 'Nexus Frame', style: 'CYBER-SIGILISM', price: '$200', hours: '1.5 HOURS', emoji: '⚡' },
  { id: 3, name: 'Iron Swallow', style: 'TRADITIONAL', price: '$250', hours: '2 HOURS', emoji: '🦅' },
  { id: 4, name: 'Sacred Geometry', style: 'GEOMETRIC', price: '$300', hours: '2.5 HOURS', emoji: '🔷' },
  { id: 5, name: 'Moon Wolf', style: 'REALISM', price: '$450', hours: '4 HOURS', emoji: '🐺' },
  { id: 6, name: 'Lotus Bloom', style: 'FINE LINE', price: '$280', hours: '2 HOURS', emoji: '🪷' },
];

const filters = ['ALL', 'TRADITIONAL', 'CYBER-SIGILISM', 'FINE LINE', 'GEOMETRIC', 'REALISM'];

export default function Catalog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-500 rounded-sm"></div>
          <span className="font-bold">The Fifth Ritual</span>
        </div>
        <button className="text-gray-400">🔔</button>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Flash Collection</h1>
        <p className="text-gray-400 text-sm mb-6">
          Curated high-contrast designs ready for booking.
        </p>

        {/* AR Try-On Button */}
        <div className="flex items-center gap-3 mb-6">
          <button className="bg-gray-800 border border-purple-500 text-purple-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <span>AR</span>
            <span>TRY-ON</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition ${
                f === 'ALL'
                  ? 'bg-white text-black border-white'
                  : 'border-gray-700 text-gray-400 hover:border-purple-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-2 gap-3">
          {designs.map((design) => (
            <div
              key={design.id}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500 transition cursor-pointer"
              onClick={() => navigate('/book')}
            >
              {/* Design Preview */}
              <div className="bg-gray-800 h-36 flex items-center justify-center text-5xl">
                {design.emoji}
              </div>

              {/* Design Info */}
              <div className="p-3">
                <p className="text-white text-sm font-semibold">{design.name}</p>
                <p className="text-gray-500 text-xs mb-2">{design.style}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 text-sm font-bold">{design.price}</span>
                  <span className="text-gray-500 text-xs">{design.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}