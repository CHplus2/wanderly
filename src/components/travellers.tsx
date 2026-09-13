import type { Trip, Traveller } from "../types";

export function participantLabel(trip: Trip, ids: string[]): string {
  const active = trip.travellers.filter((t) => ids.includes(t.id));
  if (active.length === 0) return "No one";
  if (active.length === trip.travellers.length) return "Everyone";
  return active.map((t) => t.name).join(" + ");
}

export function Avatar({ t, size = 24 }: { t: Traveller; size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-full font-semibold text-bg shrink-0"
      style={{
        width: size,
        height: size,
        background: t.color,
        fontSize: size * 0.42,
      }}
      title={t.name}
    >
      {t.name[0]}
    </span>
  );
}

export function AvatarStack({ trip, ids, size = 22 }: { trip: Trip; ids: string[]; size?: number }) {
  const active = trip.travellers.filter((t) => ids.includes(t.id));
  return (
    <div className="flex flex-wrap items-center gap-y-1.5 min-w-0">
      <div className="flex flex-wrap -space-x-1.5 shrink-0 max-w-full">
        {active.map((t) => (
          <span key={t.id} className="ring-2 ring-surface rounded-full">
            <Avatar t={t} size={size} />
          </span>
        ))}
      </div>
      <span className="ml-2 text-[12px] text-muted min-w-0 break-words">{participantLabel(trip, ids)}</span>
    </div>
  );
}

export function ParticipantSelector({
  trip,
  selected,
  onChange,
}: {
  trip: Trip;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };
  const allSelected = selected.length === trip.travellers.length;
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(allSelected ? [] : trip.travellers.map((t) => t.id))}
        className={`h-8 px-3 rounded-lg text-[13px] font-medium border transition-colors ${
          allSelected
            ? "bg-brand text-brand-fg border-transparent"
            : "bg-surface-2 text-muted border-line hover:text-ink"
        }`}
      >
        Everyone
      </button>
      {trip.travellers.map((t) => {
        const on = selected.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`h-8 pl-1.5 pr-3 rounded-lg text-[13px] font-medium border inline-flex items-center gap-1.5 transition-colors ${
              on
                ? "bg-surface-3 text-ink border-line"
                : "bg-surface-2 text-faint border-line-soft hover:text-muted"
            }`}
            style={on ? { borderColor: t.color + "66" } : undefined}
          >
            <span style={{ opacity: on ? 1 : 0.4 }}>
              <Avatar t={t} size={18} />
            </span>
            {on && (
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-good">
                <path d="M2.5 6.5l2.5 2.5 4.5-5.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {t.name}
          </button>
        );
      })}
    </div>
  );
}
