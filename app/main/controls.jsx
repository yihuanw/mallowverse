export function MainControls({
  mode,
  isRunning,
  timerInput,
  setTimerInput,
  timerSeconds,
  swSeconds,
  expPopupAmount,
  expFillWidth,
  displayedExp,
  formatTime,
  handlePlayPause,
  handleReset,
  switchToTimer,
  switchToStopwatch,
}) {
  return (
    <div className="bottom-panel">
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
          !isRunning ? (
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
  );
}
