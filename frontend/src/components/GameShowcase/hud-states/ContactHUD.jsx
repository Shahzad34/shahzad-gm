import { useState } from "react";
import { Github, Linkedin, Mail, MessageCircle, Briefcase } from "lucide-react";
import { sendContactMessage } from "../../../lib/api.js";
import GlitchText from "../GlitchText.jsx";
import shared from "../HUD.module.css";
import styles from "./ContactHUD.module.css";

const SOCIALS = [
  { icon: Mail, label: "Email", href: "mailto:shahzadgm13@gmail.com" },
  { icon: Github, label: "GitHub", href: "https://github.com/Shahzad34" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-shahzad-pk/" },
  { icon: Briefcase, label: "Indeed", href: "https://profile.indeed.com/?hl=en_PK&co=PK&from=gnav-homepage" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/923091200362" },
];

const initialForm = { name: "", email: "", subject: "Transmission from the gateway", message: "" };

export default function ContactHUD() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await sendContactMessage(form);
      setStatus({ state: "success", message: res.message || "Transmission received." });
      setForm(initialForm);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Connection failed — is the backend server running?";
      setStatus({ state: "error", message });
    }
  }

  return (
    <div className={`${shared.panel} ${shared.mainPanel} ${styles.panel}`} style={{ maxWidth: 520 }}>
      <GlitchText text="FINAL BOSS // CONTACT" as="h2" className={shared.title} />
      <p className={shared.subtitle}>The gateway is open. Send a signal.</p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.row}>
          <input
            name="name"
            type="text"
            required
            placeholder="Callsign"
            value={form.name}
            onChange={handleChange}
            aria-label="Your name"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Frequency (email)"
            value={form.email}
            onChange={handleChange}
            aria-label="Your email"
          />
        </div>

        <textarea
          name="message"
          required
          rows={3}
          placeholder="Transmission..."
          value={form.message}
          onChange={handleChange}
          aria-label="Your message"
        />

        <button type="submit" className={styles.pressStart} disabled={status.state === "loading"}>
          {status.state === "loading" ? "TRANSMITTING..." : "PRESS START TO CONNECT"}
        </button>

        {status.state === "success" && (
          <p className={styles.success} role="status">
            {status.message}
          </p>
        )}
        {status.state === "error" && (
          <p className={styles.error} role="alert">
            {status.message}
          </p>
        )}
      </form>

      <div className={styles.socials}>
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
            <s.icon size={15} />
          </a>
        ))}
      </div>
    </div>
  );
}
