import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import otpStore from "../utils/otpStore.js";
import { generateOtp } from "../utils/generateOtp.js";
import { registerSchema } from "../validators/authSchema.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0].message,
      });
    }

    const { name, email, phone, password } = parsed.data;
    const otpData = otpStore.get(email);

    if (!otpData?.verified) {
      return res.status(400).json({ error: "Email not verified" });
    }

    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email=$1 OR phone=$2",
      [email || null, phone]
    );

    if (rows.length) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("OTP STORE:", otpStore);

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, verification_status)
       VALUES ($1,$2,$3,$4,'email_verified')
       RETURNING id,name,email,phone`,
      [name, email || null, phone, password_hash]
    );

    otpStore.delete(phone);

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
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
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;