import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Reply, Inbox, RefreshCw } from "lucide-react";
import { fetchMessages, setMessageRead, deleteMessage, errorMessage } from "../../lib/api.js";
import { PageHeader, Panel, EmptyState, Notice, Loading } from "./AdminUI.jsx";
import styles from "./AdminMessages.module.css";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState({ state: "ok", message: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
      setNotice({ state: "ok", message: "" });
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't load messages.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleRead(message) {
    setBusyId(message._id);
    try {
      const updated = await setMessageRead(message._id, !message.read);
      setMessages((list) => list.map((m) => (m._id === updated._id ? updated : m)));
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't update that message.") });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(message) {
    const ok = window.confirm(`Delete the message from ${message.name}? This can't be undone.`);
    if (!ok) return;

    setBusyId(message._id);
    try {
      await deleteMessage(message._id);
      setMessages((list) => list.filter((m) => m._id !== message._id));
      setNotice({ state: "ok", message: "Message deleted." });
    } catch (err) {
      setNotice({ state: "error", message: errorMessage(err, "Couldn't delete that message.") });
    } finally {
      setBusyId(null);
    }
  }

  const unread = messages.filter((m) => !m.read).length;
  const visible =
    filter === "unread" ? messages.filter((m) => !m.read)
      : filter === "read" ? messages.filter((m) => m.read)
        : messages;

  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Contact"
        highlight="messages"
        description="Everything submitted through the public contact form."
        actions={
          <button type="button" className="btn btn-ghost" onClick={load} data-cursor="pointer">
            <RefreshCw size={15} /> Refresh
          </button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter messages">
          {[
            { key: "all", label: `All (${messages.length})` },
            { key: "unread", label: `Unread (${unread})` },
            { key: "read", label: `Read (${messages.length - unread})` },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`${styles.filter} ${filter === f.key ? styles.filterActive : ""}`}
              data-cursor="pointer"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Notice state={notice.state} message={notice.message} />

      {loading ? (
        <Loading label="Loading messages" />
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyState
            icon={Inbox}
            title={filter === "all" ? "No messages yet" : "Nothing in this view"}
            hint={
              filter === "all"
                ? "Submissions from the public contact form will land here."
                : "Try a different filter to see the rest of the inbox."
            }
          />
        </Panel>
      ) : (
        <ul className={styles.list}>
          {visible.map((message) => (
            <li key={message._id}>
              <Panel className={`${styles.item} ${message.read ? "" : styles.itemUnread}`}>
                <div className={styles.itemHead}>
                  <div className={styles.who}>
                    <span className={styles.name}>{message.name}</span>
                    <a href={`mailto:${message.email}`} className={styles.email} data-cursor="pointer">
                      {message.email}
                    </a>
                  </div>

                  <div className={styles.headMeta}>
                    <span className={`${styles.badge} ${message.read ? styles.badgeRead : styles.badgeUnread}`}>
                      {message.read ? <MailOpen size={12} strokeWidth={2} /> : <Mail size={12} strokeWidth={2} />}
                      {message.read ? "Read" : "Unread"}
                    </span>
                    <span className={styles.date}>{formatDate(message.createdAt)}</span>
                  </div>
                </div>

                <p className={styles.subject}>{message.subject}</p>
                <p className={styles.body}>{message.message}</p>

                <div className={styles.actions}>
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                    className={styles.action}
                    data-cursor="pointer"
                  >
                    <Reply size={14} strokeWidth={1.8} /> Reply
                  </a>

                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => handleToggleRead(message)}
                    disabled={busyId === message._id}
                    data-cursor="pointer"
                  >
                    {message.read ? <Mail size={14} strokeWidth={1.8} /> : <MailOpen size={14} strokeWidth={1.8} />}
                    {message.read ? "Mark unread" : "Mark read"}
                  </button>

                  <button
                    type="button"
                    className={`${styles.action} ${styles.actionDanger}`}
                    onClick={() => handleDelete(message)}
                    disabled={busyId === message._id}
                    data-cursor="pointer"
                  >
                    <Trash2 size={14} strokeWidth={1.8} /> Delete
                  </button>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
