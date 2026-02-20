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

    res.json(plans);
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
