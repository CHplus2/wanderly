import type { Activity, Trip, Traveller } from "../types"
import { toDisplay } from "./currency"

/* ---------- Location photos ---------- */
// A curated pool of Unsplash photos keyed by activity type, with city fallbacks.
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=${w}&h=${Math.round(w * 0.5)}`

const BY_TYPE: Record<string, string> = {
  Food: U("1768162126000-b6060d02f4bb"),
  Shopping: U("1542052125323-e69ad37a47c2"),
  Nature: U("1440342359743-84fcb8c21f21"),
  Culture: U("1711372722413-21663859c92b"),
  History: U("1596240748549-6ec0f32d4c95"),
  Nightlife: U("1608060146923-7b8ab13e22bb"),
  Sightseeing: U("1561503972-839d0c56de17"),
  Relaxation: U("1621139151681-5ac8d73128ce"),
  Photography: U("1573455494057-12684d151bf4"),
}

const BY_CITY: Record<string, string> = {
  tokyo: U("1561503972-839d0c56de17"),
  kyoto: U("1711372722413-21663859c92b"),
  osaka: U("1596240748549-6ec0f32d4c95"),
}

const FALLBACK = U("1561503972-839d0c56de17")

export function activityPhoto(a: Activity): string {
  if (a.photo) return a.photo
  return (
    BY_TYPE[a.activityType] || BY_CITY[a.city.trim().toLowerCase()] || FALLBACK
  )
}

export interface Share {
  traveller: Traveller
  amount: number // in display currency
}

export function activityShares(
  trip: Trip,
  a: Activity,
): { 
  total: number
  each: number
  shares: Share[]
 } {
  const dc = trip.displayCurrency
  const total =
    toDisplay(a.activityCost, dc) +
    (a.transportCost ? toDisplay(a.transportCost, dc) : 0)
  const n = a.participants.length || 1
  const each = total / n
  const shares: Share[] = a.participants
    .map((id) => trip.travellers.find((t) => t.id === id))
    .filter((t): t is Traveller => !!t)
    .map((t) => ({ traveller: t, amount: each }))
  return { total, each, shares }
}
