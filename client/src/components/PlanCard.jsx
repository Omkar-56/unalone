import { ChevronRight, Clock, Users } from "lucide-react";

import { CATEGORY_ICONS } from "../../utils/constants";
import { formatRelativeTime, spotsLeft } from "../../utils/helpers";

export default function PlanCard({
  plan,
  selected,
  onClick,
  isOwnPlan,
}) {
  const Icon = CATEGORY_ICONS[plan.category] || CATEGORY_ICONS.default;

  const free = spotsLeft(plan);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 transition-all duration-150 border-b border-gray-100 last:border-0
        ${
          selected
            ? "bg-slate-50"
            : "bg-white hover:bg-gray-50"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${
              selected
                ? "bg-slate-900 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          <Icon size={15} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm leading-tight">
                {plan.title}
              </span>

              {isOwnPlan && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Your Plan
                </span>
              )}
            </div>

            <span className="text-xs text-gray-400 flex-shrink-0">
              {plan.distance} km
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-2">
            {plan.location.placeName}
          </p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} />
              {formatRelativeTime(plan.datetime)}
            </span>

            <span
              className={`flex items-center gap-1 text-xs font-medium
                ${
                  free <= 1
                    ? "text-red-500"
                    : free <= 3
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
            >
              {free} spot{free !== 1 ? "s" : ""} left
            </span>
          </div>
        </div>

        <ChevronRight
          size={14}
          className="text-gray-300 flex-shrink-0 mt-2"
        />
      </div>
    </button>
  );
}
