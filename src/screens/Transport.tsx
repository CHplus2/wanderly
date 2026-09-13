import { Card, Badge, SectionTitle } from "../components/ui";
import { Icon } from "../components/icons";
import { AvatarStack } from "../components/travellers";
import { MoneyText } from "../components/bits";
import { useTrip } from "../state";
import type { TransportType } from "../types";

function dur(min: number) {
  return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60 ? `${min % 60}m` : ""}`.trim() : `${min}m`;
}

const LOCAL: { type: TransportType; note: string }[] = [
  { type: "Metro", note: "Primary way to move within each city" },
  { type: "Bus", note: "Covers routes the metro doesn't reach" },
  { type: "Taxi", note: "For late nights or luggage transfers" },
  { type: "Walking", note: "Short hops between nearby stops" },
];

export default function Transport() {
  const { trip } = useTrip();
  if (!trip) return null;
  const dc = trip.displayCurrency;

  return (
    <div className="space-y-6">
      <SectionTitle sub="Transport between cities and within them. Schedules include reasonable transfer and buffer time, and all costs feed into the budget.">
        Transport
      </SectionTitle>

      <div>
        <h2 className="text-[13px] font-medium text-muted uppercase tracking-wide mb-3">Between cities</h2>
        <div className="space-y-3">
          {trip.legs.length === 0 && (
            <Card className="p-5 text-[13px] text-muted">This is a single-destination trip — no inter-city transport needed.</Card>
          )}
          {trip.legs.map((leg) => (
            <Card key={leg.id} className="p-5">
              <div className="grid grid-cols-[36px_minmax(0,1fr)] items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-surface-2 border border-line-soft grid place-items-center text-brand-hi shrink-0">
                  <Icon.transport size={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 break-words">
                    <span className="text-[15px] font-medium">{leg.from}</span>
                    <Icon.chevron size={14} className="text-faint" />
                    <span className="text-[15px] font-medium">{leg.to}</span>
                    <Badge tone="brand">{leg.type}</Badge>
                  </div>
                  <div className="text-[13px] text-muted mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 tnum">
                      <Icon.clock size={13} /> {leg.departure} → {leg.arrival}
                    </span>
                    <span className="tnum">{dur(leg.durationMin)}</span>
                    <span>Day {leg.dayIndex + 1}</span>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <MoneyText money={leg.cost} display={dc} className="text-[15px] font-medium" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-line-soft">
                <AvatarStack trip={trip} ids={leg.participants} size={20} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[13px] font-medium text-muted uppercase tracking-wide mb-3">Getting around locally</h2>
        <div className="grid @min-[640px]/phone:grid-cols-2 gap-3">
          {LOCAL.map((l) => (
            <Card key={l.type} className="p-4 flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-surface-2 grid place-items-center text-muted shrink-0">
                {l.type === "Walking" ? <Icon.walk size={16} /> : <Icon.transport size={16} />}
              </span>
              <div>
                <div className="text-[14px] font-medium">{l.type}</div>
                <div className="text-[12px] text-muted mt-0.5 leading-relaxed">{l.note}</div>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-[12px] text-faint mt-3">
          Local transport costs are captured per activity in the itinerary and included in each traveller's estimate.
        </p>
      </div>
    </div>
  );
}
