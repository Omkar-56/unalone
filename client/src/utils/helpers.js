export const formatRelativeTime = (iso) => {
  const diff = new Date(iso) - Date.now();

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (diff < 0) {
    return "Started";
  }

  if (hours === 0) {
    return `${minutes}m away`;
  }

  if (hours < 24) {
    return `${hours}h ${minutes}m away`;
  }

  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

export const spotsLeft = (plan) => {
  return plan.maxParticipants - plan.participants;
};

export const occupancyPercentage = (plan) => {
  return (plan.participants / plan.maxParticipants) * 100;
};

export const isPlanStartingToday = (plan) => {
  const hoursUntil =
    (new Date(plan.datetime) - Date.now()) / 3600000;

  return hoursUntil < 24;
};

export const isPlanStartingSoon = (plan) => {
  const hoursUntil =
    (new Date(plan.datetime) - Date.now()) / 3600000;

  return hoursUntil < 3;
};

export const filterPlans = (plans, activeFilter) => {
  switch (activeFilter) {
    case "today":
      return plans.filter(isPlanStartingToday);

    case "soon":
      return plans.filter(isPlanStartingSoon);

    default:
      return plans;
  }
};
