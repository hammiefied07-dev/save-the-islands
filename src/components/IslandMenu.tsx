import { MapPin } from 'lucide-react';
import { Island } from '../services/islandService';

interface IslandMenuProps {
  islands: Island[];
  selectedIslandId: string | null;
  onIslandSelect: (island: Island) => void;
}

export default function IslandMenu({ islands, selectedIslandId, onIslandSelect }: IslandMenuProps) {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 p-4 w-64 z-10">
      <h3 className="text-slate-100 font-semibold text-lg mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-400" />
        Islands
      </h3>
      <ul className="space-y-2">
        {islands.map((island, index) => (
          <li key={island.id}>
            <button
              onClick={() => onIslandSelect(island)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedIslandId === island.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${
                  selectedIslandId === island.id ? 'text-blue-200' : 'text-slate-500'
                }`}>
                  {index + 1}
                </span>
                <span className="font-medium">{island.name}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
