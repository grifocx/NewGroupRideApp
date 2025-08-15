import { useEffect, useRef, useState } from "react";
import { type Ride } from "@shared/schema";

// Leaflet types and imports
declare global {
  interface Window {
    L: any;
  }
}

interface InteractiveMapProps {
  rides: Ride[];
  selectedRide: Ride | null;
  onRideSelect: (ride: Ride) => void;
}

export default function InteractiveMap({ rides, selectedRide, onRideSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        return new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
    };

    const initMap = async () => {
      await loadLeaflet();
      
      if (!mapRef.current || mapInstanceRef.current) return;

      setIsLoading(false);

      // Initialize map centered on San Francisco
      const map = window.L.map(mapRef.current).setView([37.7749, -122.4194], 13);

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when rides change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    rides.forEach(ride => {
      if (ride.startLatitude && ride.startLongitude) {
        const lat = parseFloat(ride.startLatitude);
        const lng = parseFloat(ride.startLongitude);

        const color = ride.difficulty === 'easy' ? '#16A34A' : 
                     ride.difficulty === 'intermediate' ? '#F97316' : '#EF4444';

        const marker = window.L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold text-cycle-dark">${ride.title}</h4>
            <p class="text-sm text-cycle-gray mt-1">${ride.startLocation}</p>
            <button class="mt-2 text-cycle-green text-sm font-medium">View Details</button>
          </div>
        `);

        marker.on('click', () => {
          onRideSelect(ride);
        });

        markersRef.current.push(marker);
      }
    });
  }, [rides, onRideSelect]);

  // Handle geolocation
  const handleFindLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setUserLocation({ lat, lng });

          if (mapInstanceRef.current && window.L) {
            mapInstanceRef.current.setView([lat, lng], 15);
            
            // Add user location marker
            window.L.circleMarker([lat, lng], {
              radius: 6,
              fillColor: '#0EA5E9',
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 1
            }).addTo(mapInstanceRef.current)
            .bindPopup('Your location');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cycle-green mx-auto mb-4"></div>
            <p className="text-cycle-gray">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full bg-gray-100" data-testid="map-container" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button 
          onClick={handleFindLocation}
          className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          title="Find my location"
          data-testid="button-find-location"
        >
          <i className="fas fa-location-arrow text-cycle-blue"></i>
        </button>
        <button 
          className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          title="Toggle map layers"
          data-testid="button-toggle-layers"
        >
          <i className="fas fa-layer-group text-cycle-gray"></i>
        </button>
      </div>
    </div>
  );
}
