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
    --bg: #FDF6EF;
    --white: #FFFFFF;
    --purple: #9B7FCC;
    --green: #5A9E7A;
    --coral: #D4876A;
    --text: #3D2E26;
    --muted: #A8937F;
    --border: #EBE0D4;
    --radius: 18px;
    --shadow: 0 2px 12px rgba(61,46,38,0.08);
  }
  body { overflow-x: hidden; }
  .screen {
    min-height: 100dvh;
    background: var(--bg);
    padding-bottom: 80px;
    position: relative;
    overflow-x: hidden;
  }
  .screen::before {
    content: '';
    position: fixed;
    top: -120px; left: -80px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(155,127,204,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .screen::after {
    content: '';
    position: fixed;
    bottom: 60px; right: -100px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(90,158,122,0.10) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .content { position: relative; z-index: 1; padding: 24px 20px 0; }
  .card {
    background: var(--white);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    padding: 18px;
    margin-bottom: 14px;
  }
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.02em;
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 24px;
    border-radius: 100px;
    border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 600;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary {
    background: var(--purple);
    color: white;
    box-shadow: 0 4px 16px rgba(155,127,204,0.35);
  }
  .btn-secondary {
    background: var(--white);
    color: var(--text);
    border: 1.5px solid var(--border);
  }
  .btn-green {
    background: var(--green);
    color: white;
    box-shadow: 0 4px 16px rgba(90,158,122,0.3);
  }
  .btn:disabled {
    opacity: 0.45; cursor: not-allowed;
  }
  h1 { font-size: 24px; font-weight: 600; color: var(--text); }
  h2 { font-size: 18px; font-weight: 600; color: var(--text); }
  h3 { font-size: 15px; font-weight: 600; color: var(--text); }
  p { font-size: 14px; color: var(--muted); line-height: 1.6; }
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
