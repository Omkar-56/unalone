import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Zap } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <Zap size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Live Now</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Meet People Near You,
              <span className="text-slate-700"> Right Now</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Find spontaneous meetups happening around you. From coffee chats to outdoor adventures,
              discover genuine connections with locals exploring the same interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:shadow-lg flex items-center justify-center gap-2 group">
                Start Exploring
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-gray-600">Active Plans</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">2K+</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">50+</p>
                <p className="text-sm text-gray-600">Cities</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-slate-600 rounded-3xl opacity-10 blur-3xl" />
            <div className="relative h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border border-gray-200 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Mock Map Visual */}
              <div className="p-6 space-y-4 w-full">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin size={20} className="text-blue-600" />
                    <span className="font-semibold text-gray-900">Coffee Near You</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full" />
                    <div className="h-2 bg-gray-200 rounded-full w-5/6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg mb-2" />
                    <div className="text-xs font-semibold text-gray-900">Morning Coffee</div>
                    <div className="text-xs text-gray-500">2 km away</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg mb-2" />
                    <div className="text-xs font-semibold text-gray-900">Park Meetup</div>
                    <div className="text-xs text-gray-500">0.8 km away</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full" />
                      <span className="text-sm font-semibold text-gray-900">Dinner Group</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">2 left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
