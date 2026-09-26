import { Router } from "express";
import Skill from "../models/Skill.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// GET /api/skills - public list used by the public Skills section
router.get("/", async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ categoryOrder: 1, order: 1, createdAt: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (err) {
    next(err);
  }
});

// GET /api/skills/:id
router.get("/:id", async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
});

// POST /api/skills - create a skill
router.post("/", protect, async (req, res, next) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: "name and category are required." });
    }
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
});

// PUT /api/skills/:id - update a skill
router.put("/:id", protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/skills/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found." });
    res.json({ success: true, message: "Skill deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;