import { useCallback, useState } from 'react'
import Header from './Header'
import GlassCard from './GlassCard'
import Calculator from './Calculator'
import CompensationAward from './CompensationAward'

export default function DashboardShell() {
  const [combined, setCombined] = useState(0)
  const onCombinedChange = useCallback((n: number) => setCombined(n), [])

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c10] text-slate-100">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-white">
              Disability rating math, made clear
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm md:text-base">
              Combine ratings with remaining-efficiency math, then see 2026 monthly pay for your
              dependent situation. Educational only — not affiliated with the VA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 content-start">
            <Calculator
              className="md:col-span-2"
              onCombinedChange={onCombinedChange}
            />

            <CompensationAward
              className="md:col-span-2 lg:col-span-1 lg:row-span-2"
              combinedRating={combined}
            />

            <GlassCard title="Evidence">
              <p className="text-slate-400 text-sm leading-relaxed">
                Local document locker. Collect files, then compile a clean PDF package for your
                claim.
              </p>
            </GlassCard>

            <GlassCard title="VASRD Browser">
              <p className="text-slate-400 text-sm leading-relaxed">
                Search the public Schedule for Rating Disabilities. Data locked from 38 CFR Part 4
                (30 Jul 2026).
              </p>
            </GlassCard>

            <GlassCard title="Helpful Links">
              <p className="text-slate-400 text-sm leading-relaxed">
                How to file a claim + official resources. No affiliation with the VA.
              </p>
            </GlassCard>

            <GlassCard title="About">
              <p className="font-display text-xl text-white leading-snug">
                I built this because no one else seemed to care.
              </p>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="px-4 py-4 border-t border-white/5 text-center text-xs text-slate-500">
        VA Math is an independent educational tool. Not affiliated with the U.S. Department of
        Veterans Affairs. Compensation rates: 2026 tables effective Dec 1, 2025 — always verify on
        VA.gov.
        <br />
        I built this because no one else seemed to care.
      </footer>
    </div>
  )
}
