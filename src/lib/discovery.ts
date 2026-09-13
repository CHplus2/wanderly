import type { Activity, Alternative, Trip } from "../types"
import { toDisplay } from "./currency"
import { computeTotals } from "./compute"

export type DiscoveryMode = "explore" | "backup"

// Concept inventory for the prototype, not a live places or availability feed.
const IDEAS = [
  {
    key: "gallery",
    name: "Local art gallery",
    type: "Culture",
    walking: "Low",
    environment: "indoor",
    factor: 0.65,
  },
  {
    key: "food",
    name: "Indoor food hall",
    type: "Food",
    walking: "Low",
    environment: "indoor",
    factor: 0.8,
  },
  {
    key: "garden",
    name: "Neighbourhood garden walk",
    type: "Nature",
    walking: "Medium",
    environment: "outdoor",
    factor: 0.2,
  },
  {
    key: "craft",
    name: "Small-group craft workshop",
    type: "Culture",
    walking: "Low",
    environment: "indoor",
    factor: 1.1,
  },
  {
    key: "photo",
    name: "City photography walk",
    type: "Photography",
    walking: "Medium",
    environment: "outdoor",
    factor: 0.5,
  },
] as const

export function optionInventory(trip: Trip, activity: Activity): Alternative[] {
  const scheduled = new Set(
    trip.activities
      .filter((a) => a.id !== activity.id)
      .map((a) => a.name.toLowerCase()),
  )
  const generated: Alternative[] = IDEAS.map((idea) => ({
    id: `idea-${activity.city.toLowerCase()}-${idea.key}`,
    name: `${idea.name} · ${activity.city}`,
    location: activity.city,
    cost: {
      currency: activity.activityCost.currency,
      amount: Math.round(
        Math.max(activity.activityCost.amount, 100) * idea.factor,
      ),
    },
    walking: idea.walking,
    activityType: idea.type,
    environment: idea.environment,
    tags: ["Sample idea"],
    reason:
      "An illustrative local activity concept. Choose a venue and verify prices, hours and travel time before booking.",
    signals: {
      preferenceMatch: 0,
      popularity: 0,
      historyMatch: null,
      budgetFit: 0,
      scheduleFit: 0,
    },
  }))
  const pool = [
    ...(trip.savedOptions?.[activity.id] ?? []),
    ...activity.alternatives,
    ...generated,
  ]
  const seen = new Set<string>()
  return pool.filter((option) => {
    const name = option.name.toLowerCase()
    if (
      seen.has(name) ||
      name === activity.name.toLowerCase() ||
      scheduled.has(name)
    )
      return false
    seen.add(name)
    return true
  })
}

export function rankOptions(
  trip: Trip,
  activity: Activity,
  mode: DiscoveryMode,
  indoorOnly = false,
) {
  const people = trip.travellers.filter((t) =>
    activity.participants.includes(t.id),
  )
  const walking = { Low: 0, Medium: 1, High: 2 }
  const total = computeTotals(trip).total
  return optionInventory(trip, activity)
    .filter((o) => !indoorOnly || o.environment === "indoor")
    .map((option) => {
      const matches = people.filter((p) =>
        p.prefs.interests.some(
          (i) => i.toLowerCase() === option.activityType.toLowerCase(),
        ),
      )
      const walkingFits = people.filter(
        (p) => walking[option.walking] <= walking[p.prefs.walking],
      )
      const avoided = people.filter((p) =>
        p.prefs.avoid.some(
          (v) =>
            v.trim() &&
            `${option.name} ${option.activityType}`
              .toLowerCase()
              .includes(v.toLowerCase()),
        ),
      )
      const delta =
        toDisplay(option.cost, trip.displayCurrency) -
        toDisplay(activity.activityCost, trip.displayCurrency)
      const saved = !!trip.savedOptions?.[activity.id]?.some(
        (o) => o.id === option.id,
      )
      const withinBudget = total + delta <= trip.groupBudget
      const score =
        matches.length * 4 +
        walkingFits.length * 3 -
        avoided.length * 20 +
        (withinBudget ? 3 : 0) +
        (delta <= 0 ? 2 : 0) +
        (mode === "backup" && saved ? 1 : 0)
      return {
        option,
        matches,
        walkingFits,
        avoided,
        delta,
        saved,
        withinBudget,
        people,
        score,
      }
    })
    .sort((a, b) => b.score - a.score || a.delta - b.delta)
}

export function replaceActivity(
  activity: Activity,
  option: Alternative,
): Activity {
  return {
    ...activity,
    name: option.name,
    location: option.location,
    activityCost: option.cost,
    walkingLevel: option.walking,
    activityType: option.activityType,
    environment: option.environment ?? "mixed",
    reason: option.reason,
    description: option.reason,
    signals: option.signals,
    photo: undefined,
    rating: undefined,
    reviewCount: undefined,
    reviews: undefined,
    inspirationLinks: [],
    alternatives: activity.alternatives.filter((a) => a.id !== option.id),
  }
}
