export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  locality?: string;
  state?: string;
  postalCode?: string;
  country: string;
  displayName: string;
  source: 'gps' | 'ip' | 'manual' | 'default';
  timestamp: number;
}

const LOCATION_STORAGE_KEY = 'shwaas_user_detected_location_v2';

// Default Fallback: Sion, Mumbai 400022
export const DEFAULT_FALLBACK_LOCATION: UserLocation = {
  latitude: 19.0434,
  longitude: 72.8634,
  city: 'Mumbai',
  locality: 'Sion',
  state: 'Maharashtra',
  postalCode: '400022',
  country: 'India',
  displayName: 'Mumbai (Sion 400022)',
  source: 'default',
  timestamp: Date.now(),
};

/**
 * Calculate distance in km between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Reverse geocode latitude and longitude to get accurate city, locality, and state
 */
export async function reverseGeocodeCoords(
  lat: number,
  lon: number
): Promise<{ city: string; locality: string; state: string; postalCode: string; displayName: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Unknown City';
      const locality = data.locality && data.locality !== city ? data.locality : '';
      const state = data.principalSubdivision || '';
      const postalCode = data.postcode || '';
      
      let displayName = city;
      if (locality) {
        displayName = `${locality}, ${city}`;
      } else if (postalCode) {
        displayName = `${city} (${postalCode})`;
      } else if (state && state !== city) {
        displayName = `${city}, ${state}`;
      }

      return { city, locality, state, postalCode, displayName };
    }
  } catch (err) {
    console.warn('Reverse geocode failed:', err);
  }

  return {
    city: 'Current Location',
    locality: '',
    state: '',
    postalCode: '',
    displayName: `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
  };
}

/**
 * Fallback to IP-based Geolocation when browser GPS is denied or unavailable
 */
export async function fetchIpLocation(): Promise<UserLocation | null> {
  // Try BigDataCloud Client IP first (Free, CORS-friendly, zero key)
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const city = data.city || data.locality || data.principalSubdivision || 'Mumbai';
        const locality = data.locality && data.locality !== city ? data.locality : '';
        const state = data.principalSubdivision || '';
        const postalCode = data.postcode || '';
        const country = data.countryName || 'India';

        let displayName = city;
        if (locality) displayName = `${locality}, ${city}`;
        else if (postalCode) displayName = `${city} (${postalCode})`;
        else if (state && state !== city) displayName = `${city}, ${state}`;

        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city,
          locality,
          state,
          postalCode,
          country,
          displayName,
          source: 'ip',
          timestamp: Date.now(),
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud IP lookup failed, trying backup:', err);
  }

  // Backup: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        const city = data.city || 'Mumbai';
        const state = data.region || '';
        const postalCode = data.postal || '';
        const country = data.country || 'India';
        const displayName = postalCode ? `${city} (${postalCode})` : (state ? `${city}, ${state}` : city);

        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city,
          state,
          postalCode,
          country,
          displayName,
          source: 'ip',
          timestamp: Date.now(),
        };
      }
    }
  } catch (err) {
    console.warn('ipwho.is lookup failed:', err);
  }

  return null;
}

/**
 * Detect user location using High-Accuracy GPS first, falling back smoothly to IP Geolocation
 */
export async function detectUserLocation(forceFresh: boolean = false): Promise<UserLocation> {
  // Check cached location if fresh (< 15 mins) and not forced
  if (!forceFresh) {
    const cached = getSavedLocation();
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000 && cached.source !== 'default') {
      return cached;
    }
  }

  // 1. Attempt High-Accuracy Browser Geolocation
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      const geocoded = await reverseGeocodeCoords(latitude, longitude);

      const location: UserLocation = {
        latitude,
        longitude,
        city: geocoded.city,
        locality: geocoded.locality,
        state: geocoded.state,
        postalCode: geocoded.postalCode,
        country: 'India',
        displayName: geocoded.displayName,
        source: 'gps',
        timestamp: Date.now(),
      };

      saveUserLocation(location);
      return location;
    } catch (gpsError) {
      console.warn('Browser GPS acquisition failed or was denied:', gpsError);
    }
  }

  // 2. Fallback to IP Geolocation (automatically works without any permissions prompt)
  const ipLoc = await fetchIpLocation();
  if (ipLoc) {
    saveUserLocation(ipLoc);
    return ipLoc;
  }

  // 3. Fallback to cached or default
  const cached = getSavedLocation();
  if (cached) return cached;

  return DEFAULT_FALLBACK_LOCATION;
}

export function getSavedLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserLocation(location: UserLocation): void {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    // Dispatch custom event so all active components update synchronously
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shwaas_location_updated', { detail: location }));
    }
  } catch (err) {
    console.warn('Failed to save location to localStorage:', err);
  }
}
