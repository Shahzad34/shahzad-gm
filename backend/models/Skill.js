import mongoose from "mongoose";

// One document per skill. `category` groups skills on the public Skills
// section (and the admin panel), `icon` stores a lucide-react icon key that
// the frontend maps to a component, `order` controls sorting inside a
// category and `categoryOrder` controls the order the category tabs appear
// in. Both are explicit numbers rather than relying on alphabetical order,
// so the public Skills section keeps its hand-authored tab sequence.
// Same shape/style as models/Project.js.
const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    categoryOrder: { type: Number, default: 0 },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "code2", trim: true },
    description: { type: String, default: "", trim: true, maxlength: 400 },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model("Skill", skillSchema);