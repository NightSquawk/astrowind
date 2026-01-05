/**
 * Google Maps - Initialization with Places API and Geocoding
 *
 * Features:
 * - Place search by business name
 * - Address geocoding
 * - Direct coordinate fallback
 * - Custom markers and info windows
 * - Error handling and fallbacks
 * - Analytics tracking
 */

declare global {
  interface Window {
    google: typeof google;
  }
}

interface MapConfig {
  placeName?: string;
  address?: string;
  coordinates?: string;
  zoom: number;
  markerTitle: string;
  showInfoWindow: boolean;
  mapTypeControl: boolean;
  streetViewControl: boolean;
  fullscreenControl: boolean;
}

/**
 * Track map event in Google Analytics
 */
function trackMapEvent(action: string, mapId: string, details?: Record<string, any>) {
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (isDevelopment || typeof window.gtag === 'undefined') {
    console.log('[GoogleMap]', action, { mapId, ...details });
    return;
  }

  window.gtag('event', 'map_interaction', {
    event_category: 'engagement',
    event_label: mapId,
    map_action: action,
    ...details,
  });
}

/**
 * Show error message
 */
function showError(mapId: string, message: string) {
  const errorEl = document.getElementById(`${mapId}-error`);
  const errorMessageEl = document.getElementById(`${mapId}-error-message`);
  const loadingEl = document.getElementById(`${mapId}-loading`);

  if (errorEl && errorMessageEl && loadingEl) {
    errorMessageEl.textContent = message;
    errorEl.classList.remove('hidden');
    loadingEl.classList.add('hidden');
  }

  console.error('[GoogleMap]', message);
  trackMapEvent('error', mapId, { error_message: message });
}

/**
 * Hide loading skeleton and show map
 */
function showMap(mapId: string) {
  const mapEl = document.getElementById(mapId);
  const loadingEl = document.getElementById(`${mapId}-loading`);

  if (mapEl && loadingEl) {
    loadingEl.classList.add('hidden');
    mapEl.classList.remove('opacity-0');
    mapEl.classList.add('opacity-100');
  }
}

/**
 * Create map with marker and info window
 */
function createMap(
  mapId: string,
  location: google.maps.LatLngLiteral,
  config: MapConfig,
  locationName?: string
) {
  const mapEl = document.getElementById(mapId);
  if (!mapEl) return;

  try {
    // Create map
    const map = new google.maps.Map(mapEl, {
      center: location,
      zoom: config.zoom,
      mapTypeControl: config.mapTypeControl,
      streetViewControl: config.streetViewControl,
      fullscreenControl: config.fullscreenControl,
      zoomControl: true,
      gestureHandling: 'cooperative',
    });

    // Create marker
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: config.markerTitle,
      animation: google.maps.Animation.DROP,
    });

    // Create info window
    if (config.showInfoWindow) {
      const infoContent = `
        <div style="padding: 12px; max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${config.markerTitle}
          </h3>
          ${locationName ? `<p style="margin: 0; font-size: 14px; color: #6b7280;">${locationName}</p>` : ''}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;"
          >
            Get Directions
          </a>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        trackMapEvent('info_window_opened', mapId);
      });

      // Auto-open info window
      infoWindow.open(map, marker);
    }

    showMap(mapId);
    trackMapEvent('map_loaded', mapId, {
      location_type: config.placeName ? 'place' : config.address ? 'address' : 'coordinates',
      zoom: config.zoom,
    });
  } catch (error) {
    showError(mapId, `Failed to create map: ${(error as Error).message}`);
  }
}

/**
 * Search for place by name using Places API
 */
async function searchPlace(mapId: string, placeName: string, config: MapConfig): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const service = new google.maps.places.PlacesService(document.createElement('div'));

      const request: google.maps.places.FindPlaceFromQueryRequest = {
        query: placeName,
        fields: ['name', 'geometry', 'formatted_address', 'place_id'],
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
          const place = results[0];
          const location = place.geometry?.location;

          if (location) {
            createMap(
              mapId,
              { lat: location.lat(), lng: location.lng() },
              config,
              place.formatted_address
            );
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          console.warn('[GoogleMap] Place search failed:', status);
          resolve(false);
        }
      });
    } catch (error) {
      console.error('[GoogleMap] Place search error:', error);
      resolve(false);
    }
  });
}

/**
 * Geocode address using Geocoding API
 */
async function geocodeAddress(mapId: string, address: string, config: MapConfig): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;

          createMap(
            mapId,
            { lat: location.lat(), lng: location.lng() },
            config,
            results[0].formatted_address
          );
          resolve(true);
        } else {
          console.warn('[GoogleMap] Geocoding failed:', status);
          resolve(false);
        }
      });
    } catch (error) {
      console.error('[GoogleMap] Geocoding error:', error);
      resolve(false);
    }
  });
}

/**
 * Initialize a single Google Map
 */
async function initGoogleMap(element: HTMLElement) {
  const mapId = element.id;
  if (!mapId) return;

  // Get configuration from data attributes
  const config: MapConfig = {
    placeName: element.dataset.placename,
    address: element.dataset.address,
    coordinates: element.dataset.coordinates,
    zoom: parseInt(element.dataset.zoom || '15', 10),
    markerTitle: element.dataset.markertitle || 'Our Location',
    showInfoWindow: element.dataset.showinfowindow !== 'false',
    mapTypeControl: element.dataset.maptypecontrol === 'true',
    streetViewControl: element.dataset.streetviewcontrol === 'true',
    fullscreenControl: element.dataset.fullscreencontrol !== 'false',
  };

  // Wait for Google Maps API to load
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    // Retry after a delay
    setTimeout(() => initGoogleMap(element), 500);
    return;
  }

  try {
    let success = false;

    // Priority 1: Search by place name
    if (config.placeName) {
      success = await searchPlace(mapId, config.placeName, config);
    }

    // Priority 2: Geocode by address
    if (!success && config.address) {
      success = await geocodeAddress(mapId, config.address, config);
    }

    // Priority 3: Use direct coordinates
    if (!success && config.coordinates) {
      try {
        const coords = JSON.parse(config.coordinates);
        if (coords.lat && coords.lng) {
          createMap(mapId, coords, config);
          success = true;
        }
      } catch (e) {
        console.error('[GoogleMap] Invalid coordinates:', e);
      }
    }

    // If all methods failed
    if (!success) {
      showError(
        mapId,
        'Unable to locate the specified place, address, or coordinates. Please verify the information is correct.'
      );
    }
  } catch (error) {
    showError(mapId, `Map initialization failed: ${(error as Error).message}`);
  }
}

/**
 * Initialize all Google Maps on the page
 */
function initAllGoogleMaps() {
  const maps = document.querySelectorAll<HTMLElement>('.google-map');
  maps.forEach(initGoogleMap);
}

// Initialize after Google Maps API loads
if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
  // API already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllGoogleMaps);
  } else {
    initAllGoogleMaps();
  }
} else {
  // Wait for API to load
  const checkGoogleMaps = setInterval(() => {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      clearInterval(checkGoogleMaps);
      initAllGoogleMaps();
    }
  }, 100);

  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkGoogleMaps);
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('[GoogleMap] Google Maps API failed to load');
    }
  }, 10000);
}

// Re-initialize after Astro view transitions
document.addEventListener('astro:after-swap', () => {
  if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
    initAllGoogleMaps();
  }
});
