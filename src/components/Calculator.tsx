import { useState } from 'react'
import { combineRatings, applyBilateral } from '../lib/calc'
import GlassCard from './GlassCard'

export default function Calculator() {
  const [ratings, setRatings] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [bilateral, setBilateral] = useState(false)

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

  const combined = bilateral && ratings.length >= 2
    ? applyBilateral(ratings.slice(0, 2), ratings.slice(2))
    : combineRatings(ratings)

  function continuousRemaining(rs: number[]) {
    let rem = 100
    const sorted = [...rs].sort((a, b) => b - a)
    for (const r of sorted) {
      rem = rem * (1 - r / 100)
    }
    return 100 - rem
  }

  const remaining = ratings.length === 0 ? 100 : Math.max(0, 100 - continuousRemaining(ratings))

  return (
    <GlassCard title="VA Math Calculator" className="md:col-span-2">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="number"
            min={0}
            max={100}
            step={10}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addRating()}
            placeholder="Add rating %"
            className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50"
          />
          <button
            onClick={addRating}
            className="px-5 py-2.5 rounded-xl bg-accent/20 border border-accent/40 text-accent-soft font-medium hover:bg-accent/30 transition"
          >
            Add
          </button>
          <button
            onClick={clear}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition"
          >
            Clear
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bilateral}
            onChange={e => setBilateral(e.target.checked)}
            className="rounded border-white/20"
          />
          Apply bilateral factor (first two ratings as paired extremities)
        </label>

        {ratings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ratings.map((r, i) => (
              <button
                key={i}
                onClick={() => removeRating(i)}
                className="px-3 py-1 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition"
                title="Remove"
              >
                {r}% ×
              </button>
            ))}
          </div>
        )}

        {/* Remaining efficiency visual */}
        <div className="pt-2">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Remaining efficiency</span>
            <span>{remaining.toFixed(1)}%</span>
          </div>
          <div className="h-4 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500/80 to-sky-400 transition-all duration-500 ease-out"
              style={{ width: `${remaining}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="text-sm text-slate-400">Combined rating</div>
          <div className="font-display text-4xl md:text-5xl text-white mt-1">
            {ratings.length === 0 ? '—' : `${combined}%`}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Official VA math (38 CFR §4.25{bilateral ? ' + §4.26' : ''}). Rounded to nearest 10.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
