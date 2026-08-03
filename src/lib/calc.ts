/**
 * Pure VA Math calculation engine
 * Implements 38 CFR §4.25 Combined Ratings + §4.26 Bilateral Factor
 * (including most-favorable exception)
 * Source: 38 CFR Part 4 as of 30 July 2026
 */

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
  // Nearest 10, values ending in 5 round up
  const rounded = Math.round(value / 10) * 10
  // Special handling for .5 cases is covered by Math.round behavior for positive numbers
  return Math.min(100, Math.max(0, rounded))
}

export function combineRatings(ratings: number[]): number {
  return roundVA(continuousCombine(ratings))
}

/**
 * Apply bilateral factor (§4.26)
 * Combines bilateral ratings first, adds 10% of that value, then combines with others.
 * Applies most-favorable exception from §4.26(d).
 */
export function applyBilateral(bilateral: number[], others: number[] = []): number {
  if (bilateral.length < 2) {
    return combineRatings([...bilateral, ...others])
  }

  const bilatCombined = continuousCombine(bilateral)
  const withFactor = bilatCombined + (bilatCombined * 0.10)

  // Most-favorable: also compute without bilateral factor
  const without = continuousCombine([...bilateral, ...others])
  const withFactorFull = continuousCombine([withFactor, ...others])

  const best = Math.max(withFactorFull, without)
  return roundVA(best)
}

// Quick validation (will be expanded)
if (import.meta.env?.DEV) {
  console.assert(combineRatings([50, 30]) === 70, '50+30 should be 70')
  console.assert(combineRatings([40, 20]) === 50, '40+20 should be 50')
  console.assert(combineRatings([60, 40, 20]) === 80, '60+40+20 should be 80')
}