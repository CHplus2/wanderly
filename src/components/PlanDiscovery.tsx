import { useState } from "react"
import { Badge, Button, Modal } from "./ui"
import { Icon } from "./icons"
import { MoneyText } from "./bits"
import { useTrip } from "../state"
import { fmt } from "../lib/currency"
import { computeTotals } from "../lib/compute"
import { rankOptions } from "../lib/discovery"
import { activityPhoto } from "../lib/media"
import type { Activity, Alternative } from "../types"

export default function PlanDiscovery({
  activityId,
  onClose,
}: {
  activityId: string
  onClose: () => void
}) {
  const { trip, update, applyAlternative, toggleLock } = useTrip()
  const mode = "explore"
  const [filter, setFilter] = useState<"all" | "indoor" | "saved">("all")
  const [selected, setSelected] = useState<Alternative | null>(null)
  const [applied, setApplied] = useState(false)
  const activity = trip?.activities.find((a) => a.id === activityId)
  if (!trip || !activity) return null
  const ranked = rankOptions(trip, activity, mode, filter === "indoor").filter(
    (r) => filter !== "saved" || r.saved,
  )
  const dc = trip.displayCurrency
  const comparison = selected
    ? rankOptions(trip, activity, mode).find((r) => r.option.id === selected.id)
    : undefined
  const save = (option: Alternative) =>
    update((d) => {
      d.savedOptions ??= {}
      const current = d.savedOptions[activityId] ?? []
      d.savedOptions[activityId] = current.some((o) => o.id === option.id)
        ? current.filter((o) => o.id !== option.id)
        : [...current, option]
    })
  return (
    <Modal
      open
      onClose={onClose}
      title={
        applied
          ? "Plan updated"
          : selected
            ? "Review your switch"
            : "Discover alternatives"
      }
    >
      {applied ? (
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-good-soft text-good grid place-items-center">
            <Icon.check size={24} />
          </div>
          <h4 className="text-lg">{activity.name}</h4>
          <p className="text-sm text-muted">
            Your itinerary and budget now reflect this option. The time slot and
            participants are retained. Confirm venue availability and travel
            times before you go.
          </p>
          <Button variant="primary" className="w-full" onClick={onClose}>
            Back to itinerary
          </Button>
        </div>
      ) : selected && comparison ? (
        <div className="space-y-4">
          <div className="p-3 bg-surface-2 rounded-xl text-sm space-y-2">
            <p className="text-muted">
              Replace <strong className="text-ink">{activity.name}</strong>
            </p>
            <Icon.arrowDown size={16} />
            <p className="font-medium">{selected.name}</p>
          </div>
          <dl className="text-sm space-y-3">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Activity cost change</dt>
              <dd className="font-medium tnum">
                {comparison.delta > 0 ? "+" : comparison.delta < 0 ? "−" : ""}
                {fmt(Math.abs(comparison.delta), dc)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">New trip estimate</dt>
              <dd className="font-medium tnum">
                {fmt(computeTotals(trip).total + comparison.delta, dc)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Time slot retained</dt>
              <dd>
                {activity.startTime}–{activity.endTime}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Walking</dt>
              <dd>
                {activity.walkingLevel} → {selected.walking}
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted bg-surface-2 p-3 rounded-lg">
            Time slot and transport estimate stay unchanged. Check opening hours
            and transfers before you go. This does not change a booking.
          </p>
          {!comparison.withinBudget && (
            <p className="text-sm text-bad">
              This option takes the trip over its total budget.
            </p>
          )}
          {comparison.avoided.length > 0 && (
            <p className="text-sm text-bad">
              Conflicts with an avoidance preference for{" "}
              {comparison.avoided.map((p) => p.name).join(", ")}.
            </p>
          )}
          {activity.locked && (
            <div className="rounded-lg bg-warn-soft p-3 space-y-2">
              <p className="text-sm">
                This activity is locked. Unlock it explicitly before replacing
                it.
              </p>
              <Button onClick={() => toggleLock(activity.id)} size="sm">
                Unlock this activity
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setSelected(null)}>
              Back
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={activity.locked || activity.participants.length === 0}
              onClick={() => {
                applyAlternative(activity.id, selected)
                setApplied(true)
              }}
            >
              Confirm switch
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted">
            Day {activity.dayIndex + 1} · Options for{" "}
            <strong className="text-ink">{activity.name}</strong>
          </p>

          <p className="text-xs text-muted leading-relaxed">
            Explore ideas for this activity. Save a favourite or compare a
            single change whenever you want.
          </p>
          <div className="flex flex-wrap gap-2">
            {(["all", "indoor", "saved"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`px-3 min-h-11 text-xs rounded-full border ${
                  filter === value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-muted"
                }`}
              >
                {value === "all"
                  ? "All ideas"
                  : value === "indoor"
                    ? "Indoor"
                    : "Saved"}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-muted border-l-2 border-accent pl-2">
            Estimated prices
          </div>
          {ranked.length === 0 && (
            <p className="p-5 bg-surface-2 rounded-xl text-sm text-muted">
              No options in this view yet. Browse all ideas and save an
              alternative for this activity.
            </p>
          )}
          {ranked.map(
            ({
              option,
              matches,
              walkingFits,
              people,
              delta,
              saved,
              avoided,
            }) => (
              <article
                key={option.id}
                className="rounded-xl border border-line overflow-hidden"
              >
                <img
                  src={activityPhoto({
                    ...activity,
                    photo: undefined,
                    activityType: option.activityType,
                  } as Activity)}
                  alt=""
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="p-3 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge>{option.activityType}</Badge>
                    {option.environment && <Badge>{option.environment}</Badge>}
                    {saved && <Badge tone="brand">Saved alternative</Badge>}
                  </div>
                  <h4 className="text-[15px] leading-snug">{option.name}</h4>
                  <p className="text-xs text-muted">
                    {matches.length
                      ? `Matches ${matches.map((p) => p.name).join(", ")}'s interests.`
                      : "A different experience to explore."}{" "}
                    Walking fits {walkingFits.length} of {people.length}{" "}
                    participants.
                  </p>
                  {avoided.length > 0 && (
                    <p className="text-xs text-bad">
                      Check avoidance preferences:{" "}
                      {avoided.map((p) => p.name).join(", ")}.
                    </p>
                  )}
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-xs text-muted">
                      {delta < 0 ? "Save " : delta > 0 ? "Extra " : "Change "}
                      {fmt(Math.abs(delta), dc)}
                    </span>
                    <MoneyText
                      money={option.cost}
                      display={dc}
                      className="text-sm font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      aria-pressed={saved}
                      onClick={() => save(option)}
                    >
                      {saved ? "Remove saved" : "Save alternative"}
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setSelected(option)}
                    >
                      Compare & switch
                    </Button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </Modal>
  )
}
