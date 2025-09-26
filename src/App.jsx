import { useEffect } from 'react';
import './App.css';
import { setupFlipClock } from './setupFlipClock';

function App() {
  useEffect(() => {
    setupFlipClock();
  }, []);

  return (
    <>
      <canvas id="matrix" />
      {/* Live view camera preview window */}
      <div id="liveViewContainer">
        <button id="closeLiveViewBtn" title="Close live view">&times;</button>
        <video id="liveViewVideo" autoPlay playsInline muted />
      </div>
      <div
        id="timerTagDisplay"
        style={{
          display: 'none',
          margin: '18px auto 10px auto',
          textAlign: 'center',
          width: '100%'
        }}
      >
        <span
          id="timerTagText"
          style={{
            color: '#0ff',
            fontSize: 'clamp(16px, 4vw, 28px)',
            fontFamily: "'Quicksand', Arial, sans-serif",
            fontWeight: 700,
            textShadow: '0 0 10px #0ff',
            display: 'inline-block'
          }}
        />
      </div>
      <div className="controls">
        <button id="clockMode">Clock</button>
        <button id="countdownMode">Countdown</button>
        <span className="countdown-inputs" id="countdownInputs" style={{ display: 'none' }}>
          <input type="number" id="countdownHour" min="0" max="99" defaultValue={0} />
          <span>:</span>
          <input type="number" id="countdownMinute" min="0" max="59" defaultValue={1} />
          <span>:</span>
          <input type="number" id="countdownSecond" min="0" max="59" defaultValue={0} />
        </span>
        <button id="fullscreenBtn">Fullscreen</button>
        <button id="tagsBtn">Goal</button>
        <button id="liveViewBtn">Turn on Live View</button>
        <button id="startCountdown" style={{ display: 'none' }}>Start</button>
      </div>
      <div className="flip-clock-container">
        <div className="flip-clock" id="flipClock" />
      </div>
      <div id="countdownCalculator" className="hideable-calculator">
        Effective time today: <span id="effectiveTime">00:00:00</span>
      </div>
      <div id="addEffectiveTime" className="hideable-add-time">
        <div className="add-time-content">
          <span className="add-time-label">Add effective time:</span>
          <span id="pendingTimeDisplay">00:00:00</span>
          <div className="add-time-buttons">
            <button id="addTimeBtn" className="time-btn">Add</button>
            <button id="clearTimeBtn" className="time-btn">Clear</button>
          </div>
        </div>
      </div>
      <div
        id="goalModal"
        style={{
          display: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2000,
          background: 'rgba(0,0,0,0.45)',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.95)',
            borderRadius: '16px',
            boxShadow: '0 0 24px #0ff8',
            padding: '32px 24px 24px 24px',
            minWidth: '260px',
            maxWidth: '90vw',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              color: '#0ff',
              fontSize: '1.3em',
              fontFamily: "'Quicksand', Arial, sans-serif",
              fontWeight: 700,
              marginBottom: '18px'
            }}
          >
            Set Goal for this timer
          </div>
          <input
            id="goalInput"
            type="text"
            maxLength={80}
            style={{
              width: '90%',
              fontSize: '1.1em',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #0ff',
              background: '#111',
              color: '#0ff',
              marginBottom: '18px',
              outline: 'none'
            }}
          />
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}
          >
            <button
              id="goalModalOk"
              style={{
                background: '#0ff',
                color: '#000',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                padding: '8px 22px',
                fontSize: '1em',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
            <button
              id="goalModalCancel"
              style={{
                background: '#222',
                color: '#0ff',
                fontWeight: 700,
                border: '1px solid #0ff',
                borderRadius: '8px',
                padding: '8px 22px',
                fontSize: '1em',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
