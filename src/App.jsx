import React, { useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from './store'
import HomeTab from './components/HomeTab'
import PlanTab from './components/PlanTab'
import HistoryTab from './components/HistoryTab'
import ClimbTab from './components/ClimbTab'
import ProfileTab from './components/ProfileTab'
import TimerScreen from './components/TimerScreen'
import ReadinessCheck from './components/ReadinessCheck'
import BottomNav from './components/BottomNav'

const GLOBAL_STYLES = `
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  :root {
    --bg: #130D20;
    --bg2: #1C1430;
    --white: #FFFFFF;
    --lavender: #9B7FE8;
    --lavender-light: #C4AEFF;
    --lavender-pale: rgba(155,127,232,0.15);
    --green: #5BB88A;
    --coral: #E8896A;
    --text: #F0EAFF;
    --muted: #9E8FC0;
    --border: rgba(155,127,232,0.18);
    --card-bg: rgba(255,255,255,0.06);
    --radius: 22px;
    --shadow: 0 8px 32px rgba(0,0,0,0.35);
  }
  body { overflow-x: hidden; background: var(--bg); }
  .screen {
    min-height: 100dvh;
    background: var(--bg);
    padding-bottom: 80px;
    position: relative;
    overflow-x: hidden;
  }
  /* organic background blobs */
  .screen::before {
    content: '';
    position: fixed;
    top: -160px; left: -120px;
    width: 520px; height: 500px;
    background: radial-gradient(ellipse at 40% 40%, rgba(124,92,220,0.28) 0%, transparent 65%);
    border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
    pointer-events: none;
    z-index: 0;
    animation: blobFloat 12s ease-in-out infinite;
  }
  .screen::after {
    content: '';
    position: fixed;
    bottom: 40px; right: -130px;
    width: 440px; height: 420px;
    background: radial-gradient(ellipse at 60% 60%, rgba(78,145,113,0.20) 0%, transparent 65%);
    border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%;
    pointer-events: none;
    z-index: 0;
    animation: blobFloat 16s ease-in-out infinite reverse;
  }
  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(12px, -18px) rotate(3deg); }
    66% { transform: translate(-8px, 10px) rotate(-2deg); }
  }
  .content { position: relative; z-index: 1; padding: 28px 20px 0; }
  .card {
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    padding: 20px;
    margin-bottom: 14px;
  }
  .card-lavender {
    background: linear-gradient(135deg, rgba(124,92,220,0.18) 0%, rgba(155,127,232,0.08) 100%);
    border-color: rgba(155,127,232,0.30);
  }
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.03em;
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 24px;
    border-radius: 100px;
    border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700;
    transition: transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
  }
  .btn:active { transform: scale(0.96); }
  .btn-primary {
    background: linear-gradient(135deg, #7C5CBF 0%, #A87FE8 100%);
    color: white;
    box-shadow: 0 8px 28px rgba(124,92,191,0.50);
  }
  .btn-secondary {
    background: rgba(255,255,255,0.08);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-green {
    background: linear-gradient(135deg, #3D8060 0%, #5BB88A 100%);
    color: white;
    box-shadow: 0 8px 28px rgba(78,145,113,0.40);
  }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  h1 { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  h2 { font-size: 19px; font-weight: 700; color: var(--text); }
  h3 { font-size: 15px; font-weight: 700; color: var(--text); }
  p { font-size: 14px; color: var(--muted); line-height: 1.65; }
`

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [activeTab, setActiveTab] = useState('home')
  const [timerWorkout, setTimerWorkout] = useState(null)
  const [showReadiness, setShowReadiness] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  const updateState = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  const startWorkout = useCallback((workout) => {
    setTimerWorkout(workout)
  }, [])

  const finishWorkout = useCallback((workout, skipped) => {
    const today = new Date().toISOString().split('T')[0]
    updateState(prev => ({
      ...prev,
      sessions: [...prev.sessions, {
        id: `s_${Date.now()}`,
        date: today,
        type: workout.type,
        title: workout.title,
        completed: !skipped,
        durationMin: workout.durationMin,
        skipped: skipped || false,
      }],
    }))
    setTimerWorkout(null)
  }, [updateState])

  if (timerWorkout) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <TimerScreen
          workout={timerWorkout}
          onFinish={(skipped) => finishWorkout(timerWorkout, skipped)}
          onBack={() => setTimerWorkout(null)}
        />
      </>
    )
  }

  if (showReadiness) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <ReadinessCheck
          state={state}
          updateState={updateState}
          onBack={() => setShowReadiness(false)}
        />
      </>
    )
  }

  const tabProps = { state, updateState, startWorkout, setShowReadiness, setActiveTab }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ position: 'relative', minHeight: '100dvh' }}>
        {activeTab === 'home' && <HomeTab {...tabProps} />}
        {activeTab === 'plan' && <PlanTab {...tabProps} />}
        {activeTab === 'history' && <HistoryTab {...tabProps} />}
        {activeTab === 'climb' && <ClimbTab {...tabProps} />}
        {activeTab === 'profile' && <ProfileTab {...tabProps} />}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  )
}
