import {
  Atom, Braces, Layout, Palette, Package, Smartphone, Server, Boxes,
  Code2, Layers, Database, Flame, GitBranch, Github, TerminalSquare,
  Cloud, Plug,
} from "lucide-react";

/**
 * The lucide-react icon set the Skills section renders. Each skill in
 * data/skills.js stores only the icon *key* (e.g. "atom"); SkillCard resolves
 * it to a component through this map.
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
