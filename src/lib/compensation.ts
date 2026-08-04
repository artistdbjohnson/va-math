/**
 * 2026 VA Disability Compensation rates
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 * Effective: December 1, 2025
 * Educational use only — always verify on VA.gov
 */

export type DependentConfig = {
  spouse: boolean
  parents: 0 | 1 | 2
  /** Total children under 18 (first is included in base "with child" rows) */
  childrenUnder18: number
  /** Children 18–23 in a qualifying school program */
  schoolChildren: number
  spouseAidAttendance: boolean
}

const FLAT_10_20: Record<10 | 20, number> = {
  10: 180.42,
  20: 356.66,
}

/** Base rates WITHOUT children (30–100%) */
const NO_CHILDREN: Record<
  number,
  {
    alone: number
    spouse: number
    spouse1Parent: number
    spouse2Parents: number
    parent1: number
    parent2: number
  }
> = {
  30: { alone: 552.47, spouse: 617.47, spouse1Parent: 669.47, spouse2Parents: 721.47, parent1: 604.47, parent2: 656.47 },
  40: { alone: 795.84, spouse: 882.84, spouse1Parent: 952.84, spouse2Parents: 1022.84, parent1: 865.84, parent2: 935.84 },
  50: { alone: 1132.9, spouse: 1241.9, spouse1Parent: 1329.9, spouse2Parents: 1417.9, parent1: 1220.9, parent2: 1308.9 },
  60: { alone: 1435.02, spouse: 1566.02, spouse1Parent: 1671.02, spouse2Parents: 1776.02, parent1: 1540.02, parent2: 1645.02 },
  70: { alone: 1808.45, spouse: 1961.45, spouse1Parent: 2084.45, spouse2Parents: 2207.45, parent1: 1931.45, parent2: 2054.45 },
  80: { alone: 2102.15, spouse: 2277.15, spouse1Parent: 2417.15, spouse2Parents: 2557.15, parent1: 2242.15, parent2: 2382.15 },
  90: { alone: 2362.3, spouse: 2559.3, spouse1Parent: 2717.3, spouse2Parents: 2875.3, parent1: 2520.3, parent2: 2678.3 },
  100: { alone: 3938.58, spouse: 4158.17, spouse1Parent: 4334.41, spouse2Parents: 4510.65, parent1: 4114.82, parent2: 4291.06 },
}

/** Base rates WITH at least 1 child (30–100%) */
const WITH_CHILD: Record<
  number,
  {
    childOnly: number
    childSpouse: number
    childSpouse1Parent: number
    childSpouse2Parents: number
    child1Parent: number
    child2Parents: number
  }
> = {
  30: { childOnly: 596.47, childSpouse: 666.47, childSpouse1Parent: 718.47, childSpouse2Parents: 770.47, child1Parent: 648.47, child2Parents: 700.47 },
  40: { childOnly: 853.84, childSpouse: 947.84, childSpouse1Parent: 1017.84, childSpouse2Parents: 1087.84, child1Parent: 923.84, child2Parents: 993.84 },
  50: { childOnly: 1205.9, childSpouse: 1322.9, childSpouse1Parent: 1410.9, childSpouse2Parents: 1498.9, child1Parent: 1293.9, child2Parents: 1381.9 },
  60: { childOnly: 1523.02, childSpouse: 1663.02, childSpouse1Parent: 1768.02, childSpouse2Parents: 1873.02, child1Parent: 1628.02, child2Parents: 1733.02 },
  70: { childOnly: 1910.45, childSpouse: 2074.45, childSpouse1Parent: 2197.45, childSpouse2Parents: 2320.45, child1Parent: 2033.45, child2Parents: 2156.45 },
  80: { childOnly: 2219.15, childSpouse: 2406.15, childSpouse1Parent: 2546.15, childSpouse2Parents: 2686.15, child1Parent: 2359.15, child2Parents: 2499.15 },
  90: { childOnly: 2494.3, childSpouse: 2704.3, childSpouse1Parent: 2862.3, childSpouse2Parents: 3020.3, child1Parent: 2652.3, child2Parents: 2810.3 },
  100: { childOnly: 4085.43, childSpouse: 4318.99, childSpouse1Parent: 4495.23, childSpouse2Parents: 4671.47, child1Parent: 4261.67, child2Parents: 4437.91 },
}

const ADD_CHILD_UNDER_18: Record<number, number> = {
  30: 32, 40: 43, 50: 54, 60: 65, 70: 76, 80: 87, 90: 98, 100: 109.11,
}

const ADD_SCHOOLCHILD: Record<number, number> = {
  30: 105, 40: 140, 50: 176, 60: 211, 70: 246, 80: 281, 90: 317, 100: 352.45,
}

const ADD_SPOUSE_AA: Record<number, number> = {
  30: 61, 40: 81, 50: 101, 60: 121, 70: 141, 80: 161, 90: 181, 100: 201.41,
}

export const COMPENSATION_META = {
  effective: 'December 1, 2025',
  year: 2026,
  sourceUrl: 'https://www.va.gov/disability/compensation-rates/veteran-rates/',
  sourceLabel: 'VA.gov current disability compensation rates',
} as const

function normalizeRating(rating: number): number {
  if (rating <= 0) return 0
  if (rating < 10) return 10
  // Round to nearest 10 for table lookup (matches VA combined-rating display)
  return Math.min(100, Math.round(rating / 10) * 10)
}

/**
 * Monthly compensation for a combined rating + dependent configuration.
 * Implements official 2026 tables including all VA-listed dependent situations.
 */
export function monthlyCompensation(
  ratingInput: number,
  dep: DependentConfig,
): { monthly: number; annual: number; rating: number; note?: string } {
  const rating = normalizeRating(ratingInput)

  if (rating < 10) {
    return { monthly: 0, annual: 0, rating, note: 'Ratings under 10% are not compensable under the standard table.' }
  }

  // 10% and 20% — no dependent add-ons
  if (rating === 10 || rating === 20) {
    const monthly = FLAT_10_20[rating]
    return {
      monthly,
      annual: monthly * 12,
      rating,
      note: 'At 10–20%, dependents do not increase the monthly rate.',
    }
  }

  const childrenUnder18 = Math.max(0, Math.floor(dep.childrenUnder18))
  const schoolChildren = Math.max(0, Math.floor(dep.schoolChildren))
  const parents = (dep.parents === 1 || dep.parents === 2 ? dep.parents : 0) as 0 | 1 | 2
  const hasChild = childrenUnder18 > 0

  let base = 0

  if (!hasChild) {
    const row = NO_CHILDREN[rating]
    if (!row) return { monthly: 0, annual: 0, rating }
    if (dep.spouse && parents === 2) base = row.spouse2Parents
    else if (dep.spouse && parents === 1) base = row.spouse1Parent
    else if (dep.spouse) base = row.spouse
    else if (parents === 2) base = row.parent2
    else if (parents === 1) base = row.parent1
    else base = row.alone
  } else {
    const row = WITH_CHILD[rating]
    if (!row) return { monthly: 0, annual: 0, rating }
    if (dep.spouse && parents === 2) base = row.childSpouse2Parents
    else if (dep.spouse && parents === 1) base = row.childSpouse1Parent
    else if (dep.spouse) base = row.childSpouse
    else if (parents === 2) base = row.child2Parents
    else if (parents === 1) base = row.child1Parent
    else base = row.childOnly

    // First under-18 child is included in base; each additional adds ADD_CHILD_UNDER_18
    const extraUnder18 = Math.max(0, childrenUnder18 - 1)
    base += extraUnder18 * (ADD_CHILD_UNDER_18[rating] ?? 0)
  }

  // Schoolchildren are always add-ons (not in base rows)
  base += schoolChildren * (ADD_SCHOOLCHILD[rating] ?? 0)

  if (dep.spouse && dep.spouseAidAttendance) {
    base += ADD_SPOUSE_AA[rating] ?? 0
  }

  // Round to nearest cent
  const monthly = Math.round(base * 100) / 100
  return { monthly, annual: Math.round(monthly * 12 * 100) / 100, rating }
}

export function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
