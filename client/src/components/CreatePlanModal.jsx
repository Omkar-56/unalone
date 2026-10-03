import { useState, useEffect } from "react";
import { MapPin, X, Loader2, Sparkles } from "lucide-react";
import { CATEGORIES } from "../utils/constants";

export default function CreatePlanModal({ location, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: location?.suggestedTitle || (location?.placeName ? `Meetup at ${location.placeName}` : ''),
    category: location?.suggestedCategory || 'coffee',
    datetime: '',
    maxParticipants: 4,
    description: '',
  });

  useEffect(() => {
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    const formatted = oneHourLater.toISOString().slice(0, 16);
    setFormData(prev => ({
      ...prev,
      datetime: formatted,
      category: location?.suggestedCategory || prev.category || 'coffee',
      title: location?.suggestedTitle || prev.title || (location?.placeName ? `Meetup at ${location.placeName}` : ''),
    }));
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, location });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-6 pt-4 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Host a Meetup</h2>
                <p className="text-xs text-gray-500">Pick details for your spontaneous plan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Venue Card Badge */}
          {location?.placeName && (
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                    Selected Venue
                  </span>
                  {location.isSuggestedVenue && (
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> Suggested Spot
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{location.placeName}</p>
                <p className="text-[11px] text-gray-500 truncate">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 tracking-wider">
              Meetup Title
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Morning Coffee & Co-work"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-gray-900 placeholder-gray-400 font-medium"
            />
            <p className="text-[11px] text-gray-400 mt-1">{formData.title.length}/50</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-white' : 'text-slate-600'} />
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 tracking-wider">
                When
              </label>
              <input
                type="datetime-local"
                required
                value={formData.datetime}
                onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 tracking-wider">
                Max Capacity: <span className="text-blue-600">{formData.maxParticipants} people</span>
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5 tracking-wider">
              Description (Optional)
            </label>
            <textarea
              maxLength={200}
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What are the plans? e.g., Bringing laptop, open to chats..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                'Publish Meetup'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
