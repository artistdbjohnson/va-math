/**
 * Pure VA Math calculation engine
 * 38 CFR §4.25 Combined Ratings + §4.26 Bilateral Factor
 * Source: 38 CFR Part 4 as of 30 July 2026
 */

export type CalcStep = {
  index: number
  rating: number
  remainingBefore: number
  remainingAfter: number
  combinedSoFar: number
  note: string
}

export function continuousCombine(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sorted = [...ratings].filter(r => r > 0).sort((a, b) => b - a)
  if (sorted.length === 0) return 0

  let remaining = 100
  for (const r of sorted) {
    remaining = remaining * (1 - r / 100)
  }
  return 100 - remaining
}

export function roundVA(value: number): number {
  const rounded = Math.round(value / 10) * 10
  return Math.min(100, Math.max(0, rounded))
}

export function combineRatings(ratings: number[]): number {
  return roundVA(continuousCombine(ratings))
}

/** Step-by-step remaining-efficiency walkthrough. Step 0 = start at 100%. */
export function explainSteps(ratings: number[]): CalcStep[] {
  const sorted = ratings.filter(r => typeof r === 'number' && r > 0).sort((a, b) => b - a)
  const steps: CalcStep[] = [
    {
      index: 0,
      rating: 0,
      remainingBefore: 100,
      remainingAfter: 100,
      combinedSoFar: 0,
      note: 'Start at 100% whole-person efficiency.',
    },
  ]
  let remaining = 100
  sorted.forEach((rating, i) => {
    const before = remaining
    remaining = remaining * (1 - rating / 100)
    const combined = 100 - remaining
    steps.push({
      index: i + 1,
      rating,
      remainingBefore: before,
      remainingAfter: remaining,
      combinedSoFar: combined,
      note: `Apply ${rating}% to remaining ${before.toFixed(1)}% → remaining ${remaining.toFixed(1)}% (combined ${combined.toFixed(1)}%).`,
    })
  })
  return steps
}

export function applyBilateral(bilateral: number[], others: number[] = []): number {
  if (bilateral.length < 2) {
    return combineRatings([...bilateral, ...others])
  }

  const bilatCombined = continuousCombine(bilateral)
  const withFactor = bilatCombined + bilatCombined * 0.1
  const without = continuousCombine([...bilateral, ...others])
  const withFactorFull = continuousCombine([withFactor, ...others])
  const best = Math.max(withFactorFull, without)
  return roundVA(best)
}
