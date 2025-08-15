import { useEffect, useRef, useState } from "react";
import { type Ride } from "@shared/schema";
import { loadLeaflet, createMap } from "@/utils/mapHelpers";

interface RideMapProps {
  ride: Ride;
  height?: string;
}

export default function RideMap({ ride, height = "h-64" }: RideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadLeaflet();
        
        if (!mapRef.current || mapInstanceRef.current) return;

        // Check if we have valid coordinates
        if (!ride.startLatitude || !ride.startLongitude) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const lat = parseFloat(ride.startLatitude);
        const lng = parseFloat(ride.startLongitude);

        if (isNaN(lat) || isNaN(lng)) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Create map centered on ride location
        mapInstanceRef.current = createMap(mapRef.current, [lat, lng], 14);

        // Add a marker for the ride start location
        if (window.L) {
          const marker = window.L.marker([lat, lng]).addTo(mapInstanceRef.current);
          marker.bindPopup(`
            <div class="text-center">
              <h4 class="font-bold text-sm mb-1">${ride.title}</h4>
              <p class="text-xs text-gray-600">${ride.startLocation}</p>
            </div>
          `);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading map:', error);
        setHasError(true);
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
  }, [ride.startLatitude, ride.startLongitude, ride.title, ride.startLocation]);

  if (isLoading) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cycle-green mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (hasError || !ride.startLatitude || !ride.startLongitude) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <i className="fas fa-map-marker-alt text-3xl mb-2"></i>
          <p className="text-sm">Map not available</p>
          <p className="text-xs">{ride.startLocation}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} rounded-lg overflow-hidden border border-gray-200`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}