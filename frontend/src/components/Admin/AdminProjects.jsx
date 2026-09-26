import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderGit2, X, Star, RefreshCw } from "lucide-react";
import {
  fetchProjects, createProject, updateProject, deleteProject, errorMessage,
} from "../../lib/api.js";
import { PageHeader, Panel, PanelHeader, Field, EmptyState, Notice, Loading } from "./AdminUI.jsx";
import styles from "./AdminProjects.module.css";

const EMPTY = {
  title: "",
  description: "",
  imageUrl: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  category: "",
  featured: false,
  order: 0,
};

/** Turns the stored document into the flat, editable form state. */
function toForm(project) {
  return {
    title: project.title ?? "",
    description: project.description ?? "",
    imageUrl: project.imageUrl ?? "",
    techStack: (project.techStack ?? []).join(", "),
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    category: project.category ?? "",
    featured: Boolean(project.featured),
    order: project.order ?? 0,
  };
}

/** Form state -> API payload (techStack is typed as a comma-separated list). */
function toPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    techStack: form.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    githubUrl: form.githubUrl.trim(),
    liveUrl: form.liveUrl.trim(),
    category: form.category.trim() || "General",
    featured: form.featured,
    order: Number(form.order) || 0,
  };
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = form closed
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ state: "ok", message: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't load projects.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY, order: projects.length + 1 });
    setNotice({ state: "ok", message: "" });
  }

  function startEdit(project) {
    setEditingId(project._id);
    setForm(toForm(project));
    setNotice({ state: "ok", message: "" });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (editingId) {
        const updated = await updateProject(editingId, payload);
        setProjects((list) => list.map((p) => (p._id === updated._id ? updated : p)));
        setNotice({ state: "ok", message: "Project updated." });
      } else {
        const created = await createProject(payload);
        setProjects((list) => [...list, created]);
        setNotice({ state: "ok", message: "Project created." });
      }
      setForm(null);
      setEditingId(null);
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't save that project.") });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project) {
    const ok = window.confirm(`Delete "${project.title}"? This can't be undone.`);
    if (!ok) return;
    try {
      await deleteProject(project._id);
      setProjects((list) => list.filter((p) => p._id !== project._id));
      if (editingId === project._id) setForm(null);
      setNotice({ state: "ok", message: "Project deleted." });
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't delete that project.") });
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Manage"
        highlight="projects"
        description="These render on the public Projects section straight from the database."
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={load} data-cursor="pointer">
              <RefreshCw size={15} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={startCreate} data-cursor="pointer">
              <Plus size={16} /> New project
            </button>
          </>
        }
      />

      <Notice state={notice.state} message={notice.message} />

      {form && (
        <Panel className={styles.formPanel}>
          <PanelHeader
            title={editingId ? "Edit project" : "New project"}
            meta={editingId ? "Updating an existing entry" : "Adding a new entry"}
            actions={
              <button
                type="button"
                className={styles.close}
                onClick={() => setForm(null)}
                aria-label="Close form"
                data-cursor="pointer"
              >
                <X size={17} />
              </button>
            }
          />

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.grid2}>
              <Field
                label="Title"
                id="p-title"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="EventSphere Management"
              />
              <Field
                label="Category"
                id="p-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Full Stack"
              />
            </div>

            <Field
              label="Description"
              id="p-description"
              as="textarea"
              required
              value={form.description}
              onChange={handleChange}
              placeholder="What the project does and what problem it solves."
            />

            <div className={styles.grid2}>
              <Field
                label="GitHub URL"
                id="p-github"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
              <Field
                label="Live URL"
                id="p-live"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className={styles.grid2}>
              <Field
                label="Image URL"
                id="p-image"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://.../preview.png"
                hint="Optional — a generated cover is shown when empty."
              />
              <Field
                label="Order"
                id="p-order"
                name="order"
                type="number"
                min="0"
                value={form.order}
                onChange={handleChange}
                hint="Lower numbers sort first."
              />
            </div>

            <Field
              label="Tech stack"
              id="p-tech"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, Express, MongoDB"
              hint="Comma separated."
            />

            <label className={styles.checkbox}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              <span>Featured project</span>
            </label>

            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary" disabled={saving} data-cursor="pointer">
                {saving ? "Saving..." : editingId ? "Save changes" : "Create project"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)} data-cursor="pointer">
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}

      {loading ? (
        <Loading label="Loading projects" />
      ) : projects.length === 0 ? (
        <Panel>
          <EmptyState
            icon={FolderGit2}
            title="No projects yet"
            hint="Add your first project, or run `npm run seed` in the backend to load the existing ones."
          />
        </Panel>
      ) : (
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project._id}>
              <Panel className={styles.item}>
                <div className={styles.itemHead}>
                  <div className={styles.headText}>
                    {project.category && <span className={styles.category}>{project.category}</span>}
                    <h3 className={styles.title}>{project.title}</h3>
                  </div>

                  <div className={styles.itemActions}>
                    {project.featured && (
                      <span className={styles.star} title="Featured">
                        <Star size={13} strokeWidth={2} fill="currentColor" />
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      className={styles.action}
                      onClick={() => startEdit(project)}
                      data-cursor="pointer"
                    >
                      <Pencil size={14} strokeWidth={1.8} /> Edit
                    </button>
                    <button
                      type="button"
                      className={`${styles.action} ${styles.actionDanger}`}
                      onClick={() => handleDelete(project)}
                      data-cursor="pointer"
                    >
                      <Trash2 size={14} strokeWidth={1.8} /> Delete
                    </button>
                  </div>
                </div>

                <p className={styles.desc}>{project.description}</p>

                {project.techStack?.length > 0 && (
                  <div className={styles.badges}>
                    {project.techStack.map((t) => (
                      <span key={t} className={styles.badge}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <p className={styles.meta}>
                  <span>Order {project.order ?? 0}</span>
                  {project.githubUrl && <span className={styles.trunc}>Code: {project.githubUrl}</span>}
                  {project.liveUrl && <span className={styles.trunc}>Live: {project.liveUrl}</span>}
                </p>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

