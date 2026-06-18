"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useLogic } from "./useLogic";
import { MainControls } from "./controls";

export default function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useLogic();

  const [success, setSuccess] = useState(false);
  const successParam = searchParams.get("success");

  useEffect(() => {
    if (successParam) {
      setSuccess(true);
    }
  }, [successParam]);

  // clear success toast msg after 2s
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [success]);

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) return;
    router.push("/login");
  }

  return (
    <div>
      <div className="main">
        {success && <div className="toast">companion created</div>}
        <div className="top">
          <div className="left-panel">{session.companion && <img src={`/assets/${session.companion.companion}.gif`} alt={session.companion.companion} />}</div>
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
        <button type="button" title="profile" onClick={() => router.push("/profile")}>
          <img src="/icons/profile.svg" width="20" />
        </button>
        <button type="button" title="switch companion" onClick={() => router.push("/switchCompanion")}>
          <img src="/icons/switch.svg" width="20" />
        </button>
        <button type="button" title="add companion" onClick={() => router.push("/addCompanion")}>
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
