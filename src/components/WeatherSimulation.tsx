import { Button } from "./ui"
import { useTrip } from "../state"
import { demoForecast, weatherRisks } from "../lib/adaptive"

export default function WeatherSimulation({ onDone }: { onDone: () => void }) {
  const { trip, update, setTab } = useTrip()
  if (!trip) return null
  const simulate = (days: number, heavy = false) => {
    update((d) => {
      // Keep the same event when advancing the horizon so the review is comparable.
      const forecast = d.weatherDisruption && !d.weatherDisruption.cleared
        ? d.weatherDisruption : demoForecast(d, "multiple")
      d.weatherDisruption = { ...forecast, horizonDays: days, severity: heavy ? "heavy-rain" : "rain" }
      delete d.adaptiveResult
    })
    setTab("itinerary")
    onDone()
  }
  return <div className="space-y-3">
    <p className="text-sm text-muted">Trigger a sample rain event, then review the affected activities. Your itinerary changes only after you approve suggestions.</p>
    <div className="grid grid-cols-2 gap-2">
      <Button onClick={() => simulate(1)}>Rain · tomorrow</Button>
      <Button onClick={() => simulate(4)}>Rain · in 4 days</Button>
      <Button onClick={() => simulate(8)}>Rain · in 8 days</Button>
      <Button onClick={() => simulate(14)}>Rain · in 14 days</Button>
    </div>
    <Button className="w-full" onClick={() => simulate(trip.weatherDisruption?.horizonDays ?? 1, true)}>Rain becomes heavier</Button>
    <Button className="w-full" disabled={!trip.weatherDisruption} onClick={() => {
      update(d => { if (d.weatherDisruption) d.weatherDisruption.cleared = true; delete d.weatherReminder })
      setTab("itinerary"); onDone()
    }}>Clear forecast</Button>
    <Button variant="ghost" className="w-full" onClick={() => {
      update(d => { delete d.weatherDisruption; delete d.weatherReminder; delete d.adaptiveResult })
      setTab("itinerary"); onDone()
    }}>Normal weather</Button>
    <p className="text-xs text-muted">Simulated forecast · timing labels are illustrative, not AI confidence scores. Currently {weatherRisks(trip).length} activities overlap the rain window. Clearing weather does not undo approved changes.</p>
  </div>
}
