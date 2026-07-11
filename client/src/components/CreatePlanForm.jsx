import { useState, useEffect } from "react";
import { MapPin, X, Loader2, Search } from "lucide-react";
import { CATEGORIES } from "../utils/constants";


export default function CreatePlanForm({ onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'coffee',
    datetime: '',
    maxParticipants: 4,
    location: null,
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    const formatted = oneHourLater.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, datetime: formatted }));
  }, []);

  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result) => {
    setFormData({
      ...formData,
      location: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        placeName: result.display_name.split(',')[0],
        fullAddress: result.display_name,
      },
    });
    setLocationSearch('');
    setSearchResults([]);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create a Plan</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {step === 1 ? 'Choose a location' : 'Add plan details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Where will this happen?
                </label>
                <div className="relative">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 gap-2">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLocationSearch())}
                      placeholder="Search for a place or address..."
                      className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                    />
                    {isSearching && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl max-h-80 overflow-y-auto z-10">
                      {searchResults.map((result) => (
                        <button
                          key={result.place_id}
                          type="button"
                          onClick={() => handleSelectLocation(result)}
                          className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
                        >
                          <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {result.display_name.split(',')[0]}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">{result.display_name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {formData.location && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{formData.location.placeName}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{formData.location.fullAddress}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, location: null })}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => formData.location && setStep(2)}
                  disabled={!formData.location}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Type size={16} />
                  Plan Title
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Morning Coffee Chat"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.title.length}/50</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          formData.category === cat.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          size={24}
                          className={formData.category === cat.id ? 'text-blue-600' : 'text-gray-500'}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.category === cat.id ? 'text-blue-900' : 'text-gray-700'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} />
                  When
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.datetime}
                  onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    Max Participants
                  </span>
                  <span className="text-2xl font-bold text-blue-600">{formData.maxParticipants}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>2</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <AlignLeft size={16} />
                  Description (Optional)
                </label>
                <textarea
                  maxLength={200}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any details about the meetup..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.description.length}/200</p>
              </div>
            </div>
          )}
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Plan'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
