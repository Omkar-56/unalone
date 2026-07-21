import pool from "../db/index.js";
import * as plansService from "../services/plans.service.js";

export const getNearbyPlans = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, filter = "all" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseInt(radius);

    const plans = await plansService.getNearbyPlans({
      lat: latNum,
      lng: lngNum,
      radius: radiusNum,
      filter
    });

    res.json({plans: plans});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const plan = await plansService.createPlan({
      ...req.body,
      userId
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan
    });

  } catch (err) {
    console.error(err);

    if (err.type === "validation") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query("SELECT id from plans WHERE user_id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Plan not found"
      });
    }

    const plan = result.rows[0];

    if (plan.user_id !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this plan.",
      });
    }

    await pool.query(
      `DELETE FROM plans
       WHERE id = $1`,
      [planId]
    );

    return res.status(200).json({
      message: "Plan deleted successfully.",
    });

  } catch (err) {
    console.error("Delete plan error:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
