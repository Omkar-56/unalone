import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../db/index.js";
import otpStore from "../utils/otpStore.js";
import { generateOtp } from "../utils/generateOtp.js";
import { registerSchema } from "../validators/authSchema.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { authenticateToken } from "../middleware/auth.js";


const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { name, email, password } = parsed.data;
    const otpData = otpStore.get(email);

    if (!otpData?.verified) {
      return res.status(400).json({ error: "Email not verified" });
    }

    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (rows.length) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("OTP STORE:", otpStore);

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, verification_status)
       VALUES ($1, $2, $3, 'email_verified')
       RETURNING id,name,email`,
      [name, email, password_hash]
    );

    const user = result.rows[0];

    otpStore.delete(email);

     // -------- Create JWT --------
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = uuidv4();

    await pool.query(
      `
      INSERT INTO refresh_tokens (id, user_id, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
      `,
      [refreshToken, user.id]
    )

    res.cookie( "accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User register successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOtp();

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });

  await sendOtpEmail(email, otp)

  res.json({ message: "OTP sent" });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ error: "OTP not found" });
  }

  if (stored.expires < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpStore.set(email, {
    ...stored,
    verified: true,
  });


  res.json({ message: "Email verified" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // -------- Validation --------
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // -------- Find user --------
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // -------- Check password --------
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // -------- Check verification --------
    if (user.verification_status !== "email_verified") {
      return res.status(403).json({
        error: "Email not verified",
      });
    }

    // -------- Create JWT --------
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = uuidv4();

    await pool.query(
      `
      INSERT INTO refresh_tokens (id, user_id, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
      `,
      [refreshToken, user.id]
    )

    res.cookie( "accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE id = $1",
    [refreshToken]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  const tokenData = result.rows[0];

  if (new Date(tokenData.expires_at) < new Date()) {
    return res.status(403).json({ error: "Refresh token expired" });
  }

  const newAccessToken = jwt.sign(
    { userId: tokenData.user_id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.json({ message: "Token refreshed" });
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await pool.query(
    "DELETE FROM refresh_tokens WHERE id = $1",
    [refreshToken]
  );

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});



export default router;