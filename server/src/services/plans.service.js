export const joinPlan = async (planId, userId) => {
  await pool.query("BEGIN");

  try {
    // -------- Get plan details --------
    const planResult = await pool.query(
      `
      SELECT
        p.user_id,
        p.max_people,
        p.time,
        COUNT(pp.user_id) AS participants
      FROM plans p
      LEFT JOIN plan_participants pp
        ON pp.plan_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [planId]
    );

    if (planResult.rows.length === 0) {
      throw {
        type: "not_found",
        message: "Plan not found."
      };
    }

    const plan = planResult.rows[0];

    // -------- Cannot join own plan --------
    if (plan.user_id === userId) {
      throw {
        type: "validation",
        message: "You cannot join your own plan."
      };
    }

    // -------- Plan expired --------
    if (new Date(plan.time) <= new Date()) {
      throw {
        type: "validation",
        message: "This plan has already ended."
      };
    }

    // -------- Plan full --------
    if (Number(plan.participants) >= plan.max_people) {
      throw {
        type: "validation",
        message: "This plan is already full."
      };
    }

    // -------- Already joined --------
    const existing = await pool.query(
      `
      SELECT 1
      FROM plan_participants
      WHERE plan_id = $1
        AND user_id = $2
      `,
      [planId, userId]
    );

    if (existing.rows.length > 0) {
      throw {
        type: "validation",
        message: "You have already joined this plan."
      };
    }

    // -------- Join plan --------
    await pool.query(
      `
      INSERT INTO plan_participants (plan_id, user_id)
      VALUES ($1, $2)
      `,
      [planId, userId]
    );

    await pool.query("COMMIT");

    return {
      success: true
    };

  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};
