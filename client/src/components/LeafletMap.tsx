import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

// Riyadh center coordinates
const RIYADH_CENTER: [number, number] = [24.7136, 46.6753];

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function LeafletMap({ onLocationSelect, initialLat, initialLng }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    const center: [number, number] = initialLat && initialLng 
      ? [initialLat, initialLng] 
      : RIYADH_CENTER;

    const map = L.map(containerRef.current).setView(center, 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add initial marker if coordinates provided
    if (initialLat && initialLng) {
      const marker = L.marker([initialLat, initialLng]).addTo(map);
      markerRef.current = marker;
    }

    // Handle map clicks
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      // Add new marker
      const marker = L.marker([lat, lng]).addTo(map);
      markerRef.current = marker;
      
      // Notify parent component
      onLocationSelect(lat, lng);
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [onLocationSelect, initialLat, initialLng]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-border"
      style={{ zIndex: 0 }}
    />
  );
}

