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
    <section id="screenshots" className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Layers size={13} />
            Product Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            See Unalone in Action
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            A frictionless interface designed for instant discovery and real-world connection.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
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
        <div className="relative mx-auto max-w-4xl rounded-xl border border-gray-200/90 bg-slate-900/5 p-2 sm:p-3 shadow-xl shadow-slate-200/50">
          {/* Browser Window Header */}
          <div className="rounded-lg bg-white border border-gray-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>

              {/* Fake address bar */}
              <div className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-3 py-0.5 text-xs text-gray-500 w-64 justify-center">
                <span className="text-gray-400">https://</span>
                <span className="font-medium text-gray-700">unalone.app</span>
                <span className="text-blue-600 font-semibold">/{activeTab}</span>
              </div>

              <div className="text-[11px] text-gray-400 font-medium hidden sm:block">
                Live Preview
              </div>
            </div>

            {/* Screen Content Showcase */}
            <div className="bg-slate-50 min-h-[340px] sm:min-h-[360px] p-3 sm:p-4">
              {/* TAB 1: Explore Map */}
              {activeTab === 'explore' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-full">
                  {/* Left Sidebar Mock */}
                  <div className="md:col-span-5 bg-white rounded-lg border border-gray-200 p-3 shadow-2xs flex flex-col justify-between space-y-3">
                    <div>
                      {/* Search Bar */}
                      <div className="relative mb-2">
                        <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                        <div className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-md text-[11px] text-gray-700">
                          Search nearby coffee, parks...
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="flex gap-1 mb-3 overflow-x-auto pb-0.5 text-[11px]">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded-full font-medium">
                          All
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                          ☕ Coffee
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                          🌳 Outdoor
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                          ⚡ Soon
                        </span>
                      </div>

                      {/* Plan Cards */}
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center">
                                <Coffee size={13} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                                  Morning Espresso & Co-work
                                </h4>
                                <p className="text-[10px] text-gray-500">Blue Bottle Cafe • 0.4 km away</p>
                              </div>
                            </div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                              2 spots left
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> Today at 10:30 AM
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={11} /> 3 attending
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center">
                                <Trees size={13} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                                  Sunset Park Run & Stretch
                                </h4>
                                <p className="text-[10px] text-gray-500">Central Meadow • 1.2 km away</p>
                              </div>
                            </div>
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-full">
                              1 spot left
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> Today at 6:00 PM
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={11} /> 4 attending
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Showing 8 plans within 5 km</span>
                      <span className="text-blue-600 font-semibold cursor-pointer">Adjust Radius</span>
                    </div>
                  </div>

                  {/* Right Map Canvas Mock */}
                  <div className="md:col-span-7 bg-slate-200 rounded-lg relative overflow-hidden min-h-[250px] border border-slate-300/80 flex items-center justify-center">
                    {/* Simulated Map Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] bg-slate-100" />

                    {/* Simulated Map Streets */}
                    <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/80 -rotate-12 border-y border-slate-300" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-white/80 rotate-45 border-x border-slate-300" />
                    <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-white/80 -rotate-6 border-x border-slate-300" />

                    {/* User Location Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
                      <div className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                      <span className="absolute top-5 text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                        You
                      </span>
                    </div>

                    {/* Marker 1: Coffee */}
                    <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center border border-white">
                        <Coffee size={12} />
                      </div>
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-gray-200">
                        Espresso (2 spots)
                      </div>
                    </div>

                    {/* Marker 2: Outdoor */}
                    <div className="absolute bottom-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white shadow-md flex items-center justify-center border border-white">
                        <Trees size={12} />
                      </div>
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-gray-200">
                        Park Run (1 spot)
                      </div>
                    </div>

                    {/* Marker 3: Food */}
                    <div className="absolute top-1/4 right-1/5 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-amber-600 text-white shadow-md flex items-center justify-center border border-white">
                        <Utensils size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Create Meetup Form */}
              {activeTab === 'create' && (
                <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Create a New Meetup</h3>
                      <p className="text-[11px] text-gray-500">Pick a spot on the map or type an address</p>
                    </div>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                      <MapPin size={16} />
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Meetup Title</label>
                      <input
                        type="text"
                        readOnly
                        value="Spontaneous Afternoon Ramen & Boba"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-md text-gray-800 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Category</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="p-1.5 bg-blue-50 border border-blue-600 rounded-md flex items-center gap-1 text-blue-700 font-semibold justify-center text-[11px]">
                          <Utensils size={12} /> Food
                        </div>
                        <div className="p-1.5 bg-slate-50 border border-gray-200 rounded-md flex items-center gap-1 text-gray-600 justify-center text-[11px]">
                          <Coffee size={12} /> Coffee
                        </div>
                        <div className="p-1.5 bg-slate-50 border border-gray-200 rounded-md flex items-center gap-1 text-gray-600 justify-center text-[11px]">
                          <Trees size={12} /> Outdoor
                        </div>
                        <div className="p-1.5 bg-slate-50 border border-gray-200 rounded-md flex items-center gap-1 text-gray-600 justify-center text-[11px]">
                          <Dumbbell size={12} /> Fitness
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Meet Time</label>
                        <div className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-md text-gray-800 flex items-center gap-1.5 text-xs">
                          <Clock size={13} className="text-gray-400" />
                          <span>Today at 7:00 PM</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Max Participants</label>
                        <div className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-md text-gray-800 flex items-center gap-1.5 text-xs">
                          <Users size={13} className="text-gray-400" />
                          <span>4 people max</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Meeting Location</label>
                      <div className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-md text-gray-800 flex items-center gap-1.5 text-xs">
                        <MapPin size={13} className="text-blue-600" />
                        <span>Ichiran Ramen, 132 W 31st St (Pinned)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-md font-medium text-xs hover:bg-gray-50">
                        Cancel
                      </button>
                      <button className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold text-xs hover:bg-slate-800 flex items-center gap-1">
                        Publish Plan <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Plan Details & Joining */}
              {activeTab === 'details' && (
                <div className="max-w-xl mx-auto bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-semibold">
                          Coffee & Work
                        </span>
                        <span className="text-[11px] text-gray-400">0.8 km away</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        Weekend Casual Coding & Coffee
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-500" />
                        Daily Grind Roasters, Main St.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        2 Spots Left
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Capacity: 4</span>
                    </div>
                  </div>

                  {/* Host info */}
                  <div className="my-3 p-2.5 bg-slate-50 rounded-md border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                        JD
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                          John Doe
                          <CheckCircle2 size={12} className="text-blue-500" />
                        </div>
                        <span className="text-[10px] text-gray-500">Verified Member • Host</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                      Starts in 45m
                    </span>
                  </div>

                  {/* Attendees */}
                  <div className="space-y-1.5 mb-3.5">
                    <h4 className="text-[11px] font-semibold text-gray-700">Attendees (2/4)</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          JD
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          AL
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500">John and Alex are going</span>
                    </div>
                  </div>

                  {/* Join Action CTA */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Calendar size={13} className="text-gray-400" />
                      <span>Today • 4:00 PM – 6:00 PM</span>
                    </div>
                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition shadow-2xs flex items-center gap-1.5">
                      Join Plan
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlight Summary under screenshots */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">Live Map Navigation</h4>
            <p className="text-[11px] text-gray-600">Dynamic Mapbox integration with precise distance calculation.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">Map Click Creation</h4>
            <p className="text-[11px] text-gray-600">Click anywhere on the map to place a pin and create a meetup.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">Instant Participation</h4>
            <p className="text-[11px] text-gray-600">Real-time attendance tracking with participant limits and spots.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
