/**
 * Seed data â€” a backend-side copy of the content that used to live only as
 * hardcoded arrays in the frontend (frontend/src/data/projects.js and
 * frontend/src/data/skills.js).
 *
 * It exists so `npm run seed` can move that content into MongoDB, making the
 * database the real source of truth the admin panel manages.
 *
 * The frontend keeps its static files as an offline fallback (the Projects
 * and Skills sections both fall back to them when the API is unreachable),
 * so if you edit either file, mirror the change here.
 */

export const projects = [
  {
    title: "EventSphere Management",
    description:
      "A MERN-based expo and event management system for organizers to create events, manage attendee registration, and track schedules in real time.",
    imageUrl: "",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    category: "Full Stack",
    featured: true,
    order: 1,
  },
  {
    title: "Laptop Hub",
    description:
      "An e-commerce and inventory management application for laptop retailers, covering product catalogs, cart, checkout, and stock control.",
    imageUrl: "",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    category: "E-Commerce",
    featured: true,
    order: 2,
  },
  {
    title: "Developer Portfolio",
    description:
      "This personal MERN portfolio â€” a dark, cyberpunk command center built to showcase full stack projects and skills.",
    imageUrl: "",
    techStack: ["React", "Express", "MongoDB", "Tailwind"],
    githubUrl: "#",
    liveUrl: "#",
    category: "Portfolio",
    featured: false,
    order: 3,
  },
];

// The static skills file groups items under `label`; the Skill model stores a
// flat document with a `category` field, so the groups are flattened here.
// `order` is the position inside a category and `categoryOrder` is the
// position of the category tab itself, so the public Skills section renders
// in exactly the same order as the static fallback after seeding.
export const skills = [
  // ---- Frontend ----
  { category: "Frontend", categoryOrder: 0, name: "React", icon: "atom", description: "Component-driven UIs with hooks and clean state management.", order: 0 },
  { category: "Frontend", categoryOrder: 0, name: "JavaScript", icon: "braces", description: "Modern ES6+ for interactive, client-side logic.", order: 1 },
  { category: "Frontend", categoryOrder: 0, name: "HTML", icon: "layout", description: "Semantic markup as the foundation of every build.", order: 2 },
  { category: "Frontend", categoryOrder: 0, name: "CSS", icon: "palette", description: "Custom layouts, animation, and responsive styling.", order: 3 },
  { category: "Frontend", categoryOrder: 0, name: "Bootstrap", icon: "package", description: "Rapid, consistent UI scaffolding when speed matters.", order: 4 },
  { category: "Frontend", categoryOrder: 0, name: "Responsive Design", icon: "smartphone", description: "Interfaces that hold up from mobile to desktop.", order: 5 },

  // ---- Backend ----
  { category: "Backend", categoryOrder: 1, name: "Node.js", icon: "server", description: "JavaScript runtime powering the API layer.", order: 0 },
  { category: "Backend", categoryOrder: 1, name: "Express.js", icon: "boxes", description: "Routing, middleware, and REST APIs on top of Node.", order: 1 },
  { category: "Backend", categoryOrder: 1, name: "Python", icon: "terminalSquare", description: "Backend services, scripting, and automation.", order: 2 },
  { category: "Backend", categoryOrder: 1, name: "PHP", icon: "code2", description: "Server-rendered apps and earlier full stack work.", order: 3 },
  { category: "Backend", categoryOrder: 1, name: "ASP.NET Core MVC", icon: "layers", description: "The .NET ecosystem and MVC architecture.", order: 4 },

  // ---- Mobile ----
  { category: "Mobile", categoryOrder: 2, name: "Flutter", icon: "smartphone", description: "Cross-platform mobile apps from a single Dart codebase.", order: 0 },
  { category: "Mobile", categoryOrder: 2, name: "Dart", icon: "code2", description: "The language behind Flutter â€” typed, fast, and expressive.", order: 1 },
  { category: "Mobile", categoryOrder: 2, name: "Mobile UI", icon: "layout", description: "Layouts and interactions tuned for small touch screens.", order: 2 },

  // ---- Database ----
  { category: "Database", categoryOrder: 3, name: "MongoDB", icon: "database", description: "Schema design and queries for the MERN stack.", order: 0 },
  { category: "Database", categoryOrder: 3, name: "MySQL", icon: "database", description: "Relational data modeling and SQL queries.", order: 1 },
  { category: "Database", categoryOrder: 3, name: "SQL Server", icon: "database", description: "Enterprise relational database work.", order: 2 },
  { category: "Database", categoryOrder: 3, name: "Firebase", icon: "flame", description: "Realtime data and auth for smaller apps.", order: 3 },

  // ---- Tools ----
  { category: "Tools", categoryOrder: 4, name: "Git", icon: "gitBranch", description: "Version control and collaborative workflows.", order: 0 },
  { category: "Tools", categoryOrder: 4, name: "GitHub", icon: "github", description: "Hosting, code review, and project history.", order: 1 },
  { category: "Tools", categoryOrder: 4, name: "VS Code", icon: "terminalSquare", description: "Primary editor, tuned with a full dev toolchain.", order: 2 },
  { category: "Tools", categoryOrder: 4, name: "Cloudinary", icon: "cloud", description: "Image and asset hosting for web projects.", order: 3 },
  { category: "Tools", categoryOrder: 4, name: "REST API", icon: "plug", description: "Designing predictable, well-documented endpoints.", order: 4 },
];