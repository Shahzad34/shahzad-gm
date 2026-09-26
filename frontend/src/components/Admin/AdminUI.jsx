import styles from "./AdminUI.module.css";

/**
 * Small shared primitives for the admin pages. They deliberately reuse the
 * site's existing type/color language — display font for headings, mono for
 * labels and timestamps, the same glass surface and radius tokens as every
 * public section — so the panel reads as part of the same site rather than a
 * bolted-on admin template.
 */

/** Page heading: an eyebrow, a section-title and an optional action slot. */
export function PageHeader({ eyebrow, title, highlight, description, actions }) {
  return (
    <header className={styles.pageHeader}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className={`section-title ${styles.pageTitle}`}>
          {title}
          {highlight && <span> {highlight}</span>}
        </h1>
        {description && <p className="section-subtitle">{description}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </header>
  );
}

/**
 * A labelled input/textarea/select, styled exactly like the public contact
 * form's fields. Renders whatever control is passed via `as`.
 */
export function Field({ label, id, hint, as: Control = "input", className = "", ...props }) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <Control id={id} {...props} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/** Glass card wrapper used for lists, forms and the dashboard tiles. */
export function Panel({ className = "", children, ...rest }) {
  return (
    <div className={`glass ${styles.panel} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function PanelHeader({ title, meta, actions }) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <h2 className={styles.panelTitle}>{title}</h2>
        {meta && <p className={styles.panelMeta}>{meta}</p>}
      </div>
      {actions && <div className={styles.panelActions}>{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, children }) {
  return (
    <div className={styles.empty}>
      {Icon && (
        <span className={styles.emptyIcon}>
          <Icon size={22} strokeWidth={1.4} />
        </span>
      )}
      <p className={styles.emptyTitle}>{title}</p>
      {hint && <p className={styles.emptyHint}>{hint}</p>}
      {children}
    </div>
  );
}

export function Loading({ label = "Loading" }) {
  return <p className={`mono ${styles.loading}`}>{label}…</p>;
}

/** Inline status line — same success/error language as the contact form. */
export function Notice({ state, message }) {
  if (!message) return null;
  return (
    <p className={state === "error" ? styles.noticeError : styles.noticeOk} role={state === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}
