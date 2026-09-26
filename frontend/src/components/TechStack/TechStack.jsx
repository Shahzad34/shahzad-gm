import { Cog, ShieldCheck, Cpu, Database } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";

const STACK = [
  { label: "Development", icon: Cog, accent: "cyan" },
  { label: "Security", icon: ShieldCheck, accent: "purple" },
  { label: "Cybernetic", icon: Cpu, accent: "cyan" },
  { label: "Backend", icon: Database, accent: "purple" },
];

const ACCENT = {
  cyan: {
    ring: "border-neon-cyan/70 shadow-[0_0_18px_rgba(0,243,255,0.35)] group-hover:border-neon-cyan group-hover:shadow-[0_0_30px_rgba(0,243,255,0.75)]",
    icon: "text-neon-cyan",
    label: "text-neon-cyan/90 group-hover:[text-shadow:0_0_10px_#00f3ff]",
  },
  purple: {
    ring: "border-neon-purple/70 shadow-[0_0_18px_rgba(188,19,254,0.35)] group-hover:border-neon-purple group-hover:shadow-[0_0_30px_rgba(188,19,254,0.75)]",
    icon: "text-neon-purple",
    label: "text-neon-purple/90 group-hover:[text-shadow:0_0_10px_#bc13fe]",
  },
};

export default function TechStack() {
  const [ref, visible] = useReveal();

  return (
    <section aria-label="Tech stack" className="relative w-full overflow-x-hidden py-16 sm:py-20">
      {/* Same ambient neon grid used across the rest of the site (Hero,
          .section::before) so this section reads as part of the same
          continuous background instead of a flat solid block. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background-image:linear-gradient(rgba(0,240,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.035)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_20%,transparent_100%)]"
      />

      <div
        ref={ref}
        className={`relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center px-6 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Animated transmission line with moving dots, sitting above the icons */}
        <div className="relative mb-14 h-px w-full max-w-[560px] bg-[linear-gradient(90deg,transparent,rgba(0,243,255,0.5)_15%,rgba(188,19,254,0.5)_50%,rgba(0,243,255,0.5)_85%,transparent)]">
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_8px_2px_rgba(0,243,255,0.8)] animate-moveDot"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neon-purple shadow-[0_0_8px_2px_rgba(188,19,254,0.8)] animate-moveDot [animation-delay:1.5s]"
          />
        </div>

        {/* 4 icons */}
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
          {STACK.map(({ label, icon: Icon, accent }) => {
            const a = ACCENT[accent];
            return (
              <div key={label} className="group flex flex-col items-center gap-3">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 ${a.ring}`}
                >
                  <Icon size={26} strokeWidth={1.5} className={a.icon} />
                </span>
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${a.label}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
