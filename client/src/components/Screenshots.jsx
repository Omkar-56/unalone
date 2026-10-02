import React, { useState } from 'react';
import {
  MapPin,
  Coffee,
  Trees,
  Utensils,
  Dumbbell,
  Users,
  Clock,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function Screenshots() {
  const [activeTab, setActiveTab] = useState('explore');

  const tabs = [
    {
      id: 'explore',
      label: 'Explore Map',
      description: 'Discover active hangouts and meetups around your current location.',
      badge: 'Live Map',
    },
    {
      id: 'create',
      label: 'Create Meetup',
      description: 'Pin a spot, set the capacity, and invite locals in just a few clicks.',
      badge: 'Quick Post',
    },
    {
      id: 'details',
      label: 'Plan & Join',
      description: 'Check attendee spots, host details, and join plans instantly.',
      badge: 'Community',
    },
  ];

  return (
    <section id="screenshots" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers size={14} />
            Product Showcase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            See Unalone in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A frictionless interface designed for instant discovery and real-world connection.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-slate-800 text-blue-300' : 'bg-white text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* App Frame Showcase */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-gray-200/80 bg-slate-900/5 p-2 sm:p-4 shadow-2xl shadow-slate-200/60">
          {/* Browser Window Header */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Fake address bar */}
              <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 w-72 justify-center">
                <span className="text-gray-400">https://</span>
                <span className="font-medium text-gray-700">unalone.app</span>
                <span className="text-blue-600 font-semibold">/{activeTab}</span>
              </div>

              <div className="text-xs text-gray-400 font-medium hidden sm:block">
                Live Preview
              </div>
            </div>

            {/* Screen Content Showcase */}
            <div className="bg-slate-50 min-h-[460px] p-4 sm:p-6">
              {/* TAB 1: Explore Map */}
              {activeTab === 'explore' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                  {/* Left Sidebar Mock */}
                  <div className="md:col-span-5 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <div className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-700">
                          Search nearby coffee, parks, gym...
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-full font-medium">
                          All
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200">
                          ☕ Coffee
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200">
                          🌳 Outdoor
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200">
                          ⚡ Starting Soon
                        </span>
                      </div>

                      {/* Plan Cards */}
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/40">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center">
                                <Coffee size={14} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900">
                                  Morning Espresso & Co-work
                                </h4>
                                <p className="text-[11px] text-gray-500">Blue Bottle Cafe • 0.4 km away</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                              2 spots left
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> Today at 10:30 AM
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> 3 attending
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                <Trees size={14} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900">
                                  Sunset Park Run & Stretch
                                </h4>
                                <p className="text-[11px] text-gray-500">Central Meadow • 1.2 km away</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                              1 spot left
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> Today at 6:00 PM
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> 4 attending
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Showing 8 plans within 5 km</span>
                      <span className="text-blue-600 font-semibold cursor-pointer">Adjust Radius</span>
                    </div>
                  </div>

                  {/* Right Map Canvas Mock */}
                  <div className="md:col-span-7 bg-slate-200 rounded-xl relative overflow-hidden min-h-[300px] border border-slate-300/80 flex items-center justify-center">
                    {/* Simulated Map Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100" />

                    {/* Simulated Map Streets */}
                    <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/80 -rotate-12 border-y border-slate-300" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/80 rotate-45 border-x border-slate-300" />
                    <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-white/80 -rotate-6 border-x border-slate-300" />

                    {/* User Location Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping" />
                      <div className="absolute w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="absolute top-6 text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow">
                        You
                      </span>
                    </div>

                    {/* Marker 1: Coffee */}
                    <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white">
                        <Coffee size={14} />
                      </div>
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-md border border-gray-200">
                        Espresso & Co-work (2 spots)
                      </div>
                    </div>

                    {/* Marker 2: Outdoor */}
                    <div className="absolute bottom-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center border-2 border-white">
                        <Trees size={14} />
                      </div>
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-md border border-gray-200">
                        Park Run (1 spot)
                      </div>
                    </div>

                    {/* Marker 3: Food */}
                    <div className="absolute top-1/4 right-1/5 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center border-2 border-white">
                        <Utensils size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Create Meetup Form */}
              {activeTab === 'create' && (
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Create a New Meetup</h3>
                      <p className="text-xs text-gray-500">Pick a spot on the map or type an address to invite people</p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <MapPin size={18} />
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Meetup Title</label>
                      <input
                        type="text"
                        readOnly
                        value="Spontaneous Afternoon Ramen & Boba"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Category</label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="p-2 bg-blue-50 border-2 border-blue-600 rounded-lg flex items-center gap-1.5 text-blue-700 font-semibold justify-center">
                          <Utensils size={13} /> Food
                        </div>
                        <div className="p-2 bg-slate-50 border border-gray-200 rounded-lg flex items-center gap-1.5 text-gray-600 justify-center">
                          <Coffee size={13} /> Coffee
                        </div>
                        <div className="p-2 bg-slate-50 border border-gray-200 rounded-lg flex items-center gap-1.5 text-gray-600 justify-center">
                          <Trees size={13} /> Outdoor
                        </div>
                        <div className="p-2 bg-slate-50 border border-gray-200 rounded-lg flex items-center gap-1.5 text-gray-600 justify-center">
                          <Dumbbell size={13} /> Fitness
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Meet Time</label>
                        <div className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span>Today at 7:00 PM</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Max Participants</label>
                        <div className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>4 people max</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Meeting Location</label>
                      <div className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 flex items-center gap-2">
                        <MapPin size={14} className="text-blue-600" />
                        <span>Ichiran Ramen, 132 W 31st St (Pinned on map)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        Cancel
                      </button>
                      <button className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 flex items-center gap-1.5">
                        Publish Plan <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Plan Details & Joining */}
              {activeTab === 'details' && (
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                          Coffee & Work
                        </span>
                        <span className="text-xs text-gray-400">0.8 km away</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Weekend Casual Coding & Coffee
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-500" />
                        Daily Grind Roasters, Main St.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        2 Spots Left
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-1">Total capacity: 4</span>
                    </div>
                  </div>

                  {/* Host info */}
                  <div className="my-4 p-3 bg-slate-50 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        JD
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                          John Doe
                          <CheckCircle2 size={13} className="text-blue-500" />
                        </div>
                        <span className="text-[11px] text-gray-500">Verified Member • Host</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded border border-gray-200">
                      Starts in 45m
                    </span>
                  </div>

                  {/* Attendees */}
                  <div className="space-y-2 mb-5">
                    <h4 className="text-xs font-semibold text-gray-700">Attendees (2/4)</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                          JD
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                          AL
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">John and Alex are going</span>
                    </div>
                  </div>

                  {/* Join Action CTA */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
                      <span>Today • 4:00 PM – 6:00 PM</span>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                      Join Plan
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlight Summary under screenshots */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Live Map Navigation</h4>
            <p className="text-xs text-gray-600">Dynamic Mapbox integration with precise distance calculation.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Map Click Creation</h4>
            <p className="text-xs text-gray-600">Click anywhere on the map to place a pin and create a meetup.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Instant Participation</h4>
            <p className="text-xs text-gray-600">Real-time attendance tracking with participant limits and spots.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
