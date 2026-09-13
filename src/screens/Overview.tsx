import { Card, Stat, Meter, Badge, Button } from "../components/ui"

import { Icon } from "../components/icons"

import { RouteStrip, WeatherIcon, MoneyText } from "../components/bits"

import { AvatarStack } from "../components/travellers"

import { useTrip } from "../state"

import { fmt } from "../lib/currency"

import { budgetStatus } from "../lib/compute"

import { weatherRisks } from "../lib/adaptive"

export default function Overview() {
  const { trip, totals, setTab } = useTrip()

  if (!trip) return null

  const dc = trip.displayCurrency

  const spent = Math.round(totals.total)

  const remaining = trip.groupBudget - spent

  const status = budgetStatus(spent, trip.groupBudget)

  const upcoming = [...trip.activities].sort(
    (a, b) => a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime),
  )[0]

  const riskCount = weatherRisks(trip).length

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[13px] text-muted mb-1">
          <Icon.pin size={14} className="text-brand-hi shrink-0" />
          <span className="min-w-0 break-words">
            {trip.destinations.map((d) => d.city).join(" → ")}
          </span>
        </div>
        <h1 className="text-[28px] @min-[640px]/phone:text-[32px] font-display font-semibold tracking-tight break-words">
          {trip.name}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[14px] text-muted">
            {trip.days} days · {trip.travellers.length} travellers ·{" "}
            {trip.budgetMode === "shared"
              ? "Shared group budget"
              : "Individual budgets"}
          </span>
        </div>
      </div>

      {/* Budget banner */}
      <Card className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] text-muted uppercase tracking-wide">
              Trip budget
            </div>
            <div className="text-[26px] font-display font-semibold tnum mt-1">
              {fmt(spent, dc)}{" "}
              <span className="text-faint text-[16px] font-normal">
                / {fmt(trip.groupBudget, dc)}
              </span>
            </div>
          </div>
          <Badge
            tone={
              status === "good" ? "good" : status === "warn" ? "warn" : "bad"
            }
          >
            {remaining >= 0
              ? `${fmt(remaining, dc)} remaining`
              : `${fmt(-remaining, dc)} over budget`}
          </Badge>
        </div>
        <div className="mt-3">
          <Meter value={spent} max={trip.groupBudget} tone={status} />
        </div>
        <div
          className="grid gap-4 mt-5 pt-4 border-t border-line-soft"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          }}
        >
          <Stat label="Shared" value={fmt(Math.round(totals.shared), dc)} />
          <Stat label="Personal" value={fmt(Math.round(totals.personal), dc)} />
          <Stat
            label="Per traveller"
            value={fmt(Math.round(spent / trip.travellers.length), dc)}
          />
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => setTab("budget")}>
              View budget <Icon.chevron size={14} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid @min-[1024px]/phone:grid-cols-3 gap-6">
        <div className="@min-[1024px]/phone:col-span-2 space-y-6">
          {/* Upcoming */}
          {upcoming && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-medium">Next up</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTab("itinerary")}
                >
                  Full itinerary <Icon.chevron size={14} />
                </Button>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0">
                  <div className="text-[11px] text-faint uppercase">
                    Day {upcoming.dayIndex + 1}
                  </div>
                  <div className="text-[15px] font-medium tnum">
                    {upcoming.startTime}
                  </div>
                </div>
                <div className="w-px self-stretch bg-line-soft" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[15px] leading-snug line-clamp-2">
                    {upcoming.name}
                  </div>
                  <div className="text-[13px] text-muted flex items-start gap-1.5 mt-0.5 min-w-0">
                    <Icon.pin size={13} className="shrink-0 mt-0.5" />
                    <span className="break-words">
                      {upcoming.location}, {upcoming.city}
                    </span>
                  </div>
                  <div className="mt-2">
                    <AvatarStack trip={trip} ids={upcoming.participants} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <MoneyText
                    money={upcoming.activityCost}
                    display={dc}
                    className="font-medium text-[14px]"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Weather */}
          <Card className="p-5">
            <h2 className="text-[15px] font-medium mb-1">Weather</h2>
            <p className="text-xs text-muted mb-3">
              Sample forecast · no live monitoring
            </p>
            {riskCount > 0 && (
              <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-warn-soft border border-warn/25">
                <Icon.info size={16} className="text-warn mt-0.5 shrink-0" />
                <div className="text-[13px] text-ink leading-relaxed min-w-0 break-words">
                  {riskCount}{" "}
                  {riskCount === 1 ? "activity may be" : "activities may be"}{" "}
                  affected by expected rain —{" "}
                  <button
                    onClick={() => setTab("itinerary")}
                    className="text-warn underline underline-offset-2"
                  >
                    review options
                  </button>
                  .
                </div>
              </div>
            )}
            <div className="grid grid-cols-5 gap-2">
              {trip.weather.slice(0, trip.days).map((w) => (
                <div
                  key={w.dayIndex}
                  className="text-center p-2 rounded-lg bg-surface-2 border border-line-soft min-w-0"
                >
                  <div className="text-[11px] text-faint">
                    Day {w.dayIndex + 1}
                  </div>
                  <div className="my-1.5 grid place-items-center">
                    <WeatherIcon condition={w.condition} size={20} />
                  </div>
                  <div className="text-[13px] font-medium tnum">{w.tempC}°</div>
                  <div className="text-[10px] text-faint truncate">
                    {w.city}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Route */}
          <Card className="p-5">
            <h2 className="text-[15px] font-medium mb-4">Trip route</h2>
            <RouteStrip trip={trip} />
            {trip.legs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-line-soft space-y-2">
                {trip.legs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setTab("transport")}
                    className="w-full flex flex-col items-start gap-0.5 text-[12px] text-muted hover:text-ink text-left"
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Icon.transport size={13} className="shrink-0" />
                      <span className="break-words">
                        {l.from} → {l.to}
                      </span>
                    </span>
                    <span className="tnum text-faint">{l.type}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Travellers */}
          <Card className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-[15px] font-medium">Travellers</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTab("group")}
                className="shrink-0 px-2"
                aria-label="Manage travellers"
              >
                <Icon.chevron size={14} />
              </Button>
            </div>
            <div className="space-y-3">
              {trip.travellers.map((t) => {
                const sp = Math.round(totals.byTraveller[t.id] || 0)

                const individual = trip.budgetMode === "individual"

                const st = budgetStatus(
                  sp,
                  individual ? t.budget : trip.groupBudget,
                )

                return (
                  <div key={t.id}>
                    <div className="flex items-center gap-2 text-[13px] mb-1 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: t.color }}
                      />
                      <span className="truncate">{t.name}</span>
                    </div>
                    <div className="text-[12px] text-muted tnum mb-1">
                      {individual
                        ? `${fmt(sp, dc)} / ${fmt(t.budget, dc)}`
                        : `Est. ${fmt(sp, dc)}`}
                    </div>
                    <Meter
                      value={sp}
                      max={individual ? t.budget : trip.groupBudget}
                      tone={st}
                    />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* AI note */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand/12 grid place-items-center text-brand-hi shrink-0">
            <Icon.sparkle size={16} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-medium">
              Why this plan fits your group
            </h2>
            <p className="text-[13px] text-muted leading-relaxed mt-1 break-words">
              {trip.groupNote}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
