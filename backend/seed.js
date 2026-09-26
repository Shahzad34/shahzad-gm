import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import { projects, skills } from "./config/seedData.js";

/**
 * Seeds the portfolio's existing static content into MongoDB so the database
 * becomes the real source of truth the admin panel manages.
 *
 *   npm run seed            insert only into empty collections (safe default)
 *   npm run seed -- --reset wipe projects + skills, then reinsert
 *
 * Contact messages are never touched — they are real submissions.
 */
const reset = process.argv.includes("--reset");

async function seedCollection({ label, Model, docs }) {
  if (reset) {
    const { deletedCount } = await Model.deleteMany({});
    console.log(`[seed] ${label}: cleared ${deletedCount} existing document(s)`);
  }

  const existing = await Model.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${label}: skipped — collection already has ${existing} document(s)`);
    return;
  }

  const inserted = await Model.insertMany(docs);
  console.log(`[seed] ${label}: inserted ${inserted.length} document(s)`);
}

async function run() {
  await connectDB();

  await seedCollection({ label: "projects", Model: Project, docs: projects });
  await seedCollection({ label: "skills", Model: Skill, docs: skills });

  console.log("[seed] Done.");
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("[seed] Failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});