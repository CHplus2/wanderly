import { Badge, Button } from "./ui"
import { useTrip } from "../state"
import {
  confidence,
  noticeKey,
  reminderActive,
  weatherRisks,
} from "../lib/adaptive"

export default function WeatherNotice({ onReview }: { onReview: () => void }) {
  const { trip, update } = useTrip()
  if (!trip?.weatherDisruption) return null
  const f = trip.weatherDisruption,
    risks = weatherRisks(trip),
    horizon = confidence(f.horizonDays)
  const result =
    trip.adaptiveResult?.forecastId === f.id ? trip.adaptiveResult : undefined
  if (f.cleared)
    return (
      <div className="rounded-xl border border-line p-3 text-sm text-muted">
        Forecast cleared. No weather risk from this forecast; your itinerary
        stays as you left it.
      </div>
    )
  if (!risks.length && !result) return <p role="status" className="rounded-xl border border-line p-3 text-sm text-muted">Forecast updated. No scheduled activities overlap this rain risk.</p>
  const snoozed = reminderActive(trip)
  return (
    <section
      aria-label="Weather update"
      aria-live="polite"
      className={`rounded-xl border p-4 space-y-3 ${
        risks.length
          ? "border-warn/25 bg-warn-soft"
          : "border-good/25 bg-good-soft"
      }`}
    >
      {result && (
        <p role="status" className="text-sm font-medium">
          {result.count} {result.count === 1 ? "change" : "changes"} applied.{" "}
          {risks.length
            ? `${risks.length} ${
                risks.length === 1
                  ? "activity still needs"
                  : "activities still need"
              } attention.`
            : "No activities remain affected by this rain window."}
        </p>
      )}
      {risks.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge tone="warn">{horizon.label}</Badge>
            <span className="text-xs text-muted">
              {f.horizonDays === 0
                ? "Today"
                : `${f.horizonDays} ${
                    f.horizonDays === 1 ? "day" : "days"
                  } away`}
            </span>
          </div>
          <h2 className="text-[16px]">
            {f.severity === "heavy-rain" ? "Heavy rain" : "Rain"} may affect {risks.length}{" "}
            {risks.length === 1 ? "activity" : "activities"}
          </h2>
          <p className="text-xs text-muted">
            Day {f.dayIndex + 1} · {f.city} · {f.startTime}–{f.endTime}
          </p>
          <p className="text-xs text-muted">{horizon.early ? "Lower certainty at this range; exact timing may shift." : "Closer to the date; conditions can still change."}</p>
          <p className="text-sm text-muted">
            {snoozed
              ? "Reminder saved. Risk markers stay visible; you can review whenever you're ready."
              : horizon.early
                ? "Conditions may change. You can wait until closer to the date before changing your itinerary."
                : "Wanderly prepared suggested adjustments. You decide what changes."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={horizon.early || snoozed ? "secondary" : "primary"}
              size="sm"
              onClick={onReview}
            >
              {snoozed
                ? "Review now"
                : horizon.early
                  ? "Review options anyway"
                  : result
                    ? "Review alternatives"
                    : "Review suggested plan"}
            </Button>
            {!snoozed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  update((d) => {
                    d.weatherReminder = {
                      signature: noticeKey(d),
                      untilHorizonDays: horizon.early ? 2 : -1,
                      until:
                        Date.now() +
                        (horizon.early ? 30 * 24 : 6) * 60 * 60 * 1000,
                    }
                  })
                }
              >
                {horizon.early
                  ? "Remind me closer to the date"
                  : "Remind me later"}
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
