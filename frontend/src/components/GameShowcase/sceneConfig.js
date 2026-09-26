// All values are fractions (0 -> 1) of the whole pinned scroll timeline.
// Keeping them in one place means the GSAP trigger, the 3D model windows,
// and the HUD panel switching never drift out of sync with each other.

// Where the HUD's discrete "LEVEL 0X" text/panel switches over.
export const LEVEL_BOUNDARIES = [0.34, 0.68];

// Where each 3D model is active (with intentional overlap for cross-fades).
export const MODEL_WINDOWS = {
  helmet: [0, 0.4], // State 1 — orb/helmet
  armory: [0.28, 0.72], // State 2 — core orb + hologram project cards
  gateway: [0.62, 1.0], // State 3 — portal
};

// Where the two hand-off particle effects peak.
export const BURST_POINTS = {
  lightStreams: 0.34, // State 1 -> 2: camera zoom + particle light streams
  explosion: 0.68, // State 2 -> 3: particle explosion into the portal
};

// The Armory window is subdivided evenly across the project count so
// scrolling through State 2 cycles the highlighted holo-card.
export const PROJECT_COUNT = 3;
export const ARMORY_PROJECT_WINDOW = MODEL_WINDOWS.armory;
