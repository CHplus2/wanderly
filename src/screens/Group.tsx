import { useState } from "react";
import { Card, Button, Badge, Modal, Field, Input, SectionTitle } from "../components/ui";
import { Icon } from "../components/icons";
import { Avatar } from "../components/travellers";
import { PrefEditor } from "../components/prefEditor";
import { useTrip } from "../state";
import { fmt } from "../lib/currency";
import { budgetStatus } from "../lib/compute";
import type { Traveller, Preferences } from "../types";
import { TRAVELLER_COLORS } from "../data";

const emptyPrefs = (): Preferences => ({
  budget: "Medium",
  interests: [],
  pace: "Balanced",
  walking: "Medium",
  intensity: "Medium",
  food: [],
  mustDo: [],
  avoid: [],
  preferredTimes: "Flexible",
  accessibility: "",
});

export default function Group() {
  const { trip, totals, updateTraveller, addTraveller, removeTraveller } = useTrip();
  const [editing, setEditing] = useState<Traveller | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Traveller | null>(null);
  if (!trip) return null;
  const dc = trip.displayCurrency;

  // group-level shared interests (appearing in 2+ travellers)
  const interestCounts: Record<string, number> = {};
  trip.travellers.forEach((t) => t.prefs.interests.forEach((i) => (interestCounts[i] = (interestCounts[i] || 0) + 1)));
  const groupInterests = Object.entries(interestCounts)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  const startAdd = () => {
    const i = trip.travellers.length;
    setEditing({
      id: "t" + Date.now(),
      name: "",
      color: TRAVELLER_COLORS[i % TRAVELLER_COLORS.length],
      budget: 1000,
      prefs: emptyPrefs(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle sub="Everyone's budgets and explicit preferences. Wanderly considers both individual and shared group preferences.">
          Group
        </SectionTitle>
        <Button variant="secondary" size="sm" onClick={startAdd} className="shrink-0">
          <Icon.plus size={15} /> Add traveller
        </Button>
      </div>

      {/* AI explanation */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand/12 grid place-items-center text-brand-hi shrink-0">
            <Icon.sparkle size={16} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-medium">Why this plan fits your group</h2>
            <p className="text-[13px] text-muted leading-relaxed mt-1 break-words">{trip.groupNote}</p>
            {groupInterests.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[12px] text-faint shrink-0">Shared interests:</span>
                {groupInterests.map((i) => (
                  <Badge key={i} tone="brand">
                    {i}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Traveller cards */}
      <div className="grid @min-[768px]/phone:grid-cols-2 gap-4">
        {trip.travellers.map((t) => {
          const sp = Math.round(totals.byTraveller[t.id] || 0);
          const st = budgetStatus(sp, t.budget);
          const remaining = t.budget - sp;
          return (
            <Card key={t.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className="shrink-0" style={{ boxShadow: `0 0 0 3px ${t.color}22`, borderRadius: 999 }}>
                  <Avatar t={t} size={40} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-[16px] truncate">{t.name}</div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditing(t)}
                        className="w-8 h-8 grid place-items-center rounded-lg text-faint hover:text-ink hover:bg-surface-2"
                        title="Edit traveller"
                      >
                        <Icon.edit size={15} />
                      </button>
                      {trip.travellers.length > 1 && (
                        <button
                          onClick={() => setConfirmRemove(t)}
                          className="w-8 h-8 grid place-items-center rounded-lg text-faint hover:text-bad hover:bg-surface-2"
                          title="Remove traveller"
                        >
                          <Icon.trash size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[13px] flex-wrap">
                    {trip.budgetMode === "individual" ? (
                      <>
                        <span className="text-muted tnum">
                          {fmt(sp, dc)} / {fmt(t.budget, dc)}
                        </span>
                        <Badge tone={st === "good" ? "good" : st === "warn" ? "warn" : "bad"}>
                          {remaining >= 0 ? `${fmt(remaining, dc)} left` : `${fmt(-remaining, dc)} over`}
                        </Badge>
                      </>
                    ) : (
                      <span className="text-muted tnum">Estimated {fmt(sp, dc)}</span>
                    )}
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4 text-[13px] min-w-0">
                <Row label="Budget" value={t.prefs.budget} />
                <Row label="Pace" value={t.prefs.pace} />
                <Row label="Walking" value={t.prefs.walking} />
                <Row label="Intensity" value={t.prefs.intensity} />
              </dl>

              <TagRow label="Interests" items={t.prefs.interests} />
              <TagRow label="Food" items={t.prefs.food} />
              <TagRow label="Must-do" items={t.prefs.mustDo} tone="good" />
              <TagRow label="Avoid" items={t.prefs.avoid} tone="bad" />
              {t.prefs.accessibility && (
                <div className="mt-3 pt-3 border-t border-line-soft text-[12px] text-muted flex items-start gap-1.5">
                  <Icon.info size={13} className="mt-0.5 shrink-0 text-faint" />
                  <span className="min-w-0 break-words">{t.prefs.accessibility}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {editing && (
        <TravellerEditModal
          key={editing.id}
          traveller={editing}
          isNew={!trip.travellers.some((t) => t.id === editing.id)}
          currency={dc}
          budgetMode={trip.budgetMode}
          onClose={() => setEditing(null)}
          onSave={(t) => {
            if (trip.travellers.some((x) => x.id === t.id)) updateTraveller(t.id, t);
            else addTraveller(t);
            setEditing(null);
          }}
        />
      )}

      <Modal open={!!confirmRemove} onClose={() => setConfirmRemove(null)} title="Remove traveller">
        <p className="text-[14px] text-muted leading-relaxed break-words">
          Remove <span className="text-ink font-medium">{confirmRemove?.name}</span> from the trip? They'll be
          taken off all activities and their cost shares reallocated to remaining participants.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => setConfirmRemove(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirmRemove) removeTraveller(confirmRemove.id);
              setConfirmRemove(null);
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-faint uppercase tracking-wide whitespace-nowrap">{label}</dt>
      <dd className="text-ink mt-0.5 break-words">{value}</dd>
    </div>
  );
}

function TagRow({ label, items, tone = "neutral" }: { label: string; items: string[]; tone?: "neutral" | "good" | "bad" }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 min-w-0">
      <div className="text-[11px] text-faint uppercase tracking-wide mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Badge key={i} tone={tone}>
            {i}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function TravellerEditModal({
  traveller,
  isNew,
  currency,
  budgetMode,
  onClose,
  onSave,
}: {
  traveller: Traveller;
  isNew: boolean;
  currency: string;
  budgetMode: "shared" | "individual";
  onClose: () => void;
  onSave: (t: Traveller) => void;
}) {
  const [draft, setDraft] = useState<Traveller>(() => structuredClone(traveller));
  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Add traveller" : `Edit ${traveller.name}`}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!draft.name.trim()} onClick={() => onSave(draft)}>
            {isNew ? "Add traveller" : "Save changes"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid @min-[640px]/phone:grid-cols-2 gap-4">
          <Field label="Name">
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Traveller name" />
          </Field>
          {budgetMode === "individual" && (
            <Field label={`Budget (${currency})`}>
              <Input
                type="number"
                value={draft.budget}
                onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) || 0 })}
              />
            </Field>
          )}
        </div>
        <div>
          <span className="block text-[13px] font-medium text-ink mb-1.5">Colour</span>
          <div className="flex flex-wrap gap-2">
            {TRAVELLER_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setDraft({ ...draft, color: c })}
                className={`w-7 h-7 rounded-full transition-transform shrink-0 ${draft.color === c ? "scale-110 ring-2 ring-offset-2 ring-offset-surface ring-ink" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-line-soft">
          <PrefEditor prefs={draft.prefs} onChange={(p) => setDraft({ ...draft, prefs: p })} />
        </div>
      </div>
    </Modal>
  );
}
