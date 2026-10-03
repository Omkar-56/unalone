import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Navigation,
  MapPin,
  Plus,
  SlidersHorizontal,
  Loader2,
  Map,
  LogOut,
  LayoutDashboard,
  Coffee,
  Utensils,
  Trees,
  Dumbbell,
  BookOpen,
  Compass,
  Layers,
  Sparkles,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

import { MAPBOX_TOKEN, FILTERS, CATEGORIES, CATEGORY_ICONS } from '../utils/constants';
import { spotsLeft, formatRelativeTime } from '../utils/helpers';

import PlanDetailSheet from '../components/PlanDetailSheet';
import CreatePlanForm from '../components/CreatePlanForm';
import CreatePlanModal from '../components/CreatePlanModal';
import PlanCard from '../components/PlanCard';

// Available Mapbox Styles
const MAP_STYLES = [
  { id: 'streets', name: 'Streets (POIs)', uri: 'mapbox://styles/mapbox/streets-v12' },
  { id: 'standard', name: 'Standard 3D', uri: 'mapbox://styles/mapbox/standard' },
  { id: 'outdoors', name: 'Outdoors', uri: 'mapbox://styles/mapbox/outdoors-v12' },
  { id: 'dark', name: 'Dark', uri: 'mapbox://styles/mapbox/dark-v11' },
];

// Activity Venue Discovery Categories
const VENUE_FILTERS = [
  { id: 'cafe', label: 'Cafes', icon: Coffee, category: 'coffee' },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils, category: 'food' },
  { id: 'park', label: 'Parks', icon: Trees, category: 'park' },
  { id: 'gym', label: 'Fitness', icon: Dumbbell, category: 'fitness' },
];

export default function ExplorePage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const venueMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const { userLocation, isLoadingLocation, locationError, requestLocation, setManualLocation } =
    useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('streets');
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // Filters
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Venue discovery spots on map
  const [activeVenueType, setActiveVenueType] = useState(null); // 'cafe' | 'restaurant' | 'park' | 'gym' | null
  const [discoveredVenues, setDiscoveredVenues] = useState([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLocation, setCreateLocation] = useState(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Helper function to check if plan belongs to current user
  const isOwnPlan = (plan) => {
    if (!user || !plan?.creator?.id) return false;
    return plan.creator.id === user.id;
  };

  // Fetch nearby plans from API
  const fetchNearbyPlans = useCallback(async (coords = null) => {
    const loc = coords || userLocation;
    if (!loc) return;

    setIsLoadingPlans(true);
    try {
      const response = await API.get('/plans/nearby', {
        params: {
          lat: loc.lat,
          lng: loc.lng,
          radius: 15000,
          filter: activeTimeFilter,
        },
      });

      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [userLocation, activeTimeFilter]);

  // Discover nearby cafes, restaurants, parks using Nominatim/OSM in map view
  const fetchVenuesInView = async (type) => {
    if (!mapRef.current) return;
    setIsLoadingVenues(true);
    try {
      const bounds = mapRef.current.getBounds();
      const minLng = bounds.getWest();
      const maxLng = bounds.getEast();
      const minLat = bounds.getSouth();
      const maxLat = bounds.getNorth();

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        type
      )}&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=10`;

      const res = await fetch(url, { headers: { 'User-Agent': 'Unalone-App' } });
      const data = await res.json();

      const formatted = (data || []).map((d) => ({
        id: d.place_id,
        name: d.name || d.display_name.split(',')[0],
        fullAddress: d.display_name,
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon),
        type,
      }));

      setDiscoveredVenues(formatted);
    } catch (err) {
      console.error('Error discovering venues:', err);
      setDiscoveredVenues([]);
    } finally {
      setIsLoadingVenues(false);
    }
  };

  // Toggle venue discovery on map
  const handleToggleVenueType = (type) => {
    if (activeVenueType === type) {
      setActiveVenueType(null);
      setDiscoveredVenues([]);
    } else {
      setActiveVenueType(type);
      fetchVenuesInView(type);
    }
  };

  // Sync venue markers on map
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !window.mapboxgl) return;

    venueMarkersRef.current.forEach((m) => m.remove());
    venueMarkersRef.current = [];

    if (!activeVenueType || discoveredVenues.length === 0) return;

    discoveredVenues.forEach((venue) => {
      const el = document.createElement('div');
      el.className = 'venue-marker-pin';
      el.innerHTML = `
        <div style="
          background: #1e293b;
          color: white;
          border: 2px solid white;
          border-radius: 20px;
          padding: 4px 9px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          transition: transform 0.15s ease;
        ">
          <span>${activeVenueType === 'cafe' ? '☕' : activeVenueType === 'restaurant' ? '🍽️' : activeVenueType === 'park' ? '🌳' : '💪'}</span>
          <span>${venue.name}</span>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.08)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('click', () => {
        const catMap = { cafe: 'coffee', restaurant: 'food', park: 'park', gym: 'fitness' };
        setCreateLocation({
          lat: venue.lat,
          lng: venue.lng,
          placeName: venue.name,
          suggestedTitle: `Meetup at ${venue.name}`,
          suggestedCategory: catMap[activeVenueType] || 'coffee',
          isSuggestedVenue: true,
        });
        setShowCreateModal(true);
      });

      const marker = new window.mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([venue.lng, venue.lat])
        .addTo(mapRef.current);

      venueMarkersRef.current.push(marker);
    });
  }, [discoveredVenues, activeVenueType, mapLoaded]);

  // Load Mapbox GL JS from CDN
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link');
      link.id = 'mapbox-css';
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize Mapbox Map
  const initMap = useCallback(() => {
    if (!window.mapboxgl || !mapContainerRef.current) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const center = userLocation ? [userLocation.lng, userLocation.lat] : [77.5946, 12.9716];

    const activeStyleObj = MAP_STYLES.find((s) => s.id === currentStyle) || MAP_STYLES[0];

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: activeStyleObj.uri,
      center,
      zoom: userLocation ? 16 : 13,
      pitch: 0,
      antialias: true,
    });

    map.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    // Handle map clicks to create meetups (or inspect clicked POI)
    map.on('click', async (e) => {
      if (
        e.originalEvent.target.closest('.plan-marker-bubble') ||
        e.originalEvent.target.closest('.venue-marker-pin')
      ) {
        return;
      }

      let placeName = 'Selected Location';
      let suggestedCategory = 'coffee';

      // 1. Try to query vector POI clicked by user
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5],
      ];
      const features = map.queryRenderedFeatures(bbox);
      const poi = features.find(
        (f) =>
          f.properties?.name ||
          f.properties?.name_en ||
          f.layer?.id?.includes('poi') ||
          f.properties?.class === 'food_and_drink'
      );

      if (poi && (poi.properties?.name || poi.properties?.name_en)) {
        placeName = poi.properties.name || poi.properties.name_en;
        const cls = poi.properties?.class || poi.properties?.type || '';
        if (cls.includes('food') || cls.includes('restaurant')) suggestedCategory = 'food';
        else if (cls.includes('park') || cls.includes('garden')) suggestedCategory = 'park';
        else if (cls.includes('gym') || cls.includes('fitness') || cls.includes('sport'))
          suggestedCategory = 'fitness';
        else suggestedCategory = 'coffee';
      } else {
        // 2. Fallback to Mapbox Reverse Geocoding API
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await res.json();
          if (data.features?.length > 0) {
            placeName = data.features[0].text || data.features[0].place_name.split(',')[0];
          }
        } catch {
          placeName = 'Selected Spot';
        }
      }

      setCreateLocation({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        placeName,
        suggestedCategory,
        suggestedTitle: `Meetup at ${placeName}`,
      });
      setShowCreateModal(true);
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
      if (userLocation) addUserMarker(userLocation, map);
    });
  }, [userLocation, currentStyle]);

  // User Marker
  const addUserMarker = (loc, map) => {
    if (!window.mapboxgl || !map) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;width:22px;height:22px">
        <div style="position:absolute;inset:0;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 3px 12px rgba(37,99,235,0.4)"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:55px;height:55px;background:rgba(37,99,235,0.15);border-radius:50%;animation:pulseRing 2s ease-out infinite"></div>
      </div>`;

    userMarkerRef.current = new window.mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([loc.lng, loc.lat])
      .setPopup(
        new window.mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
          '<p style="font-size:12px;font-weight:700;color:#1e293b;margin:0;padding:2px 4px">Your Location</p>'
        )
      )
      .addTo(map);
  };

  // Center on user
  const handleRecenter = () => {
    if (!mapRef.current || !userLocation) {
      requestLocation();
      return;
    }
    mapRef.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 16,
      speed: 1.4,
      essential: true,
    });
    addUserMarker(userLocation, mapRef.current);
  };

  // Change Map Style
  const handleStyleChange = (styleObj) => {
    if (!mapRef.current || currentStyle === styleObj.id) return;
    setCurrentStyle(styleObj.id);
    setShowStyleMenu(false);
    mapRef.current.setStyle(styleObj.uri);
    mapRef.current.once('style.load', () => {
      if (userLocation) addUserMarker(userLocation, mapRef.current);
    });
  };

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 16,
      speed: 1.4,
      essential: true,
    });
    addUserMarker(userLocation, mapRef.current);
    fetchNearbyPlans();
  }, [userLocation, mapLoaded, fetchNearbyPlans]);

  // Sync plan markers on map
  useEffect(() => {
    if (!mapRef.current || !window.mapboxgl || !mapLoaded) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    plans.forEach((plan) => {
      const free = spotsLeft(plan);
      const isSelected = selectedPlan && String(selectedPlan.id) === String(plan.id);
      const isOwn = isOwnPlan(plan);

      const el = document.createElement('div');
      el.className = 'plan-marker-bubble';
      el.innerHTML = `
        <div style="
          background: ${isSelected ? '#0f172a' : 'white'};
          color: ${isSelected ? 'white' : '#0f172a'};
          border: 1.5px solid ${isSelected ? '#0f172a' : '#cbd5e1'};
          border-radius: 14px;
          padding: 6px 10px;
          cursor: pointer;
          box-shadow: ${isSelected ? '0 8px 24px rgba(15,23,42,0.3)' : '0 4px 14px rgba(0,0,0,0.08)'};
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transform: ${isSelected ? 'scale(1.08)' : 'scale(1)'};
          transition: all 0.15s ease;
        ">
          <div style="
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: ${isOwn ? '#3b82f6' : free <= 1 ? '#ef4444' : '#10b981'};
          "></div>
          <div style="font-size: 12px; font-weight: 700;">${plan.title}</div>
          <div style="
            font-size: 10px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 8px;
            background: ${isSelected ? 'rgba(255,255,255,0.2)' : free <= 1 ? '#fee2e2' : '#dcfce7'};
            color: ${isSelected ? 'white' : free <= 1 ? '#b91c1c' : '#15803d'};
          ">
            ${free} left
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedPlan(plan);
        mapRef.current?.flyTo({
          center: [plan.location.lng, plan.location.lat],
          zoom: 17,
          speed: 1.2,
        });
      });

      markersRef.current[plan.id] = new window.mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([plan.location.lng, plan.location.lat])
        .addTo(mapRef.current);
    });
  }, [plans, mapLoaded, selectedPlan]);

  // Mapbox Geocoding Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const proximity = userLocation ? `&proximity=${userLocation.lng},${userLocation.lat}` : '';
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${MAPBOX_TOKEN}${proximity}&limit=5`;

      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.features || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select Search Result
  const handleSelectResult = (r) => {
    const [lng, lat] = r.geometry.coordinates;
    const name = r.text || r.place_name.split(',')[0];
    setManualLocation(lat, lng, name);
    setSearchQuery('');
    setSearchResults([]);

    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 16, speed: 1.4 });
    }
    fetchNearbyPlans({ lat, lng });
  };

  // Create Plan Handler
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

      setPlans((prev) => [response.data.plan, ...prev]);
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

  // Join Plan Handler
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

  // Delete Plan Handler
  const deletePlan = async (planId) => {
    const confirmed = window.confirm('Are you sure you want to delete this plan?');
    if (!confirmed) return;

    try {
      await API.delete(`/plans/${planId}`);
      setPlans(plans.filter((p) => String(p.id) !== planId));
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert(error.response?.data?.message || 'Failed to delete plan');
    }
  };

  // Filter plans based on category and time
  const filteredPlans = plans.filter((p) => {
    // Time filter
    const diffHours = (new Date(p.datetime) - Date.now()) / 3600000;
    if (activeTimeFilter === 'today' && diffHours >= 24) return false;
    if (activeTimeFilter === 'soon' && diffHours >= 3) return false;

    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    return true;
  });

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden text-slate-900">
      {/* Top Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 z-30 shadow-xs">
        {/* Brand */}
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          title="Back to Dashboard"
        >
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Map size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight hidden sm:inline">
            Unalone
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-200">
          <button
            onClick={() => navigate('/home')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-900 flex items-center gap-1.5">
            <Compass size={14} />
            <span>Explore Map</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Search Bar with Mapbox Geocoding Autocomplete */}
        <div className="flex-1 relative max-w-md mx-auto">
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 gap-2 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-all">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none min-w-0"
              placeholder="Search address, neighborhood, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <X size={14} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
            {isSearching && <Loader2 size={14} className="text-blue-600 animate-spin" />}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectResult(r)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-left transition-colors"
                >
                  <MapPin size={15} className="text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {r.text || r.place_name.split(',')[0]}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{r.place_name}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">{sidebarOpen ? 'Hide List' : 'Show List'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
              {filteredPlans.length}
            </span>
          </button>

          {/* New Plan Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Plan</span>
          </button>

          {/* User & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside
          className={`flex flex-col bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 ease-in-out z-20 ${
            sidebarOpen ? 'w-full sm:w-80 md:w-96 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Filters Section */}
          <div className="p-3.5 border-b border-slate-100 space-y-2.5 flex-shrink-0">
            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTimeFilter(f.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                    activeTimeFilter === f.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category Quick Selector Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subheader: Meetup Count */}
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
            <span>
              <strong className="text-slate-900">{filteredPlans.length}</strong> meetups in view
            </span>
            <span className="text-[11px] text-slate-400">Click a card to highlight</span>
          </div>

          {/* Plan Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {!userLocation && !isLoadingLocation ? (
              <div className="p-8 text-center">
                <MapPin size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800 mb-1">Location Required</p>
                <p className="text-xs text-slate-500 mb-4">
                  Enable location to find meetups near you
                </p>
                <button
                  onClick={requestLocation}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Enable GPS Location
                </button>
              </div>
            ) : isLoadingPlans ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500">Scanning for meetups…</p>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Compass size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">No meetups match filters</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Click anywhere on the map or pick a nearby cafe to host the first plan!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  Host a Meetup
                </button>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  isOwnPlan={isOwnPlan(plan)}
                  onClick={() => {
                    setSelectedPlan(plan);
                    mapRef.current?.flyTo({
                      center: [plan.location.lng, plan.location.lat],
                      zoom: 17,
                      speed: 1.2,
                    });
                  }}
                />
              ))
            )}
          </div>
        </aside>

        {/* Mapbox Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* FLOATING TOOLBAR 1: Activity Venues Discovery Pills (Cafes, Restaurants, Parks) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-1 hidden md:inline">
              Spotlight:
            </span>
            {VENUE_FILTERS.map((vf) => {
              const Icon = vf.icon;
              const isActive = activeVenueType === vf.id;
              return (
                <button
                  key={vf.id}
                  onClick={() => handleToggleVenueType(vf.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-blue-300' : 'text-slate-600'} />
                  <span>{vf.label}</span>
                  {isActive && isLoadingVenues && (
                    <Loader2 size={11} className="animate-spin text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* FLOATING TOOLBAR 2: Map Style Switcher & Recenter Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Style Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStyleMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Change Map Style"
              >
                <Layers size={14} className="text-slate-600" />
                <span className="capitalize hidden sm:inline">{currentStyle}</span>
              </button>

              {showStyleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-30 divide-y divide-slate-100">
                  {MAP_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style)}
                      className={`w-full px-3 py-2 text-xs font-semibold rounded-lg text-left flex items-center justify-between transition-colors ${
                        currentStyle === style.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{style.name}</span>
                      {currentStyle === style.id && <CheckCircle2 size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recenter / GPS Button */}
            <button
              onClick={handleRecenter}
              className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Locate Me"
            >
              <Navigation size={17} className="text-blue-600" />
            </button>
          </div>

          {/* Quick Map Click Helper Pill at Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl text-xs font-medium flex items-center gap-2 border border-white/10">
              <Sparkles size={14} className="text-blue-400" />
              <span>Click any cafe, restaurant, or spot on the map to host a plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Detail Sheet Drawer */}
      <PlanDetailSheet
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onJoin={handleJoin}
        isOwnPlan={selectedPlan ? isOwnPlan(selectedPlan) : false}
        onDelete={deletePlan}
      />

      {/* Create Plan Modal (triggered by clicking map or venue) */}
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

      {/* Create Plan Form Modal (triggered by header button) */}
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
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        .mapboxgl-ctrl-bottom-right { bottom: 70px !important; right: 14px !important; }
        .mapboxgl-ctrl-group {
          border-radius: 14px !important;
          box-shadow: 0 4px 18px rgba(0,0,0,0.1) !important;
          border: 1px solid #e2e8f0 !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-group button { width: 38px !important; height: 38px !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
