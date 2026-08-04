/**
 * Header with soft atmospheric band + bottom fade into the glass dashboard.
 * Dual-world / continuity portrait slideshow slots reserved — replace gradient
 * layers with real campaign images when assets are ready.
 */
export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-white/10">
      {/* Atmospheric depth — stands in until dual-world portraits ship */}
      <div
        className="header-fade pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 90% 120% at 15% -30%, rgba(56,189,248,0.28), transparent 55%),
            radial-gradient(ellipse 70% 90% at 95% 10%, rgba(52,211,153,0.14), transparent 50%),
            radial-gradient(ellipse 50% 60% at 50% 100%, rgba(15,23,42,0.9), transparent 70%),
            linear-gradient(180deg, #0f172a 0%, #0a0c10 100%)
          `,
        }}
      />

      {/* Subtle grid texture for non-vanilla depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl border border-sky-400/40 bg-sky-500/15 font-display text-xl text-sky-200">
            Σ
          </span>
          <div>
            <div className="font-display text-2xl leading-none text-white">VA Math</div>
            <div className="text-xs text-slate-400 mt-0.5">Built by a veteran for veterans</div>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <div className="text-xs uppercase tracking-wider text-slate-500">2026 rates</div>
          <div className="text-sm text-slate-300">Combine → Pay estimate</div>
        </div>
      </div>
    </header>
  )
}
