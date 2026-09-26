import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * Close the boot splash (the single loading screen, defined in index.html)
 * once React has actually painted its first frame.
 *
 * A double requestAnimationFrame is what makes this safe: the first rAF
 * fires after React's initial commit, the second after the browser has
 * painted it, so the splash never fades out to reveal an empty <div id="root">.
 * The splash enforces its own minimum on-screen time, so it also never
 * flashes past on a warm cache.
 */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.__BOOT__?.dismiss();
  });
});
