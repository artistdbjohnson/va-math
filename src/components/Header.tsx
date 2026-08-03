export default function Header() {
  return (
    <header className="relative w-full h-48 md:h-64 overflow-hidden header-fade">
      {/* Placeholder for dual-world / continuity slideshow */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-surface flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight">
            VA Math
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            Built by a veteran for veterans
          </p>
        </div>
      </div>
    </header>
  )
}