import React, { useState, useEffect, useRef, useCallback } from 'react'
import { IconSparkle } from './Characters'

function BreathingCircle({ isRunning, totalSeconds, remainingSeconds }) {
  const pct = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1
  const size = 220
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EBE0D4" strokeWidth={8}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#9B7FCC" strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.9s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4,
      }}>
        <div style={{
          width: size - 40, height: size - 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,127,204,0.15) 0%, rgba(155,127,204,0.04) 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: isRunning ? 'breathe 5s ease-in-out infinite' : 'none',
        }}>
          <span style={{ fontSize: 48, fontWeight: 300, color: '#3D2E26', letterSpacing: '-2px' }}>
            {remainingSeconds}
          </span>
          <span style={{ fontSize: 12, color: '#A8937F' }}>Sekunden</span>
        </div>
      </div>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function TimerScreen({ workout, onFinish, onBack }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [remaining, setRemaining] = useState(workout.steps[0].duration)
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  const step = workout.steps[stepIdx]
  const totalSteps = workout.steps.length

  const advance = useCallback(() => {
    if (stepIdx < totalSteps - 1) {
      const next = stepIdx + 1
      setStepIdx(next)
      setRemaining(workout.steps[next].duration)
    } else {
      setIsRunning(false)
      setDone(true)
    }
  }, [stepIdx, totalSteps, workout.steps])

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          advance()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, advance])

  const handleSkipStep = () => {
    clearInterval(intervalRef.current)
    advance()
  }

  const handleBack = () => {
    if (stepIdx > 0) {
      clearInterval(intervalRef.current)
      const prev = stepIdx - 1
      setStepIdx(prev)
      setRemaining(workout.steps[prev].duration)
    }
  }

  if (done) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 0 }}>
        <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
          <div style={{ marginBottom: 24, animation: 'breathe 3s ease-in-out infinite' }}><IconSparkle size={72} /></div>
          <h1 style={{ marginBottom: 8 }}>Abgeschlossen</h1>
          <p style={{ marginBottom: 8 }}>{workout.title}</p>
          <p style={{ fontSize: 12, color: '#C4B4A4', marginBottom: 40 }}>
            Quelle: {workout.reference}
          </p>
          <button className="btn btn-primary" style={{ width: '100%', maxWidth: 280, marginBottom: 12 }}
            onClick={() => onFinish(false)}>
            Fertig
          </button>
          <button className="btn btn-secondary" style={{ width: '100%', maxWidth: 280 }}
            onClick={() => onFinish(true)}>
            Als übersprungen markieren
          </button>
          <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="screen" style={{ paddingBottom: 0 }}>
      <div className="content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid #EBE0D4', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18,
          }}>←</button>
          <div>
            <h2 style={{ marginBottom: 2 }}>{workout.title}</h2>
            <p style={{ fontSize: 12 }}>{workout.subtitle}</p>
          </div>
        </div>

        {/* Step label */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span className="pill" style={{ background: 'rgba(155,127,204,0.12)', color: '#9B7FCC', marginBottom: 8 }}>
            {step.label}
          </span>
          <p style={{ fontSize: 12, color: '#A8937F' }}>Schritt {stepIdx + 1} von {totalSteps}</p>
        </div>

        {/* Breathing circle */}
        <BreathingCircle isRunning={isRunning} totalSeconds={step.duration} remainingSeconds={remaining} />

        {/* Cue card */}
        {step.cue && (
          <div className="card" style={{ margin: '24px 0', textAlign: 'center', background: 'rgba(155,127,204,0.06)' }}>
            <p style={{ fontSize: 14, color: '#5A4E45', lineHeight: 1.7 }}>{step.cue}</p>
          </div>
        )}

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {workout.steps.map((_, i) => (
            <div key={i} style={{
              width: i === stepIdx ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i < stepIdx ? '#9B7FCC' : i === stepIdx ? '#9B7FCC' : '#EBE0D4',
              transition: 'width 0.3s ease',
            }}/>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleBack}
            disabled={stepIdx === 0}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid #EBE0D4', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: stepIdx === 0 ? 0.4 : 1, fontSize: 16,
            }}>
            ⏮
          </button>

          <button
            onClick={() => setIsRunning(r => !r)}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              border: 'none', background: '#9B7FCC',
              color: 'white', fontSize: 28, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(155,127,204,0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isRunning ? '⏸' : '▶'}
          </button>

          <button
            onClick={handleSkipStep}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid #EBE0D4', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16,
            }}>
            ⏭
          </button>
        </div>

        {/* Reference */}
        <p style={{ fontSize: 11, color: '#C4B4A4', textAlign: 'center', marginTop: 24 }}>
          {workout.reference}
        </p>

        {/* Skip whole workout */}
        <button
          onClick={() => onFinish(true)}
          style={{
            width: '100%', marginTop: 16,
            padding: '12px', borderRadius: 100,
            border: 'none', background: 'transparent',
            color: '#A8937F', fontFamily: 'Nunito, sans-serif',
            fontSize: 13, cursor: 'pointer',
          }}>
          Heute lieber ausruhen
        </button>
      </div>
    </div>
  )
}
