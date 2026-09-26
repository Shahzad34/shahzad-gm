import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Mail, FolderGit2, Sparkles, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { clearAdminToken, isAdminAuthed } from "../../lib/adminAuth.js";
import styles from "./AdminLayout.module.css";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
];

/**
 * The admin shell: a fixed sidebar plus the active page in an <Outlet/>.
 *
 * Guard rails live here rather than in each page — a missing token bounces
 * straight to /admin/login, and so does the `admin:unauthorized` event the
 * axios interceptor dispatches whenever the API answers any admin call with
 * a 401 (expired or tampered token).
 *
 * The panel deliberately skips the public site's decorative chrome (loader,
 * custom cursor, CRT overlay, navbar, footer) — it's a plain dashboard — but
 * it is built from the same tokens, glass surfaces and type scale so it still
 * looks like the same site.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const authed = isAdminAuthed();

  useEffect(() => {
    const onUnauthorized = () => navigate("/admin/login", { replace: true });
    window.addEventListener("admin:unauthorized", onUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", onUnauthorized);
  }, [navigate]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  const current = LINKS.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)));

  return (
    <div className={styles.shell}>
      {/* Scrim behind the mobile drawer */}
      {navOpen && <div className={styles.scrim} onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${navOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <span className={styles.monogram}>SG</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Shahzad</span>
            <span className={styles.brandRole}>Admin Console</span>
          </span>
        </div>

        <span className={styles.navLabel}>Manage</span>
        <nav className={styles.nav} aria-label="Admin">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              data-cursor="pointer"
            >
              <link.icon size={16} strokeWidth={1.8} aria-hidden="true" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.footLink} data-cursor="pointer">
            <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
            View site
          </a>
          <button type="button" className={styles.logout} onClick={handleLogout} data-cursor="pointer">
            <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        {/* Compact bar shown only on narrow screens, where the sidebar is a drawer */}
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.burger}
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={navOpen}
            data-cursor="pointer"
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className={styles.topbarTitle}>{current?.label ?? "Admin"}</span>
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}