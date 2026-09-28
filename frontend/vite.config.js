import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
// so assets need that sub-path. The deploy workflow sets VITE_BASE from the
// repo name automatically; locally it defaults to "/" so `npm run dev` works.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
