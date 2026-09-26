import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import adminRoutes from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Render/Railway sit behind a reverse proxy that sets X-Forwarded-For. Without
// this, Express ignores that header, every request resolves to the same proxy
// IP, and the rate limiter on /api/contact + /api/admin/login becomes a single
// global bucket -- one visitor would lock out everyone else. `1` = the number
// of proxy hops between the client and this process. Do not set it to `true`,
// which trusts a client-supplied header and lets anyone bypass the limiter.
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "100kb" }));

// Basic rate limiting on the contact endpoint to prevent spam/abuse.
// Mounted on POST only — the admin-only GET/PATCH/DELETE routes in the same
// router must never be throttled by the public submission limit.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running." });
});

app.post("/api/contact", contactLimiter);
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
  });
}

start();
