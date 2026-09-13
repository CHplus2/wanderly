import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  Trip,
  Activity,
  Traveller,
  ManualExpense,
  CurrencyCode,
  Alternative,
} from "./types"
import { buildDemoTrip } from "./data"
import { buildMalaysiaExample } from "./lib/examples"
import { computeTotals, type Totals } from "./lib/compute"
import { replaceActivity } from "./lib/discovery"
import { isWeatherRisk } from "./lib/adaptive"
import { convert } from "./lib/currency"

export type Screen = "welcome" | "setup" | "generating" | "app"
export type Tab = "overview" | "group" | "itinerary" | "budget" | "stay" | "transport"

interface Ctx {
  trip: Trip | null
  totals: Totals
  screen: Screen
  tab: Tab
  setScreen: (s: Screen) => void
  setTab: (t: Tab) => void
  loadDemo: (example?: "japan" | "malaysia") => void
  startTrip: (trip: Trip) => void
  update: (fn: (draft: Trip) => void) => void
  updateActivity: (id: string, patch: Partial<Activity>) => void
  addActivity: (a: Activity) => void
  setParticipants: (id: string, ids: string[]) => void
  toggleLock: (id: string) => void
  deleteActivity: (id: string) => void
  applyAlternative: (activityId: string, alt: Alternative) => void
  addManualExpense: (e: ManualExpense) => void
  removeManualExpense: (id: string) => void
  setDisplayCurrency: (c: CurrencyCode) => void
  updateTraveller: (id: string, patch: Partial<Traveller>) => void
  addTraveller: (t: Traveller) => void
  removeTraveller: (id: string) => void
}

const TripContext = createContext<Ctx | null>(null)

const STORAGE_KEY = "travel-planner.trip.v1"

interface Persisted {
  trip: Trip | null
  screen: Screen
  tab: Tab
}

function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Persisted
    // Never resume mid-generation; drop straight into the app if a trip exists.
    if (p.screen === "generating") p.screen = p.trip ? "app" : "welcome"
    return p
  } catch {
    return null
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const persisted = typeof window !== "undefined" ? loadPersisted() : null
  const [trip, setTrip] = useState<Trip | null>(persisted?.trip ?? null)
  const [screen, setScreen] = useState<Screen>(persisted?.screen ?? "welcome")
  const [tab, setTab] = useState<Tab>(persisted?.tab ?? "overview")

  // Persist trip, preferences and navigation so nothing is lost on reload.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ trip, screen, tab }))
    } catch {
      /* storage unavailable — keep working in-memory */
    }
  }, [trip, screen, tab])

  const update = (fn: (draft: Trip) => void) => {
    setTrip((prev) => {
      if (!prev) return prev
      const next = structuredClone(prev) as Trip
      fn(next)
      return next
    })
  }

  const api: Ctx = {
    trip,
    totals: useMemo(
      () =>
        trip
          ? computeTotals(trip)
          : { total: 0, shared: 0, personal: 0, byTraveller: {} },
      [trip],
    ),
    screen,
    tab,
    setScreen,
    setTab,
    loadDemo: (example = "japan") => {
      setTrip(example === "malaysia" ? buildMalaysiaExample() : buildDemoTrip())
      setTab("overview")
      setScreen("app")
    },
    startTrip: (t) => {
      setTrip(t)
      setScreen("generating")
    },
    update,
    updateActivity: (id, patch) =>
      update((d) => {
        const a = d.activities.find((x) => x.id === id)
        if (a) Object.assign(a, patch)
      }),
    addActivity: (a) =>
      update((d) => {
        d.activities.push(a)
      }),
    setParticipants: (id, ids) =>
      update((d) => {
        const a = d.activities.find((x) => x.id === id)
        if (a) a.participants = ids
      }),
    toggleLock: (id) =>
      update((d) => {
        const a = d.activities.find((x) => x.id === id)
        if (a) a.locked = !a.locked
      }),
    deleteActivity: (id) =>
      update((d) => {
        d.activities = d.activities.filter((x) => x.id !== id)
        if (d.savedOptions) delete d.savedOptions[id]
      }),
    applyAlternative: (activityId, alt) =>
      update((d) => {
        const a = d.activities.find((x) => x.id === activityId)
        if (!a || a.locked) return
        const wasAtRisk = isWeatherRisk(d, a)
        Object.assign(a, replaceActivity(a, alt))
        if (wasAtRisk && !isWeatherRisk(d, a))
          a.adjustedForForecast = d.weatherDisruption?.id
        if (d.savedOptions?.[activityId])
          d.savedOptions[activityId] = d.savedOptions[activityId].filter(
            (option) => option.id !== alt.id,
          )
      }),
    addManualExpense: (e) =>
      update((d) => {
        d.manualExpenses.push(e)
      }),
    removeManualExpense: (id) =>
      update((d) => {
        d.manualExpenses = d.manualExpenses.filter((x) => x.id !== id)
      }),
    setDisplayCurrency: (c) =>
      update((d) => {
        d.groupBudget = convert(d.groupBudget, d.displayCurrency, c)
        d.travellers.forEach((t) => {
          t.budget = convert(t.budget, d.displayCurrency, c)
        })
        d.displayCurrency = c
      }),
    updateTraveller: (id, patch) =>
      update((d) => {
        const t = d.travellers.find((x) => x.id === id)
        if (t) Object.assign(t, patch)
      }),
    addTraveller: (t) =>
      update((d) => {
        d.travellers.push(t)
      }),
    removeTraveller: (id) =>
      update((d) => {
        d.travellers = d.travellers.filter((x) => x.id !== id)
        d.subgroups.forEach(
          (g) => (g.members = g.members.filter((m) => m !== id)),
        )
        d.activities.forEach(
          (a) => (a.participants = a.participants.filter((p) => p !== id)),
        )
        d.legs.forEach(
          (l) => (l.participants = l.participants.filter((p) => p !== id)),
        )
        d.accommodations.forEach(
          (a) => (a.participants = a.participants.filter((p) => p !== id)),
        )
      }),
  }

  return <TripContext.Provider value={api}>{children}</TripContext.Provider>
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error("useTrip must be used within TripProvider")
  return ctx
}

export function useTripSafe() {
  return useContext(TripContext)
}
