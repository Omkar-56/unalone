import { z } from "zod";

export const createPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  placeName: z.string().min(1, "Place name is required"),
  datetime: z.string().refine(
    (val) => new Date(val) > new Date(),
    { message: "Date must be in the future" }
  ),
  maxParticipants: z.number().min(1).max(10),
});
