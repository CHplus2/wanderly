import type {
  Trip,
  CurrencyCode,
  Activity,
  Destination,
  TransportLeg,
  Accommodation,
  Preferences,
} from "../types"

import { TRAVELLER_COLORS } from "../data"

const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  japan: "JPY",

  germany: "EUR",

  netherlands: "EUR",

  france: "EUR",

  italy: "EUR",

  spain: "EUR",

  china: "CNY",

  "united kingdom": "GBP",

  uk: "GBP",

  england: "GBP",

  "united states": "USD",

  usa: "USD",

  us: "USD",

  malaysia: "MYR",
}

export function currencyForCountry(
  country: string,
  fallback: CurrencyCode,
): CurrencyCode {
  return COUNTRY_CURRENCY[country.trim().toLowerCase()] ?? fallback
}

export interface SetupTraveller {
  name: string

  budget: number

  prefs: Preferences
}

export interface SetupDest {
  city: string

  country: string
}

export interface SetupConfig {
  name: string

  days: number

  startDate: string

  displayCurrency: CurrencyCode

  budgetMode: "shared" | "individual"

  groupBudget: number

  travellers: SetupTraveller[]

  destinations: SetupDest[]
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00")

  d.setDate(d.getDate() + n)

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const DAY_TEMPLATE = [
  {
    start: "09:30",
    end: "12:00",
    suffix: "Morning highlights",
    type: "Culture",
    cost: 0.15,
    walk: "Medium" as const,
  },

  {
    start: "12:30",
    end: "14:00",
    suffix: "Local lunch",
    type: "Food",
    cost: 0.12,
    walk: "Low" as const,
  },

  {
    start: "15:00",
    end: "17:30",
    suffix: "Afternoon exploring",
    type: "Sightseeing",
    cost: 0.2,
    walk: "Medium" as const,
  },
]

// A rough local-currency baseline so generated costs feel plausible.

const BASE_COST: Record<CurrencyCode, number> = {
  JPY: 20000,

  CNY: 300,

  MYR: 150,

  USD: 40,

  EUR: 40,

  GBP: 35,
}

export function generateTrip(cfg: SetupConfig): Trip {
  const travellers = cfg.travellers.map((t, i) => ({
    id: "t" + (i + 1),

    name: t.name.trim() || `Traveller ${i + 1}`,

    color: TRAVELLER_COLORS[i % TRAVELLER_COLORS.length],

    budget: t.budget,

    prefs: t.prefs,
  }))

  const allIds = travellers.map((t) => t.id)

  const dests = cfg.destinations.length
    ? cfg.destinations
    : [{ city: "Destination", country: "" }]

  const per = Math.floor(cfg.days / dests.length)

  let rem = cfg.days - per * dests.length

  let cursor = 0

  const destinations: Destination[] = dests.map((d, i) => {
    const count = per + (rem > 0 ? 1 : 0)

    if (rem > 0) rem--

    const dayStart = cursor

    const dayEnd = cursor + count - 1

    cursor += count

    return {
      id: "d" + (i + 1),

      city: d.city.trim() || `City ${i + 1}`,

      country: d.country.trim(),

      currency: currencyForCountry(d.country, cfg.displayCurrency),

      arrival: addDays(cfg.startDate, dayStart),

      departure: addDays(cfg.startDate, dayEnd + 1),

      dayStart,

      dayEnd,
    }
  })

  const legs: TransportLeg[] = []

  const accommodations: Accommodation[] = []

  const activities: Activity[] = []

  destinations.forEach((dest, i) => {
    const base = BASE_COST[dest.currency]

    // transport leg into this destination (except the first)

    if (i > 0) {
      const prev = destinations[i - 1]

      legs.push({
        id: "l" + i,

        from: prev.city,

        to: dest.city,

        dayIndex: dest.dayStart,

        type: prev.country === dest.country ? "High-speed rail" : "Flight",

        departure: "09:30",

        arrival: prev.country === dest.country ? "11:45" : "13:00",

        durationMin: prev.country === dest.country ? 135 : 210,

        cost: {
          amount: Math.round(base * (prev.country === dest.country ? 0.7 : 3)),
          currency: dest.currency,
        },

        participants: allIds,
      })
    }

    const nights = dest.dayEnd - dest.dayStart + 1

    accommodations.push({
      id: "acc" + (i + 1),

      destinationId: dest.id,

      name: `${dest.city} Central Hotel`,

      location: `Central ${dest.city}`,

      checkIn: addDays(cfg.startDate, dest.dayStart),

      checkOut: addDays(cfg.startDate, dest.dayEnd + 1),

      nights,

      room: travellers.length > 2 ? "2 twin rooms" : "1 room",

      costPerNight: { amount: Math.round(base * 0.9), currency: dest.currency },

      participants: allIds,
    })

    for (let day = dest.dayStart; day <= dest.dayEnd; day++) {
      DAY_TEMPLATE.forEach((tpl, k) => {
        // Leave arrival time free; generated transfer times still require user verification.
        const incoming = legs.find(l => l.dayIndex === day && l.to === dest.city)
        if (incoming && tpl.start < "14:00") return
        activities.push({
          id: `g-${day}-${k}`,

          dayIndex: day,

          startTime: tpl.start,

          endTime: tpl.end,

          name: `${dest.city} ${tpl.suffix}`,

          location: dest.city,

          city: dest.city,

          country: dest.country,

          description:
            "A starting idea — adjust the plan, participants and cost, or browse Discover.",

          participants: allIds,

          activityCost: {
            amount: Math.round(base * tpl.cost),
            currency: dest.currency,
          },

          transportType: "Metro",

          transportCost: {
            amount: Math.round(base * 0.02),
            currency: dest.currency,
          },

          travelDuration: 20,

          walkingDuration: 30,

          walkingLevel: tpl.walk,

          activityType: tpl.type,

          signals: {
            preferenceMatch: 70,

            popularity: k === 0 ? 92 : 75,

            historyMatch: k === 2 ? 68 : null,

            budgetFit: 85,

            scheduleFit: 88,
          },

          reason:
            "An editable starting idea. Compare it with your preferences and budget before confirming.",

          inspirationLinks:
            k === 0
              ? [
                  {
                    label: `${dest.city} highlights video`,
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(dest.city + " travel")}`,
                  },
                ]
              : [],

          locked: false,

          alternatives: [
            {
              id: `alt-${day}-${k}-a`,

              name: `${dest.city} viewpoint & café`,

              location: dest.city,

              cost: {
                amount: Math.round(base * 0.06),
                currency: dest.currency,
              },

              walking: "Low",

              activityType: "Relaxation",

              tags: ["Fits budget", "Lower walking"],

              reason:
                "A cheaper, lower-effort option that still fits the group's pace.",

              signals: {
                preferenceMatch: 74,
                popularity: 80,
                historyMatch: null,
                budgetFit: 95,
                scheduleFit: 90,
              },
            },

            {
              id: `alt-${day}-${k}-b`,

              name: `${dest.city} free walking route`,

              location: dest.city,

              cost: { amount: 0, currency: dest.currency },

              walking: "Medium",

              activityType: "Sightseeing",

              tags: ["Free", "Popular"],

              reason:
                "A no-cost alternative that keeps you exploring the city.",

              signals: {
                preferenceMatch: 72,
                popularity: 85,
                historyMatch: null,
                budgetFit: 100,
                scheduleFit: 86,
              },
            },
          ],
        })
      })
    }
  })

  return {
    name: cfg.name.trim() || "My Trip",

    budgetMode: cfg.budgetMode,

    groupBudget: cfg.groupBudget,

    displayCurrency: cfg.displayCurrency,

    days: cfg.days,

    startDate: cfg.startDate,

    groupNote:
      "This starter plan uses your group's preferences. Review estimated costs against your budget, then edit activities or browse Discover.",

    travellers,

    subgroups: [],

    destinations,

    legs,

    accommodations,

    activities,

    weather: Array.from({ length: cfg.days }, (_, day) => {
      const dest = destinations.find(
        (d) => day >= d.dayStart && day <= d.dayEnd,
      )!

      return {
        dayIndex: day,
        city: dest.city,
        tempC: 20 + ((day * 3) % 6),
        condition: "Sunny" as const,
      }
    }),

    manualExpenses: [],
  }
}
