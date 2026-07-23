import { MapPin, AlertCircle, Shield, X } from "lucide-react";
import { CATEGORY_ICONS } from "../utils/constants";
import { formatRelativeTime, spotsLeft } from "../utils/helpers";

export default function PlanDetailSheet({ plan, onClose, onJoin, isOwnPlan, onDelete }) {
  if (!plan) return null;
  const Icon = CATEGORY_ICONS[plan.category] || MapPin;
  const free = spotsLeft(plan);
  const pct  = (plan.participants / plan.maxParticipants) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:mx-4 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-slate-700" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">{plan.title}</h2>
                <p className="text-sm text-gray-500">{plan.location.placeName}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">{plan.creator.initials}</span>
            </div>
            <span className="text-sm text-gray-600">{plan.creator.name}</span>
            {plan.creator.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-full">
                <Shield size={11} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Verified</span>
              </div>
            )}
            {isOwnPlan && (
              <div className="ml-auto px-2 py-0.5 bg-green-50 rounded-full">
                <span className="text-xs font-medium text-green-700">Your Plan</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-gray-700 leading-relaxed">{plan.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">When</p>
              <p className="text-sm font-semibold text-gray-900">{formatRelativeTime(plan.datetime)}</p>
              <p className="text-xs text-gray-400">
                {new Date(plan.datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-sm font-semibold text-gray-900">{plan.distance} km</p>
              <p className="text-xs text-gray-400">from your location</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                {plan.participants} joined · {free} spot{free !== 1 ? 's' : ''} left
              </span>
              <span className="text-xs text-gray-400">{plan.maxParticipants} max</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-red-400' : pct >= 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          {!isOwnPlan && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                This meetup is in a <strong>public place</strong>. Chat is unlocked only after the creator accepts your request.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Close
          </button>
          {isOwnPlan ? (
            <button
              onClick={() => onDelete(plan.id)}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Delete Plan
            </button>
          ) : (
            <button onClick={() => onJoin(plan.id)} disabled={free === 0}
              className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {free === 0 ? 'Plan Full' : 'Join Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
