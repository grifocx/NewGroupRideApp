import { type Ride } from "@shared/schema";
import { getMarkerColor } from "./rideHelpers";

/**
 * Leaflet global interface
 */
declare global {
  interface Window {
    L: any;
  }
}

/**
 * Load Leaflet CSS and JavaScript
 */
export async function loadLeaflet(): Promise<void> {
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
}

/**
 * Create a map instance
 */
export function createMap(container: HTMLElement, center: [number, number] = [37.7749, -122.4194], zoom: number = 13): any {
  if (!window.L) {
    throw new Error('Leaflet not loaded');
  }

  const map = window.L.map(container).setView(center, zoom);

  // Add OpenStreetMap tile layer
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  return map;
}

/**
 * Create a ride marker
 */
export function createRideMarker(ride: Ride, onRideSelect: (ride: Ride) => void): any {
  if (!window.L || !ride.startLatitude || !ride.startLongitude) {
    return null;
  }

  const lat = parseFloat(ride.startLatitude);
  const lng = parseFloat(ride.startLongitude);
  const color = getMarkerColor(ride.difficulty);

  const marker = window.L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: color,
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  });

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

  return marker;
}

/**
 * Create a user location marker
 */
export function createUserLocationMarker(lat: number, lng: number): any {
  if (!window.L) {
    return null;
  }

  return window.L.circleMarker([lat, lng], {
    radius: 6,
    fillColor: '#0EA5E9',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 1
  }).bindPopup('Your location');
}

/**
 * Add markers for multiple rides
 */
export function addRideMarkers(
  map: any, 
  rides: Ride[], 
  onRideSelect: (ride: Ride) => void,
  existingMarkers: any[] = []
): any[] {
  // Clear existing markers
  existingMarkers.forEach(marker => {
    map.removeLayer(marker);
  });

  // Add new markers
  const newMarkers: any[] = [];
  rides.forEach(ride => {
    const marker = createRideMarker(ride, onRideSelect);
    if (marker) {
      marker.addTo(map);
      newMarkers.push(marker);
    }
  });

  return newMarkers;
}

/**
 * Set map view to user location
 */
export function setMapToUserLocation(map: any, lat: number, lng: number, zoom: number = 15): any {
  if (!map || !window.L) return null;
  
  map.setView([lat, lng], zoom);
  return createUserLocationMarker(lat, lng).addTo(map);
}