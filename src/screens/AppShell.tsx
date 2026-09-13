import { useState } from "react"
import { Icon } from "../components/icons"
import { Select } from "../components/ui"
import { CURRENCIES } from "../lib/currency"
import { useTrip, type Tab } from "../state"
import type { CurrencyCode } from "../types"
import Overview from "./Overview"
import Group from "./Group"
import Itinerary from "./Itinerary"
import Budget from "./Budget"
import Stay from "./Stay"
import Transport from "./Transport"
import PrototypeInfo from "../components/PrototypeInfo"

const NAV: { 
  id: Tab
  label: string
  icon: keyof typeof Icon
 }[] = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "group", label: "Group", icon: "group" },
  { id: "itinerary", label: "Itinerary", icon: "itinerary" },
  { id: "budget", label: "Budget", icon: "budget" },
  { id: "stay", label: "Stay", icon: "stay" },
  { id: "transport", label: "Transport", icon: "transport" },
]

export default function AppShell() {
  const { trip, tab, setTab, setDisplayCurrency, setScreen } = useTrip()
  const [infoOpen, setInfoOpen] = useState(false)
  if (!trip) return null

  const route = trip.destinations.map((d) => d.city).join(" → ")

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line-soft bg-bg/90 backdrop-blur px-4 pt-3 pb-2.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setScreen("welcome")}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="w-8 h-8 rounded-xl bg-brand grid place-items-center text-brand-fg">
              <Icon.pin size={16} />
            </span>
            <span className="font-display font-semibold text-[16px] tracking-tight">
              Wanderly
            </span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Select
              aria-label="Display currency"
              value={trip.displayCurrency}
              onChange={(e) =>
                setDisplayCurrency(e.target.value as CurrencyCode)
              }
              className="h-9 w-[68px] text-[13px]"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
            <button
              onClick={() => setInfoOpen(true)}
              className="w-9 h-9 grid place-items-center rounded-xl bg-accent text-accent-fg shrink-0 active:brightness-95"
              title="About & demo controls"
              aria-label="About & demo controls"
            >
              <Icon.info size={17} />
            </button>
          </div>
        </div>
        <div className="mt-2.5 min-w-0">
          <h1 className="text-[17px] font-display font-semibold truncate">
            {trip.name}
          </h1>
          <div className="text-[12px] text-muted truncate">
            {route} · {trip.days} days · {trip.travellers.length} travellers
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-5 pb-24" key={tab}>
        {tab === "overview" && <Overview />}
        {tab === "group" && <Group />}
        {tab === "itinerary" && <Itinerary />}
        {tab === "budget" && <Budget />}
        {tab === "stay" && <Stay />}
        {tab === "transport" && <Transport />}
      </main>

      {/* Bottom nav */}
      <nav
        aria-label="Trip navigation"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 border-t border-line-soft bg-surface/95 backdrop-blur grid grid-cols-6"
      >
        {NAV.map((n) => {
          const I = Icon[n.icon]
          const on = tab === n.id
          return (
            <button
              key={n.id}
              aria-current={on ? "page" : undefined}
              onClick={() => setTab(n.id)}
              className={`flex flex-col items-center justify-center gap-1 h-16 text-[10px] transition-colors ${
                on ? "text-accent" : "text-faint"
              }`}
            >
              <I size={20} />
              {n.label}
            </button>
          )
        })}
      </nav>

      {infoOpen && <PrototypeInfo onClose={() => setInfoOpen(false)} />}
    </div>
  )
}
