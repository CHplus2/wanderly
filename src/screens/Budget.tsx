import { useState } from "react"

import {
  Card,
  Button,
  Badge,
  Meter,
  Stat,
  Modal,
  Field,
  Input,
  SectionTitle,
} from "../components/ui"

import { Icon } from "../components/icons"

import { AvatarStack } from "../components/travellers"

import { MoneyText } from "../components/bits"

import { useTrip } from "../state"

import { fmt, toDisplay } from "../lib/currency"

import { budgetStatus } from "../lib/compute"

import type { Money } from "../types"

interface Line {
  id: string

  label: string

  sub: string

  money: Money

  participants: string[]

  category: "shared" | "personal"
}

export default function Budget() {
  const { trip, totals, update, applyAlternative, removeManualExpense } =
    useTrip()

  const [editBudget, setEditBudget] = useState(false)

  const [changed, setChanged] = useState(false)

  const [rebalance, setRebalance] = useState(false)

  if (!trip) return null

  const dc = trip.displayCurrency

  const spent = Math.round(totals.total)

  const remaining = trip.groupBudget - spent

  const status = budgetStatus(spent, trip.groupBudget)

  const lines: Line[] = []

  for (const acc of trip.accommodations) {
    lines.push({
      id: acc.id,

      label: acc.name,

      sub: `${acc.location} · ${acc.nights} nights`,

      money: {
        amount: acc.costPerNight.amount * acc.nights,
        currency: acc.costPerNight.currency,
      },

      participants: acc.participants,

      category: "shared",
    })
  }

  for (const leg of trip.legs) {
    lines.push({
      id: leg.id,
      label: `${leg.from} → ${leg.to}`,
      sub: leg.type,
      money: leg.cost,
      participants: leg.participants,
      category: "shared",
    })
  }

  for (const a of trip.activities) {
    if (a.activityCost.amount > 0) {
      lines.push({
        id: a.id,

        label: a.name,

        sub: `Day ${a.dayIndex + 1} · ${a.city}`,

        money: a.activityCost,

        participants: a.participants,

        category:
          a.participants.length === trip.travellers.length
            ? "shared"
            : "personal",
      })
    }
  }

  for (const e of trip.manualExpenses) {
    lines.push({
      id: e.id,
      label: e.label,
      sub: e.dayIndex != null ? `Day ${e.dayIndex + 1} · recorded` : "Recorded",
      money: e.cost,
      participants: e.participants,
      category: e.category,
    })
  }

  // rebalance candidate: most expensive non-locked activity that has alternatives

  const candidate = [...trip.activities]

    .filter((a) => !a.locked && a.alternatives.length > 0)

    .sort(
      (x, y) => toDisplay(y.activityCost, dc) - toDisplay(x.activityCost, dc),
    )[0]

  const bestAlt = candidate?.alternatives

    .slice()

    .sort((a, b) => toDisplay(a.cost, dc) - toDisplay(b.cost, dc))[0]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <SectionTitle
          sub={
            trip.budgetMode === "shared"
              ? "One shared planning envelope. Unused personal budget never transfers automatically between travellers."
              : "Each traveller has an independent budget. Unused budget never transfers automatically."
          }
        >
          Budget
        </SectionTitle>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setEditBudget(true)}
        >
          <Icon.edit size={14} /> Adjust budgets
        </Button>
      </div>

      {changed && (
        <div className="p-4 rounded-xl bg-brand/10 border border-brand/30 flex items-start gap-2.5 anim-in">
          <Icon.info size={16} className="text-brand-hi mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="text-[14px] font-medium">Budget changed</div>
            <p className="text-[13px] text-muted mt-0.5 leading-relaxed">
              The itinerary hasn't been changed. You can ask Wanderly to suggest
              adjustments that fit the new budget — nothing is applied without
              your confirmation.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRebalance(true)}
                disabled={!candidate}
              >
                <Icon.sparkle size={14} /> Find lower-cost options
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChanged(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <Card className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Stat
            label="Trip total"
            value={fmt(spent, dc)}
            sub={`of ${fmt(trip.groupBudget, dc)} ${
              trip.budgetMode === "shared" ? "group budget" : "combined"
            }`}
          />
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
        <div className="grid grid-cols-2 @min-[640px]/phone:grid-cols-3 gap-4 mt-5 pt-4 border-t border-line-soft">
          <Stat
            label="Shared expenses"
            value={fmt(Math.round(totals.shared), dc)}
          />
          <Stat
            label="Personal expenses"
            value={fmt(Math.round(totals.personal), dc)}
          />
          <Stat
            label="Remaining"
            value={fmt(remaining, dc)}
            tone={
              status === "bad" ? "bad" : status === "warn" ? "warn" : "good"
            }
          />
        </div>
      </Card>

      {/* Per traveller */}
      <Card className="p-5">
        <h2 className="text-[15px] font-medium mb-1">
          Estimated spending per traveller
        </h2>
        <p className="text-[12px] text-faint mb-4">
          {trip.budgetMode === "individual"
            ? "Each traveller's estimate against their own budget."
            : "Each traveller's share of the shared group budget. There are no separate individual budgets in this mode."}
        </p>
        <div className="grid @min-[640px]/phone:grid-cols-2 gap-x-6 gap-y-4">
          {trip.travellers.map((t) => {
            const sp = Math.round(totals.byTraveller[t.id] || 0)

            const individual = trip.budgetMode === "individual"

            const rem = t.budget - sp

            const st = budgetStatus(
              sp,
              individual ? t.budget : trip.groupBudget,
            )

            return (
              <div key={t.id}>
                <div className="flex items-center justify-between text-[13px] mb-1.5">
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: t.color }}
                    />
                    {t.name}
                  </span>
                  <span className="tnum text-muted">
                    Est. {fmt(sp, dc)}
                    {individual && (
                      <span className="text-faint"> / {fmt(t.budget, dc)}</span>
                    )}
                  </span>
                </div>
                <Meter
                  value={sp}
                  max={individual ? t.budget : trip.groupBudget}
                  tone={st}
                />
                {individual && (
                  <div className="text-[12px] mt-1 tnum">
                    <span className={rem >= 0 ? "text-good" : "text-bad"}>
                      {rem >= 0
                        ? `${fmt(rem, dc)} remaining`
                        : `${fmt(-rem, dc)} over`}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Expense breakdown */}
      <Card className="p-5">
        <h2 className="text-[15px] font-medium mb-4">Expense breakdown</h2>
        <div className="divide-y divide-line-soft">
          {lines.map((l) => {
            const perPerson = l.participants.length
              ? toDisplay(l.money, dc) / l.participants.length
              : 0

            return (
              <div key={l.id} className="expense-row py-4 space-y-3">
                <div className="min-w-0">
                  <div className="text-[14px] font-medium leading-relaxed break-words">
                    {l.label}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge tone={l.category === "shared" ? "neutral" : "brand"}>
                      {l.category}
                    </Badge>
                    <span className="text-[12px] text-muted">{l.sub}</span>
                  </div>
                </div>
                <div className="expense-amount text-right flex flex-wrap items-end justify-between gap-2">
                  <div className="text-[12px] text-muted tnum">
                    {fmt(perPerson, dc)} / person
                  </div>
                  <MoneyText
                    money={l.money}
                    display={dc}
                    className="text-[14px] font-medium"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <AvatarStack trip={trip} ids={l.participants} size={20} />
                  {trip.manualExpenses.some((e) => e.id === l.id) && (
                    <button
                      onClick={() => removeManualExpense(l.id)}
                      aria-label={`Remove expense: ${l.label}`}
                      className="text-muted hover:text-bad hover:bg-bad-soft min-w-11 min-h-11 rounded-lg grid place-items-center shrink-0"
                    >
                      <Icon.trash size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {editBudget && (
        <BudgetEditModal
          onClose={() => setEditBudget(false)}
          onSaved={() => {
            setEditBudget(false)

            setChanged(true)
          }}
        />
      )}

      <Modal
        open={rebalance}
        onClose={() => setRebalance(false)}
        title="Budget suggestion"
      >
        {candidate && bestAlt ? (
          <div>
            <p className="text-[13px] text-muted leading-relaxed">
              To reduce spending, Wanderly suggests swapping the most expensive
              flexible activity. Must-do and locked activities are preserved.
              Review before applying.
            </p>
            <div className="mt-4 p-3.5 rounded-lg bg-surface-2 border border-line-soft">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-muted line-through">
                  {candidate.name}
                </span>
                <MoneyText
                  money={candidate.activityCost}
                  display={dc}
                  className="text-muted line-through text-[13px]"
                />
              </div>
              <div className="flex items-center gap-2 my-2 text-faint">
                <Icon.arrowDown size={14} />
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium">{bestAlt.name}</span>
                <MoneyText
                  money={bestAlt.cost}
                  display={dc}
                  className="font-medium text-[13px]"
                />
              </div>
              <p className="text-[12px] text-muted mt-2 leading-relaxed">
                {bestAlt.reason}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setRebalance(false)}>
                Keep original
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  applyAlternative(candidate.id, bestAlt)

                  setRebalance(false)

                  setChanged(false)
                }}
              >
                Apply change
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-muted">
            No flexible activities with alternatives are available to rebalance
            right now.
          </p>
        )}
      </Modal>
    </div>
  )

  function BudgetEditModal({
    onClose,
    onSaved,
  }: {
    onClose: () => void
    onSaved: () => void
  }) {
    const [mode, setMode] = useState(trip!.budgetMode)

    const [group, setGroup] = useState(trip!.groupBudget)

    const [budgets, setBudgets] = useState<Record<string, number>>(
      Object.fromEntries(trip!.travellers.map((t) => [t.id, t.budget])),
    )

    return (
      <Modal
        open
        onClose={onClose}
        title="Adjust budgets"
        wide
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                update((d) => {
                  d.budgetMode = mode

                  d.groupBudget = group

                  d.travellers.forEach(
                    (t) => (t.budget = budgets[t.id] ?? t.budget),
                  )
                })

                onSaved()
              }}
            >
              Save budgets
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Budget mode">
            <div className="flex gap-2">
              {(["shared", "individual"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`h-9 px-4 rounded-lg text-[13px] border transition-colors ${
                    mode === m
                      ? "bg-brand/12 text-brand-hi border-brand/40"
                      : "bg-surface-2 text-muted border-line"
                  }`}
                >
                  {m === "shared"
                    ? "Shared group budget"
                    : "Individual budgets"}
                </button>
              ))}
            </div>
          </Field>
          {mode === "shared" ? (
            <Field
              label={`Group budget (${dc})`}
              hint="Spending draws from this shared envelope — no per-person budgets are used in this mode."
            >
              <Input
                type="number"
                value={group}
                onChange={(e) => setGroup(Number(e.target.value) || 0)}
              />
            </Field>
          ) : (
            <div>
              <span className="block text-[13px] font-medium text-ink mb-2">
                Individual budgets
              </span>
              <div className="space-y-2">
                {trip!.travellers.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: t.color }}
                    />
                    <span className="text-[14px] flex-1">{t.name}</span>
                    <div className="relative w-40">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-faint">
                        {dc}
                      </span>
                      <Input
                        type="number"
                        className="pl-12"
                        value={budgets[t.id]}
                        onChange={(e) =>
                          setBudgets({
                            ...budgets,
                            [t.id]: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-faint mt-2 leading-relaxed">
                Changing one traveller's budget never automatically changes
                another's. Discover helps you compare alternative costs.
              </p>
            </div>
          )}
        </div>
      </Modal>
    )
  }
}
