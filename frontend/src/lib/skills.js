import {
  Atom, Braces, Layout, Palette, Package, Smartphone, Server, Boxes,
  Code2, Layers, Database, Flame, GitBranch, Github, TerminalSquare,
  Cloud, Plug,
} from "lucide-react";

/**
 * The lucide-react icon set the Skills section renders. A Skill document only
 * stores the *key* (e.g. "atom"), so both the public SkillCard and the admin
 * panel's icon picker read the mapping from here — that way every icon you
 * can pick in the admin panel is guaranteed to be one the public section can
 * actually draw.
 */
export const SKILL_ICONS = {
  atom: Atom,
  braces: Braces,
  layout: Layout,
  palette: Palette,
  package: Package,
  smartphone: Smartphone,
  server: Server,
  boxes: Boxes,
  code2: Code2,
  layers: Layers,
  database: Database,
  flame: Flame,
  gitBranch: GitBranch,
  github: Github,
  terminalSquare: TerminalSquare,
  cloud: Cloud,
  plug: Plug,
};

export const SKILL_ICON_KEYS = Object.keys(SKILL_ICONS);

export const DEFAULT_SKILL_ICON = "code2";

/** Resolves an icon key to a component, falling back to Code2. */
export function resolveSkillIcon(icon) {
  return SKILL_ICONS[icon] || Code2;
}

/**
 * Turns a flat list of skill documents (the shape /api/skills returns) into
 * the `{ label, items }` shape the public Skills section renders its tabs
 * from. Preserves first-seen category order so a seeded database renders in
 * exactly the same tab order as the static fallback file.
 */
export function groupSkillsByCategory(skills = []) {
  const groups = [];
  const index = new Map();

  for (const skill of skills) {
    const label = skill?.category || "General";
    if (!index.has(label)) {
      index.set(label, { label, items: [] });
      groups.push(index.get(label));
    }
    index.get(label).items.push(skill);
  }

  return groups;
}