import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

testConnection();

export default pool;
