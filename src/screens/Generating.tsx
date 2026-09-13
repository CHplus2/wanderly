import { useEffect, useState } from "react"
import { Icon } from "../components/icons"
import { useTrip } from "../state"
import { participantLabel } from "../components/travellers"

const STEPS = [
  "Saving traveller preferences",
  "Checking budgets and currencies",
  "Preparing editable activity ideas",
  "Adding transfer estimates",
  "Leaving time for estimated arrivals",
  "Finding alternatives and recommendations",
]

export default function Generating() {
  const { setScreen, setTab, trip } = useTrip()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => {
        if (a >= STEPS.length) {
          clearInterval(interval)
          return a
        }
        return a + 1
      })
    }, 520)
    const done = setTimeout(
      () => {
        setTab("overview")
        setScreen("app")
      },
      STEPS.length * 520 + 500,
    )
    return () => {
      clearInterval(interval)
      clearTimeout(done)
    }
  }, [setScreen, setTab])

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-9 h-9 rounded-xl bg-brand grid place-items-center text-brand-fg">
            <Icon.sparkle size={18} />
          </span>
          <div>
            <h1 className="text-[20px]">Building your trip…</h1>
            {trip && (
              <p className="text-[13px] text-muted">
                {trip.name} · {trip.destinations.map((d) => d.city).join(" → ")}{" "}
                · {trip.days} days ·{" "}
                {participantLabel(
                  trip,
                  trip.travellers.map((t) => t.id),
                )}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {STEPS.map((s, i) => {
            const state =
              i < active ? "done" : i === active ? "active" : "pending"
            return (
              <div
                key={s}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                  state === "active" ? "bg-surface-2" : ""
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full grid place-items-center shrink-0 ${
                    state === "done"
                      ? "bg-good/20 text-good"
                      : state === "active"
                        ? "text-brand-hi"
                        : "text-faint"
                  }`}
                >
                  {state === "done" ? (
                    <Icon.check size={13} />
                  ) : state === "active" ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full border border-line" />
                  )}
                </span>
                <span
                  className={`text-[14px] ${
                    state === "pending" ? "text-faint" : "text-ink"
                  }`}
                >
                  {s}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-[12px] text-faint mt-6 leading-relaxed">
          Wanderly drafts a starting plan from everyone's preferences and
          budgets. You stay in control — nothing is locked in, and every
          suggestion can be accepted, edited, or rejected.
        </p>
      </div>
    </div>
  )
}
