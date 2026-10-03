import express from "express";
import {
  getNearbyPlans,
  createPlan,
  deletePlan,
  joinPlan,
  leavePlan,
  getUserDashboard,
} from "../controllers/plans.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/nearby", authenticateToken, getNearbyPlans);
router.get("/dashboard", authenticateToken, getUserDashboard);
router.post("/create", authenticateToken, createPlan);
router.post("/:id/join", authenticateToken, joinPlan);
router.post("/:id/leave", authenticateToken, leavePlan);
router.delete("/:id", authenticateToken, deletePlan);

export default router;
