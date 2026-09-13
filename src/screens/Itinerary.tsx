import { useState } from "react"
import PlanDiscovery from "../components/PlanDiscovery"
import WeatherNotice from "../components/WeatherNotice"
import AdaptiveReview from "../components/AdaptiveReview"
import WeatherSimulation from "../components/WeatherSimulation"
import { exposure, isWeatherRisk } from "../lib/adaptive"

import {
  Card,
  Button,
  Badge,
  Modal,
  Field,
  Input,
  Select,
  Textarea,
  SectionTitle,
} from "../components/ui"
import { Icon } from "../components/icons"
import {
  ParticipantSelector,
  AvatarStack,
  participantLabel,
} from "../components/travellers"
import { WeatherIcon, MoneyText } from "../components/bits"
import { useTrip } from "../state"
import { CURRENCIES, fmt } from "../lib/currency"
import { activityPhoto, activityShares } from "../lib/media"
import type {
  Activity,
  CurrencyCode,
  ManualExpense,
  TransportType,
  WalkingLevel,
  Trip,
} from "../types"

const TRANSPORT_TYPES: TransportType[] = [
  "Flight",
  "High-speed rail",
  "Train",
  "Metro",
  "Bus",
  "Taxi",
  "Walking",
]
const WALK_LEVELS: WalkingLevel[] = ["Low", "Medium", "High"]

function dayCity(trip: Trip, day: number) {
  const d = trip.destinations.find((x) => day >= x.dayStart && day <= x.dayEnd)
  return d ?? trip.destinations[0]
}

export default function Itinerary() {
  const {
    trip,
    updateActivity,
    addActivity,
    deleteActivity,
    setParticipants,
    toggleLock,
    addManualExpense,
  } = useTrip()
  const [editing, setEditing] = useState<Activity | null>(null)
  const [creating, setCreating] = useState<{
    day: number
    startTime?: string
    endTime?: string
    participants?: string[]
  } | null>(null)
  const [discovery, setDiscovery] = useState<string | null>(null)
  const [spendingFor, setSpendingFor] = useState<Activity | null>(null)
  const [adaptiveOpen, setAdaptiveOpen] = useState(false)
  const [weatherDemoOpen, setWeatherDemoOpen] = useState(false)

  if (!trip) return null
  const dc = trip.displayCurrency
  const days = Array.from({ length: trip.days }, (_, i) => i)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SectionTitle sub="Recommendations when you want them. Alternatives when you need them.">
          Itinerary
        </SectionTitle>
        <Button size="sm" onClick={() => setWeatherDemoOpen(true)}>Simulate weather</Button>
      </div>

      {weatherDemoOpen && <Modal open onClose={() => setWeatherDemoOpen(false)} title="Simulate a weather change"><WeatherSimulation onDone={() => setWeatherDemoOpen(false)} /></Modal>}

      <WeatherNotice onReview={() => setAdaptiveOpen(true)} />

      {days.map((day) => {
        const dest = dayCity(trip, day)
        const weather = trip.weather.find((w) => w.dayIndex === day)
        const dayActs = trip.activities
          .filter((a) => a.dayIndex === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
        const leg = trip.legs.find((l) => l.dayIndex === day)

        // group by start time
        const groups: { 
          time: string
          acts: Activity[]
         }[] = []
        for (const a of dayActs) {
          const g = groups.find((x) => x.time === a.startTime)
          if (g) g.acts.push(a)
          else groups.push({ time: a.startTime, acts: [a] })
        }

        return (
          <section key={day}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-[15px] font-display font-semibold uppercase tracking-wide">
                  Day {day + 1}{" "}
                  <span className="text-brand-hi">· {dest?.city}</span>
                </h2>
                <span className="text-[12px] text-faint">{dest?.country}</span>
              </div>
              {weather && (
                <span className="flex items-center gap-1.5 text-[13px] text-muted">
                  <WeatherIcon condition={weather.condition} size={16} />
                  <span className="tnum">{weather.tempC}°</span>
                  <span className="hidden @min-[640px]/phone:inline">
                    {weather.condition}
                  </span>
                </span>
              )}
            </div>

            {leg && (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-surface-2 border border-line-soft">
                <span className="w-8 h-8 rounded-lg bg-surface-3 grid place-items-center text-brand-hi shrink-0">
                  <Icon.transport size={16} />
                </span>
                <div className="text-[13px]">
                  <span className="font-medium">
                    {leg.from} → {leg.to}
                  </span>
                  <span className="text-muted ml-2">
                    {leg.type} · {leg.departure}–{leg.arrival} ·{" "}
                    {leg.durationMin >= 60
                      ? `${Math.floor(leg.durationMin / 60)}h ${leg.durationMin % 60}m`
                      : `${leg.durationMin}m`}
                  </span>
                </div>
                <span className="ml-auto text-[13px]">
                  <MoneyText money={leg.cost} display={dc} />
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {groups.map((g) => (
                <div key={g.time} className="flex gap-3">
                  <div className="w-12 @min-[640px]/phone:w-14 shrink-0 pt-3 text-right">
                    <div className="text-[13px] font-medium tnum">{g.time}</div>
                    {g.acts.length > 1 && (
                      <div className="text-[10px] text-brand-hi mt-0.5">
                        Parallel
                      </div>
                    )}
                  </div>
                  <div
                    className={`min-w-0 flex-1 grid gap-2.5 ${
                      g.acts.length > 1
                        ? "grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]"
                        : ""
                    }`}
                  >
                    {g.acts.map((a) => (
                      <ActivityCard
                        key={a.id}
                        trip={trip}
                        activity={a}
                        parallel={g.acts.length > 1}
                        onToggleLock={() => toggleLock(a.id)}
                        onEdit={() => setEditing(a)}
                        onAlternatives={() => setAdaptiveOpen(true)}
                        onDiscover={() => setDiscovery(a.id)}
                        onSpending={() => setSpendingFor(a)}
                        onDelete={() => deleteActivity(a.id)}
                        onParticipants={(ids) => setParticipants(a.id, ids)}
                      />
                    ))}
                    <button
                      onClick={() => {
                        const busy = new Set(
                          g.acts.flatMap((a) => a.participants),
                        )
                        const free = trip.travellers
                          .map((t) => t.id)
                          .filter((id) => !busy.has(id))
                        setCreating({
                          day,
                          startTime: g.time,
                          endTime: g.acts[0]?.endTime,
                          participants: free.length
                            ? free
                            : trip.travellers.map((t) => t.id),
                        })
                      }}
                      className="flex items-center justify-center gap-1.5 text-[12px] text-muted hover:text-brand-hi border border-dashed border-line rounded-xl py-2 transition-colors"
                    >
                      <Icon.plus size={14} /> Parallel activity at {g.time}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <div className="w-12 @min-[640px]/phone:w-14 shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start border border-dashed border-line"
                  onClick={() => setCreating({ day })}
                >
                  <Icon.plus size={15} /> Add activity to Day {day + 1}
                </Button>
              </div>
            </div>
          </section>
        )
      })}

      {editing && (
        <ActivityEditModal
          trip={trip}
          activity={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateActivity(editing.id, patch)
            setEditing(null)
          }}
        />
      )}

      {creating !== null && (
        <ActivityEditModal
          trip={trip}
          activity={newActivity(trip, creating)}
          isNew
          onClose={() => setCreating(null)}
          onSave={(patch) => {
            const base = newActivity(trip, creating)
            addActivity({ ...base, ...patch, id: "a" + Date.now() } as Activity)
            setCreating(null)
          }}
        />
      )}

      {spendingFor && (
        <AddSpendingModal
          trip={trip}
          activity={spendingFor}
          onClose={() => setSpendingFor(null)}
          onSave={(exp) => {
            addManualExpense(exp)
            setSpendingFor(null)
          }}
        />
      )}

      {discovery && (
        <PlanDiscovery
          activityId={discovery}
          onClose={() => setDiscovery(null)}
        />
      )}
      {adaptiveOpen && (
        <AdaptiveReview onClose={() => setAdaptiveOpen(false)} />
      )}
    </div>
  )
}

function newActivity(
  trip: Trip,
  opts: {
    day: number
    startTime?: string
    endTime?: string
    participants?: string[]
  },
): Activity {
  const { day } = opts
  const dest = dayCity(trip, day)
  return {
    id: "new-" + Date.now(),
    dayIndex: day,
    startTime: opts.startTime || "10:00",
    endTime: opts.endTime || "12:00",
    name: "",
    location: dest?.city || "",
    city: dest?.city || "",
    country: dest?.country || "",
    description: "",
    participants:
      opts.participants && opts.participants.length
        ? opts.participants
        : trip.travellers.map((t) => t.id),
    activityCost: {
      amount: 0,
      currency: dest?.currency || trip.displayCurrency,
    },
    transportType: "Metro",
    transportCost: {
      amount: 0,
      currency: dest?.currency || trip.displayCurrency,
    },
    travelDuration: 15,
    walkingDuration: 20,
    walkingLevel: "Medium",
    activityType: "Sightseeing",
    signals: {
      preferenceMatch: 70,
      popularity: 70,
      historyMatch: null,
      budgetFit: 80,
      scheduleFit: 85,
    },
    reason: "Added manually.",
    inspirationLinks: [],
    locked: true,
    alternatives: [],
  }
}

/* ---------- Activity card ---------- */

function ActivityCard({
  trip,
  activity: a,
  parallel,
  onToggleLock,
  onEdit,
  onAlternatives,
  onDiscover,
  onSpending,
  onDelete,
  onParticipants,
}: {
  trip: Trip
  activity: Activity
  parallel: boolean
  onToggleLock: () => void
  onEdit: () => void
  onAlternatives: () => void
  onDiscover: () => void
  onSpending: () => void
  onDelete: () => void
  onParticipants: (ids: string[]) => void
}) {
  const dc = trip.displayCurrency
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)

  const shares = activityShares(trip, a)
  const atRisk = isWeatherRisk(trip, a)
  const otherLinks = a.inspirationLinks.filter(
    (l) =>
      /^https?:\/\//i.test(l.url) && !/youtube|youtu.be|tiktok/i.test(l.url),
  )

  return (
    <Card
      className={`overflow-hidden min-w-0 ${a.locked ? "border-brand/30" : ""}`}
    >
      {/* Location photo */}
      <div className="relative h-28">
        <img
          src={activityPhoto(a)}
          alt={a.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
      </div>

      <div className="p-3.5">
        {atRisk ? (
          <div className="mb-3 rounded-lg bg-warn-soft p-2.5 space-y-1">
            <Badge tone="warn">Weather risk</Badge>
            <p className="text-xs text-muted">
              Rain expected during this activity.
            </p>
            <button
              onClick={onAlternatives}
              className="min-h-11 text-xs font-medium text-brand underline underline-offset-2"
            >
              View options
            </button>
          </div>
        ) : (
          a.adjustedForForecast && (
            <Badge tone="good" className="mb-2">
              Adjusted
            </Badge>
          )
        )}
        <div className="flex flex-col gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-faint tnum whitespace-nowrap">
                {a.startTime}–{a.endTime}
              </span>
              <Badge tone="neutral">{a.activityType}</Badge>
              {a.locked && (
                <span className="text-brand-hi flex items-center gap-0.5 text-[10px]">
                  <Icon.lock size={11} /> Locked
                </span>
              )}
            </div>
            <div className="font-medium text-[15px] mt-1 leading-snug">
              {a.name}
            </div>
            <div className="text-[12px] text-muted flex items-center gap-1 mt-0.5">
              <Icon.pin size={12} /> {a.location}, {a.city}
            </div>
          </div>
          <div className="text-right self-end">
            <MoneyText
              money={a.activityCost}
              display={dc}
              className="font-medium text-[14px]"
            />
            {shares.shares.length > 1 && (
              <div className="text-[11px] text-faint tnum mt-0.5">
                {fmt(shares.each, dc)} each
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5">
          <AvatarStack trip={trip} ids={a.participants} size={20} />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[12px] text-muted">
          <span className="flex items-center gap-1">
            <Icon.walk size={13} /> {a.walkingLevel}
          </span>
          <span className="flex items-center gap-1">
            <Icon.transport size={13} /> {a.transportType}
          </span>
          {a.travelDuration > 0 && (
            <span className="flex items-center gap-1">
              <Icon.clock size={13} /> {a.travelDuration}m travel
            </span>
          )}
        </div>

        {open && (
          <div className="mt-3 pt-3 border-t border-line-soft space-y-3.5 anim-in">
            <div className="flex items-start gap-2 text-[12px] text-muted leading-relaxed">
              <Icon.info size={13} className="text-faint mt-0.5 shrink-0" />
              <span>{a.reason}</span>
            </div>

            {/* Per-traveller budget split */}
            <div>
              <div className="text-[11px] text-faint uppercase tracking-wide mb-1.5">
                Cost per traveller
              </div>
              <div className="space-y-1">
                {shares.shares.map((s) => (
                  <div
                    key={s.traveller.id}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.traveller.color }}
                      />
                      {s.traveller.name}
                    </span>
                    <span className="text-muted tnum">{fmt(s.amount, dc)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-[12px] pt-1 mt-1 border-t border-line-soft">
                  <span className="text-faint">Total (incl. transport)</span>
                  <span className="text-ink font-medium tnum">
                    {fmt(shares.total, dc)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-faint uppercase tracking-wide mb-1.5">
                Participants
              </div>
              <ParticipantSelector
                trip={trip}
                selected={a.participants}
                onChange={onParticipants}
              />
            </div>

            {/* Reference links (non-video) */}
            {otherLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {otherLinks.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] text-brand-hi hover:underline"
                  >
                    <Icon.link size={13} /> {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-line-soft">
          <Button size="sm" onClick={onDiscover}>
            <Icon.sparkle size={14} /> Discover
          </Button>
          {!!trip.savedOptions?.[a.id]?.length && (
            <span className="text-xs text-muted">
              {trip.savedOptions[a.id].length} saved{" "}
              {trip.savedOptions[a.id].length === 1
                ? "alternative"
                : "alternatives"}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 mt-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-[12px] text-muted hover:text-ink flex items-center gap-1"
          >
            {open ? "Hide details" : "Details"}
            <Icon.chevronDown
              size={13}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <span className="ml-auto" />
          <IconBtn
            title={a.locked ? "Unlock" : "Lock"}
            onClick={onToggleLock}
            active={a.locked}
          >
            {a.locked ? <Icon.lock size={15} /> : <Icon.unlock size={15} />}
          </IconBtn>
          <IconBtn title="Edit" onClick={onEdit}>
            <Icon.edit size={15} />
          </IconBtn>
          <div className="relative">
            <IconBtn title="More" onClick={() => setMenu((m) => !m)}>
              <span className="text-[16px] leading-none">⋯</span>
            </IconBtn>
            {menu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenu(false)}
                />
                <div className="absolute right-0 bottom-full mb-1 z-20 w-44 bg-surface-2 border border-line rounded-lg shadow-xl py-1 anim-in">
                  <MenuItem
                    onClick={() => {
                      setMenu(false)
                      onSpending()
                    }}
                    icon={<Icon.budget size={14} />}
                  >
                    Add spending
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenu(false)
                      onEdit()
                    }}
                    icon={<Icon.link size={14} />}
                  >
                    Reference link
                  </MenuItem>
                  <div className="h-px bg-line-soft my-1" />
                  <MenuItem
                    onClick={() => {
                      setMenu(false)
                      onDelete()
                    }}
                    icon={<Icon.trash size={14} />}
                    danger
                  >
                    Delete
                  </MenuItem>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function IconBtn({
  children,
  title,
  onClick,
  active,
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 grid place-items-center rounded-lg transition-colors ${
        active
          ? "text-brand-hi bg-brand/10"
          : "text-faint hover:text-ink hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  )
}

function MenuItem({
  children,
  icon,
  onClick,
  danger,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 h-9 text-[13px] transition-colors ${
        danger ? "text-bad hover:bg-bad-soft" : "text-ink hover:bg-surface-3"
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

/* ---------- Add spending modal ---------- */

function AddSpendingModal({
  trip,
  activity,
  onClose,
  onSave,
}: {
  trip: Trip
  activity: Activity
  onClose: () => void
  onSave: (e: ManualExpense) => void
}) {
  const [label, setLabel] = useState(activity.name + " — extra")
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState<CurrencyCode>(
    activity.activityCost.currency,
  )
  const [participants, setParticipants] = useState<string[]>(
    activity.participants,
  )
  const [category, setCategory] = useState<"shared" | "personal">(
    activity.participants.length === trip.travellers.length
      ? "shared"
      : "personal",
  )
  const per = participants.length ? amount / participants.length : 0
  return (
    <Modal
      open
      onClose={onClose}
      title="Record spending"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={amount <= 0 || participants.length === 0}
            onClick={() =>
              onSave({
                id: "e" + Date.now(),
                label,
                cost: { amount, currency },
                participants,
                category,
                dayIndex: activity.dayIndex,
              })
            }
          >
            Record spending
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Description">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Currency">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Category">
          <div className="flex gap-2">
            {(["shared", "personal"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`h-9 px-4 rounded-lg text-[13px] capitalize border transition-colors ${
                  category === c
                    ? "bg-brand/12 text-brand-hi border-brand/40"
                    : "bg-surface-2 text-muted border-line"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>
        <div>
          <span className="block text-[13px] font-medium text-ink mb-1.5">
            Participants
          </span>
          <ParticipantSelector
            trip={trip}
            selected={participants}
            onChange={setParticipants}
          />
          {participants.length > 0 && amount > 0 && (
            <p className="text-[12px] text-faint mt-2">
              {fmt(per, currency)} each · split across {participants.length}
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}

/* ---------- Activity edit modal ---------- */

function ActivityEditModal({
  trip,
  activity,
  isNew,
  onClose,
  onSave,
}: {
  trip: Trip
  activity: Activity
  isNew?: boolean
  onClose: () => void
  onSave: (patch: Partial<Activity>) => void
}) {
  const [d, setD] = useState<Activity>(activity)
  const set = (patch: Partial<Activity>) => setD({ ...d, ...patch })
  const addLink = () =>
    set({
      inspirationLinks: [
        ...d.inspirationLinks,
        { label: "Reference", url: "" },
      ],
    })

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Add activity" : "Edit activity"}
      wide
      footer={
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-[13px] text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={d.locked}
              onChange={(e) => set({ locked: e.target.checked })}
              className="accent-[var(--color-brand)] w-4 h-4"
            />
            Lock this activity (protected from suggested changes)
          </label>
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!d.name.trim()}
              onClick={() => onSave(d)}
            >
              {isNew ? "Add activity" : "Save changes"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Activity name">
          <Input
            value={d.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Shibuya Shopping"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location">
            <Input
              value={d.location}
              onChange={(e) => set({ location: e.target.value })}
            />
          </Field>
          <Field label="Type">
            <Input
              value={d.activityType}
              onChange={(e) => set({ activityType: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start time">
            <Input
              type="time"
              value={d.startTime}
              onChange={(e) => set({ startTime: e.target.value })}
            />
          </Field>
          <Field label="End time">
            <Input
              type="time"
              value={d.endTime}
              onChange={(e) => set({ endTime: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Cost">
            <Input
              type="number"
              value={d.activityCost.amount}
              onChange={(e) =>
                set({
                  activityCost: {
                    ...d.activityCost,
                    amount: Number(e.target.value) || 0,
                  },
                })
              }
            />
          </Field>
          <Field label="Currency">
            <Select
              value={d.activityCost.currency}
              onChange={(e) =>
                set({
                  activityCost: {
                    ...d.activityCost,
                    currency: e.target.value as CurrencyCode,
                  },
                })
              }
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Walking">
            <Select
              value={d.walkingLevel}
              onChange={(e) =>
                set({ walkingLevel: e.target.value as WalkingLevel })
              }
            >
              {WALK_LEVELS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Transport">
          <Select
            value={d.transportType}
            onChange={(e) =>
              set({ transportType: e.target.value as TransportType })
            }
          >
            {TRANSPORT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea
            rows={2}
            value={d.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </Field>
        <Field label="Weather exposure">
          <Select
            value={exposure(d)}
            onChange={(e) =>
              set({ environment: e.target.value as Activity["environment"] })
            }
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="mixed">Partly outdoors</option>
          </Select>
        </Field>
        <div>
          <span className="block text-[13px] font-medium text-ink mb-1.5">
            Participants
          </span>
          <ParticipantSelector
            trip={trip}
            selected={d.participants}
            onChange={(ids) => set({ participants: ids })}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-medium text-ink">
              Reference links
            </span>
            <Button variant="ghost" size="sm" onClick={addLink}>
              <Icon.plus size={13} /> Add link
            </Button>
          </div>
          <div className="space-y-2">
            {d.inspirationLinks.map((l, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="w-40"
                  value={l.label}
                  onChange={(e) =>
                    set({
                      inspirationLinks: d.inspirationLinks.map((x, j) =>
                        j === i ? { ...x, label: e.target.value } : x,
                      ),
                    })
                  }
                  placeholder="Label"
                />
                <Input
                  value={l.url}
                  onChange={(e) =>
                    set({
                      inspirationLinks: d.inspirationLinks.map((x, j) =>
                        j === i ? { ...x, url: e.target.value } : x,
                      ),
                    })
                  }
                  placeholder="https://…"
                />
                <button
                  onClick={() =>
                    set({
                      inspirationLinks: d.inspirationLinks.filter(
                        (_, j) => j !== i,
                      ),
                    })
                  }
                  className="w-9 h-9 grid place-items-center text-faint hover:text-bad shrink-0"
                >
                  <Icon.trash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
