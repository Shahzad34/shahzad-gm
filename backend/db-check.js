import "dotenv/config";
import mongoose from "mongoose";

/**
 * Read-only connectivity check — no writes, no server boot.
 *
 *   npm run db:ping
 *
 * Prints the resolved database name, the Atlas host it landed on, the latency,
 * and the current document counts. Credentials are never echoed.
 */
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not set in backend/.env");
  process.exit(1);
}

console.log("[check] Target:", uri.replace(/\/\/[^@]*@/, "//<credentials>@"));

const started = Date.now();

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const conn = mongoose.connection;

  console.log(
    `[check] CONNECTED in ${Date.now() - started}ms — ` +
      `db="${conn.name}" host=${conn.host}:${conn.port}`
  );
  console.log(`[check] ping ok=${(await conn.db.command({ ping: 1 })).ok}`);

  const [projects, skills, contacts] = await Promise.all([
    mongoose.connection.db.collection("projects").countDocuments(),
    mongoose.connection.db.collection("skills").countDocuments(),
    mongoose.connection.db.collection("contacts").countDocuments(),
  ]);
  console.log(`[check] counts — projects=${projects} skills=${skills} contacts=${contacts}`);

  if (conn.name !== "shahzad-portfolio") {
    console.warn(
      `[check] WARNING: connected to "${conn.name}", not "shahzad-portfolio". ` +
        "Add /shahzad-portfolio to the path in MONGO_URI or the seed writes to the wrong db."
    );
  }
} catch (err) {
  console.error(`[check] FAILED after ${Date.now() - started}ms — ${err.name}: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}