import { useEffect, useRef, useState } from "react";
import { type Ride } from "@shared/schema";
import { loadLeaflet, createMap, addRideMarkers, setMapToUserLocation } from "@/utils/mapHelpers";
import { getCurrentLocation, isGeolocationSupported } from "@/utils/locationHelpers";

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
    const initMap = async () => {
      try {
        await loadLeaflet();
        
        if (!mapRef.current || mapInstanceRef.current) return;

        setIsLoading(false);
        mapInstanceRef.current = createMap(mapRef.current);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
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
    if (!mapInstanceRef.current) return;
    markersRef.current = addRideMarkers(mapInstanceRef.current, rides, onRideSelect, markersRef.current);
  }, [rides, onRideSelect]);

  // Handle geolocation
  const handleFindLocation = async () => {
    if (!isGeolocationSupported()) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      if (mapInstanceRef.current) {
        setMapToUserLocation(mapInstanceRef.current, location.lat, location.lng);
      }
    } catch (error) {
      alert((error as Error)?.message || 'Unable to get your location. Please check your browser settings.');
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

  if (!mapInstanceRef.current) {
    return (
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <i className="fas fa-map text-6xl mb-4 opacity-50"></i>
            <p className="text-lg">Map temporarily unavailable</p>
            <p className="text-sm">Showing ride locations in list view</p>
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
