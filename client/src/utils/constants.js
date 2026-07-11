import {
  MapPin,
  Coffee,
  Trees,
  BookOpen,
  Music,
  Utensils,
  Dumbbell,
} from "lucide-react";

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const CATEGORY_ICONS = {
  coffee: Coffee,
  park: Trees,
  book: BookOpen,
  music: Music,
  food: Utensils,
  fitness: Dumbbell,
  default: MapPin,
};

export const FILTERS = [
  {
    id: "all",
    label: "All Plans",
  },
  {
    id: "today",
    label: "Today",
  },
  {
    id: "soon",
    label: "Starting Soon",
  },
];

export const CATEGORIES = [
  {
    id: "coffee",
    label: "Coffee",
    icon: Coffee,
  },
  {
    id: "food",
    label: "Food",
    icon: Utensils,
  },
  {
    id: "park",
    label: "Outdoor",
    icon: Trees,
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: Dumbbell,
  },
  {
    id: "book",
    label: "Books",
    icon: BookOpen,
  },
  {
    id: "music",
    label: "Music",
    icon: Music,
  },
];
