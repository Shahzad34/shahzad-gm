import { Router } from "express";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - submit the contact form
router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    const entry = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    res.status(201).json({
      success: true,
      message: "Message received — thanks for reaching out. I'll reply soon.",
      id: entry._id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/contact - list submitted messages (admin only — these hold
// visitors' email addresses, so they must never be public).
router.get("/", protect, async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ read: 1, createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contact/:id/read - mark a message as read or unread.
// Accepts { read: true|false }; defaults to true so a bare PATCH works.
router.patch("/:id/read", protect, async (req, res, next) => {
  try {
    const read = req.body?.read === undefined ? true : Boolean(req.body.read);
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contact/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
