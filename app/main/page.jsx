"use client";

import { useEffect, useState } from "react";
import { useTimer, useStopwatch } from "react-timer-hook";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getActiveCompanion } from "../../lib/companion";

export default function MainPage() {
  // loading logged in user's companion
  const router = useRouter();
  const [companion, setCompanion] = useState(null);

  useEffect(() => {
    async function loadCompanion() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const result = await getActiveCompanion(userData.user.id);

      setCompanion(result);
    }
    loadCompanion();
  }, []);

  // timer & stopwatch
  const [mode, setMode] = useState("timer");

  const [timerInput, setTimerInput] = useState("00:25:00");

  const [timerStarted, setTimerStarted] = useState(false);

  function normalizeTimeString(value) {
    const parts = value.split(":");

    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    const s = parseInt(parts[2]) || 0;

    let totalSeconds = h * 3600 + m * 60 + s;

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const {
    seconds: tSeconds,
    minutes: tMinutes,
    hours: tHours,
    isRunning: tRunning,
    pause: tPause,
    resume: tResume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      setTimerStarted(false);
    },
  });

  const {
    seconds: swSeconds,
    minutes: swMinutes,
    hours: swHours,
    isRunning: swRunning,
    start: swStart,
    pause: swPause,
    reset: swReset,
  } = useStopwatch({
    autoStart: false,
  });

  function startTimer() {
    const normalized = normalizeTimeString(timerInput);

    const [h, m, s] = normalized.split(":").map((n) => parseInt(n) || 0);

    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds <= 0) return;

    setTimerInput(normalized);

    const expiry = new Date();

    expiry.setSeconds(expiry.getSeconds() + totalSeconds);

    restart(expiry, true);
    setTimerStarted(true);
  }

  function resetTimer() {
    restart(new Date(), false);
    setTimerStarted(false);
  }

  function switchToTimer() {
    swPause();
    swReset(undefined, false);
    setMode("timer");
  }

  function switchToStopwatch() {
    tPause();
    setTimerStarted(false);
    setMode("stopwatch");
  }

  // when user clicks logout button
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
            <img src="/assets/calico.gif" alt="calico" />
          </div>

          <div className="right-panel">
            <table>
              <tbody>
                <tr>
                  <td>companion</td>
                  <td>{companion?.companion}</td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>{companion?.name}</td>
                </tr>
                <tr>
                  <td>level</td>
                  <td>{companion?.level}</td>
                </tr>
                <tr>
                  <td>field</td>
                  <td>{companion?.field}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-panel">
          <div className="bottom-container">
            <div className="timepiece">
              <button
                type="button"
                className={mode === "timer" ? "active" : ""}
                onClick={switchToTimer}
              >
                timer
              </button>

              <button
                type="button"
                className={mode === "stopwatch" ? "active" : ""}
                onClick={switchToStopwatch}
              >
                stopwatch
              </button>
            </div>

            <div className="clock">
              {mode === "timer" ? (
                !timerStarted ? (
                  <input
                    className="timer-input"
                    value={timerInput}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");

                      let padded = digits.padStart(6, "0").slice(-6);

                      const formatted = `${padded.slice(0, 2)}:${padded.slice(2, 4)}:${padded.slice(4, 6)}`;

                      setTimerInput(formatted);
                    }}
                    onBlur={() =>
                      setTimerInput(normalizeTimeString(timerInput))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setTimerInput(normalizeTimeString(timerInput));
                      }
                    }}
                  />
                ) : (
                  <label>
                    {String(tHours).padStart(2, "0")}:
                    {String(tMinutes).padStart(2, "0")}:
                    {String(tSeconds).padStart(2, "0")}
                  </label>
                )
              ) : (
                <label>
                  {String(swHours).padStart(2, "0")}:
                  {String(swMinutes).padStart(2, "0")}:
                  {String(swSeconds).padStart(2, "0")}
                </label>
              )}

              <div className="timer-controls">
                <button
                  type="button"
                  className="playpause-button"
                  onClick={() => {
                    if (mode === "timer") {
                      if (!timerStarted) {
                        startTimer();
                      } else if (tRunning) {
                        tPause();
                      } else {
                        tResume();
                      }
                    } else {
                      if (swRunning) {
                        swPause();
                      } else {
                        swStart();
                      }
                    }
                  }}
                >
                  <img
                    src={
                      (mode === "timer" ? tRunning : swRunning)
                        ? "/icons/pause.svg"
                        : "/icons/play.svg"
                    }
                    width="20"
                    alt=""
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (mode === "timer") {
                      resetTimer();
                    } else {
                      swReset(undefined, false);
                    }
                  }}
                >
                  <img src="/icons/reset.svg" width="20" alt="" />
                </button>
              </div>
            </div>

            <label className="exp-notif">+ 5 exp</label>

            <div className="exp-bar">
              <div className="exp-filled"></div>
            </div>

            <label className="exp-ratio">{companion?.exp}/100</label>
          </div>
        </div>
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
