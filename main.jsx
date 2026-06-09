import React, { useMemo } from 'react'
import {
  getDayPostpartum, getWeekPostpartum, getPhaseLabel, getPhaseColor,
  getTodaySymptom, getWeekSessions, logSymptom,
} from '../store'
import { getTodayWorkouts, getDayMessage } from '../workouts'

const MOODS = [
  { id: 'good', label: 'Gut', emoji: '😊' },
  { id: 'medium', label: 'Mittel', emoji: '😐' },
  { id: 'tired', label: 'Müde', emoji: '😴' },
  { id: 'pause', label: 'Pause', emoji: '🌙' },
]

function WeekDot({ day }) {
  const { session, symptom, isToday } = day
  const isPause = symptom?.mood === 'pause' || session?.skipped
  const isDone = session?.completed

  let bg = '#EBE0D4'
  let label = ''
  if (isToday) { bg = '#9B7FCC'; label = '•' }
  else if (isPause) { bg = '#5A9E7A'; label = '🌙' }
  else if (isDone) { bg = '#9B7FCC' }

  const d = new Date(day.date)
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12,
        border: isToday ? '2px solid #9B7FCC' : 'none',
        outline: isToday ? '3px solid rgba(155,127,204,0.2)' : 'none',
      }}>
        {label}
      </div>
      <span style={{ fontSize: 10, color: '#A8937F', fontWeight: isToday ? 600 : 400 }}>
        {dayNames[d.getDay()]}
      </span>
    </div>
  )
}

function WorkoutCard({ workout, onStart }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(155,127,204,0.15), rgba(155,127,204,0.05))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>
        {workout.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ marginBottom: 2 }}>{workout.title}</h3>
        <p style={{ fontSize: 12, marginBottom: 4 }}>{workout.subtitle}</p>
        <span style={{ fontSize: 11, color: '#A8937F' }}>{workout.durationMin} Min</span>
      </div>
      <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => onStart(workout)}>
        Start
      </button>
    </div>
  )
}

function MoodBar({ state, updateState }) {
  const today = getTodaySymptom(state)
  const currentMood = today?.mood

  const handleMood = (moodId) => {
    updateState(prev => logSymptom(prev, {
      mood: moodId,
      pelvicPressure: today?.pelvicPressure || false,
      incontinence: today?.incontinence || false,
      pain: today?.pain || false,
      sleepHours: today?.sleepHours || 0,
      note: today?.note || '',
    }))
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>Wie geht es dir heute?</h3>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => handleMood(m.id)}
            style={{
              flex: 1, padding: '10px 6px',
              borderRadius: 14,
              border: '1.5px solid',
              borderColor: currentMood === m.id ? '#9B7FCC' : '#EBE0D4',
              background: currentMood === m.id ? 'rgba(155,127,204,0.1)' : 'white',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            <span style={{ fontSize: 11, color: currentMood === m.id ? '#9B7FCC' : '#A8937F', fontWeight: 500 }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProgressRing({ value, max, color, size = 72, label, sublabel }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(1, value / Math.max(1, max))
  const dash = pct * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EBE0D4" strokeWidth={6}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div style={{ textAlign: 'center', marginTop: -4 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#3D2E26' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: '#A8937F' }}>{sublabel}</div>}
      </div>
    </div>
  )
}

export default function HomeTab({ state, updateState, startWorkout, setShowReadiness }) {
  const { profile, currentPhase } = state
  const dayPP = getDayPostpartum(profile.birthDate)
  const weekPP = getWeekPostpartum(profile.birthDate)
  const todaySymptom = getTodaySymptom(state)
  const weekDays = getWeekSessions(state)
  const workouts = useMemo(() => getTodayWorkouts(currentPhase), [currentPhase])
  const phaseColor = getPhaseColor(currentPhase)
  const message = getDayMessage(weekPP, todaySymptom?.mood)

  const weekDone = weekDays.filter(d => d.session?.completed || d.session?.skipped || d.symptom?.mood === 'pause').length
  const totalSessions = state.sessions.filter(s => s.completed).length

  return (
    <div className="screen">
      <div className="content">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h1>Hallo, {profile.name} 👋</h1>
            <span className="pill" style={{ background: `${phaseColor}20`, color: phaseColor }}>
              {getPhaseLabel(currentPhase)}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#A8937F' }}>Tag {dayPP} postpartal · Woche {weekPP}</p>
          <p style={{ fontSize: 14, color: '#7A6B5E', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>{message}</p>
        </div>

        {/* Breastfeeding reminder */}
        {profile.breastfeeding && (
          <div className="card" style={{ background: 'rgba(90,158,122,0.08)', border: '1px solid rgba(90,158,122,0.25)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18 }}>💧</span>
              <div>
                <p style={{ fontSize: 13, color: '#3D7A55', fontWeight: 500, marginBottom: 2 }}>Stillen: +700 ml Wasser täglich</p>
                <p style={{ fontSize: 12, color: '#5A9E7A' }}>Und ca. 330–400 kcal Mehrbedarf beim Training. (GSSI 2025 / EFSA 2010)</p>
              </div>
            </div>
          </div>
        )}

        {/* Week strip */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3>Diese Woche</h3>
            <span style={{ fontSize: 12, color: '#A8937F' }}>{weekDone}/7 Tage aktiv</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {weekDays.map(d => <WeekDot key={d.date} day={d} />)}
          </div>
        </div>

        {/* Progress rings */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Fortschritt</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <ProgressRing value={weekDone} max={5} color="#9B7FCC" size={80}
              label={weekDone} sublabel="diese Woche" />
            <ProgressRing value={totalSessions} max={50} color="#5A9E7A" size={80}
              label={totalSessions} sublabel="gesamt" />
            <ProgressRing value={weekPP} max={52} color="#D4876A" size={80}
              label={`W${weekPP}`} sublabel="postpartal" />
          </div>
        </div>

        {/* Today workouts */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ marginBottom: 4 }}>Heute</h2>
          <p style={{ fontSize: 13, color: '#A8937F', marginBottom: 14 }}>
            Kein Training ist auch eine Option — Ruhe ist Teil des Plans.
          </p>
          {workouts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌿</div>
              <h3 style={{ marginBottom: 6 }}>Ruhetag</h3>
              <p>Heute steht Erholung im Plan. Das ist genauso wichtig.</p>
            </div>
          ) : (
            workouts.map(w => <WorkoutCard key={w.id} workout={w} onStart={startWorkout} />)
          )}
        </div>

        {/* Mood */}
        <MoodBar state={state} updateState={updateState} />

        {/* Phase 1: Physio reminder */}
        {currentPhase === 1 && (
          <div className="card" style={{ background: 'rgba(155,127,204,0.06)', border: '1px solid rgba(155,127,204,0.2)', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🩺</span>
              <div>
                <h3 style={{ marginBottom: 4, color: '#9B7FCC' }}>Beckenbodenphysiotherapie</h3>
                <p style={{ fontSize: 13 }}>Vor Phase 2 unbedingt empfohlen. Eine Befundung ist der wichtigste Schritt für sicheren Wiedereinstieg.</p>
              </div>
            </div>
          </div>
        )}

        {/* Diastasis reminder */}
        {weekPP >= 6 && weekPP <= 12 && currentPhase === 1 && (
          <div className="card" style={{ background: 'rgba(212,135,106,0.08)', border: '1px solid rgba(212,135,106,0.25)', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <div>
                <h3 style={{ marginBottom: 4, color: '#D4876A' }}>Diastase-Assessment</h3>
                <p style={{ fontSize: 13 }}>Woche 6–8 ist ein guter Zeitpunkt für die Untersuchung auf Rektusdiastase.</p>
              </div>
            </div>
          </div>
        )}

        {/* Readiness check teaser */}
        {currentPhase === 1 && weekPP >= 10 && (
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ marginBottom: 6 }}>Bereit für Phase 2?</h3>
            <p style={{ marginBottom: 14, fontSize: 13 }}>
              Ab Woche 12 kannst du den Readiness-Check für Phase 2 durchführen.
              {weekPP < 12 ? ` Noch ${12 - weekPP} Wochen.` : ' Du könntest jetzt starten.'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowReadiness(true)}
              disabled={weekPP < 12}
              style={{ width: '100%' }}
            >
              Readiness-Check öffnen
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: '#C4B4A4', textAlign: 'center', padding: '8px 0 20px' }}>
          Diese App ersetzt keine individuelle Befundung.
        </p>
      </div>
    </div>
  )
}
