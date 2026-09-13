import type { Activity, Alternative, Trip, WeatherDisruption } from "../types"
import { rankOptions, replaceActivity } from "./discovery"

export interface AdaptiveSuggestion {
  activityId: string
  included: boolean
  method: "replace" | "reschedule"
  alternative?: Alternative
  dayIndex: number
  startTime: string
  endTime: string
}

export function minutes(time: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) return NaN
  const [h, m] = time.split(":").map(Number)
  return h < 24 && m < 60 ? h * 60 + m : NaN
}
const clock = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`
export function exposure(a: Activity): "indoor" | "outdoor" | "mixed" {
  if (a.environment) return a.environment
  // Legacy sample records predate an explicit exposure field.
  if (/market|park|shrine|grove|walk|free time/i.test(a.name)) return "outdoor"
  if (["Nature", "Photography"].includes(a.activityType)) return "outdoor"
  if (["Shopping", "Sightseeing"].includes(a.activityType)) return "mixed"
  return "indoor"
}
export function confidence(days: number) {
  if (days <= 2)
    return { key: "near", label: "Near-term forecast", early: false }
  if (days <= 5)
    return { key: "moderate", label: "Developing forecast", early: false }
  if (days <= 10) return { key: "early", label: "Early forecast", early: true }
  return { key: "very-early", label: "Very early forecast", early: true }
}
export function isWeatherRisk(trip: Trip, a: Activity) {
  const f = trip.weatherDisruption
  return (
    !!f &&
    !f.cleared &&
    f.horizonDays >= 0 &&
    f.horizonDays <= 14 &&
    a.dayIndex === f.dayIndex &&
    a.city === f.city &&
    exposure(a) !== "indoor" &&
    minutes(a.startTime) < minutes(f.endTime) &&
    minutes(f.startTime) < minutes(a.endTime)
  )
}
export const weatherRisks = (trip: Trip) =>
  trip.activities.filter((a) => isWeatherRisk(trip, a))
export function forecastKey(trip: Trip) {
  const f = trip.weatherDisruption
  return f
    ? [
        f.id,
        f.dayIndex,
        f.city,
        f.startTime,
        f.endTime,
        f.severity,
        confidence(f.horizonDays).key,
        !!f.cleared,
      ].join("|")
    : "none"
}
export function noticeKey(trip: Trip) {
  return `${forecastKey(trip)}|${weatherRisks(trip)
    .map((a) => a.id)
    .sort()
    .join(",")}`
}
export function reminderActive(trip: Trip, now = Date.now()) {
  const r = trip.weatherReminder
  return (
    !!r &&
    r.signature === noticeKey(trip) &&
    (trip.weatherDisruption?.horizonDays ?? 0) > r.untilHorizonDays &&
    now < r.until
  )
}
export function indoorOptions(trip: Trip, a: Activity) {
  // Safety of a venue is never inferred from saving it. Require indoor metadata and preference suitability first.
  return rankOptions(trip, a, "backup", true).filter(
    (r) =>
      !r.avoided.length &&
      r.walkingFits.length === r.people.length &&
      r.people.length > 0,
  )
}
function sameTravellers(a: Activity, b: Activity) {
  return a.participants.some((id) => b.participants.includes(id))
}
function destinationFits(trip: Trip, a: Activity, day: number) {
  return trip.destinations.some(
    (d) => d.city === a.city && day >= d.dayStart && day <= d.dayEnd,
  )
}
function findFreeTime(trip: Trip, a: Activity) {
  const duration = minutes(a.endTime) - minutes(a.startTime)
  if (!(duration > 0)) return null
  for (let day = a.dayIndex; day < Math.min(trip.days, a.dayIndex + 2); day++) {
    if (!destinationFits(trip, a, day)) continue
    for (let start = 8 * 60; start + duration <= 21 * 60; start += 30) {
      const candidate = {
        ...a,
        dayIndex: day,
        startTime: clock(start),
        endTime: clock(start + duration),
      }
      if (isWeatherRisk(trip, candidate)) continue
      if (
        trip.activities.some(
          (b) =>
            b.id !== a.id &&
            b.dayIndex === day &&
            sameTravellers(a, b) &&
            start < minutes(b.endTime) + 30 &&
            minutes(b.startTime) - 30 < start + duration,
        )
      )
        continue
      if (
        trip.legs.some(
          (l) =>
            l.dayIndex === day &&
            l.to === a.city &&
            a.participants.some((id) => l.participants.includes(id)) &&
            start < minutes(l.arrival) + 30,
        )
      )
        continue
      return {
        dayIndex: day,
        startTime: candidate.startTime,
        endTime: candidate.endTime,
      }
    }
  }
  return null
}
export function suggestAdaptivePlan(trip: Trip): AdaptiveSuggestion[] {
  const reserved = new Set<string>()
  let preview = structuredClone(trip)
  return weatherRisks(trip).map((a) => {
    const option = indoorOptions(trip, a).find(
      (r) => !reserved.has(r.option.name.toLowerCase()),
    )?.option
    const slot = option ? null : findFreeTime(preview, a)
    if (option) reserved.add(option.name.toLowerCase())
    const suggestion: AdaptiveSuggestion = {
      activityId: a.id,
      included: !a.locked && (!!option || !!slot),
      method: option ? "replace" : "reschedule",
      alternative: option,
      dayIndex: slot?.dayIndex ?? a.dayIndex,
      startTime: slot?.startTime ?? a.startTime,
      endTime: slot?.endTime ?? a.endTime,
    }
    if (suggestion.included)
      preview.activities = preview.activities.map((b) =>
        b.id === a.id ? projectedActivity(b, suggestion) : b,
      )
    return suggestion
  })
}
export function projectedActivity(a: Activity, s: AdaptiveSuggestion) {
  const updated =
    s.method === "replace" && s.alternative
      ? replaceActivity(a, s.alternative)
      : { ...a }
  return {
    ...updated,
    dayIndex: s.dayIndex,
    startTime: s.startTime,
    endTime: s.endTime,
  }
}
export function validateAdaptivePlan(
  trip: Trip,
  suggestions: AdaptiveSuggestion[],
) {
  const selected = suggestions.filter((s) => s.included)
  const errors: string[] = []
  if (
    !trip.weatherDisruption ||
    trip.weatherDisruption.cleared ||
    trip.weatherDisruption.horizonDays < 0 ||
    trip.weatherDisruption.horizonDays > 14
  )
    return [
      "There is no active forecast to adapt to. Return to your itinerary.",
    ]
  const ids = new Set<string>()
  const next = trip.activities.map((a) => {
    const s = selected.find((s) => s.activityId === a.id)
    return s ? projectedActivity(a, s) : a
  })
  for (const s of selected) {
    const a = trip.activities.find((a) => a.id === s.activityId)
    if (!a || ids.has(s.activityId)) {
      errors.push("An activity is missing or repeated. Reopen the review.")
      continue
    }
    ids.add(s.activityId)
    if (!isWeatherRisk(trip, a))
      errors.push(`${a.name} is no longer affected. Reopen the review.`)
    if (a.locked)
      errors.push(`${a.name} is locked. Unlock it or keep the original.`)
    if (!a.participants.length) errors.push(`${a.name} has no participants.`)
    if (
      s.method === "replace" &&
      (!s.alternative ||
        !indoorOptions(trip, a).some((r) => r.option.id === s.alternative?.id))
    )
      errors.push(`Choose a suitable indoor option for ${a.name}.`)
    const n = next.find((b) => b.id === a.id)!
    if (
      !Number.isInteger(s.dayIndex) ||
      s.dayIndex < 0 ||
      s.dayIndex >= trip.days ||
      !destinationFits(trip, a, s.dayIndex)
    )
      errors.push(`${a.name} must stay on a day in ${a.city}.`)
    const start = minutes(s.startTime),
      end = minutes(s.endTime)
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
      errors.push(`Check the start and end time for ${a.name}.`)
    if (isWeatherRisk(trip, n))
      errors.push(
        `${a.name} still overlaps the rain window. Choose another time or an indoor option.`,
      )
    for (const other of next) {
      if (other.id === a.id || other.dayIndex !== n.dayIndex) continue
      if (
        n.name.toLowerCase() === other.name.toLowerCase() &&
        s.method === "replace"
      )
        errors.push(
          `${n.name} is proposed more than once. Choose another option.`,
        )
      if (
        sameTravellers(n, other) &&
        start < minutes(other.endTime) &&
        minutes(other.startTime) < end
      )
        errors.push(`${n.name} overlaps ${other.name} for a shared traveller.`)
    }
    if (
      trip.legs.some(
        (l) =>
          l.dayIndex === n.dayIndex &&
          l.to === n.city &&
          n.participants.some((id) => l.participants.includes(id)) &&
          start < minutes(l.arrival) + 30,
      )
    )
      errors.push(`${n.name} starts before arrival plus a 30-minute buffer.`)
  }
  return [...new Set(errors)]
}
export function applyAdaptivePlan(
  trip: Trip,
  suggestions: AdaptiveSuggestion[],
  key: string,
) {
  const errors = validateAdaptivePlan(trip, suggestions)
  if (key !== forecastKey(trip))
    errors.push(
      "The forecast changed. Close this review and prepare a fresh plan.",
    )
  const selected = suggestions.filter((s) => s.included)
  if (!selected.length) errors.push("Select at least one change.")
  if (errors.length) return { trip, errors, count: 0 }
  const next = structuredClone(trip)
  next.activities = next.activities.map((a) => {
    const s = selected.find((s) => s.activityId === a.id)
    if (!s) return a
    if (s.alternative && s.method === "replace" && next.savedOptions?.[a.id])
      next.savedOptions[a.id] = next.savedOptions[a.id].filter(
        (o) => o.id !== s.alternative!.id,
      )
    return {
      ...projectedActivity(a, s),
      adjustedForForecast: next.weatherDisruption!.id,
    }
  })
  next.adaptiveResult = {
    count: selected.length,
    forecastId: next.weatherDisruption!.id,
  }
  return { trip: next, errors: [], count: selected.length }
}

export function demoForecast(
  trip: Trip,
  scenario: "early" | "near" | "multiple",
): WeatherDisruption {
  if (
    scenario !== "multiple" &&
    trip.weatherDisruption &&
    !trip.weatherDisruption.cleared
  )
    return {
      ...trip.weatherDisruption,
      horizonDays: scenario === "early" ? 12 : 1,
    }
  const windows = trip.destinations.flatMap((d) =>
    Array.from({ length: d.dayEnd - d.dayStart + 1 }, (_, i) => ({
      city: d.city,
      day: d.dayStart + i,
    })),
  )
  const startTime = scenario === "multiple" ? "09:00" : "14:00",
    endTime = scenario === "multiple" ? "18:00" : "17:00"
  const best = windows.sort((x, y) => {
    const count = (v: typeof x) =>
      trip.activities.filter(
        (a) =>
          a.city === v.city &&
          a.dayIndex === v.day &&
          exposure(a) !== "indoor" &&
          minutes(a.startTime) < minutes(endTime) &&
          minutes(startTime) < minutes(a.endTime),
      ).length
    return count(y) - count(x)
  })[0]
  return {
    id: `weather-${best?.city ?? "trip"}-${best?.day ?? 0}`,
    dayIndex: best?.day ?? 0,
    city: best?.city ?? "",
    startTime,
    endTime,
    horizonDays: scenario === "early" ? 12 : 1,
    severity: "rain",
  }
}
