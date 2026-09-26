import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Sparkles, RefreshCw } from "lucide-react";
import { fetchSkills, createSkill, updateSkill, deleteSkill, errorMessage } from "../../lib/api.js";
import { SKILL_ICONS, SKILL_ICON_KEYS, DEFAULT_SKILL_ICON, groupSkillsByCategory } from "../../lib/skills.js";
import { PageHeader, Panel, PanelHeader, Field, EmptyState, Notice, Loading } from "./AdminUI.jsx";
import styles from "./AdminSkills.module.css";

const EMPTY = { category: "", categoryOrder: 0, name: "", icon: DEFAULT_SKILL_ICON, description: "", order: 0 };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ state: "ok", message: "" });

  // Same grouping the public Skills section uses, so what you see here is
  // exactly what renders there.
  const groups = useMemo(() => groupSkillsByCategory(skills), [skills]);
  const categories = useMemo(() => groups.map((g) => g.label), [groups]);

  // A new category goes to the end of the tab strip; an existing one keeps
  // the position it already has, so editing a skill never reshuffles tabs.
  function resolveCategoryOrder(category) {
    const match = skills.find((s) => s.category === category);
    return match ? match.categoryOrder ?? 0 : categories.length;
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSkills();
      setSkills(data);
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't load skills.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditingId(null);
    const category = categories[0] ?? "";
    setForm({
      ...EMPTY,
      category,
      categoryOrder: resolveCategoryOrder(category),
      order: groups[0]?.items.length ?? 0,
    });
    setNotice({ state: "ok", message: "" });
  }

  function startEdit(skill) {
    setEditingId(skill._id);
    setForm({
      category: skill.category ?? "",
      categoryOrder: skill.categoryOrder ?? 0,
      name: skill.name ?? "",
      icon: skill.icon ?? DEFAULT_SKILL_ICON,
      description: skill.description ?? "",
      order: skill.order ?? 0,
    });
    setNotice({ state: "ok", message: "" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      // Re-picking an existing category adopts that category's tab position
      // instead of keeping the previous field's number.
      if (name === "category" && value !== f.category) {
        return { ...f, category: value, categoryOrder: resolveCategoryOrder(value) };
      }
      return { ...f, [name]: value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        category: form.category.trim(),
        categoryOrder: Number(form.categoryOrder) || 0,
        name: form.name.trim(),
        icon: form.icon,
        description: form.description.trim(),
        order: Number(form.order) || 0,
      };
      if (editingId) {
        const updated = await updateSkill(editingId, payload);
        setSkills((list) => list.map((s) => (s._id === updated._id ? updated : s)));
        setNotice({ state: "ok", message: "Skill updated." });
      } else {
        const created = await createSkill(payload);
        setSkills((list) => [...list, created]);
        setNotice({ state: "ok", message: "Skill created." });
      }
      setForm(null);
      setEditingId(null);
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't save that skill.") });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill) {
    const ok = window.confirm(`Delete "${skill.name}"? This can't be undone.`);
    if (!ok) return;
    try {
      await deleteSkill(skill._id);
      setSkills((list) => list.filter((s) => s._id !== skill._id));
      if (editingId === skill._id) setForm(null);
      setNotice({ state: "ok", message: "Skill deleted." });
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't delete that skill.") });
    }
  }


  return (
    <>
      <PageHeader
        eyebrow="Stack"
        title="Manage"
        highlight="skills"
        description="Grouped by category — these render as the tabs on the public Skills section."
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={load} data-cursor="pointer">
              <RefreshCw size={15} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={startCreate} data-cursor="pointer">
              <Plus size={16} /> New skill
            </button>
          </>
        }
      />

      <Notice state={notice.state} message={notice.message} />

      {form && (
        <Panel className={styles.formPanel}>
          <PanelHeader
            title={editingId ? "Edit skill" : "New skill"}
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
                label="Name"
                id="s-name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="React"
              />
              <div>
                <Field
                  label="Category"
                  id="s-category"
                  name="category"
                  required
                  list="skill-categories"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Frontend"
                  hint="Existing or new — new categories become new tabs."
                />
                <datalist id="skill-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <Field
              label="Description"
              id="s-description"
              as="textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="One line on what you use it for."
            />

            <div className={styles.grid2}>
              <Field
                label="Order"
                id="s-order"
                name="order"
                type="number"
                min="0"
                value={form.order}
                onChange={handleChange}
                hint="Sorts within the category."
              />
              <Field
                label="Category order"
                id="s-category-order"
                name="categoryOrder"
                type="number"
                min="0"
                value={form.categoryOrder}
                onChange={handleChange}
                hint="Position of this category's tab. Lower comes first."
              />
            </div>

            <div className={styles.preview}>
              <span className={styles.previewLabel}>Preview</span>
              <span className={styles.previewCard}>
                <span className={styles.previewIcon}>
                  {(() => {
                    const Icon = SKILL_ICONS[form.icon] || SKILL_ICONS[DEFAULT_SKILL_ICON];
                    return <Icon size={19} strokeWidth={1.6} />;
                  })()}
                </span>
                <span className={styles.previewName}>{form.name || "Skill name"}</span>
              </span>
            </div>

            {/* Icon picker — the same lucide set the public section renders. */}
            <div className={styles.iconField}>
              <span className={styles.iconLabel}>Icon</span>
              <div className={styles.iconGrid} role="radiogroup" aria-label="Skill icon">
                {SKILL_ICON_KEYS.map((key) => {
                  const Icon = SKILL_ICONS[key];
                  const selected = form.icon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      title={key}
                      onClick={() => setForm((f) => ({ ...f, icon: key }))}
                      className={`${styles.iconBtn} ${selected ? styles.iconBtnActive : ""}`}
                      data-cursor="pointer"
                    >
                      <Icon size={17} strokeWidth={1.7} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary" disabled={saving} data-cursor="pointer">
                {saving ? "Saving..." : editingId ? "Save changes" : "Create skill"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)} data-cursor="pointer">
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}

      {loading ? (
        <Loading label="Loading skills" />
      ) : groups.length === 0 ? (
        <Panel>
          <EmptyState
            icon={Sparkles}
            title="No skills yet"
            hint="Add your first skill, or run `npm run seed` in the backend to load the existing ones."
          />
        </Panel>
      ) : (
        <div className={styles.groups}>
          {groups.map((group) => (
            <Panel key={group.label} className={styles.group}>
              <PanelHeader
                title={group.label}
                meta={`${group.items.length} skill${group.items.length === 1 ? "" : "s"}`}
              />

              <ul className={styles.list}>
                {group.items.map((skill) => {
                  const Icon = SKILL_ICONS[skill.icon] || SKILL_ICONS[DEFAULT_SKILL_ICON];
                  return (
                    <li key={skill._id} className={styles.item}>
                      <span className={styles.itemIcon}>
                        <Icon size={18} strokeWidth={1.6} />
                      </span>
                      <div className={styles.itemText}>
                        <span className={styles.itemName}>{skill.name}</span>
                        {skill.description && <p className={styles.itemDesc}>{skill.description}</p>}
                      </div>
                      <div className={styles.itemActions}>
                        <span className={styles.order}>{skill.order ?? 0}</span>
                        <button
                          type="button"
                          className={styles.action}
                          onClick={() => startEdit(skill)}
                          aria-label={`Edit ${skill.name}`}
                          data-cursor="pointer"
                        >
                          <Pencil size={14} strokeWidth={1.8} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.action} ${styles.actionDanger}`}
                          onClick={() => handleDelete(skill)}
                          aria-label={`Delete ${skill.name}`}
                          data-cursor="pointer"
                        >
                          <Trash2 size={14} strokeWidth={1.8} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}

