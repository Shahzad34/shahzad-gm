// The Hero's scroll-driven "developer profiles". Icon values are string
// keys resolved against the ICONS map in Hero.jsx (same pattern as
// data/skills.js + SkillCard.jsx), so this file stays framework-agnostic.
export const DEV_PROFILES = [
  {
    id: "mern",
    role: "MERN Stack Developer",
    description:
      "Building modern, scalable, and interactive web applications with the MERN stack and modern frontend technologies.",
    skills: [
      { label: "FRONTEND", icon: "code2" },
      { label: "BACKEND", icon: "cog" },
      { label: "DATABASE", icon: "database" },
      { label: "API", icon: "plug" },
    ],
  },
  {
    id: "python",
    role: "Python Developer",
    description:
      "Writing clean, efficient Python for backend services, scripting, and automation.",
    skills: [
      { label: "PYTHON", icon: "terminal" },
      { label: "BACKEND", icon: "cog" },
      { label: "AUTOMATION", icon: "workflow" },
      { label: "DATA", icon: "database" },
    ],
  },
  {
    id: "flutter",
    role: "Flutter Mobile App Developer",
    description:
      "Building cross-platform mobile apps with Flutter and Dart, from one codebase to iOS and Android.",
    skills: [
      { label: "FLUTTER", icon: "smartphone" },
      { label: "DART", icon: "code2" },
      { label: "MOBILE UI", icon: "layout" },
      { label: "CROSS-PLATFORM", icon: "plug" },
    ],
  },
];
