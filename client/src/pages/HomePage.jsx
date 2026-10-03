import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Map,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  Trash2,
  CheckCircle2,
  LogOut,
  Loader2,
  Sparkles,
  Compass,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import API from '../api/axios';
import { CATEGORY_ICONS } from '../utils/constants';
import { formatRelativeTime, spotsLeft } from '../utils/helpers';
import CreatePlanForm from '../components/CreatePlanForm';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { userLocation, isLoadingLocation, requestLocation } = useLocation();
  const navigate = useNavigate();

  // State
  const [dashboardData, setDashboardData] = useState({
    stats: { activeCreated: 0, activeJoined: 0, totalPlans: 0, connections: 0 },
    createdPlans: [],
    joinedPlans: [],
  });
  const [nearbyPlans, setNearbyPlans] = useState([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'hosted' | 'joined'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Fetch user dashboard data from backend
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await API.get('/plans/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  // Fetch nearby plans using user location
  const fetchNearby = useCallback(async () => {
    if (!userLocation?.lat || !userLocation?.lng) return;
    setIsLoadingNearby(true);
    try {
      const res = await API.get('/plans/nearby', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 15000,
          filter: 'all',
        },
      });
      setNearbyPlans(res.data?.plans || []);
    } catch (err) {
      console.error('Failed to load nearby plans:', err);
    } finally {
      setIsLoadingNearby(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (userLocation) {
      fetchNearby();
    }
  }, [userLocation, fetchNearby]);

  // Create Plan Handler
  const handleCreatePlan = async (planData) => {
    setIsSubmittingPlan(true);
    try {
      await API.post('/plans/create', {
        title: planData.title,
        description: planData.description,
        category: planData.category,
        lat: planData.location.lat,
        lng: planData.location.lng,
        placeName: planData.location.placeName || 'Selected Location',
        datetime: new Date(planData.datetime).toISOString(),
        maxParticipants: planData.maxParticipants,
      });

      setShowCreateForm(false);
      setNotification({ type: 'success', message: 'Meetup plan created successfully!' });
      setActiveTab('hosted');
      fetchDashboard();
      if (userLocation) fetchNearby();
    } catch (err) {
      console.error('Create plan error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create plan. Please try again.',
      });
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  // Delete Plan Handler
  const handleDeletePlan = async (planId) => {
    const ok = window.confirm('Are you sure you want to delete this plan?');
    if (!ok) return;

    setActionLoadingId(planId);
    try {
      await API.delete(`/plans/${planId}`);
      setNotification({ type: 'success', message: 'Plan deleted successfully.' });
      fetchDashboard();
      if (userLocation) fetchNearby();
    } catch (err) {
      console.error('Delete error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete plan.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Join Plan Handler
  const handleJoinPlan = async (planId) => {
    setActionLoadingId(planId);
    try {
      await API.post(`/plans/${planId}/join`);
      setNotification({ type: 'success', message: 'Successfully joined meetup!' });
      fetchDashboard();
      if (userLocation) fetchNearby();
    } catch (err) {
      console.error('Join error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to join plan.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Leave Plan Handler
  const handleLeavePlan = async (planId) => {
    const ok = window.confirm('Leave this meetup?');
    if (!ok) return;

    setActionLoadingId(planId);
    try {
      await API.post(`/plans/${planId}/leave`);
      setNotification({ type: 'success', message: 'You left the plan.' });
      fetchDashboard();
      if (userLocation) fetchNearby();
    } catch (err) {
      console.error('Leave error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to leave plan.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter plans based on search
  const filterList = (list) => {
    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.location?.placeName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  };

  const visibleNearby = filterList(nearbyPlans);
  const visibleHosted = filterList(dashboardData.createdPlans || []);
  const visibleJoined = filterList(dashboardData.joinedPlans || []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce sm:animate-none">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <div
                onClick={() => navigate('/home')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Map size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">Unalone</span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={() => navigate('/home')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-900"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Compass size={15} />
                  Explore Map
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </nav>
            </div>

            {/* Actions & User Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs hover:shadow"
              >
                <Plus size={16} />
                <span>Host Meetup</span>
              </button>

              <button
                onClick={() => navigate('/explore')}
                className="flex sm:hidden items-center justify-center w-9 h-9 bg-slate-900 text-white rounded-xl"
                title="Explore Map"
              >
                <Compass size={18} />
              </button>

              {/* User profile pill */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {initials}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || 'Explorer'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {user?.email}
                  </p>
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
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200">
                <Sparkles size={13} className="text-blue-300" />
                Live Real-Time Meetups
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Connect locally for coffee, outdoor runs, study sessions, or dinners. See what is
                happening around you or start your own meetup.
              </p>

              {/* Location Badge */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
                <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                {isLoadingLocation ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Detecting location...
                  </span>
                ) : userLocation ? (
                  <span>
                    Location active ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})
                  </span>
                ) : (
                  <button
                    onClick={requestLocation}
                    className="underline text-blue-300 hover:text-blue-200 font-medium"
                  >
                    Enable GPS to find nearest meetups
                  </button>
                )}
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="flex-1 sm:flex-none px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Compass size={16} />
                Explore Map
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex-1 sm:flex-none px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Host a Plan
              </button>
            </div>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">Active Plans</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoadingDashboard ? (
                <Loader2 size={20} className="animate-spin text-slate-400" />
              ) : (
                dashboardData.stats?.activeCreated || 0
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Meetups hosted by you</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">Meetups Joined</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoadingDashboard ? (
                <Loader2 size={20} className="animate-spin text-slate-400" />
              ) : (
                dashboardData.stats?.activeJoined || 0
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Upcoming attendances</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">Connections</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoadingDashboard ? (
                <Loader2 size={20} className="animate-spin text-slate-400" />
              ) : (
                dashboardData.stats?.connections || 0
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">People met in meetups</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">Nearby Right Now</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Compass size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoadingNearby ? (
                <Loader2 size={20} className="animate-spin text-slate-400" />
              ) : (
                nearbyPlans.length
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Within your current radius</p>
          </div>
        </div>

        {/* Section Tabs & Search Filter */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Bar inside Card */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('nearby')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'nearby'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Happening Nearby</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {nearbyPlans.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('hosted')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'hosted'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Hosted by Me</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {dashboardData.createdPlans?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('joined')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'joined'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Joined Meetups</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {dashboardData.joinedPlans?.length || 0}
                </span>
              </button>
            </div>

            {/* Search Input & Refresh Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by title, place, category..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                onClick={() => {
                  fetchDashboard();
                  if (userLocation) fetchNearby();
                }}
                title="Refresh Data"
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Tab 1: Happening Nearby */}
          {activeTab === 'nearby' && (
            <div className="p-4 sm:p-6">
              {isLoadingNearby ? (
                <div className="py-16 text-center">
                  <Loader2 size={28} className="animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Searching plans around your area...</p>
                </div>
              ) : visibleNearby.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleNearby.map(plan => {
                    const CategoryIcon =
                      CATEGORY_ICONS[plan.category] || CATEGORY_ICONS.default;
                    const freeSpots = spotsLeft(plan);
                    const isOwn = plan.creator?.id === user?.id;

                    return (
                      <div
                        key={plan.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Row: Category, Distance & Spots */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CategoryIcon size={16} />
                              </div>
                              <span className="text-xs font-semibold capitalize text-slate-600">
                                {plan.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {plan.distance !== undefined && (
                                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {plan.distance} km away
                                </span>
                              )}
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  freeSpots <= 1
                                    ? 'bg-red-50 text-red-600'
                                    : freeSpots <= 3
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {freeSpots > 0 ? `${freeSpots} left` : 'Full'}
                              </span>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                            {plan.title}
                          </h3>
                          {plan.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                              {plan.description}
                            </p>
                          )}

                          {/* Location & Time */}
                          <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {plan.location?.placeName || 'Location'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400 flex-shrink-0" />
                              <span>{formatRelativeTime(plan.datetime)}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">
                                {new Date(plan.datetime).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Creator info & Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                              {plan.creator?.initials || 'U'}
                            </div>
                            <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                              {isOwn ? 'You' : plan.creator?.name || 'Local'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => navigate('/explore')}
                              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              Map
                            </button>

                            {isOwn ? (
                              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                                Your Plan
                              </span>
                            ) : plan.hasJoined ? (
                              <button
                                onClick={() => handleLeavePlan(plan.id)}
                                disabled={actionLoadingId === plan.id}
                                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 font-semibold text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                              >
                                {actionLoadingId === plan.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  'Joined'
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleJoinPlan(plan.id)}
                                disabled={actionLoadingId === plan.id || freeSpots <= 0}
                                className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                              >
                                {actionLoadingId === plan.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  'Join'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Compass size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No meetups nearby right now
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Be the first to create a spontaneous plan in your neighborhood! You can host a
                    coffee chat, run, or co-work session.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Host the First Meetup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Hosted by Me */}
          {activeTab === 'hosted' && (
            <div className="p-4 sm:p-6">
              {isLoadingDashboard ? (
                <div className="py-16 text-center">
                  <Loader2 size={28} className="animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Loading your plans...</p>
                </div>
              ) : visibleHosted.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleHosted.map(plan => {
                    const CategoryIcon =
                      CATEGORY_ICONS[plan.category] || CATEGORY_ICONS.default;
                    const isUpcoming = plan.status === 'upcoming';

                    return (
                      <div
                        key={plan.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CategoryIcon size={16} />
                              </div>
                              <span className="text-xs font-semibold capitalize text-slate-600">
                                {plan.category}
                              </span>
                            </div>

                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isUpcoming
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                            {plan.title}
                          </h3>
                          {plan.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                              {plan.description}
                            </p>
                          )}

                          <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {plan.location?.placeName || 'Location'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400 flex-shrink-0" />
                              <span>
                                {new Date(plan.datetime).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Users size={13} className="text-blue-600 flex-shrink-0" />
                              <span>
                                {plan.participants} / {plan.maxParticipants} participants
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => navigate('/explore')}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            <ExternalLink size={13} />
                            View on Map
                          </button>

                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={actionLoadingId === plan.id}
                            className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            {actionLoadingId === plan.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <>
                                <Trash2 size={13} />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    You haven't hosted any plans yet
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Have an idea for a meetup? Click below to pick a venue and invite locals.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Create Your First Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Joined Meetups */}
          {activeTab === 'joined' && (
            <div className="p-4 sm:p-6">
              {isLoadingDashboard ? (
                <div className="py-16 text-center">
                  <Loader2 size={28} className="animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Loading joined plans...</p>
                </div>
              ) : visibleJoined.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleJoined.map(plan => {
                    const CategoryIcon =
                      CATEGORY_ICONS[plan.category] || CATEGORY_ICONS.default;
                    const isUpcoming = plan.status === 'upcoming';

                    return (
                      <div
                        key={plan.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CategoryIcon size={16} />
                              </div>
                              <span className="text-xs font-semibold capitalize text-slate-600">
                                {plan.category}
                              </span>
                            </div>

                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isUpcoming
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isUpcoming ? 'Attending' : 'Past'}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                            {plan.title}
                          </h3>
                          {plan.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                              {plan.description}
                            </p>
                          )}

                          <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {plan.location?.placeName || 'Location'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400 flex-shrink-0" />
                              <span>
                                {new Date(plan.datetime).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                              {plan.creator?.initials || 'H'}
                            </div>
                            <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                              Host: {plan.creator?.name || 'Local'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => navigate('/explore')}
                              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              Map
                            </button>
                            <button
                              onClick={() => handleLeavePlan(plan.id)}
                              disabled={actionLoadingId === plan.id}
                              className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                              {actionLoadingId === plan.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                'Leave'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserCheck size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No joined meetups yet
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Browse meetups happening around you on the map or in the nearby tab.
                  </p>
                  <button
                    onClick={() => setActiveTab('nearby')}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                  >
                    <Compass size={14} />
                    Explore Nearby Plans
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Plan Form Modal */}
      {showCreateForm && (
        <CreatePlanForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreatePlan}
          isSubmitting={isSubmittingPlan}
        />
      )}
    </div>
  );
}
