import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Island } from '../services/islandService';

interface GlobeComponentProps {
  islands: Island[];
  onIslandClick: (island: Island) => void;
  selectedIslandId: string | null;
}

export default function GlobeComponent({ islands, onIslandClick, selectedIslandId }: GlobeComponentProps) {
  const globeEl = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  const pointsData = islands.map(island => ({
    lat: island.latitude,
    lng: island.longitude,
    size: 0.8,
    color: selectedIslandId === island.id ? '#ef4444' : '#3b82f6',
    label: island.name,
    island: island
  }));

  useEffect(() => {
    if (globeEl.current && isGlobeReady) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 200;
      globeEl.current.controls().maxDistance = 500;
    }
  }, [isGlobeReady]);

  useEffect(() => {
    if (globeEl.current && selectedIslandId && isGlobeReady) {
      const island = islands.find(i => i.id === selectedIslandId);
      if (island) {
        globeEl.current.pointOfView(
          { lat: island.latitude, lng: island.longitude, altitude: 2 },
          1500
        );
      }
    }
  }, [selectedIslandId, islands, isGlobeReady]);

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={pointsData}
        pointAltitude={0.01}
        pointRadius="size"
        pointColor="color"
        pointLabel="label"
        onPointClick={(point: any) => {
          if (point.island) {
            onIslandClick(point.island);
          }
        }}
        onGlobeReady={() => setIsGlobeReady(true)}
        atmosphereColor="#4299e1"
        atmosphereAltitude={0.25}
      />
    </div>
  );
}
