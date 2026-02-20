import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, X, Loader } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

// Note: You'll need to include Leaflet CSS in your index.html
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

export default function MapView({ plans = [], onPlanClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  const { 
    userLocation, 
    isLoadingLocation, 
    locationError,
    requestLocation,
  } = useLocation();

  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      initializeMap();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.L) return;

    const defaultCenter = userLocation 
      ? [userLocation.lat, userLocation.lng]
      : [20.5937, 78.9629]; // India center

    const map = window.L.map(mapRef.current).setView(defaultCenter, userLocation ? 13 : 5);

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add user location marker if available
    if (userLocation) {
      addUserMarker(userLocation.lat, userLocation.lng);
    }

    // Add plan markers
    updatePlanMarkers();
  };

  // Update map center when user location changes
  useEffect(() => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
      addUserMarker(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // Update plan markers when plans change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updatePlanMarkers();
    }
  }, [plans]);

  const addUserMarker = (lat, lng) => {
    if (!window.L || !mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    // Custom icon for user location
    const userIcon = window.L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative;">
          <div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    userMarkerRef.current = window.L.marker([lat, lng], { icon: userIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('You are here');
  };

  const updatePlanMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    plans.forEach(plan => {
      if (plan.location?.lat && plan.location?.lng) {
        const planIcon = window.L.divIcon({
          className: 'plan-marker',
          html: `
            <div style="background: white; padding: 8px 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid #3B82F6; cursor: pointer; white-space: nowrap;">
              <div style="font-weight: 600; color: #1F2937; font-size: 14px;">${plan.title}</div>
              <div style="font-size: 12px; color: #6B7280;">${plan.participants || 0}/${plan.maxParticipants || 10} joined</div>
            </div>
          `,
          iconSize: [150, 60],
          iconAnchor: [75, 30],
        });

        const marker = window.L.marker([plan.location.lat, plan.location.lng], { icon: planIcon })
          .addTo(mapInstanceRef.current);

        marker.on('click', () => {
          if (onPlanClick) onPlanClick(plan);
        });

        markersRef.current.push(marker);
      }
    });
  };

  const handleRecenterMap = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Use Nominatim (OpenStreetMap) geocoding service - FREE!
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13);
      addUserMarker(lat, lng);
    }
    
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              placeholder="Search for a location..."
              className="flex-1 ml-3 outline-none text-gray-900 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border-t border-gray-200 max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.display_name.split(',')[0]}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{result.display_name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          )}
        </div>
      </div>

      {/* Location Controls */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Recenter Button */}
        {userLocation && (
          <button
            onClick={handleRecenterMap}
            className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Center on my location"
          >
            <Navigation className="h-5 w-5 text-blue-600" />
          </button>
        )}

        {/* Request Location Button */}
        {!userLocation && !isLoadingLocation && (
          <button
            onClick={() => setShowLocationPrompt(true)}
            className="px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Enable Location</span>
          </button>
        )}

        {isLoadingLocation && (
          <div className="px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center gap-2">
            <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-gray-900">Getting location...</span>
          </div>
        )}
      </div>

      {/* Location Error Message */}
      {locationError && !userLocation && (
        <div className="absolute top-20 left-4 right-4 z-[1000]">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">{locationError}</p>
            <button
              onClick={() => setShowLocationPrompt(true)}
              className="mt-2 text-sm font-medium text-amber-900 underline"
            >
              Search location manually
            </button>
          </div>
        </div>
      )}

      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="absolute inset-0 z-[1001] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enable Location</h3>
                <p className="text-sm text-gray-600">Find plans near you</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              We need your location to show nearby meetup plans. You can also search for a location manually.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  requestLocation();
                  setShowLocationPrompt(false);
                }}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Use My Location
              </button>
              <button
                onClick={() => setShowLocationPrompt(false)}
                className="w-full py-3 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Search Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Leaflet CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .leaflet-container {
          background: #f0f0f0;
        }
        
        .plan-marker,
        .user-location-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
