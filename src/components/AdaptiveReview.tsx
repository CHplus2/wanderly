import { useState } from "react"
import { Badge, Button, Field, Input, Modal, Select } from "./ui"
import { useTrip } from "../state"
import {
  applyAdaptivePlan,
  confidence,
  forecastKey,
  indoorOptions,
  projectedActivity,
  suggestAdaptivePlan,
  validateAdaptivePlan,
  weatherRisks,
  type AdaptiveSuggestion,
} from "../lib/adaptive"
import { computeTotals } from "../lib/compute"
import { fmt } from "../lib/currency"

export default function AdaptiveReview({ onClose }: { onClose: () => void }) {
  const { trip, update, toggleLock } = useTrip()
  const [suggestions, setSuggestions] = useState(() =>
    trip ? suggestAdaptivePlan(trip) : [],
  )
  const [key] = useState(() => (trip ? forecastKey(trip) : ""))
  const [chooser, setChooser] = useState<string | null>(null)
  const [timeEditor, setTimeEditor] = useState<string | null>(null)
  const [applied, setApplied] = useState(0)
  const [submitErrors, setSubmitErrors] = useState<string[]>([])
  const [removedSuggestions, setRemovedSuggestions] = useState<AdaptiveSuggestion[]>([])
  if (!trip || !trip.weatherDisruption) return null
  const forecast = trip.weatherDisruption
  const patch = (id: string, value: Partial<AdaptiveSuggestion>) =>
    setSuggestions((all) =>
      all.map((s) => (s.activityId === id ? { ...s, ...value } : s)),
    )
  const selected = suggestions.filter((s) => s.included)
  const errors = validateAdaptivePlan(trip, suggestions)
  if (key !== forecastKey(trip))
    errors.push(
      "The forecast changed. Close this review and prepare a fresh plan.",
    )
  const projected = {
    ...trip,
    activities: trip.activities.map((a) => {
      const s = selected.find((s) => s.activityId === a.id)
      return s ? projectedActivity(a, s) : a
    }),
  }
  const delta = computeTotals(projected).total - computeTotals(trip).total
  const remaining = weatherRisks(trip).length
  const removed = weatherRisks(trip).filter(
    (a) => !suggestions.some((s) => s.activityId === a.id),
  )
  return (
    <Modal
      open
      onClose={onClose}
      title={
        applied
          ? `${applied} ${applied === 1 ? "change" : "changes"} applied`
          : "Review adaptive plan"
      }
      footer={
        !applied ? (
          <div className="space-y-2">
            <div className="flex justify-between gap-2 text-xs">
              <span className="text-muted">Estimated cost change</span>
              <strong className="tnum">
                {delta < 0 ? "−" : delta > 0 ? "+" : ""}
                {fmt(Math.abs(delta), trip.displayCurrency)}
              </strong>
            </div>
            <Button
              variant="primary"
              className="w-full"
              disabled={!selected.length || errors.length > 0}
              onClick={() => {
                const result = applyAdaptivePlan(trip, suggestions, key)
                if (result.errors.length) {
                  setSubmitErrors(result.errors)
                  return
                }
                update((d) => {
                  const fresh = applyAdaptivePlan(d, suggestions, key)
                  if (!fresh.errors.length) Object.assign(d, fresh.trip)
                })
                setApplied(result.count)
              }}
            >
              Apply {selected.length}{" "}
              {selected.length === 1 ? "change" : "changes"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Keep current itinerary
            </Button>
          </div>
        ) : undefined
      }
    >
      {applied ? (
        <div className="space-y-4" role="status">
          <Badge tone="good">Itinerary updated</Badge>
          <p className="text-sm">
            {remaining
              ? `${remaining} ${
                  remaining === 1 ? "activity is" : "activities are"
                } still affected by expected rain.`
              : "Your scheduled activities no longer overlap this rain risk."}
          </p>
          <p className="text-xs text-muted">
            Only your selected changes were applied. Other activities and
            participants were kept.
          </p>
          {remaining > 0 && (
            <Button
              className="w-full"
              onClick={() => {
                setSuggestions(suggestAdaptivePlan(trip))
                setRemovedSuggestions([])
                setApplied(0)
              }}
            >
              Review remaining alternatives
            </Button>
          )}
          <Button variant="primary" className="w-full" onClick={onClose}>
            Back to itinerary
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Badge tone="warn">{confidence(forecast.horizonDays).label}</Badge>
            <p className="text-sm">
              Day {forecast.dayIndex + 1} · {forecast.city} · Rain{" "}
              {forecast.startTime}–{forecast.endTime}
            </p>
            <p className="text-xs text-muted">
              Choose what changes. Indoor alternatives keep the time slot; you
              can also move an activity outside the rain window.
            </p>
          </div>
          {suggestions.map((s, index) => {
            const a = trip.activities.find((a) => a.id === s.activityId)
            if (!a) return null
            const options = indoorOptions(trip, a)
            return (
              <article
                key={a.id}
                className={`border rounded-xl p-3 space-y-3 ${
                  s.included ? "border-brand/30" : "border-line bg-surface-2"
                }`}
              >
                <label className="flex items-start gap-2 min-h-11 text-sm font-medium">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 shrink-0 accent-[var(--color-brand)]"
                    checked={s.included}
                    disabled={a.locked}
                    onChange={(e) =>
                      patch(a.id, { included: e.target.checked })
                    }
                  />
                  <span>
                    Adjustment {index + 1}: {a.name}
                  </span>
                </label>
                <div className="text-xs">
                  <span className="uppercase tracking-wide text-muted">
                    Current
                  </span>
                  <p className="mt-1">
                    Day {a.dayIndex + 1} · {a.startTime}–{a.endTime}
                  </p>
                  <p className="font-medium text-sm mt-1">{a.name}</p>
                </div>
                <div className="bg-brand/5 rounded-lg p-3 text-xs">
                  <span className="uppercase tracking-wide text-brand">
                    Suggested
                  </span>
                  <p className="mt-1">
                    Day {s.dayIndex + 1} · {s.startTime}–{s.endTime}
                  </p>
                  <p className="font-medium text-sm mt-1">
                    {s.method === "replace"
                      ? (s.alternative?.name ?? "Choose an indoor alternative")
                      : a.name}
                  </p>
                  <p className="text-muted mt-2">
                    {s.method === "replace"
                      ? "Indoor option during the expected rain window."
                      : "Move this activity outside the expected rain window."}
                  </p>
                  {s.alternative &&
                    trip.savedOptions?.[a.id]?.some(
                      (o) => o.id === s.alternative?.id,
                    ) &&
                    s.method === "replace" && (
                      <Badge className="mt-2" tone="brand">
                        From your saved alternatives
                      </Badge>
                    )}
                </div>
                {a.locked && (
                  <div className="text-xs text-muted">
                    <p>This activity is locked and will stay unchanged.</p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        toggleLock(a.id)
                        patch(a.id, { included: true })
                      }}
                    >
                      Unlock to include
                    </Button>
                  </div>
                )}
                {!s.included && !a.locked && (
                  <Badge>Keeping original · risk remains</Badge>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setChooser(chooser === a.id ? null : a.id)}
                  >
                    Choose another
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      patch(a.id, { method: "reschedule" })
                      setTimeEditor(a.id)
                    }}
                  >
                    Change time
                  </Button>
                </div>
                {chooser === a.id && (
                  <Field label={`Alternative for ${a.name}`}>
                    <Select
                      value={
                        s.method === "replace" ? (s.alternative?.id ?? "") : ""
                      }
                      onChange={(e) => {
                        const alt = options.find(
                          (o) => o.option.id === e.target.value,
                        )?.option
                        if (alt)
                          patch(a.id, {
                            alternative: alt,
                            method: "replace",
                            dayIndex: a.dayIndex,
                            startTime: a.startTime,
                            endTime: a.endTime,
                          })
                      }}
                    >
                      <option value="">Choose an indoor alternative</option>
                      {options.map((o) => (
                        <option key={o.option.id} value={o.option.id}>
                          {o.saved ? "Saved · " : ""}
                          {o.option.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
                {timeEditor === a.id && (
                  <div className="space-y-2">
                    <Field label={`Day for ${a.name}`}>
                      <Select
                        value={s.dayIndex}
                        onChange={(e) =>
                          patch(a.id, {
                            dayIndex: Number(e.target.value),
                            method: "reschedule",
                          })
                        }
                      >
                        {Array.from({ length: trip.days }, (_, i) => (
                          <option value={i} key={i}>
                            Day {i + 1}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Start time">
                        <Input
                          type="time"
                          value={s.startTime}
                          onChange={(e) =>
                            patch(a.id, {
                              startTime: e.target.value,
                              method: "reschedule",
                            })
                          }
                        />
                      </Field>
                      <Field label="End time">
                        <Input
                          type="time"
                          value={s.endTime}
                          onChange={(e) =>
                            patch(a.id, {
                              endTime: e.target.value,
                              method: "reschedule",
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => patch(a.id, { included: false })}
                  >
                    Keep original
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setRemovedSuggestions(all => [...all.filter(p => p.activityId !== a.id), s])
                      setSuggestions((all) =>
                        all.filter((p) => p.activityId !== a.id),
                      )
                    }}
                  >
                    Remove suggestion
                  </Button>
                </div>
              </article>
            )
          })}
          {removed.length > 0 && (
            <div className="p-3 bg-surface-2 rounded-xl text-xs space-y-2">
              <p>
                {removed.length} removed{" "}
                {removed.length === 1 ? "suggestion" : "suggestions"}. Those
                activities remain unchanged.
              </p>
              {removed.map(a => <div key={a.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0">{a.name} · risk remains</span>
                <Button size="sm" aria-label={`Restore ${a.name}`} onClick={() => {
                  const saved = removedSuggestions.find(s => s.activityId === a.id)
                  if (!saved) return
                  setSuggestions(all => [...all, {...saved, included: saved.included && !a.locked}])
                  setRemovedSuggestions(all => all.filter(s => s.activityId !== a.id))
                }}>Undo removal</Button>
              </div>)}
            </div>
          )}
          {(errors.length > 0 || submitErrors.length > 0) && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-warn-soft text-xs space-y-2"
            >
              {[...new Set([...errors, ...submitErrors])].map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          )}
          <p className="text-xs text-muted">
            Check venue hours and transfers before travelling. Prices are
            estimates; this does not change a booking.
          </p>
        </div>
      )}
    </Modal>
  )
}
