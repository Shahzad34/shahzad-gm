import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signAdminToken } from "../middleware/auth.js";

const router = Router();

// Brute-force guard on the only credentialed endpoint in the API. Matches
// the limiter style already used for POST /api/contact in server.js.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

/**
 * POST /api/admin/login — trades the single hardcoded admin credentials for
 * a 12h JWT. There are no user accounts and no signup: the email/password
 * pair lives in .env as ADMIN_EMAIL / ADMIN_PASSWORD.
 */
router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const adminEmail = String(email).trim().toLowerCase();
  const expectedEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const expectedPassword = String(process.env.ADMIN_PASSWORD || "");

  // One generic error for both fields so the response never reveals which
  // half of the credentials was wrong.
  if (!expectedEmail || adminEmail !== expectedEmail || password !== expectedPassword) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const token = signAdminToken(adminEmail);
  res.json({ success: true, token, email: adminEmail });
});

export default router;
