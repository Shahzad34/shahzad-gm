import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "../MobileMenu/MobileMenu.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

/**
 * Tailwind rewrite — logo and links share the same flex row with
 * `items-center`, so they're always vertically aligned regardless of the
 * logo badge's internal two-line stack. `z-50` keeps this above every
 * other section, including the Hero's floating skill nodes.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex min-h-[72px] items-center px-6 transition-colors duration-300 sm:px-10 ${
        scrolled ? "border-b border-white/[0.08] bg-[rgba(5,6,12,0.82)] backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between">
        {/* Wordmark — monogram tile plus name and role. No glow stack, no
            keyword tagline: it reads as a name, not a HUD readout. */}
        <NavLink to="/" end aria-label="Shahzad GM — home" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-neon-cyan/25 bg-[linear-gradient(140deg,rgba(0,240,255,0.10),rgba(176,38,255,0.12))] font-display text-[14px] font-extrabold text-[#EAF6FF] transition-colors duration-200 group-hover:border-neon-cyan/50">
            SG
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-bold uppercase tracking-[0.14em] text-[#EAF6FF]">
              Shahzad
            </span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:block">
              Full Stack Developer
            </span>
          </span>
        </NavLink>

        {/* Links + one quiet contact CTA. The active item is marked with a
            thin underline, so state never depends on colour alone. */}
        <div className="hidden items-center lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-0.5">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative rounded-md px-3.5 py-2 font-display text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-px bg-[linear-gradient(90deg,#00f0ff,#b026ff)] transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/contact"
            className="ml-4 inline-flex min-h-[40px] items-center rounded-[10px] border border-white/[0.14] px-4 font-display text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#EAF6FF] transition-colors duration-200 hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            Get in Touch
          </Link>
        </div>

        {/* Collapses to a hamburger below lg — mobile/tablet nav stacks via MobileMenu */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
    </header>
  );
}
