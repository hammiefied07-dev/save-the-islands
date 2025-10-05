import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ExtinctSpecies } from '../services/islandService';

interface AnimatedCreatureProps {
  species: ExtinctSpecies;
}

export default function AnimatedCreature({ species }: AnimatedCreatureProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (species.narration_audio_url) {
      const audioElement = new Audio(species.narration_audio_url);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.remove();
      };
    }
  }, [species.narration_audio_url]);

  const toggleNarration = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const colors = species.animation_config?.colors || ['#3b82f6', '#60a5fa'];
  const creatureTypeIcon = getCreatureIcon(species.type);

  return (
    <div className="fixed bottom-8 right-8 z-30">
      <div className="relative">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl cursor-pointer transform transition-all duration-300 hover:scale-110 animate-float"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
            boxShadow: `0 10px 40px ${colors[0]}40`
          }}
          title={`${species.name} - Click to hear story`}
          onClick={toggleNarration}
        >
          {creatureTypeIcon}
        </div>

        {species.narration_audio_url && (
          <button
            onClick={toggleNarration}
            className="absolute top-0 right-0 bg-slate-900 rounded-full p-2 shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 bg-slate-900/95 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
          <p className="text-white font-semibold text-center text-sm">{species.name}</p>
          {species.scientific_name && (
            <p className="text-slate-400 text-xs text-center italic">{species.scientific_name}</p>
          )}
        </div>
      </div>

      {species.narration_text && !isPlaying && (
        <div className="absolute bottom-full right-0 mb-24 w-80 bg-slate-900/95 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow-2xl">
          <p className="text-slate-300 text-sm leading-relaxed">{species.narration_text}</p>
        </div>
      )}
    </div>
  );
}

function getCreatureIcon(type: string): string {
  switch (type) {
    case 'bird':
      return '🦅';
    case 'marine':
      return '🐋';
    case 'reptile':
      return '🦎';
    case 'mammal':
      return '🦘';
    default:
      return '🌿';
  }
}
