import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X, Navigation, MapPin, Plus, SlidersHorizontal, Loader2, Map, LogOut } from 'lucide-react';

import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

import { MAPBOX_TOKEN, FILTERS, } from '../utils/constants';
import { spotsLeft } from '../utils/helpers';

import PlanDetailSheet from '../components/PlanDetailSheet';
import CreatePlanForm from '../components/CreatePlanForm';
import CreatePlanModal from '../components/CreatePlanModal';
import PlanCard from '../components/PlanCard';

// ─── Main ──────────────────────────────────────────────────────
export default function ExplorePage() {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markersRef      = useRef({});
  const userMarkerRef   = useRef(null);

  const { userLocation, isLoadingLocation, locationError, requestLocation, setManualLocation } = useLocation();
  const { user, logout } = useAuth(); // ← Get current user

  const [plans,         setPlans]         = useState([]);
  const [selectedPlan,  setSelectedPlan]  = useState(null);
  const [mapLoaded,     setMapLoaded]     = useState(false);
  const [activeFilter,  setActiveFilter]  = useState('all');
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching,   setIsSearching]   = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [showList,      setShowList]      = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Create plan modal states
  const [showCreateModal, setShowCreateModal] = useState(false); // Map click
  const [showCreateForm, setShowCreateForm] = useState(false);   // Button click
  const [createLocation,  setCreateLocation]  = useState(null);
  const [isCreatingPlan,  setIsCreatingPlan]  = useState(false);

  // Helper function to check if plan belongs to current user
  const isOwnPlan = (plan) => {
    console.log("Current User:", user);
    console.log("Plan:", plan);
    console.log("Creator:", plan.creator);
    console.log("Creator ID:", plan.creator?.id);
    console.log("Creator_id:", plan.creator_id);

    if (!user || !plan?.creator?.id) return false;

    return plan.creator.id === user.id;
  };

  // Fetch nearby plans from API
  const fetchNearbyPlans = async () => {
    if (!userLocation) return;

    setIsLoadingPlans(true);
    try {
      const response = await API.get('/plans/nearby', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 10000,
          filter: activeFilter,
        },
      });

      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Load Mapbox GL JS from CDN
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link');
      link.id   = 'mapbox-css';
      link.rel  = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
      document.head.appendChild(link);
    }

    const script   = document.createElement('script');
    script.src     = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.async   = true;
    script.onload  = initMap;
    document.body.appendChild(script);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  const initMap = useCallback(() => {
    if (!window.mapboxgl || !mapContainerRef.current) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const center = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [77.5946, 12.9716];

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style:     'mapbox://styles/mapbox/standard',
      center,
      zoom:      userLocation ? 17 : 13,
      pitch:     0,
      antialias: true,
      config: {
        basemap: {
          show3dObjects: false,
          showPointOfInterestLabels: true,
          showPlaceLabels: true,
          showRoadLabels: true,
          showTransitLabels: true,
          lightPreset: 'day',
        }
      }
    });

    map.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    // Handle map clicks for creating plans
    map.on('click', async (e) => {
      if (e.originalEvent.target.closest('.plan-marker-bubble')) return;

      let placeName = 'Selected Location';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`
        );
        const data = await response.json();
        if (data.display_name) {
          placeName = data.display_name.split(',')[0];
        }
      } catch (error) {
        console.log('Could not fetch place name');
      }

      setCreateLocation({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        placeName,
      });
      setShowCreateModal(true);
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
      if (userLocation) addUserMarker(userLocation, map);
    });

  }, [userLocation]);

  const addUserMarker = (loc, map) => {
    if (!window.mapboxgl || !map) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;width:20px;height:20px">
        <div style="position:absolute;inset:0;background:#1e293b;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.3)"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;background:rgba(30,41,59,0.12);border-radius:50%;animation:pulseRing 2s ease-out infinite"></div>
      </div>`;

    userMarkerRef.current = new window.mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([loc.lng, loc.lat])
      .setPopup(new window.mapboxgl.Popup({ offset: 16, closeButton: false })
        .setHTML('<p style="font-size:13px;font-weight:600;color:#1e293b;margin:0;padding:2px 0">You are here</p>'))
      .addTo(map);
  };

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 17, speed: 1.4, essential: true });
    addUserMarker(userLocation, mapRef.current);
    fetchNearbyPlans();
  }, [userLocation, mapLoaded]);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyPlans();
    }
  }, [activeFilter]);

  // Sync plan markers
  useEffect(() => {
    if (!mapRef.current || !window.mapboxgl || !mapLoaded) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    plans.forEach(plan => {
      const free = spotsLeft(plan);
      const el   = document.createElement('div');
      el.innerHTML = `
        <div class="plan-marker-bubble" style="
          background:white;
          border:1.5px solid #e2e8f0;
          border-radius:12px;
          padding:6px 11px;
          cursor:pointer;
          box-shadow:0 4px 16px rgba(0,0,0,0.09);
          display:flex;align-items:center;gap:6px;
          white-space:nowrap;
          transition:all 0.15s ease;
        ">
          <div style="font-size:13px;font-weight:600;color:#1e293b;">${plan.title}</div>
          <div style="font-size:11px;font-weight:500;color:${free <= 1 ? '#ef4444' : free <= 3 ? '#d97706' : '#059669'}">${free} left</div>
        </div>`;

      el.addEventListener('click', () => {
        setSelectedPlan(plan);
        mapRef.current?.flyTo({ center: [plan.location.lng, plan.location.lat], zoom: 17, speed: 1.2 });
      });

      markersRef.current[plan.id] = new window.mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([plan.location.lng, plan.location.lat])
        .addTo(mapRef.current);
    });
  }, [plans, mapLoaded]);

  // Highlight selected marker
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const bubble = marker.getElement().querySelector('.plan-marker-bubble');
      if (!bubble) return;
      const sel = selectedPlan && String(selectedPlan.id) === id;
      bubble.style.background  = sel ? '#1e293b' : 'white';
      bubble.style.borderColor = sel ? '#1e293b' : '#e2e8f0';
      bubble.style.transform   = sel ? 'scale(1.08)' : 'scale(1)';
      bubble.style.boxShadow   = sel ? '0 8px 24px rgba(30,41,59,0.25)' : '0 4px 16px rgba(0,0,0,0.09)';
      const title = bubble.querySelector('div:first-child');
      const spots = bubble.querySelector('div:last-child');
      if (title) title.style.color = sel ? 'white' : '#1e293b';
      if (spots) spots.style.color = sel ? 'rgba(255,255,255,0.75)' : (spotsLeft(plans.find(p => String(p.id) === id) || {maxParticipants:10,participants:0}) <= 1 ? '#ef4444' : '#059669');
    });
  }, [selectedPlan, plans]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=4`);
      const data = await res.json();
      setSearchResults(data);
    } catch { /* silent */ }
    finally { setIsSearching(false); }
  };

  const handleSelectResult = (r) => {
    setManualLocation(parseFloat(r.lat), parseFloat(r.lon), r.display_name.split(',')[0]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCreatePlan = async (planData) => {
    setIsCreatingPlan(true);
    try {
      const response = await API.post('/plans/create', {
        title: planData.title,
        description: planData.description,
        category: planData.category,
        lat: planData.location.lat,
        lng: planData.location.lng,
        placeName: planData.location.placeName || 'Selected Location',
        datetime: new Date(planData.datetime).toISOString(),
        maxParticipants: planData.maxParticipants,
      });

      setPlans(prev => [response.data.plan, ...prev]);

      setShowCreateModal(false);
      setShowCreateForm(false);
      setCreateLocation(null);

      setSelectedPlan(response.data.plan);

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [planData.location.lng, planData.location.lat],
          zoom: 17,
          speed: 1.2,
        });
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert(error.response?.data?.message || 'Failed to create plan. Please try again.');
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleJoin = async (planId) => {
    try {
      await API.post(`/plans/${planId}/join`);
      setSelectedPlan(null);
      fetchNearbyPlans();
    } catch (error) {
      console.error('Error joining plan:', error);
      alert(error.response?.data?.message || 'Failed to join plan');
    }
  };

  const filteredPlans = plans.filter(p => {
    const h = (new Date(p.datetime) - Date.now()) / 3600000;
    if (activeFilter === 'today') return h < 24;
    if (activeFilter === 'soon')  return h < 3;
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-30 shadow-sm">
        <div className="flex items-center gap-2.5 mr-1">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Map size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:block tracking-tight">Unalone</span>
        </div>

        <div className="flex-1 relative max-w-sm">
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-2">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
              placeholder="Search a place…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && <button onClick={() => { setSearchQuery(''); setSearchResults([]); }}><X size={13} className="text-gray-400" /></button>}
            {isSearching && <Loader2 size={13} className="text-blue-500 animate-spin" />}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {searchResults.map(r => (
                <button key={r.place_id} onClick={() => handleSelectResult(r)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
                  <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.display_name.split(',')[0]}</p>
                    <p className="text-xs text-gray-400 truncate">{r.display_name.split(',').slice(1, 3).join(',')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setShowList(v => !v)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            <SlidersHorizontal size={14} />List
          </button>

          <button onClick={() => setSidebarOpen(v => !v)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            <SlidersHorizontal size={14} />{sidebarOpen ? 'Hide list' : 'Show list'}
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
            <Plus size={15} /><span className="hidden sm:inline">New Plan</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
            <LogOut size={15} /><span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`hidden sm:flex flex-col bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === f.id ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-900">{filteredPlans.length}</span>{' '}
              plan{filteredPlans.length !== 1 ? 's' : ''} nearby
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!userLocation && !isLoadingLocation ? (
              <div className="p-8 text-center">
                <MapPin size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">Enable location to see plans near you</p>
                <button onClick={requestLocation}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                  Use My Location
                </button>
              </div>
            ) : isLoadingLocation ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="text-gray-300 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Finding your location…</p>
              </div>
            ) : isLoadingPlans ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="text-gray-300 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading plans…</p>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="p-8 text-center">
                <MapPin size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No plans match this filter</p>
              </div>
            ) : (
              filteredPlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  isOwnPlan={isOwnPlan(plan)}
                  onClick={() => {
                    setSelectedPlan(plan);
                    mapRef.current?.flyTo({ center: [plan.location.lng, plan.location.lat], zoom: 17, speed: 1.2 });
                  }}
                />
              ))
            )}
          </div>
        </aside>

        <div className="flex-1 relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {!userLocation && !isLoadingLocation && mapLoaded && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-4 max-w-sm">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Navigation size={18} className="text-slate-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Enable location</p>
                  <p className="text-xs text-gray-400">
                    {locationError ? 'Or search a location above' : 'See plans happening near you'}
                  </p>
                </div>
                {!locationError && (
                  <button onClick={requestLocation}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors flex-shrink-0">
                    Allow
                  </button>
                )}
              </div>
            </div>
          )}

          {userLocation && mapLoaded && (
            <button
              onClick={() => mapRef.current?.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 17, speed: 1.2 })}
              className="absolute bottom-6 right-4 z-20 w-11 h-11 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="My location"
            >
              <Navigation size={17} className="text-slate-700" />
            </button>
          )}
        </div>

        {showList && (
          <div className="sm:hidden absolute inset-0 z-40 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                {FILTERS.map(f => (
                  <button key={f.id} onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeFilter === f.id ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowList(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  isOwnPlan={isOwnPlan(plan)}
                  onClick={() => { setSelectedPlan(plan); setShowList(false); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <PlanDetailSheet
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onJoin={handleJoin}
        isOwnPlan={selectedPlan ? isOwnPlan(selectedPlan) : false}
      />

      {showCreateModal && createLocation && (
        <CreatePlanModal
          location={createLocation}
          onClose={() => {
            setShowCreateModal(false);
            setCreateLocation(null);
          }}
          onSubmit={handleCreatePlan}
          isSubmitting={isCreatingPlan}
        />
      )}

      {showCreateForm && (
        <CreatePlanForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreatePlan}
          isSubmitting={isCreatingPlan}
        />
      )}

      <style>{`
        @keyframes pulseRing {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        .mapboxgl-ctrl-bottom-right { bottom: 70px !important; right: 12px !important; }
        .mapboxgl-ctrl-group {
          border-radius: 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.09) !important;
          border: 1px solid #e2e8f0 !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-group button { width: 36px !important; height: 36px !important; }
        .mapboxgl-popup-content {
          border-radius: 12px !important;
          padding: 8px 14px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
          border: 1px solid #f1f5f9 !important;
        }
        .mapboxgl-popup-tip { border-top-color: white !important; }
      `}</style>
    </div>
  );
}
