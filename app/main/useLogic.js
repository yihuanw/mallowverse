"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { getActiveCompanion } from "../../lib/companion";

export function useLogic() {
  const [companion, setCompanion] = useState(null);
  const [displayedExp, setDisplayedExp] = useState(0);
  const [displayedLevel, setDisplayedLevel] = useState(0);
  const [expFillWidth, setExpFillWidth] = useState(0);

  const [mode, setMode] = useState("timer");
  const [isRunning, setIsRunning] = useState(false);
  const [timerInput, setTimerInput] = useState("00:15:00");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [swSeconds, setSwSeconds] = useState(0);

  const [expPopupAmount, setExpPopupAmount] = useState(null);

  const intervalRef = useRef(null);
  const sessionExpRef = useRef(0);
  const popupTimerRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    async function loadCompanion() {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData.session?.user;
      if (!user) return;

      userIdRef.current = user.id;

      const result = await getActiveCompanion(user.id);
      setCompanion(result);
      setDisplayedExp(result?.exp ?? 0);
      setDisplayedLevel(result?.level ?? 0);
      setExpFillWidth(((result?.exp ?? 0) / 1800) * 100);
    }
    loadCompanion();
  }, []);

  async function saveAndFinalize(finalExp, finalLevel) {
    if (!userIdRef.current) return;
    await supabase.from("companions").update({ exp: finalExp, level: finalLevel }).eq("user_id", userIdRef.current).eq("active", true);
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

      setDisplayedExp(newExp);
      setDisplayedLevel(newLevel);
      setExpFillWidth((newExp / 1800) * 100);

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
    if (isRunning) {
      flushSession();
      setTimerInput(formatTime(timerSeconds));
    } else {
      setTimerSeconds(parseInput(timerInput));
    }
    setIsRunning((prev) => !prev);
  }

  function handleReset() {
    if (isRunning) flushSession();
    setIsRunning(false);
    if (mode === "timer") {
      setTimerSeconds(parseInput(timerInput));
    } else {
      setSwSeconds(0);
    }
  }

  function switchToTimer() {
    if (isRunning) flushSession();
    setIsRunning(false);
    setMode("timer");
  }

  function switchToStopwatch() {
    if (isRunning) flushSession();
    setIsRunning(false);
    setMode("stopwatch");
  }

  return {
    companion,
    displayedExp,
    displayedLevel,
    expFillWidth,
    expPopupAmount,
    mode,
    isRunning,
    timerInput,
    setTimerInput,
    timerSeconds,
    swSeconds,
    formatTime,
    handlePlayPause,
    handleReset,
    switchToTimer,
    switchToStopwatch,
  };
}