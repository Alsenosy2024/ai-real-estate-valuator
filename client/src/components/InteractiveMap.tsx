import { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

// Riyadh center coordinates
const RIYADH_CENTER = { lat: 24.7136, lng: 46.6753 };

export default function InteractiveMap({ onLocationSelect, initialLat, initialLng }: InteractiveMapProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const handleMapClick = useCallback((event: any) => {
    if (event.detail?.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      setMarkerPosition({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  // Use Google Maps API key from environment or fallback to demo key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg";

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={markerPosition || RIYADH_CENTER}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          mapId="riyadh-property-map"
        >
          {markerPosition && (
            <AdvancedMarker position={markerPosition} />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

