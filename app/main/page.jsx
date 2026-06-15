"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getActiveCompanion } from "../../lib/companion";

export default function MainPage() {
  const router = useRouter();
  const [companion, setCompanion] = useState(null);

  // displayed exp/level — only updated at end of session
  const [displayedExp, setDisplayedExp] = useState(0);
  const [displayedLevel, setDisplayedLevel] = useState(0);
  const [expFillWidth, setExpFillWidth] = useState(0);

  useEffect(() => {
    async function loadCompanion() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const result = await getActiveCompanion(userData.user.id);
      setCompanion(result);
      setDisplayedExp(result?.exp ?? 0);
      setDisplayedLevel(result?.level ?? 0);
      setExpFillWidth(((result?.exp ?? 0) / 1800) * 100);
    }
    loadCompanion();
  }, []);

  // timer & stopwatch
  const [mode, setMode] = useState("timer");
  const [isRunning, setIsRunning] = useState(false);

  const [timerInput, setTimerInput] = useState("00:25:00");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [swSeconds, setSwSeconds] = useState(0);

  const intervalRef = useRef(null);
  const sessionExpRef = useRef(0);

  // exp popup
  const [expPopupAmount, setExpPopupAmount] = useState(null);
  const popupTimerRef = useRef(null);

  async function saveAndFinalize(finalExp, finalLevel) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from("companions").update({ exp: finalExp, level: finalLevel }).eq("user_id", userData.user.id);
  }

  function flushSession() {
    const earned = sessionExpRef.current;
    if (earned === 0) return;
    sessionExpRef.current = 0;

    setCompanion((c) => {
      if (!c) return c;

      let newExp = c.exp + earned;
      let newLevel = c.level;

      if (newExp >= 1800) {
        newLevel += 1;
        newExp = newExp - 1800;
      }

      const newFill = (newExp / 1800) * 100;

      // update displayed values
      setDisplayedExp(newExp);
      setDisplayedLevel(newLevel);
      setExpFillWidth(newFill);

      // show popup
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      setExpPopupAmount(earned);
      popupTimerRef.current = setTimeout(() => setExpPopupAmount(null), 5000);

      saveAndFinalize(newExp, newLevel);

      return { ...c, exp: newExp, level: newLevel };
    });
  }

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      if (mode === "timer") {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            sessionExpRef.current += 1;
            // use setTimeout so state updates from setTimerSeconds settle first
            setTimeout(() => flushSession(), 0);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setSwSeconds((prev) => prev + 1);
      }

      sessionExpRef.current += 1;
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function parseInput(value) {
    const digits = value.replace(/\D/g, "").padStart(6, "0").slice(-6);
    const h = Number(digits.slice(0, 2));
    const m = Number(digits.slice(2, 4));
    const s = Number(digits.slice(4, 6));
    return h * 3600 + m * 60 + s;
  }

  function handlePlayPause() {
    if (mode === "timer") {
      if (!isRunning && timerSeconds === 0) {
        setTimerSeconds(parseInput(timerInput));
      }
    }

    if (isRunning) {
      flushSession();
    }

    setIsRunning((prev) => !prev);
  }

  function handleReset() {
    setIsRunning(false);
    if (mode === "timer") {
      setTimerSeconds(parseInput(timerInput));
    } else {
      setSwSeconds(0);
    }
  }

  function switchToTimer() {
    setIsRunning(false);
    setMode("timer");
  }

  function switchToStopwatch() {
    setIsRunning(false);
    setMode("stopwatch");
  }

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
                  <td>{displayedLevel}</td>
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
              <button type="button" className={mode === "timer" ? "active" : ""} onClick={switchToTimer}>
                timer
              </button>
              <button type="button" className={mode === "stopwatch" ? "active" : ""} onClick={switchToStopwatch}>
                stopwatch
              </button>
            </div>

            <div className="clock">
              {mode === "timer" ? (
                !isRunning && timerSeconds === 0 ? (
                  <input
                    className="timer-input"
                    value={timerInput}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      const padded = digits.padStart(6, "0").slice(-6);
                      setTimerInput(`${padded.slice(0, 2)}:${padded.slice(2, 4)}:${padded.slice(4, 6)}`);
                    }}
                  />
                ) : (
                  <label>{formatTime(timerSeconds)}</label>
                )
              ) : (
                <label>{formatTime(swSeconds)}</label>
              )}

              <div className="timer-controls">
                <button type="button" className="playpause-button" onClick={handlePlayPause}>
                  <img src={isRunning ? "/icons/pause.svg" : "/icons/play.svg"} width="20" alt="" />
                </button>
                <button type="button" onClick={handleReset}>
                  <img src="/icons/reset.svg" width="20" alt="" />
                </button>
              </div>
            </div>

            <label className="exp-notif" style={{ visibility: expPopupAmount !== null ? "visible" : "hidden" }}>
              + {expPopupAmount} exp
            </label>

            <div className="exp-bar">
              <div className="exp-filled" style={{ width: `${expFillWidth}%` }}></div>
            </div>

            <label className="exp-ratio">{displayedExp}/1800</label>
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