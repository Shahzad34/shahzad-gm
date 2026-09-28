import { useState } from "react";
import {
  Mail, Github, Linkedin, MessageCircle, Briefcase, Send, CheckCircle2, AlertCircle, ArrowRight, Download,
} from "lucide-react";
import { sendContactMessage } from "../../lib/contact.js";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./Contact.module.css";

const SOCIALS = [
  { icon: Mail, label: "Email", href: "mailto:shahzadgm13@gmail.com" },
  { icon: Github, label: "GitHub", href: "https://github.com/Shahzad34" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-shahzad-pk/" },
  { icon: Briefcase, label: "Indeed", href: "https://profile.indeed.com/?hl=en_PK&co=PK&from=gnav-homepage" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/923091200362" },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [ref, visible] = useReveal();
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
      setStatus({ state: "success", message: res.message || "Message sent — I'll reply soon." });
      setForm(initialForm);
    } catch (err) {
      const message =
        err?.message || "Couldn't send the message. Please email me directly instead.";
      setStatus({ state: "error", message });
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div ref={ref} className={`${styles.wrap} ${visible ? styles.visible : ""}`}>
          <div className={styles.intro}>
            <span className="eyebrow">Contact</span>
            <h2 className="section-title">
              Let's build something <span>great together</span>
            </h2>
            <p className={`section-subtitle ${styles.lede}`}>
              Have a project in mind, or just want to talk shop? Tell me what you're building and
              I'll get back to you with a clear plan and next steps.
            </p>

            <div className={styles.ctaRow}>
              <a href="#contact-form" className={`btn btn-primary ${styles.ctaBtn}`} data-cursor="pointer">
                Start a Project <ArrowRight size={16} />
              </a>
              <a
                href={`${import.meta.env.BASE_URL}cv/Shahzad-CV.pdf`}
                download="Shahzad-CV.pdf"
                aria-label="Download Shahzad CV"
                className={styles.downloadCv}
                data-cursor="pointer"
              >
                <Download size={15} strokeWidth={1.9} aria-hidden="true" />
                Download My CV
              </a>
            </div>

            <ul className={styles.channels}>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.channel}
                    data-cursor="pointer"
                  >
                    <s.icon size={16} strokeWidth={1.8} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form
            id="contact-form"
            onSubmit={handleSubmit}
            className={`glass ${styles.form}`}
            noValidate
          >
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" required value={form.subject} onChange={handleChange} placeholder="What's this about?" />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project..." />
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={status.state === "loading"}>
              {status.state === "loading" ? "Sending..." : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>

            {status.state === "success" && (
              <p className={styles.success} role="status">
                <CheckCircle2 size={16} /> {status.message}
              </p>
            )}
            {status.state === "error" && (
              <p className={styles.error} role="alert">
                <AlertCircle size={16} /> {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
