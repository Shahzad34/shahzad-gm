import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model("Project", projectSchema);
