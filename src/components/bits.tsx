import { Icon } from "./icons"
import type { DayWeather, Trip } from "../types"
import { fmtMoney } from "../lib/currency"
import type { Money, CurrencyCode } from "../types"

export function WeatherIcon({
  condition,
  size = 16,
}: {
  condition: DayWeather["condition"]
  size?: number
}) {
  if (condition === "Sunny")
    return <Icon.sun size={size} className="text-warn" />
  if (condition === "Rain" || condition === "Showers")
    return <Icon.rain size={size} className="text-brand-hi" />
  return <Icon.cloud size={size} className="text-muted" />
}

export function RouteStrip({
  trip,
  compact = false,
}: {
  trip: Trip
  compact?: boolean
}) {
  return (
    <div
      className={`flex ${
        compact ? "flex-row items-center gap-2 flex-wrap" : "flex-col"
      } min-w-0`}
    >
      {trip.destinations.map((d, i) => (
        <div
          key={d.id}
          className={compact ? "flex items-center gap-2 min-w-0" : "min-w-0"}
        >
          {i > 0 && (
            <span
              className={
                compact
                  ? "text-faint shrink-0"
                  : "flex items-center gap-2 py-1 pl-1 text-faint"
              }
            >
              {compact ? (
                <Icon.chevron size={13} />
              ) : (
                <Icon.arrowDown size={14} />
              )}
            </span>
          )}
          <div
            className={compact ? "min-w-0" : "flex items-start gap-3 min-w-0"}
          >
            {!compact && (
              <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1.5" />
            )}
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-ink truncate">
                {d.city}
              </div>
              {!compact && (
                <div className="text-[12px] text-faint break-words">
                  {d.country} · Day {d.dayStart + 1}
                  {d.dayEnd !== d.dayStart ? `–${d.dayEnd + 1}` : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/*
  FIX: MoneyText previously rendered `original` and `converted` inline on a
  single `whitespace-nowrap` line, e.g. "¥6,000 RM186". Wherever this sits in
  a `shrink-0` box (as it does in ActivityCard's price column), that box is
  not allowed to shrink to fit its container — so on narrow cards the nowrap
  text kept its full intrinsic width and, being right-aligned, overflowed
  *leftward* past the card edge, visually overlapping the sibling column's
  content (badges/title) underneath it.

  Fix: stack `original` and `converted` on separate lines (like the existing
  "X each" sub-line elsewhere in the app) instead of forcing them onto one
  nowrap row. Each line still doesn't wrap internally (a single amount like
  "¥6,000" is short and safe to keep on one line), but the two no longer
  compete for the same horizontal space.
*/
export function MoneyText({
  money,
  display,
  className = "",
}: {
  money: Money
  display: CurrencyCode
  className?: string
}) {
  const { original, converted } = fmtMoney(money, display)
  return (
    <span
      className={`tnum inline-flex flex-col items-end leading-tight ${className}`}
    >
      <span className="whitespace-nowrap">{original}</span>
      {converted && (
        <span className="whitespace-nowrap text-faint font-normal text-[0.85em] mt-0.5">
          {converted}
        </span>
      )}
    </span>
  )
}
