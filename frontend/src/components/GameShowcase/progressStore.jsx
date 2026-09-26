import { createContext, useContext, useRef } from "react";

/**
 * Three.js components read `store.progress` (0 -> 1 across the whole pinned
 * section) inside useFrame. Because it's a plain mutable object rather than
 * React state, updating it 60x/second from GSAP's onUpdate never triggers a
 * React re-render — only the HUD (which cares about discrete level changes)
 * subscribes via listeners.
 */
export function createProgressStore() {
  return {
    progress: 0, // 0 -> 1 across the entire pinned timeline
    level: 0, // 0, 1, or 2 — current "LEVEL 0X" section
    projectIndex: 0, // which holo-card is highlighted during LEVEL 02 // ARMORY
    listeners: new Set(),
    projectListeners: new Set(),
    setProgress(value) {
      this.progress = value;
    },
    setLevel(nextLevel) {
      if (nextLevel === this.level) return;
      this.level = nextLevel;
      this.listeners.forEach((fn) => fn(nextLevel));
    },
    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    },
    setProjectIndex(nextIndex) {
      if (nextIndex === this.projectIndex) return;
      this.projectIndex = nextIndex;
      this.projectListeners.forEach((fn) => fn(nextIndex));
    },
    subscribeProject(fn) {
      this.projectListeners.add(fn);
      return () => this.projectListeners.delete(fn);
    },
  };
}

const ProgressContext = createContext(null);

export function ProgressProvider({ store, children }) {
  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

export function useProgressStore() {
  const store = useContext(ProgressContext);
  if (!store) throw new Error("useProgressStore must be used within a ProgressProvider");
  return store;
}

export function useProgressStoreRef() {
  return useRef(createProgressStore()).current;
}
