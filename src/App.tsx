import { useEffect, useState } from 'react';
import GlobeComponent from './components/Globe';
import IslandMenu from './components/IslandMenu';
import IslandDetail from './components/IslandDetail';
import AnimatedCreature from './components/AnimatedCreature';
import AIChat from './components/AIChat';
import { fetchAllIslands, fetchSpeciesByIsland, Island, ExtinctSpecies } from './services/islandService';
import { Loader2 } from 'lucide-react';

function App() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<ExtinctSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIslands();
  }, []);

  useEffect(() => {
    if (selectedIsland) {
      loadSpecies(selectedIsland.id);
    }
  }, [selectedIsland]);

  const loadIslands = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllIslands();
      setIslands(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load islands:', err);
      setError('Failed to load islands. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecies = async (islandId: string) => {
    try {
      const data = await fetchSpeciesByIsland(islandId);
      setSelectedSpecies(data);
    } catch (err) {
      console.error('Failed to load species:', err);
      setSelectedSpecies([]);
    }
  };

  const handleIslandSelect = (island: Island) => {
    setSelectedIsland(island);
  };

  const handleCloseDetail = () => {
    setSelectedIsland(null);
    setSelectedSpecies([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Islands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={loadIslands}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {!selectedIsland && islands.length > 0 && (
        <>
          <div className="fixed inset-0">
            <GlobeComponent
              islands={islands}
              onIslandClick={handleIslandSelect}
              selectedIslandId={selectedIsland?.id || null}
            />
          </div>

          <IslandMenu
            islands={islands}
            selectedIslandId={selectedIsland?.id || null}
            onIslandSelect={handleIslandSelect}
          />

          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-2xl">
              Extinct Species Islands
            </h1>
            <p className="text-slate-300 text-center mt-2 text-lg">
              Explore seven islands and their lost species
            </p>
          </div>
        </>
      )}

      {selectedIsland && (
        <>
          <IslandDetail
            island={selectedIsland}
            species={selectedSpecies}
            onClose={handleCloseDetail}
          />

          {selectedSpecies.length > 0 && (
            <AnimatedCreature species={selectedSpecies[0]} />
          )}
        </>
      )}

      <AIChat
        currentIslandId={selectedIsland?.id || null}
        currentIslandName={selectedIsland?.name || null}
      />
    </div>
  );
}

export default App;
