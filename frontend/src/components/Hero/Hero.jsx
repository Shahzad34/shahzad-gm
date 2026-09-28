import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { gsap } from "../../lib/gsapSetup.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

/**
 * Hero — "PLAYER 1: SHAHZAD", refined.
 *
 * The creative concept is unchanged (the character render, the PLAYER 1
 * label, the rotating developer profiles), but it now reads as a premium
 * developer hero instead of a game HUD: one name, one role, one value
 * statement, two CTAs, four quiet profile links. The spinning rings, the
 * floating badge cluster, the corner labels, the particle field and the
 * 300vh scroll-jacked pin have all been removed — the portrait, the name
 * and the type hierarchy do the work now.
 *
 * The role "scroller" is still here, re-implemented as a calm vertical
 * slide/fade rotator on a single mounted node: it eases up and out, the
 * next role swaps in on the state change, then slides in from below. It
 * advances on a slow timer and can be driven manually through the thin
 * progress bars under it. Nothing about it blocks scrolling.
 */

const CHARACTER_IMAGE = `${import.meta.env.BASE_URL}assets/hero-character.png`;

// The four roles this portfolio actually represents.
const ROLES = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Python Developer",
  "Flutter Developer",
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Shahzad34", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-shahzad-pk/", icon: Linkedin },
  { label: "WhatsApp", href: "https://wa.me/923091200362", icon: MessageCircle },
  { label: "Email", href: "mailto:shahzadgm13@gmail.com", icon: Mail },
];

const ROTATE_INTERVAL = 4600;

export default function Hero({ reveal }) {
  const rootRef = useRef(null);
  const roleRef = useRef(null);
  const activeIndexRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const [activeRole, setActiveRole] = useState(0);

  // ---- Role rotator: one node sliding out upward / in from below ----
  const rotateTo = useCallback(
    (next) => {
      const index = ((next % ROLES.length) + ROLES.length) % ROLES.length;
      if (index === activeIndexRef.current) return;
      activeIndexRef.current = index;

      const el = roleRef.current;
      if (reducedMotion || !el) {
        setActiveRole(index);
        return;
      }

      gsap
        .timeline()
        .to(el, { opacity: 0, y: -12, duration: 0.28, ease: "power2.in" })
        .call(() => {
          setActiveRole(index);
          gsap.set(el, { y: 14 });
        })
        .to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (reducedMotion) return undefined;
    // Re-armed whenever the visible role changes, so a manual selection
    // also restarts the cycle instead of firing straight after a click.
    const id = setInterval(() => rotateTo(activeIndexRef.current + 1), ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [reducedMotion, rotateTo, activeRole]);

  // ---- One-shot entrance, timed to the boot splash's wipe-out ----
  useEffect(() => {
    if (!reveal || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const settle = () => gsap.set("[data-hero]", { clearProps: "opacity,transform" });

      gsap
        .timeline({ defaults: { ease: "power3.out" }, onComplete: settle })
        .from('[data-hero="eyebrow"]', { opacity: 0, y: 12, duration: 0.45 })
        .from('[data-hero="name"]', { opacity: 0, y: 26, duration: 0.7 }, "-=0.3")
        .from('[data-hero="role"]', { opacity: 0, y: 16, duration: 0.5 }, "-=0.42")
        .from('[data-hero="statement"]', { opacity: 0, y: 16, duration: 0.5 }, "-=0.34")
        .from('[data-hero="cta"]', { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 }, "-=0.3")
        .from('[data-hero="social"]', { opacity: 0, y: 14, duration: 0.5 }, "-=0.3")
        .from('[data-hero="portrait"]', { opacity: 0, y: 24, scale: 0.97, duration: 0.8 }, "-=0.95");
    }, rootRef);

    // Safety net — the hero must never be left invisible if the loader's
    // timeline is interrupted (e.g. a fast route change mid-boot).
    const settleTimeout = setTimeout(
      () => gsap.set("[data-hero]", { clearProps: "opacity,transform" }),
      4000
    );

    return () => {
      clearTimeout(settleTimeout);
      ctx.revert();
    };
  }, [reveal, reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="home"
      aria-label="Shahzad GM — full stack developer"
      className="relative flex min-h-screen w-full items-center overflow-hidden"
    >
      {/* Tier 3 — background support only: a faint grid, two soft ambient
          glows, nothing animated, so it never competes with the copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_78%_72%_at_45%_35%,#000_20%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] top-[-12%] -z-10 h-[520px] w-[520px] rounded-full bg-neon-purple/[0.10] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-22%] right-[-14%] -z-10 h-[560px] w-[560px] rounded-full bg-neon-cyan/[0.09] blur-[160px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-14 px-6 pb-20 pt-32 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-20 lg:pb-28 lg:pt-32">
        {/* ---- Text column ---- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span
            data-hero="eyebrow"
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-300 sm:tracking-[0.18em]"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="hidden sm:inline">Player 1 &middot; Available for new opportunities</span>
            <span className="sm:hidden">Player 1 &middot; Open to work</span>
          </span>

          <div data-hero="name" className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-slate-500">
              Shahzad
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(42px,8.4vw,84px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#EAF6FF] [text-shadow:0_0_60px_rgba(0,240,255,0.16)]">
              GM
            </h1>
          </div>

          <div data-hero="role" className="mt-6 flex min-h-[38px] items-center">
            <h2
              ref={roleRef}
              className="bg-[linear-gradient(100deg,#00f0ff,#b026ff)] bg-clip-text font-display text-[clamp(19px,3.2vw,28px)] font-semibold tracking-[-0.01em] text-transparent"
            >
              {ROLES[activeRole]}
            </h2>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {ROLES.map((role, i) => (
              <button
                key={role}
                type="button"
                onClick={() => rotateTo(i)}
                aria-label={`Show role: ${role}`}
                aria-pressed={i === activeRole}
                className={`h-[3px] rounded-full transition-all duration-500 ease-out ${
                  i === activeRole
                    ? "w-9 bg-[linear-gradient(90deg,#00f0ff,#b026ff)]"
                    : "w-4 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          <p
            data-hero="statement"
            className="mt-8 max-w-[56ch] text-[16.5px] leading-[1.75] text-slate-400"
          >
            I build production-ready web and mobile applications — from database architecture
            and API design to fast, responsive interfaces people actually enjoy using.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              to="/projects"
              data-hero="cta"
              data-cursor="pointer"
              className="group inline-flex min-h-[50px] items-center gap-2 rounded-[10px] bg-[linear-gradient(100deg,#17d4e8,#8b2cf0)] px-7 font-display text-[13.5px] font-bold uppercase tracking-[0.05em] text-[#05070d] shadow-[0_18px_36px_-22px_rgba(0,240,255,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-22px_rgba(176,38,255,0.65)]"
            >
              View My Projects
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}cv/Shahzad-CV.pdf`}
              download="Shahzad-CV.pdf"
              aria-label="Download Shahzad CV"
              data-hero="cta"
              data-cursor="pointer"
              className="group inline-flex min-h-[50px] items-center gap-2 rounded-[10px] border border-white/[0.15] bg-[linear-gradient(160deg,rgba(0,240,255,0.07),rgba(176,38,255,0.06))] px-7 font-display text-[13.5px] font-bold uppercase tracking-[0.05em] text-[#EAF6FF] transition-all duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-neon-cyan/60 hover:text-neon-cyan hover:shadow-[0_14px_32px_-16px_rgba(0,240,255,0.45)]"
            >
              Download CV
              <Download
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-[250ms] ease-out group-hover:translate-y-0.5"
              />
            </a>
            <Link
              to="/contact"
              data-hero="cta"
              data-cursor="pointer"
              className="inline-flex min-h-[50px] items-center rounded-[10px] border border-white/[0.15] bg-white/[0.02] px-7 font-display text-[13.5px] font-bold uppercase tracking-[0.05em] text-[#EAF6FF] transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              Get In Touch
            </Link>
          </div>

          <div
            data-hero="social"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-6 sm:gap-x-6 lg:justify-start"
          >
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] text-slate-500 transition-colors duration-200 hover:text-white"
                >
                  <Icon size={15} strokeWidth={1.7} />
                  {social.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* ---- Portrait column ---- */}
        <div
          data-hero="portrait"
          className="relative mx-auto w-full max-w-[380px] lg:max-w-none"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-14%] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.14),rgba(176,38,255,0.10)_45%,transparent_72%)] blur-[26px]"
          />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(160deg,rgba(0,240,255,0.10),rgba(24,16,44,0.72)_45%,rgba(8,6,18,0.92))] shadow-[0_50px_90px_-60px_rgba(0,0,0,0.95)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(0,240,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.06)_1px,transparent_1px)] [background-size:34px_34px]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent"
            />

            <img
              src={CHARACTER_IMAGE}
              alt="Shahzad GM — developer character render"
              draggable={false}
              className="absolute bottom-[11%] left-1/2 h-[88%] w-auto max-w-none -translate-x-1/2 select-none object-contain [filter:drop-shadow(0_18px_34px_rgba(0,0,0,0.6))]"
            />

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.09] bg-[rgba(5,4,12,0.72)] px-4 py-3 backdrop-blur-md">
              <div className="min-w-0 text-left">
                <p className="truncate font-display text-[13px] font-semibold text-[#EAF6FF]">
                  Shahzad GM
                </p>
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {ROLES[activeRole]}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.06] font-display text-[12px] font-bold text-neon-cyan">
                SG
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

