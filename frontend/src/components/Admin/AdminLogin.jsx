import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, LogIn, AlertCircle } from "lucide-react";
import { adminLogin, errorMessage } from "../../lib/api.js";
import { isAdminAuthed } from "../../lib/adminAuth.js";
import { Field } from "./AdminUI.jsx";
import styles from "./AdminLogin.module.css";

/**
 * The one and only admin sign-in. Credentials are checked server-side against
 * ADMIN_EMAIL / ADMIN_PASSWORD; on success the returned JWT is stored by
 * lib/api.js and the router swaps this page for the dashboard.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  if (isAdminAuthed()) {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await adminLogin(form);
      navigate("/admin", { replace: true });
    } catch (err) {
      setStatus({
        state: "error",
        message: errorMessage(err, "Couldn't sign in. Is the backend running?"),
      });
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={`glass glass-neon ${styles.card}`}>
        <span className={styles.badge}>
          <ShieldCheck size={13} strokeWidth={1.9} aria-hidden="true" />
          Restricted
        </span>

        <span className="eyebrow">Admin</span>
        <h1 className={`section-title ${styles.title}`}>
          Control <span>panel</span>
        </h1>
        <p className={styles.sub}>
          Sign in with the administrator account to manage messages, projects and skills.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Field
            label="Email"
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="shahzad@gmail.com"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Password"
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={status.state === "loading"}>
            {status.state === "loading" ? (
              "Signing in..."
            ) : (
              <>
                Sign in <LogIn size={16} />
              </>
            )}
          </button>

          {status.state === "error" && (
            <p className={styles.error} role="alert">
              <AlertCircle size={16} /> {status.message}
            </p>
          )}

          <p className={styles.footNote}>
            <Lock size={12} strokeWidth={1.9} aria-hidden="true" />
            Single shared account — no signup, no user database.
          </p>
        </form>

        {/* Decorative icon marks, borrowed from the site icon language. */}
        <Mail className={styles.decoA} size={64} strokeWidth={0.7} aria-hidden="true" />
      </div>
    </div>
  );
}