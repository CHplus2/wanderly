import { useEffect } from "react";
import { TripProvider, useTrip } from "./state";
import Welcome from "./screens/Welcome";
import Setup from "./screens/Setup";
import Generating from "./screens/Generating";
import AppShell from "./screens/AppShell";

function Router() {
  const { screen, tab } = useTrip();
  useEffect(() => {
    document.querySelector(".phone-scroll")?.scrollTo({ top: 0 });
  }, [screen, tab]);
  if (screen === "welcome") return <Welcome />;
  if (screen === "setup") return <Setup />;
  if (screen === "generating") return <Generating />;
  return <AppShell />;
}

export default function App() {
  return (
    <TripProvider>
      <div className="demo-stage">
        <div className="phone-frame">
          <span className="phone-button phone-action" aria-hidden="true" />
          <span className="phone-button phone-volume-up" aria-hidden="true" />
          <span className="phone-button phone-volume-down" aria-hidden="true" />
          <span className="phone-button phone-power" aria-hidden="true" />
          <div className="phone-screen">
            <div className="phone-status" aria-hidden="true">
              <span>9:41</span>
              <span className="phone-island" />
              <div className="phone-status-icons">
                <svg width="17" height="14" viewBox="0 0 17 14" fill="currentColor"><rect y="9" width="3" height="5" rx="1" /><rect x="4.5" y="6" width="3" height="8" rx="1" /><rect x="9" y="3" width="3" height="11" rx="1" /><rect x="13.5" width="3" height="14" rx="1" /></svg>
                <svg width="17" height="14" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 4.5a12 12 0 0 1 16 0M5 8a7.5 7.5 0 0 1 10 0M8 11.5a3 3 0 0 1 4 0" /><circle cx="10" cy="14" r=".6" fill="currentColor" /></svg>
                <span className="phone-battery" />
              </div>
            </div>
            <div className="phone-viewport">
              <div className="phone-scroll"><Router /></div>
            </div>
            <div className="phone-home" aria-hidden="true"><span /></div>
          </div>
        </div>
      </div>
    </TripProvider>
  );
}
