import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, FolderGit2, Sparkles, ArrowRight, Inbox, Database } from "lucide-react";
import { fetchMessages, fetchProjects, fetchSkills, errorMessage } from "../../lib/api.js";
import { PageHeader, Panel, EmptyState, Notice } from "./AdminUI.jsx";
import styles from "./AdminDashboard.module.css";

/**
 * The /admin landing page: a short set of live counts pulled from the three
 * collections, each tile linking straight to the page that manages it.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // All three are independent — fetch together and take whichever succeed.
    Promise.allSettled([fetchMessages(), fetchProjects(), fetchSkills()]).then(([m, p, s]) => {
      if (cancelled) return;

      const messages = m.status === "fulfilled" ? m.value : [];
      const projects = p.status === "fulfilled" ? p.value : [];
      const skills = s.status === "fulfilled" ? s.value : [];

      const rejected = [m, p, s].filter((r) => r.status === "rejected");
      if (rejected.length) {
        setError(errorMessage(rejected[0].reason, "Some data couldn't be loaded."));
      }

      setStats({
        messages: messages.length,
        unread: messages.filter((m2) => !m2.read).length,
        projects: projects.length,
        featured: projects.filter((p2) => p2.featured).length,
        skills: skills.length,
        categories: new Set(skills.map((s2) => s2.category)).size,
        latest: messages[0] ?? null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Content"
        highlight="control"
        description="Everything on the public site is driven from here — messages, projects and skills all live in MongoDB."
        actions={
          <Link to="/admin/projects" className="btn btn-ghost" data-cursor="pointer">
            Manage projects <ArrowRight size={15} />
          </Link>
        }
      />

      <Notice state="error" message={error} />

      <div className={styles.tiles}>
        <StatTile
          to="/admin/messages"
          icon={Inbox}
          label="Messages"
          value={stats ? stats.messages : "—"}
          sub={stats ? `${stats.unread} unread` : "Loading"}
        />
        <StatTile
          to="/admin/projects"
          icon={FolderGit2}
          label="Projects"
          value={stats ? stats.projects : "—"}
          sub={stats ? `${stats.featured} featured` : "Loading"}
        />
        <StatTile
          to="/admin/skills"
          icon={Sparkles}
          label="Skills"
          value={stats ? stats.skills : "—"}
          sub={stats ? `${stats.categories} categories` : "Loading"}
        />
      </div>

      <Panel className={styles.recent}>
        <div className={styles.recentHead}>
          <div>
            <h2 className={styles.recentTitle}>Latest message</h2>
            <p className={styles.recentMeta}>Most recent submission from the contact form</p>
          </div>
          <Link to="/admin/messages" className={styles.recentLink} data-cursor="pointer">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {!stats ? (
          <p className={`mono ${styles.recentLoading}`}>Loading…</p>
        ) : stats.latest ? (
          <div className={styles.recentBody}>
            <div className={styles.recentWho}>
              <span className={styles.recentName}>{stats.latest.name}</span>
              <span className={styles.recentEmail}>{stats.latest.email}</span>
            </div>
            <p className={styles.recentSubject}>{stats.latest.subject}</p>
            <p className={styles.recentText}>{stats.latest.message}</p>
          </div>
        ) : (
          <EmptyState
            icon={Mail}
            title="No messages yet"
            hint="Submissions from the public contact form will show up here."
          />
        )}
      </Panel>

      <Panel className={styles.seed}>
        <div className={styles.seedIcon}>
          <Database size={18} strokeWidth={1.6} />
        </div>
        <div>
          <h2 className={styles.recentTitle}>Fresh install?</h2>
          <p className={styles.recentMeta}>
            Load the original projects and skills into MongoDB with{" "}
            <code className={styles.code}>npm run seed</code> in the backend folder. Add{" "}
            <code className={styles.code}>-- --reset</code> to wipe and reinsert.
          </p>
        </div>
      </Panel>
    </>
  );
}

function StatTile({ to, icon: Icon, label, value, sub }) {
  return (
    <Link to={to} className={`glass ${styles.tile}`} data-cursor="pointer">
      <span className={styles.tileIcon}>
        <Icon size={19} strokeWidth={1.6} />
      </span>
      <span className={styles.tileValue}>{value}</span>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileSub}>{sub}</span>
    </Link>
  );
}