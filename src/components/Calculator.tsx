import { useEffect, useMemo, useState } from 'react'
import { combineRatings, applyBilateral } from '../lib/calc'
import {
  quickPayRows,
  monthlyCompensation,
  formatUSD,
  COMPENSATION_META,
  SMC,
  type DependentConfig,
} from '../lib/compensation'
import GlassCard from './GlassCard'

type Props = {
  onCombinedChange?: (combined: number) => void
  className?: string
}

export default function Calculator({ onCombinedChange, className = '' }: Props) {
  const [ratings, setRatings] = useState<number[]>([70, 30, 10])
  const [input, setInput] = useState('')
  const [bilateral, setBilateral] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [spouse, setSpouse] = useState(false)
  const [parents, setParents] = useState<0 | 1 | 2>(0)
  const [childrenUnder18, setChildrenUnder18] = useState(0)
  const [schoolChildren, setSchoolChildren] = useState(0)
  const [spouseAA, setSpouseAA] = useState(false)
  const [smcKCount, setSmcKCount] = useState(0)

  const addRating = () => {
    const val = parseInt(input, 10)
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setRatings(prev => [...prev, val].sort((a, b) => b - a))
      setInput('')
    }
  }

  const removeRating = (index: number) => {
    setRatings(prev => prev.filter((_, i) => i !== index))
  }

  const clear = () => setRatings([])

  const combined =
    ratings.length === 0
      ? 0
      : bilateral && ratings.length >= 2
        ? applyBilateral(ratings.slice(0, 2), ratings.slice(2))
        : combineRatings(ratings)

  function continuousRemaining(rs: number[]) {
    let rem = 100
    const sorted = [...rs].filter(r => r > 0).sort((a, b) => b - a)
    for (const r of sorted) {
      rem = rem * (1 - r / 100)
    }
    return 100 - rem
  }

  const rawCombined =
    ratings.length === 0 ? 0 : continuousRemaining(ratings)
  const remaining =
    ratings.length === 0 ? 100 : Math.max(0, 100 - continuousRemaining(ratings))

  useEffect(() => {
    onCombinedChange?.(combined)
  }, [combined, onCombinedChange])

  const payRows = useMemo(
    () => (combined > 0 ? quickPayRows(combined) : []),
    [combined],
  )

  const dep: DependentConfig = {
    spouse,
    parents,
    childrenUnder18,
    schoolChildren,
    spouseAidAttendance: spouseAA,
  }

  const customPay = useMemo(() => {
    if (combined <= 0) return null
    const base = monthlyCompensation(combined, dep)
    const kAdd = Math.min(3, Math.max(0, smcKCount)) * SMC.K
    return {
      ...base,
      monthlyWithK: Math.round((base.monthly + kAdd) * 100) / 100,
      kAdd,
    }
  }, [combined, dep, smcKCount])

  return (
    <GlassCard title="Calculator" className={className}>
      <div className="space-y-4">
        {/* Input */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="number"
            min={0}
            max={100}
            step={10}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addRating()}
            placeholder="Add rating 0–100"
            className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/50"
          />
          <button
            type="button"
            onClick={addRating}
            className="px-5 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 font-medium hover:bg-sky-500/30 transition"
          >
            + Add
          </button>
          <button
            type="button"
            onClick={clear}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setRatings(prev => [...prev, p].sort((a, b) => b - a))}
              className="min-h-9 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-slate-300 hover:border-sky-400/40"
            >
              {p}%
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bilateral}
            onChange={e => setBilateral(e.target.checked)}
            className="rounded border-white/20"
          />
          Apply bilateral factor (§4.26) to the two highest ratings
        </label>

        {ratings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ratings.map((r, i) => (
              <button
                key={`${r}-${i}`}
                type="button"
                onClick={() => removeRating(i)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition"
                title="Remove"
              >
                {r}% −
              </button>
            ))}
          </div>
        )}

        {/* Remaining efficiency */}
        <div className="pt-1">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Remaining efficiency</span>
            <span className="tabular-nums">{Math.round(remaining)}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, remaining))}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>0%</span>
            <span>100% whole person</span>
          </div>
        </div>

        {/* Combined result + live pay table */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-sm text-slate-400">Combined disability rating</div>
          <div className="font-display text-5xl md:text-6xl text-white mt-1 tabular-nums tracking-tight">
            {ratings.length === 0 ? '—' : `${combined}%`}
          </div>
          {ratings.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Raw combined {rawCombined.toFixed(1)}% → rounded per §4.25(b)
            </p>
          )}

          {combined > 0 && payRows.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    Estimated monthly pay
                  </div>
                  <div className="text-[11px] text-slate-500">
                    2026 rates · effective {COMPENSATION_META.effective}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold tabular-nums text-emerald-300">
                    {formatUSD(payRows[0].monthly)}
                  </div>
                  <div className="text-[11px] text-slate-500">veteran alone</div>
                </div>
              </div>

              <ul className="divide-y divide-white/5">
                {payRows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="text-slate-300">{row.label}</span>
                    <span className="tabular-nums font-medium text-white">
                      {formatUSD(row.monthly)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setShowMore((s) => !s)}
                className="w-full px-4 py-2.5 text-left text-sm text-sky-300 hover:bg-white/5 border-t border-white/10 transition"
              >
                {showMore ? 'Hide' : 'More situations'} · parents, school kids, A&A, SMC-K
              </button>

              {showMore && (
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/5 bg-black/20">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex min-h-10 items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={spouse}
                        onChange={(e) => {
                          setSpouse(e.target.checked)
                          if (!e.target.checked) setSpouseAA(false)
                        }}
                        className="rounded border-white/20"
                      />
                      Spouse
                    </label>
                    <label className="flex min-h-10 items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={spouseAA}
                        disabled={!spouse}
                        onChange={(e) => setSpouseAA(e.target.checked)}
                        className="rounded border-white/20 disabled:opacity-40"
                      />
                      Spouse Aid & Attendance
                    </label>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] text-slate-500 mb-1">Parents</div>
                      <div className="flex gap-1">
                        {([0, 1, 2] as const).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setParents(n)}
                            className={`flex-1 min-h-9 rounded-lg border text-sm ${
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
                    <div>
                      <div className="text-[11px] text-slate-500 mb-1">Kids under 18</div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setChildrenUnder18((c) => Math.max(0, c - 1))} className="size-9 rounded-lg border border-white/10 bg-white/5">−</button>
                        <span className="min-w-[1.5rem] text-center tabular-nums">{childrenUnder18}</span>
                        <button type="button" onClick={() => setChildrenUnder18((c) => Math.min(12, c + 1))} className="size-9 rounded-lg border border-white/10 bg-white/5">+</button>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 mb-1">School 18–23</div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setSchoolChildren((c) => Math.max(0, c - 1))} className="size-9 rounded-lg border border-white/10 bg-white/5">−</button>
                        <span className="min-w-[1.5rem] text-center tabular-nums">{schoolChildren}</span>
                        <button type="button" onClick={() => setSchoolChildren((c) => Math.min(12, c + 1))} className="size-9 rounded-lg border border-white/10 bg-white/5">+</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">
                      SMC-K awards (add-on, up to 3 × {formatUSD(SMC.K)})
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setSmcKCount(n)}
                          className={`flex-1 min-h-9 rounded-lg border text-sm ${
                            smcKCount === n
                              ? 'border-sky-400/50 bg-sky-500/20 text-sky-200'
                              : 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {customPay && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                      <div className="text-xs text-emerald-200/80">Your custom estimate</div>
                      <div className="text-2xl font-semibold tabular-nums text-white mt-0.5">
                        {formatUSD(customPay.monthlyWithK)}
                        <span className="text-sm text-slate-400"> / mo</span>
                      </div>
                      {customPay.kAdd > 0 && (
                        <div className="text-xs text-slate-400 mt-1">
                          Includes {formatUSD(customPay.kAdd)} SMC-K on top of{' '}
                          {formatUSD(customPay.monthly)} base
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Higher SMC levels (L–S) replace the base rate rather than stacking — e.g. SMC-L{' '}
                    {formatUSD(SMC.L)}, SMC-S {formatUSD(SMC.S)}, SMC-R.1 {formatUSD(SMC.R1)}.
                    See{' '}
                    <a
                      href={COMPENSATION_META.smcSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 hover:underline"
                    >
                      VA SMC rates
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
            Educational estimate only. Always verify at{' '}
            <a
              href={COMPENSATION_META.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:underline"
            >
              {COMPENSATION_META.sourceLabel}
            </a>
            . Not affiliated with the VA.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
