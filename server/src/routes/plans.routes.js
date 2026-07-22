import express from "express";
import { getNearbyPlans, createPlan, deletePlan, joinPlan } from "../controllers/plans.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/nearby", authenticateToken, getNearbyPlans);
router.post("/create", authenticateToken, createPlan);
router.delete("/:id", authenticateToken, deletePlan);
router.post("/:id/join", authenticateToken, joinPlan);

export default router;
