import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
