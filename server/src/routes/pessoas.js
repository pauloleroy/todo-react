import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

// GET /api/pessoas
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM pessoas WHERE is_deleted = false ORDER BY nome");
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;