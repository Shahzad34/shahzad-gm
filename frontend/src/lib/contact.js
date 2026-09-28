/**
 * Contact form delivery for a fully static site (no backend).
 *
 * - If VITE_FORMSPREE_ENDPOINT is set at build time (e.g.
 *   https://formspree.io/f/xxxxxxx), the message is POSTed there and lands in
 *   your inbox without leaving the page.
 * - Otherwise it falls back to opening the visitor's email app with the
 *   message pre-filled (mailto:), so the form always works with zero setup.
 */
const CONTACT_EMAIL = "shahzadgm13@gmail.com";
const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export async function sendContactMessage({ name, email, subject, message }) {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) throw new Error("Message could not be sent.");
    return { message: "Message sent — I'll reply soon." };
  }

  const body = `${message}\n\n— ${name} (${email})`;
  const url =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject || "Portfolio contact")}` +
    `&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  return { message: "Opening your email app — just hit send to deliver the message." };
}
