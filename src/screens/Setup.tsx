import { useEffect, useState } from "react";
import { Button, Card, Field, Input, Select, Badge } from "../components/ui";
import { Icon } from "../components/icons";
import { CURRENCIES } from "../lib/currency";
import { TRAVELLER_COLORS } from "../data";
import { generateTrip, currencyForCountry, type SetupConfig } from "../lib/generate";
import { useTrip } from "../state";
import type { CurrencyCode, Preferences } from "../types";
import { PrefEditor } from "../components/prefEditor";

const defaultPrefs = (): Preferences => ({
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

const STEPS = ["Trip", "Destinations", "Travellers", "Preferences"];

export default function Setup() {
  const { startTrip, setScreen } = useTrip();
  const [step, setStep] = useState(0);
  useEffect(() => {
    document.querySelector(".phone-scroll")?.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const [name, setName] = useState("");
  const [days, setDays] = useState(5);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("MYR");
  const [budgetMode, setBudgetMode] = useState<"shared" | "individual">("shared");
  const [groupBudget, setGroupBudget] = useState(5000);

  const [dests, setDests] = useState([
    { city: "", country: "" },
    { city: "", country: "" },
  ]);
  const [travellers, setTravellers] = useState([
    { name: "", budget: 1000, prefs: defaultPrefs() },
    { name: "", budget: 1000, prefs: defaultPrefs() },
  ]);
  const [prefTab, setPrefTab] = useState(0);

  const canNext =
    step === 0
      ? name.trim().length > 0 && days >= 1 && days <= 14
      : step === 1
      ? dests.some((d) => d.city.trim()) && dests.filter(d => d.city.trim()).length <= days
      : step === 2
      ? travellers.some((t) => t.name.trim())
      : true;

  const finish = () => {
    const cfg: SetupConfig = {
      name,
      days,
      startDate,
      displayCurrency,
      budgetMode,
      groupBudget,
      travellers: travellers.filter((t) => t.name.trim()),
      destinations: dests.filter((d) => d.city.trim()),
    };
    startTrip(generateTrip(cfg));
  };

  return (
    <div className="min-h-screen">
      <header className="h-16 border-b border-line-soft px-6 flex items-center justify-between sticky top-0 bg-bg/90 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand grid place-items-center text-brand-fg">
            <Icon.pin size={16} />
          </span>
          <span className="font-display font-semibold text-[15px]">New trip</span>
        </div>
        <button onClick={() => setScreen("welcome")} className="text-[13px] text-faint hover:text-ink transition-colors">
          Cancel
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <ol className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 ${i <= step ? "" : "pointer-events-none"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full grid place-items-center text-[12px] font-semibold ${
                    i < step
                      ? "bg-brand text-brand-fg"
                      : i === step
                      ? "bg-brand/15 text-brand-hi border border-brand/40"
                      : "bg-surface-2 text-faint border border-line"
                  }`}
                >
                  {i < step ? <Icon.check size={13} /> : i + 1}
                </span>
                <span className={`text-[12px] hidden min-[380px]:block ${i === step ? "text-ink font-medium" : "text-faint"}`}>{i === step ? s : ""}</span>
              </button>
              {i < STEPS.length - 1 && <span className="flex-1 h-px bg-line-soft" />}
            </li>
          ))}
        </ol>

        <Card className="p-6 anim-in">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-[19px]">Trip basics</h2>
              <Field label="Trip name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Japan Adventure" />
              </Field>
              <div className="grid @min-[640px]/phone:grid-cols-2 gap-4">
                <Field label="Number of days" hint="Supports 1–14 days">
                  <Input
                    type="number"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Math.min(14, Number(e.target.value) || 1)))}
                  />
                </Field>
                <Field label="Start date">
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Field>
              </div>
              <Field label="Preferred display currency" hint="All money is shown in this currency, with local currency kept alongside.">
                <Select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Budget mode">
                <div className="grid @min-[640px]/phone:grid-cols-2 gap-3">
                  <ModeCard
                    active={budgetMode === "shared"}
                    onClick={() => setBudgetMode("shared")}
                    title="Shared group budget"
                    desc="One planning envelope for the whole group."
                  />
                  <ModeCard
                    active={budgetMode === "individual"}
                    onClick={() => setBudgetMode("individual")}
                    title="Individual budgets"
                    desc="Each traveller has their own independent budget."
                  />
                </div>
              </Field>
              {budgetMode === "shared" && (
                <Field label={`Group budget (${displayCurrency})`}>
                  <Input
                    type="number"
                    value={groupBudget}
                    onChange={(e) => setGroupBudget(Number(e.target.value) || 0)}
                  />
                </Field>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-[20px] font-semibold leading-tight">Destinations</h2>
                <p className="text-[14px] leading-relaxed text-muted">Add the places you’ll visit, in order. Each stop can be in a different country.</p>
              </div>
              <p className="text-xs text-muted">Transfer times and costs are editable estimates. Allow at least one day per destination.</p>
              <div className="space-y-3">
                {dests.map((d, i) => {
                  const cur = d.country.trim() ? currencyForCountry(d.country, displayCurrency) : null;
                  return (
                    <div key={i} className="rounded-xl border border-line bg-surface p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[13px] font-medium">
                          <Icon.pin size={16} className="text-muted shrink-0" />
                          <span>Destination {i + 1}</span>
                        </div>
                        {dests.length > 1 && (
                          <button
                            aria-label={`Remove destination ${i + 1}`}
                            onClick={() => setDests(dests.filter((_, j) => j !== i))}
                            className="w-11 h-11 grid place-items-center text-muted hover:text-bad rounded-lg hover:bg-surface-2 shrink-0"
                          >
                            <Icon.trash size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 min-w-0">
                        <Field label="City">
                          <Input
                            aria-label={`Destination ${i + 1} city`}
                            placeholder="e.g. Tokyo"
                            value={d.city}
                            onChange={(e) => setDests(dests.map((x, j) => (j === i ? { ...x, city: e.target.value } : x)))}
                          />
                        </Field>
                        <Field label="Country">
                          <Input
                            aria-label={`Destination ${i + 1} country`}
                            placeholder="e.g. Japan"
                            value={d.country}
                            onChange={(e) => setDests(dests.map((x, j) => (j === i ? { ...x, country: e.target.value } : x)))}
                          />
                        </Field>
                      </div>
                      {cur && <p className="text-xs text-muted">Planning currency: <span className="font-medium">{cur}</span></p>}
                    </div>
                  );
                })}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDests([...dests, { city: "", country: "" }])}>
                <Icon.plus size={14} /> Add destination
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-[19px]">Travellers</h2>
              <p className="text-[14px] leading-relaxed text-muted">Add each traveller.{budgetMode === "individual" ? " Set an independent budget for each — unused budget never transfers between travellers." : " Spending draws from the shared group budget, so no individual budgets are needed."}</p>
              <div className="space-y-3">
                {travellers.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full grid place-items-center text-[13px] font-semibold text-bg shrink-0"
                      style={{ background: TRAVELLER_COLORS[i % TRAVELLER_COLORS.length] }}
                    >
                      {(t.name.trim()[0] || (i + 1)).toString().toUpperCase()}
                    </span>
                    <Input
                      placeholder={`Traveller ${i + 1} name`}
                      value={t.name}
                      onChange={(e) => setTravellers(travellers.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                      className="flex-1"
                    />
                    {budgetMode === "individual" && (
                      <div className="relative w-36">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-faint">{displayCurrency}</span>
                        <Input
                          type="number"
                          value={t.budget}
                          onChange={(e) => setTravellers(travellers.map((x, j) => (j === i ? { ...x, budget: Number(e.target.value) || 0 } : x)))}
                          className="pl-12"
                        />
                      </div>
                    )}
                    {travellers.length > 1 && (
                      <button
                        onClick={() => setTravellers(travellers.filter((_, j) => j !== i))}
                        className="w-9 h-9 grid place-items-center text-faint hover:text-bad rounded-lg hover:bg-surface-2 shrink-0"
                      >
                        <Icon.trash size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTravellers([...travellers, { name: "", budget: 1000, prefs: defaultPrefs() }])}
              >
                <Icon.plus size={14} /> Add traveller
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-[19px]">Preferences</h2>
              <p className="text-[14px] leading-relaxed text-muted">Preferences are provided explicitly by each traveller. You can refine these anytime from the Group section.</p>
              <div className="flex flex-wrap gap-2">
                {travellers.filter((t) => t.name.trim()).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setPrefTab(i)}
                    className={`h-8 px-3 rounded-lg text-[13px] inline-flex items-center gap-1.5 border transition-colors ${
                      prefTab === i ? "bg-surface-3 text-ink border-line" : "bg-surface-2 text-muted border-line-soft hover:text-ink"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full text-bg grid place-items-center text-[10px] font-bold"
                      style={{ background: TRAVELLER_COLORS[i % TRAVELLER_COLORS.length] }}
                    >
                      {t.name.trim()[0]?.toUpperCase()}
                    </span>
                    {t.name}
                  </button>
                ))}
              </div>
              <PrefEditor
                prefs={travellers.filter((t) => t.name.trim())[prefTab]?.prefs ?? defaultPrefs()}
                onChange={(p) => {
                  const named = travellers.filter((t) => t.name.trim());
                  const target = named[prefTab];
                  setTravellers(travellers.map((t) => (t === target ? { ...t, prefs: p } : t)));
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-line-soft">
            <Button variant="ghost" onClick={() => (step === 0 ? setScreen("welcome") : setStep(step - 1))}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button variant="primary" onClick={finish}>
                <Icon.sparkle size={15} /> Generate trip
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ModeCard({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-colors ${
        active ? "bg-brand/10 border-brand/50" : "bg-surface-2 border-line hover:border-line"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full border-2 grid place-items-center ${active ? "border-brand" : "border-line"}`}
        >
          {active && <span className="w-2 h-2 rounded-full bg-brand" />}
        </span>
        <span className="text-[14px] font-medium">{title}</span>
      </div>
      <p className="text-[12px] text-muted mt-1.5 leading-relaxed">{desc}</p>
    </button>
  );
}
