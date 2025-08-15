interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }
    
    const results = await response.json();
    
    if (results && results.length > 0) {
      const first = results[0];
      return {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
        displayName: first.display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    
    if (!response.ok) {
      throw new Error("Reverse geocoding request failed");
    }
    
    const result = await response.json();
    
    if (result && result.display_name) {
      return result.display_name;
    }
    
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

// Search for places as user types (autocomplete)
export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  if (query.length < 3) return [];
  
  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error("Place search request failed");
    }
    
    const results = await response.json();
    
    return results.map((result: any) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    }));
  } catch (error) {
    console.error("Place search error:", error);
    return [];
  }
}
