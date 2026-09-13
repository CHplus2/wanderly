export type CurrencyCode = "MYR" | "JPY" | "USD" | "EUR" | "CNY" | "GBP"

export type Money = { 
  amount: number
  currency: CurrencyCode
 }

export type TransportType = "Flight" | "High-speed rail" | "Train" | "Metro" | "Bus" | "Taxi" | "Walking"

export type WalkingLevel = "Low" | "Medium" | "High"

export interface Preferences {
  budget: "Low" | "Medium" | "High"
  interests: string[]
  pace: "Relaxed" | "Balanced" | "Packed"
  walking: WalkingLevel
  intensity: "Low" | "Medium" | "High"
  food: string[]
  mustDo: string[]
  avoid: string[]
  preferredTimes: string
  accessibility: string
}

export interface Traveller {
  id: string
  name: string
  color: string
  budget: number // in display currency terms (MYR base for demo)
  prefs: Preferences
}

export interface Subgroup {
  id: string
  name: string
  members: string[] // traveller ids
}

export interface Signals {
  preferenceMatch: number // 0-100 product signals, not scientific
  popularity: number
  historyMatch: number | null
  budgetFit: number
  scheduleFit: number
}

export interface InspirationLink {
  label: string
  url: string
}

export interface Review {
  author: string
  rating: number // 1-5
  text: string
  when: string // e.g. "2 weeks ago"
}

export interface Alternative {
  id: string
  name: string
  location: string
  cost: Money
  walking: WalkingLevel
  activityType: string
  tags: string[] // e.g. "Fits budget", "Popular"
  reason: string
  signals: Signals
  environment?: "indoor" | "outdoor" | "mixed"
}

export interface WeatherDisruption {
  id: string
  dayIndex: number
  city: string
  startTime: string
  endTime: string
  horizonDays: number
  severity: "rain" | "heavy-rain"
  cleared?: boolean
}

export interface Activity {
  environment?: "indoor" | "outdoor" | "mixed"
  adjustedForForecast?: string
  id: string
  dayIndex: number // 0-based
  startTime: string // HH:MM
  endTime: string
  name: string
  location: string
  city: string
  country: string
  description: string
  participants: string[] // traveller ids
  activityCost: Money
  transportCost?: Money
  transportType: TransportType
  travelDuration: number // minutes
  walkingDuration: number // minutes
  walkingLevel: WalkingLevel
  activityType: string
  signals: Signals
  reason: string
  inspirationLinks: InspirationLink[]
  locked: boolean
  alternatives: Alternative[]
  photo?: string // image URL
  rating?: number // 0-5 place rating
  reviewCount?: number
  reviews?: Review[]
}

export interface Destination {
  id: string
  city: string
  country: string
  currency: CurrencyCode
  arrival: string // ISO-ish label
  departure: string
  dayStart: number // 0-based inclusive
  dayEnd: number // inclusive
}

export interface TransportLeg {
  id: string
  from: string
  to: string
  dayIndex: number
  type: TransportType
  departure: string
  arrival: string
  durationMin: number
  cost: Money
  participants: string[]
}

export interface Accommodation {
  id: string
  destinationId: string
  name: string
  location: string
  checkIn: string
  checkOut: string
  nights: number
  room: string
  costPerNight: Money
  participants: string[]
}

export interface DayWeather {
  dayIndex: number
  city: string
  tempC: number
  condition: "Sunny" | "Cloudy" | "Rain" | "Showers"
  note?: string
  affectsActivityId?: string
  resolved?: "kept" | "applied"
}

export interface ManualExpense {
  id: string
  label: string
  cost: Money
  participants: string[]
  category: "shared" | "personal"
  dayIndex?: number
}

export interface Trip {
  weatherDisruption?: WeatherDisruption
  weatherReminder?: { 
    signature: string
    untilHorizonDays: number
    until: number
   }
  adaptiveResult?: { 
    count: number
    forecastId: string
   }
  savedOptions?: Record<string, Alternative[]>
  name: string
  budgetMode: "shared" | "individual"
  groupBudget: number // display currency
  displayCurrency: CurrencyCode
  days: number
  startDate: string
  travellers: Traveller[]
  subgroups: Subgroup[]
  destinations: Destination[]
  legs: TransportLeg[]
  accommodations: Accommodation[]
  activities: Activity[]
  weather: DayWeather[]
  manualExpenses: ManualExpense[]
  groupNote: string
}
