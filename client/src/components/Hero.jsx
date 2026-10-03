import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Zap } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <Zap size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Live Now</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Meet People Near You,
              <span className="text-slate-700"> Right Now</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
              Find spontaneous meetups happening around you. From coffee chats to outdoor adventures,
              discover genuine connections with locals exploring the same interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all hover:shadow-md flex items-center justify-center gap-2 group text-sm sm:text-base">
                Start Exploring
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-200">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">500+</p>
                <p className="text-xs sm:text-sm text-gray-500">Active Plans</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">2K+</p>
                <p className="text-xs sm:text-sm text-gray-500">Users</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">50+</p>
                <p className="text-xs sm:text-sm text-gray-500">Cities</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-72 sm:h-80 lg:h-[390px] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-slate-600 rounded-2xl opacity-10 blur-2xl" />
            <div className="relative h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Mock Map Visual */}
              <div className="p-4 sm:p-5 space-y-3 w-full max-w-sm">
                <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="text-xs font-semibold text-gray-900">Coffee Near You</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-gray-200 rounded-full" />
                    <div className="h-1.5 bg-gray-200 rounded-full w-5/6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
                    <div className="w-6 h-6 bg-green-100 rounded-md mb-1.5" />
                    <div className="text-[11px] font-semibold text-gray-900">Morning Coffee</div>
                    <div className="text-[10px] text-gray-500">2 km away</div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
                    <div className="w-6 h-6 bg-purple-100 rounded-md mb-1.5" />
                    <div className="text-[11px] font-semibold text-gray-900">Park Meetup</div>
                    <div className="text-[10px] text-gray-500">0.8 km away</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-100 rounded-full" />
                      <span className="text-xs font-semibold text-gray-900">Dinner Group</span>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">2 left</span>
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
