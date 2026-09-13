import { Modal } from "./ui"
import { useTrip } from "../state"
import WeatherSimulation from "./WeatherSimulation"

export default function PrototypeInfo({ onClose }: { onClose: () => void }) {
  const { trip } = useTrip()
  if (!trip) return null
  return (
    <Modal open onClose={onClose} title="About this prototype">
      <div className="space-y-4 text-sm">
        <p>
          Explore an example trip. Your edits and saved alternatives stay in
          this browser.
        </p>
        <p className="text-muted">
          Recommendations use a sample activity catalogue and simple preference
          rules. Prices, images and forecasts are illustrative; no live booking,
          weather or group-sync service is connected.
        </p>
        <p className="text-muted">
          Forecast timing labels are UX heuristics, not measured probabilities.
          Reminders appear inside the app when you return or advance the demo
          forecast; no background notifications are sent.
        </p>
        <details className="border-t border-line pt-3">
          <summary className="cursor-pointer font-medium min-h-11">
            Demo controls
          </summary>
          <WeatherSimulation onDone={onClose} />
        </details>
      </div>
    </Modal>
  )
}
