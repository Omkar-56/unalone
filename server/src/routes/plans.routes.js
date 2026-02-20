import express from "express";
import { getNearbyPlans, createPlan } from "../controllers/plans.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/nearby", authenticateToken, getNearbyPlans);
router.post("/create", authenticateToken, createPlan);


export default router;
