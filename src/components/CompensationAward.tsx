import { useMemo, useState } from 'react'
import GlassCard from './GlassCard'
import {
  monthlyCompensation,
  formatUSD,
  COMPENSATION_META,
  type DependentConfig,
} from '../lib/compensation'

type Props = {
  /** Combined rating from the math calculator (optional auto-fill) */
  combinedRating?: number
  className?: string
}

const RATING_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export default function CompensationAward({ combinedRating, className = '' }: Props) {
  const [manualRating, setManualRating] = useState<number | null>(null)
  const [spouse, setSpouse] = useState(false)
  const [parents, setParents] = useState<0 | 1 | 2>(0)
  const [childrenUnder18, setChildrenUnder18] = useState(0)
  const [schoolChildren, setSchoolChildren] = useState(0)
  const [spouseAA, setSpouseAA] = useState(false)

  const rating =
    manualRating ??
    (combinedRating && combinedRating > 0 ? combinedRating : 70)

  const dep: DependentConfig = useMemo(
    () => ({
      spouse,
      parents,
      childrenUnder18,
      schoolChildren,
      spouseAidAttendance: spouseAA,
    }),
    [spouse, parents, childrenUnder18, schoolChildren, spouseAA],
  )

  const result = useMemo(() => monthlyCompensation(rating, dep), [rating, dep])

  const summaryParts: string[] = []
  if (spouse) summaryParts.push('spouse')
  if (parents === 1) summaryParts.push('1 parent')
  if (parents === 2) summaryParts.push('2 parents')
  if (childrenUnder18 === 1) summaryParts.push('1 child under 18')
  if (childrenUnder18 > 1) summaryParts.push(`${childrenUnder18} children under 18`)
  if (schoolChildren === 1) summaryParts.push('1 schoolchild')
  if (schoolChildren > 1) summaryParts.push(`${schoolChildren} schoolchildren`)
  if (spouse && spouseAA) summaryParts.push('spouse A&A')
  const summary =
    summaryParts.length === 0 ? 'Veteran alone' : `Veteran + ${summaryParts.join(' + ')}`

  return (
    <GlassCard title="Compensation Award" className={className}>
      <div className="space-y-4">
        <p className="text-sm text-slate-400 leading-relaxed">
          2026 monthly pay by rating and dependents. Rates effective{' '}
          {COMPENSATION_META.effective}.
        </p>

        {/* Rating */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-500 mb-1.5">
            Combined rating
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RATING_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setManualRating(r)}
                className={`min-h-10 min-w-[3rem] rounded-lg border px-2.5 text-sm tabular-nums transition ${
                  result.rating === r
                    ? 'border-sky-400/50 bg-sky-500/20 text-sky-200'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          {combinedRating != null && combinedRating > 0 && manualRating == null && (
            <p className="mt-1.5 text-xs text-slate-500">
              Using combined rating from calculator ({combinedRating}%). Tap a % to override.
            </p>
          )}
        </div>

        {/* Dependents */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3">
            <input
              type="checkbox"
              checked={spouse}
              onChange={(e) => {
                setSpouse(e.target.checked)
                if (!e.target.checked) setSpouseAA(false)
              }}
              className="size-4 rounded border-white/20"
            />
            <span className="text-sm text-slate-200">Spouse</span>
          </label>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3">
            <input
              type="checkbox"
              checked={spouseAA}
              disabled={!spouse}
              onChange={(e) => setSpouseAA(e.target.checked)}
              className="size-4 rounded border-white/20 disabled:opacity-40"
            />
            <span className={`text-sm ${spouse ? 'text-slate-200' : 'text-slate-500'}`}>
              Spouse needs Aid & Attendance
            </span>
          </label>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="text-xs text-slate-500 mb-1">Dependent parents</div>
            <div className="flex gap-1.5">
              {([0, 1, 2] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setParents(n)}
                  className={`min-h-9 flex-1 rounded-lg border text-sm transition ${
                    parents === n
                      ? 'border-sky-400/50 bg-sky-500/20 text-sky-200'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="text-xs text-slate-500 mb-1">Children under 18</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChildrenUnder18((c) => Math.max(0, c - 1))}
                className="size-9 rounded-lg border border-white/10 bg-white/5 text-lg leading-none"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center tabular-nums text-slate-100">{childrenUnder18}</span>
              <button
                type="button"
                onClick={() => setChildrenUnder18((c) => Math.min(12, c + 1))}
                className="size-9 rounded-lg border border-white/10 bg-white/5 text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:col-span-2">
            <div className="text-xs text-slate-500 mb-1">
              Schoolchildren (18–23 in qualifying school)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSchoolChildren((c) => Math.max(0, c - 1))}
                className="size-9 rounded-lg border border-white/10 bg-white/5 text-lg leading-none"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center tabular-nums text-slate-100">{schoolChildren}</span>
              <button
                type="button"
                onClick={() => setSchoolChildren((c) => Math.min(12, c + 1))}
                className="size-9 rounded-lg border border-white/10 bg-white/5 text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="border-t border-white/10 pt-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">{summary}</div>
          <div className="mt-1 font-display text-4xl tabular-nums text-white md:text-5xl">
            {formatUSD(result.monthly)}
            <span className="text-lg text-slate-400"> / mo</span>
          </div>
          <div className="mt-1 text-sm text-slate-400">
            {formatUSD(result.annual)} per year · tax-free disability compensation
          </div>
          {result.note && (
            <p className="mt-2 text-xs text-amber-200/80">{result.note}</p>
          )}
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Educational estimate using {COMPENSATION_META.year} rates. Always verify at{' '}
            <a
              href={COMPENSATION_META.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:underline"
            >
              {COMPENSATION_META.sourceLabel}
            </a>
            . Not affiliated with the VA. Does not include Special Monthly Compensation (SMC).
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
