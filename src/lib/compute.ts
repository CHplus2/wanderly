import type { Trip, Money, CurrencyCode } from "../types";
import { toDisplay } from "./currency";

function share(money: Money, count: number, display: CurrencyCode): number {
  if (count <= 0) return 0;
  return toDisplay(money, display) / count;
}

export interface Totals {
  total: number;
  shared: number;
  personal: number;
  byTraveller: Record<string, number>;
}

/** All spending totals, in the trip's display currency. */
export function computeTotals(trip: Trip): Totals {
  const dc = trip.displayCurrency;
  const byTraveller: Record<string, number> = {};
  trip.travellers.forEach((t) => (byTraveller[t.id] = 0));
  let shared = 0;
  let personal = 0;

  const add = (id: string, amt: number) => {
    if (byTraveller[id] === undefined) return;
    byTraveller[id] += amt;
  };

  for (const a of trip.activities) {
    const p = a.participants.filter((id) => byTraveller[id] !== undefined);
    if (p.length === 0) continue;
    const isShared = p.length === trip.travellers.length;
    const perActivity = share(a.activityCost, p.length, dc);
    const perTransport = a.transportCost ? share(a.transportCost, p.length, dc) : 0;
    for (const id of p) add(id, perActivity + perTransport);
    const sum = (perActivity + perTransport) * p.length;
    if (isShared) shared += sum;
    else personal += sum;
  }

  for (const leg of trip.legs) {
    const p = leg.participants.filter((id) => byTraveller[id] !== undefined);
    const per = share(leg.cost, p.length, dc);
    for (const id of p) add(id, per);
    shared += per * p.length;
  }

  for (const acc of trip.accommodations) {
    const p = acc.participants.filter((id) => byTraveller[id] !== undefined);
    const total: Money = { amount: acc.costPerNight.amount * acc.nights, currency: acc.costPerNight.currency };
    const per = share(total, p.length, dc);
    for (const id of p) add(id, per);
    shared += per * p.length;
  }

  for (const e of trip.manualExpenses) {
    const p = e.participants.filter((id) => byTraveller[id] !== undefined);
    const per = share(e.cost, p.length, dc);
    for (const id of p) add(id, per);
    if (e.category === "shared") shared += per * p.length;
    else personal += per * p.length;
  }

  const total = Object.values(byTraveller).reduce((s, n) => s + n, 0);
  return { total, shared, personal, byTraveller };
}

export function budgetStatus(spent: number, budget: number): "good" | "warn" | "bad" {
  if (budget <= 0) return "good";
  const ratio = spent / budget;
  if (ratio > 1) return "bad";
  if (ratio > 0.9) return "warn";
  return "good";
}

export function activityCostDisplay(trip: Trip, activityId: string): number {
  const a = trip.activities.find((x) => x.id === activityId);
  if (!a) return 0;
  const t = a.transportCost ? toDisplay(a.transportCost, trip.displayCurrency) : 0;
  return toDisplay(a.activityCost, trip.displayCurrency) + t;
}
