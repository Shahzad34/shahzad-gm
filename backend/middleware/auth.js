import jwt from "jsonwebtoken";

/**
 * Protects admin-only routes (creating/editing/deleting projects, skills,
 * reading contact messages, etc).
 * Expects `Authorization: Bearer <token>`, where <token> was signed with
 * ADMIN_JWT_SECRET by POST /api/admin/login. This portfolio has no user
 * accounts — there is exactly one admin, credentials live in .env.
 *
 * Usage:
 *   import { protect } from "../middleware/auth.js";
 *   router.post("/", protect, async (req, res) => { ... });
 */
export function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (decoded?.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not authorized. Invalid token." });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized. Invalid or expired token." });
  }
}

/**
 * Issues a 12h admin token. Call this from the login route once a submitted
 * email + password have been checked against ADMIN_EMAIL / ADMIN_PASSWORD.
 */
export function signAdminToken(email) {
  return jwt.sign({ role: "admin", email }, process.env.ADMIN_JWT_SECRET, { expiresIn: "12h" });
}
