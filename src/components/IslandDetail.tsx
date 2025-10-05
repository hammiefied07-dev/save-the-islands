import { X, Info, TreePine, Globe2, History, Users } from 'lucide-react';
import { Island, ExtinctSpecies } from '../services/islandService';
import { useState } from 'react';

interface IslandDetailProps {
  island: Island;
  species: ExtinctSpecies[];
  onClose: () => void;
}

export default function IslandDetail({ island, species, onClose }: IslandDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'species'>('overview');

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      {island.background_video_url ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={island.background_video_url} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/50">
          <div className="sticky top-0 bg-slate-900/98 border-b border-slate-700/50 rounded-t-3xl z-10">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-4xl font-bold text-white">{island.name}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 px-6 pb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('species')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'species'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Extinct Species ({species.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {island.climate && (
                  <Section icon={<Info />} title="Climate" content={island.climate} />
                )}
                {island.terrain && (
                  <Section icon={<TreePine />} title="Terrain" content={island.terrain} />
                )}
                {island.biodiversity && (
                  <Section icon={<Globe2 />} title="Biodiversity" content={island.biodiversity} />
                )}
                {island.history && (
                  <Section icon={<History />} title="History" content={island.history} />
                )}
                {island.cultural_significance && (
                  <Section icon={<Users />} title="Cultural Significance" content={island.cultural_significance} />
                )}
              </div>
            )}

            {activeTab === 'species' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {species.map(sp => (
                  <SpeciesCard key={sp.id} species={sp} />
                ))}
                {species.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-400">
                    No extinct species data available for this island yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-blue-400">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}

function SpeciesCard({ species }: { species: ExtinctSpecies }) {
  return (
    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{species.name}</h4>
          {species.scientific_name && (
            <p className="text-sm italic text-slate-400">{species.scientific_name}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          species.type === 'bird' ? 'bg-sky-900/50 text-sky-300' :
          species.type === 'marine' ? 'bg-cyan-900/50 text-cyan-300' :
          species.type === 'reptile' ? 'bg-emerald-900/50 text-emerald-300' :
          'bg-amber-900/50 text-amber-300'
        }`}>
          {species.type}
        </span>
      </div>

      {species.description && (
        <p className="text-slate-300 text-sm mb-3">{species.description}</p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        {species.extinction_year && (
          <span className="bg-slate-900/50 px-2 py-1 rounded">
            Extinct: {species.extinction_year}
          </span>
        )}
        {species.wikipedia_url && (
          <a
            href={species.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded hover:bg-blue-800/40 transition-colors"
          >
            Wikipedia
          </a>
        )}
      </div>
    </div>
  );
}
