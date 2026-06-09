import React, { useMemo, useState } from 'react'
import {
  getDayPostpartum, getWeekPostpartum, getPhaseLabel, getPhaseColor,
  getTodaySymptom, getWeekSessions, logSymptom,
} from '../store'
import { getTodayWorkouts, getDayMessage, getWeekSchedule, getPhaseWorkouts } from '../workouts'
import {
  MoodHappy, MoodNeutral, MoodTired, MoodPause,
  IconMoon, IconPlant, IconWater, IconMedical, IconClipboard, IconWave,
  WORKOUT_ICONS,
} from './Characters'

const MOODS = [
  { id: 'good', label: 'Gut', Char: MoodHappy },
  { id: 'medium', label: 'Mittel', Char: MoodNeutral },
  { id: 'tired', label: 'Müde', Char: MoodTired },
  { id: 'pause', label: 'Pause', Char: MoodPause },
]

const DAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

function WorkoutCard({ workout, onStart, accent }) {
  const Icon = WORKOUT_ICONS[workout.id] || WORKOUT_ICONS.p1_pelvic_basic
  const color = accent || '#7C5CBF'
  return (
    <div className="card" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      background: `linear-gradient(135deg, rgba(124,92,191,0.07) 0%, rgba(255,255,255,0.9) 60%)`,
      borderColor: `rgba(124,92,191,0.18)`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 18, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}22 0%, ${color}0a 100%)`,
        border: `1.5px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={38} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ marginBottom: 2 }}>{workout.title}</h3>
        <p style={{ fontSize: 12, marginBottom: 4 }}>{workout.subtitle}</p>
        <span style={{
          fontSize: 11, color: color, fontWeight: 700,
          background: `${color}15`, borderRadius: 100, padding: '2px 8px',
        }}>{workout.durationMin} Min</span>
      </div>
      <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => onStart(workout)}>
        Start
      </button>
    </div>
  )
}

function WeekSchedule({ phase, sessions, onSelectWorkout, selectedId }) {
  const schedule = useMemo(() => getWeekSchedule(phase), [phase])
  const phaseWorkouts = useMemo(() => getPhaseWorkouts(phase), [phase])
  const [swapDay, setSwapDay] = useState(null)

  const isCompleted = (dateStr) => sessions.some(s => s.date === dateStr && s.completed)
  const isSkipped = (dateStr) => sessions.some(s => s.date === dateStr && s.skipped)

  return (
    <div className="card" style={{ padding: '18px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Diese Woche</h3>
        <span style={{ fontSize: 11, color: '#8E7DA8' }}>
          {schedule.filter(d => d.workout && isCompleted(d.date)).length} / {schedule.filter(d => d.workout).length} erledigt
        </span>
      </div>

      {/* 7-day strip */}
      <div style={{ display: 'flex', gap: 6, marginBottom: swapDay !== null ? 16 : 0 }}>
        {schedule.map((day, i) => {
          const done = isCompleted(day.date)
          const skipped = isSkipped(day.date)
          const isSelected = day.isToday
          const hasWorkout = !!day.workout
          const color = done ? '#4E9171' : skipped ? '#8E7DA8' : hasWorkout ? '#7C5CBF' : '#C8BFD8'

          return (
            <div
              key={day.date}
              onClick={() => day.isToday && hasWorkout && setSwapDay(swapDay === i ? null : i)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                cursor: day.isToday && hasWorkout ? 'pointer' : 'default',
              }}
            >
              <div style={{
                width: '100%', aspectRatio: '1',
                borderRadius: 12,
                background: isSelected
                  ? `linear-gradient(135deg, #7C5CBF 0%, #9B7FCC 100%)`
                  : done ? 'rgba(78,145,113,0.15)'
                  : hasWorkout ? 'rgba(124,92,191,0.10)'
                  : 'rgba(200,191,216,0.18)',
                border: isSelected ? '2px solid #7C5CBF'
                  : swapDay === i ? '2px dashed #7C5CBF'
                  : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.2s',
              }}>
                {done && <span style={{ fontSize: 14 }}>✓</span>}
                {skipped && !done && <span style={{ fontSize: 10, color: '#8E7DA8' }}>–</span>}
                {!done && !skipped && hasWorkout && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isSelected ? 'white' : color,
                  }}/>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: isSelected ? 700 : 400,
                color: isSelected ? '#7C5CBF' : day.isPast ? '#C8BFD8' : '#8E7DA8',
              }}>{DAY_SHORT[day.dayOfWeek]}</span>
              {hasWorkout && !day.isPast && (
                <span style={{
                  fontSize: 9, color: color, fontWeight: 600,
                  textAlign: 'center', lineHeight: 1.2,
                  maxWidth: 36, overflow: 'hidden',
                  whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>
                  {day.workout.title.split(' ')[0]}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Swap picker for today */}
      {swapDay !== null && (
        <div style={{ borderTop: '1px solid #E2D9F3', paddingTop: 14 }}>
          <p style={{ fontSize: 12, marginBottom: 10, color: '#7C5CBF', fontWeight: 600 }}>Andere Einheit wählen:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {phaseWorkouts.map(w => {
              const Icon = WORKOUT_ICONS[w.id] || WORKOUT_ICONS.p1_pelvic_basic
              const isActive = selectedId === w.id || (!selectedId && schedule[swapDay]?.workout?.id === w.id)
              return (
                <button
                  key={w.id}
                  onClick={() => { onSelectWorkout(w); setSwapDay(null) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 14,
                    border: `1.5px solid ${isActive ? '#7C5CBF' : '#E2D9F3'}`,
                    background: isActive ? 'rgba(124,92,191,0.08)' : 'white',
                    cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={32} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#2E1F3E' }}>{w.title}</div>
                    <div style={{ fontSize: 11, color: '#8E7DA8' }}>{w.durationMin} Min · {w.subtitle}</div>
                  </div>
                  {isActive && <span style={{ marginLeft: 'auto', color: '#7C5CBF', fontWeight: 700 }}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {(() => {
        const upcoming = schedule.filter(d => !d.isToday && !d.isPast && d.workout).slice(0, 2)
        if (upcoming.length === 0) return null
        return (
          <div style={{ borderTop: '1px solid #E2D9F3', marginTop: 14, paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: '#8E7DA8', fontWeight: 600, marginBottom: 8 }}>Als nächstes</p>
            {upcoming.map(d => (
              <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#7C5CBF',
                  background: 'rgba(124,92,191,0.10)', borderRadius: 8,
                  padding: '3px 8px', minWidth: 24, textAlign: 'center',
                }}>{DAY_SHORT[d.dayOfWeek]}</span>
                <span style={{ fontSize: 13, color: '#2E1F3E', fontWeight: 500 }}>{d.workout.title}</span>
                <span style={{ fontSize: 11, color: '#8E7DA8', marginLeft: 'auto' }}>{d.workout.durationMin} Min</span>
              </div>
            ))}
          </div>
        )
      })()}
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
      <h3 style={{ marginBottom: 14 }}>Wie geht es dir heute?</h3>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => handleMood(m.id)}
            style={{
              flex: 1, padding: '12px 4px',
              borderRadius: 18,
              border: '1.5px solid',
              borderColor: currentMood === m.id ? '#7C5CBF' : '#E2D9F3',
              background: currentMood === m.id
                ? 'linear-gradient(135deg, rgba(124,92,191,0.12) 0%, rgba(180,159,224,0.06) 100%)'
                : 'white',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.2s',
              boxShadow: currentMood === m.id ? '0 4px 14px rgba(124,92,191,0.2)' : 'none',
            }}
          >
            <m.Char size={30} />
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: currentMood === m.id ? '#7C5CBF' : '#8E7DA8',
            }}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function HomeTab({ state, updateState, startWorkout, setShowReadiness }) {
  const { profile, currentPhase } = state
  const [selectedWorkout, setSelectedWorkout] = useState(null)

  const dayPP = getDayPostpartum(profile.birthDate)
  const weekPP = getWeekPostpartum(profile.birthDate)
  const todaySymptom = getTodaySymptom(state)
  const phaseColor = getPhaseColor(currentPhase)
  const message = getDayMessage(weekPP, todaySymptom?.mood)

  const defaultWorkouts = useMemo(() => getTodayWorkouts(currentPhase), [currentPhase])
  const todayWorkouts = selectedWorkout ? [selectedWorkout] : defaultWorkouts

  const handleSelectWorkout = (w) => setSelectedWorkout(w)

  return (
    <div className="screen">
      <div className="content">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Hallo, {profile.name} <IconWave size={28} />
            </h1>
            <span className="pill" style={{ background: `${phaseColor}20`, color: phaseColor }}>
              {getPhaseLabel(currentPhase)}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#8E7DA8', marginBottom: 10 }}>Tag {dayPP} postpartal · Woche {weekPP}</p>
          <div style={{
            padding: '12px 16px', borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(124,92,191,0.10) 0%, rgba(180,159,224,0.05) 100%)',
            border: '1px solid rgba(124,92,191,0.15)',
          }}>
            <p style={{ fontSize: 14, color: '#5A4470', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{message}</p>
          </div>
        </div>

        {/* Breastfeeding reminder */}
        {profile.breastfeeding && (
          <div className="card" style={{ background: 'rgba(78,145,113,0.07)', borderColor: 'rgba(78,145,113,0.25)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <IconWater size={22} />
              <div>
                <p style={{ fontSize: 13, color: '#2E5E41', fontWeight: 700, marginBottom: 2 }}>Stillen: +700 ml Wasser täglich</p>
                <p style={{ fontSize: 12, color: '#4E9171' }}>Ca. 330–400 kcal Mehrbedarf beim Training. (GSSI 2025 / EFSA 2010)</p>
              </div>
            </div>
          </div>
        )}

        {/* Week schedule with workout selector */}
        <WeekSchedule
          phase={currentPhase}
          sessions={state.sessions}
          onSelectWorkout={handleSelectWorkout}
          selectedId={selectedWorkout?.id}
        />

        {/* Today's workout */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <h2>Heute</h2>
            {selectedWorkout && (
              <button
                onClick={() => setSelectedWorkout(null)}
                style={{ fontSize: 11, color: '#8E7DA8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >zurücksetzen</button>
            )}
          </div>
          {todayWorkouts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '28px 20px', background: 'rgba(124,92,191,0.05)' }}>
              <div style={{ marginBottom: 10 }}><IconPlant size={40} /></div>
              <h3 style={{ marginBottom: 6, color: '#7C5CBF' }}>Ruhetag</h3>
              <p style={{ fontSize: 13 }}>Heute steht Erholung im Plan. Das ist genauso wichtig.</p>
            </div>
          ) : (
            todayWorkouts.map(w => (
              <WorkoutCard key={w.id} workout={w} onStart={startWorkout} accent={phaseColor} />
            ))
          )}
        </div>

        {/* Mood */}
        <MoodBar state={state} updateState={updateState} />

        {/* Phase 1: Physio reminder */}
        {currentPhase === 1 && (
          <div className="card" style={{ background: 'rgba(124,92,191,0.06)', borderColor: 'rgba(124,92,191,0.2)', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <IconMedical size={24} />
              <div>
                <h3 style={{ marginBottom: 4, color: '#7C5CBF' }}>Beckenbodenphysiotherapie</h3>
                <p style={{ fontSize: 13 }}>Vor Phase 2 unbedingt empfohlen. Eine Befundung ist der wichtigste Schritt für sicheren Wiedereinstieg.</p>
              </div>
            </div>
          </div>
        )}

        {/* Diastasis reminder */}
        {weekPP >= 6 && weekPP <= 12 && currentPhase === 1 && (
          <div className="card" style={{ background: 'rgba(201,112,85,0.07)', borderColor: 'rgba(201,112,85,0.25)', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <IconClipboard size={24} />
              <div>
                <h3 style={{ marginBottom: 4, color: '#C97055' }}>Diastase-Assessment</h3>
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

        <p style={{ fontSize: 11, color: '#C8BFD8', textAlign: 'center', padding: '8px 0 20px' }}>
          Diese App ersetzt keine individuelle Befundung.
        </p>
      </div>
    </div>
  )
}
