import { Button } from "../components/ui"
import { Icon } from "../components/icons"
import { useTrip } from "../state"

export default function Welcome() {
  const { loadDemo, setScreen } = useTrip()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 px-5 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-brand grid place-items-center text-brand-fg">
            <Icon.pin size={16} />
          </span>
          <span className="font-display font-semibold text-[16px] tracking-tight">
            Wanderly
          </span>
        </div>

      </header>

      <main className="flex-1 flex flex-col gap-8 w-full px-5 pt-6 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] text-accent bg-accent-soft border border-accent/20 rounded-full pl-2 pr-3 py-1 mb-5">
            <Icon.sparkle size={13} /> Preference-led · traveller-controlled
          </div>
          <h1 className="text-[38px] leading-[1.05] font-display font-semibold tracking-tight">
            Plan better.
            <br />
            Travel <span className="text-accent">together.</span>
          </h1>
          <p className="text-[15px] text-muted leading-relaxed mt-4">
            Build a trip around everyone's preferences, budget, and priorities —
            with suggestions helping along the way. Different travellers can
            follow different plans while the whole trip stays coherent.
          </p>
          <div className="flex gap-3 mt-6">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setScreen("setup")}
            >
              Start planning
            </Button>

          </div>
          <div className="flex flex-col gap-2 mt-6 text-[13px] text-faint">
            {[
              "Parallel per-traveller itineraries",
              "Shared & individual budgets",
              "Multi-city, multi-currency",
            ].map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5">
                <Icon.check size={14} className="text-good" /> {f}
              </span>
            ))}
          </div>
        </div>

        <section className="space-y-3" aria-label="Example trips">
          <h2 className="text-lg font-medium">Explore an example trip</h2>
          <p className="text-sm text-muted">See how preferences, budgeting and weather adjustments work with sample data.</p>
          <DemoPreview malaysia onOpen={() => loadDemo("malaysia")} />
          <DemoPreview onOpen={() => loadDemo("japan")} />
        </section>
      </main>

      <footer className="px-5 py-5 flex items-center justify-center text-center text-[12px] text-faint">
        A collaborative, preference-aware travel planning prototype.
      </footer>
    </div>
  )
}

function DemoPreview({ onOpen, malaysia = false }: { onOpen: () => void; malaysia?: boolean }) {
  return (
    <button
      onClick={onOpen}
      className="group text-left bg-surface border border-line rounded-2xl p-5 hover:border-brand/40 transition-colors w-full"
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-wide text-faint">
          Example trip
        </span>
        <span className="text-[12px] text-brand-hi ">
          Open example →
        </span>
      </div>
      <div className="text-[22px] font-display font-semibold mt-2">
        {malaysia ? "Malaysia City Escape" : "Japan Adventure"}
      </div>
      <div className="flex items-center gap-2 text-[14px] text-muted mt-3">
        {(malaysia ? ["Kuala Lumpur", "George Town"] : ["Tokyo", "Kyoto", "Osaka"]).map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <Icon.chevron size={13} className="text-faint" />}
            {c}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          [malaysia ? "3 days" : "5 days", malaysia ? "Malaysia" : "Japan"],
          ["4 travellers", "1 group"],
          [malaysia ? "RM2,500" : "RM5,000", "shared budget"],
        ].map(([a, b]) => (
          <div
            key={a}
            className="bg-surface-2 border border-line-soft rounded-lg p-3"
          >
            <div className="text-[15px] font-medium tnum">{a}</div>
            <div className="text-[12px] text-faint mt-0.5">{b}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex -space-x-1.5">
        {["#f472b6", "#22d3ee", "#c084fc", "#fb923c"].map((c, i) => (
          <span
            key={c}
            className="w-7 h-7 rounded-full ring-2 ring-surface grid place-items-center text-[12px] font-semibold text-bg"
            style={{ background: c }}
          >
            {(malaysia ? ["A", "D", "M", "A"] : ["A", "B", "C", "D"])[i]}
          </span>
        ))}
      </div>
    </button>
  )
}
