import pool from "../db/index.js";

export const getNearbyPlans = async ({ lat, lng, radius, filter }) => {
  let timeFilter = "";
  if (filter === "today") {
    timeFilter = "AND p.time < NOW() + INTERVAL '24 hours'";
  }
  if (filter === "soon") {
    timeFilter = "AND p.time < NOW() + INTERVAL '3 hours'";
  }

  const query = `
    SELECT
      p.id,
      p.user_id,
      p.title,
      p.description,
      p.category,
      p.location_name,
      p.time,
      p.max_people,
      u.name AS creator_name,
      u.verification_status,

      COUNT(pp.user_id) AS participants,

      ST_Y(p.location::geometry) AS lat,
      ST_X(p.location::geometry) AS lng,

      ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
      ) / 1000 AS distance

    FROM plans p

    JOIN users u
      ON u.id = p.user_id

    LEFT JOIN plan_participants pp
      ON pp.plan_id = p.id

    WHERE ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
      $3
    )

    ${timeFilter}

    GROUP BY
      p.id,
      p.user_id,
      p.title,
      p.description,
      p.category,
      p.location_name,
      p.time,
      p.max_people,
      u.name,
      u.verification_status,
      p.location

    ORDER BY distance ASC

    LIMIT 50;
  `;

  const { rows } = await pool.query(query, [lat, lng, radius]);

  return rows.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    location: {
      lat: p.lat,
      lng: p.lng,
      placeName: p.location_name
    },
    datetime: p.time,
    participants: Number(p.participants),
    maxParticipants: Number(p.max_people),
    distance: Number(p.distance).toFixed(1),
    creator: {
      id: p.user_id,
      name: p.creator_name,
      verified: p.verification_status === 'email_verified'? true : false,
      initials: p.creator_name
        .split(" ")
        .map(n => n[0])
        .join("")
    }
  }));
};

export const createPlan = async ({
  title,
  description,
  category,
  lat,
  lng,
  placeName,
  datetime,
  maxParticipants,
  userId
}) => {

  // ---- Validation ----
  const errors = {};

  if (!title) errors.title = "Title is required";
  if (lat === undefined || lng === undefined) errors.location = "Location required";
  if (!datetime || new Date(datetime) <= new Date()) {
    errors.datetime = "Date must be in the future";
  }
  if (maxParticipants === undefined || maxParticipants < 1) {
    errors.maxParticipants = "Invalid participant limit";
  }

  if (Object.keys(errors).length > 0) {
    throw { type: "validation", errors };
  }

  // ---- Insert plan ----
  const query = `
    INSERT INTO plans (
      user_id,
      title,
      description,
      category,
      location,
      location_name,
      time,
      max_people,
      current_people
    )
    VALUES (
      $1, $2, $3, $4,
      ST_SetSRID(ST_MakePoint($6, $5), 4326)::geography,
      $7, $8, $9, 1
    )
    RETURNING *
  `;

  let plan;
  await pool.query("BEGIN");

  try {
    const { rows } = await pool.query(query, [
      userId,         // $1
      title,          // $2
      description,    // $3
      category,       // $4
      lat,            // $5
      lng,            // $6
      placeName,      // $7
      datetime,       // $8
      maxParticipants // $9
    ]);

    plan = rows[0];

    await pool.query("INSERT INTO plan_participants (plan_id, user_id) VALUES ($1, $2)", [plan.id, userId]);
    await pool.query("COMMIT");

  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }

  // ---- Get creator ----
  const userRes = await pool.query(
    "SELECT id, name, verification_status FROM users WHERE id = $1",
    [userId]
  );

  const creator = userRes.rows[0];

  return {
    id: plan.id,
    title: plan.title,
    description: plan.description,
    category: plan.category,
    location: {
      lat,
      lng,
      placeName: plan.location_name
    },
    datetime: plan.time,
    participants: 1,
    maxParticipants: plan.max_people,
    distance: 0,
    creator: {
      id: creator.id,
      name: creator.name,
      verified: creator.verification_status === "email_verified",
      initials: creator.name
        .split(" ")
        .map(n => n[0])
        .join("")
    },
    status: "active",
    createdAt: plan.created_at
  };
};


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
