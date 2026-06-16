"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useLogic } from "./useLogic";
import { MainControls } from "./controls";

export default function MainPage() {
  const router = useRouter();
  const session = useLogic();

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) return;
    router.push("/login");
  }

  return (
    <div>
      <div className="main">
        <div className="top">
          <div className="left-panel">
            <img src={`/assets/${session.companion?.companion}.gif`} alt={session.companion?.companion || "companion"} />
          </div>

          <div className="right-panel">
            <table>
              <tbody>
                <tr>
                  <td>companion</td>
                  <td>{session.companion?.companion}</td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>{session.companion?.name}</td>
                </tr>
                <tr>
                  <td>level</td>
                  <td>{session.displayedLevel}</td>
                </tr>
                <tr>
                  <td>field</td>
                  <td>{session.companion?.field}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <MainControls
          mode={session.mode}
          isRunning={session.isRunning}
          timerInput={session.timerInput}
          setTimerInput={session.setTimerInput}
          timerSeconds={session.timerSeconds}
          swSeconds={session.swSeconds}
          expPopupAmount={session.expPopupAmount}
          expFillWidth={session.expFillWidth}
          displayedExp={session.displayedExp}
          formatTime={session.formatTime}
          handlePlayPause={session.handlePlayPause}
          handleReset={session.handleReset}
          switchToTimer={session.switchToTimer}
          switchToStopwatch={session.switchToStopwatch}
        />
      </div>

      <div className="main-buttons">
        <button type="button" title="profile">
          <img src="/icons/profile.svg" width="20" />
        </button>
        <button type="button" title="switch field">
          <img src="/icons/switch.svg" width="20" />
        </button>
        <button type="button" title="add field">
          <img src="/icons/add.svg" width="20" />
        </button>
        <div className="divider"></div>
        <button type="button" title="log out" onClick={handleLogOut}>
          <img src="/icons/logout.svg" width="20" />
        </button>
      </div>
    </div>
  );
}
