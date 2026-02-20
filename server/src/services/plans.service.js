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
      p.title,
      p.description,
      p.category,
      p.location_name,
      p.time,
      p.max_people,
      p.current_people,
      u.name AS creator_name,
      u.verification_status,
      ST_Y(p.location::geometry) AS lat,
      ST_X(p.location::geometry) AS lng,
      ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
      ) / 1000 AS distance
    FROM plans p
    JOIN users u ON u.id = p.user_id
    WHERE ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
      $3
    )
    ${timeFilter}
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
    participants: p.current_people,
    maxParticipants: p.max_people,
    distance: Number(p.distance).toFixed(1),
    creator: {
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
  if (!lat || !lng) errors.location = "Location required";
  if (!datetime || new Date(datetime) <= new Date()) {
    errors.datetime = "Date must be in the future";
  }
  if (!maxParticipants || maxParticipants < 1) {
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

  const plan = rows[0];

  // ---- Get creator ----
  const userRes = await pool.query(
    "SELECT name, verification_status FROM users WHERE id = $1",
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
    participants: plan.current_people,
    maxParticipants: plan.max_people,
    distance: 0,
    creator: {
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