import { Card, Badge, SectionTitle } from "../components/ui";
import { Icon } from "../components/icons";
import { AvatarStack } from "../components/travellers";
import { MoneyText } from "../components/bits";
import { useTrip } from "../state";
import { fmt, toDisplay } from "../lib/currency";

export default function Stay() {
  const { trip } = useTrip();
  if (!trip) return null;
  const dc = trip.displayCurrency;

  return (
    <div className="space-y-6">
      <SectionTitle sub="Accommodation for each destination. All costs feed into the trip budget.">
        Stay
      </SectionTitle>

      <div className="space-y-4">
        {trip.accommodations.map((acc) => {
          const dest = trip.destinations.find((d) => d.id === acc.destinationId);
          const total = { amount: acc.costPerNight.amount * acc.nights, currency: acc.costPerNight.currency };
          const perPerson = acc.participants.length ? toDisplay(total, dc) / acc.participants.length : 0;
          return (
            <Card key={acc.id} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 text-[12px] text-brand-hi mb-1">
                    <Icon.pin size={13} /> {dest?.city}, {dest?.country}
                  </div>
                  <h2 className="text-[17px] font-medium">{acc.name}</h2>
                  <div className="text-[13px] text-muted mt-0.5">{acc.location}</div>
                </div>
                <div className="text-right">
                  <MoneyText money={total} display={dc} className="text-[18px] font-display font-semibold" />
                  <div className="text-[12px] text-faint tnum mt-0.5">{fmt(perPerson, dc)} / person</div>
                </div>
              </div>

              <div className="grid grid-cols-2 @min-[640px]/phone:grid-cols-4 gap-4 mt-4 pt-4 border-t border-line-soft text-[13px]">
                <Detail label="Check-in" value={acc.checkIn} />
                <Detail label="Check-out" value={acc.checkOut} />
                <Detail label="Nights" value={String(acc.nights)} />
                <Detail label="Room" value={acc.room} />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line-soft flex-wrap gap-2">
                <AvatarStack trip={trip} ids={acc.participants} />
                <Badge tone="neutral">
                  <MoneyText money={acc.costPerNight} display={dc} /> / night
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-faint uppercase tracking-wide">{label}</div>
      <div className="text-ink mt-0.5">{value}</div>
    </div>
  );
}
