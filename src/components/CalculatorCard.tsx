import { useState } from 'react'
import { combineRatings, applyBilateral } from '../lib/calc'

export default function CalculatorCard() {
  const [ratings, setRatings] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [isBilateral, setIsBilateral] = useState(false)

  const combined = isBilateral && ratings.length >= 2
    ? applyBilateral(ratings)
    : combineRatings(ratings)

  // Continuous remaining efficiency (before rounding) for the visual
  function getRemaining(rs: number[]): number {
    if (rs.length === 0) return 100
    const sorted = [...rs].filter(r => r > 0).sort((a, b) => b - a)
    let rem = 100
    for (const r of sorted) {
      rem = rem * (1 - r / 100)
    }
    return rem
  }

  const remaining = getRemaining(ratings)

  function addRating() {
    const val = parseInt(input, 10)
    if ([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(val)) {
      setRatings(prev => [...prev, val])
      setInput('')
    }
  }

  function removeLast() {
    setRatings(prev => prev.slice(0, -1))
  }

  function clearAll() {
    setRatings([])
    setIsBilateral(false)
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Input row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={0}
          max={100}
          step={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addRating()}
          placeholder="10–100"
          className="w-24 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-sky-400/50"
        />
        <button
          onClick={addRating}
          className="px-5 py-2.5 rounded-xl bg-sky-500/80 hover:bg-sky-400 text-white font-medium transition"
        >
          Add Rating
        </button>
        {ratings.length > 0 && (
          <button
            onClick={removeLast}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition"
          >
            Undo
          </button>
        )}
      </div>

      {/* Bilateral toggle */}
      <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isBilateral}
          onChange={(e) => setIsBilateral(e.target.checked)}
          className="w-4 h-4 rounded border-white/30 bg-white/10 text-sky-500 focus:ring-sky-400"
        />
        Apply bilateral factor (paired extremities) — §4.26
      </label>

      {/* Current ratings */}
      <div className="text-sm text-slate-400">
        {ratings.length === 0 ? (
          <span>No ratings yet. Add percentages above.</span>
        ) : (
          <span>
            Ratings: <span className="text-white font-medium">{ratings.join(' + ')}</span>
            {isBilateral && ratings.length >= 2 && (
              <span className="ml-2 text-sky-300">(+ bilateral)</span>
            )}
          </span>
        )}
      </div>

      {/* Remaining Efficiency visual */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Remaining Efficiency</span>
          <span className="text-emerald-300">{remaining.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.max(0, Math.min(100, remaining))}%` }}
          />
        </div>
      </div>

      {/* Combined result */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="text-sm text-slate-400 mb-1">Combined Disability Rating</div>
        <div className="text-5xl font-bold tracking-tight text-white">
          {combined}<span className="text-3xl text-slate-400">%</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Official VA math (§4.25 / §4.26) · rounded to nearest 10
        </p>
      </div>

      {ratings.length > 0 && (
        <button
          onClick={clearAll}
          className="self-start text-xs text-slate-500 hover:text-slate-300 transition"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
