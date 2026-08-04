import Header from './Header'
import GlassCard from './GlassCard'
import Calculator from './Calculator'

export default function DashboardShell() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface">
      <Header />

      <main className="flex-1 overflow-y-auto md:overflow-hidden px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 h-full content-start">
            <Calculator />

            <GlassCard title="Evidence">
              <p>Local document locker. Collect files, then compile a clean PDF package for your claim.</p>
            </GlassCard>

            <GlassCard title="VASRD Browser">
              <p>Search the public Schedule for Rating Disabilities. Data locked from 38 CFR Part 4 (30 Jul 2026).</p>
            </GlassCard>

            <GlassCard title="Saved Scenarios">
              <p>Local-only rating scenarios. Understand what-if increases before you file.</p>
            </GlassCard>

            <GlassCard title="Helpful Links">
              <p>How to file a claim + official resources. No affiliation with the VA.</p>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="px-4 py-3 border-t border-white/5 text-center text-xs text-slate-500">
        VA Math is an independent educational tool. Not affiliated with the U.S. Department of Veterans Affairs.
        <br />
        I built this because no one else seemed to care.
      </footer>
    </div>
  )
}
