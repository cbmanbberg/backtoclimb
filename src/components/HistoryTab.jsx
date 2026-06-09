import React, { useMemo } from 'react'
import { getPhaseColor } from '../store'
import { IconBook, IconMoon } from './Characters'

const MOOD_LABELS = { good: 'Gut', medium: 'Mittel', tired: 'Müde', pause: 'Pause' }
const TYPE_LABELS = { pelvic: 'Beckenboden', breath: 'Atmung', strength: 'Kraft', cardio: 'Cardio', mobility: 'Mobilität', climb: 'Klettern' }

export default function HistoryTab({ state }) {
  const { sessions, symptomLog } = state

  const entries = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = { date: s.date, sessions: [], symptom: null }
      map[s.date].sessions.push(s)
    })
    symptomLog.forEach(s => {
      if (!map[s.date]) map[s.date] = { date: s.date, sessions: [], symptom: null }
      map[s.date].symptom = s
    })
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
  }, [sessions, symptomLog])

  if (entries.length === 0) {
    return (
      <div className="screen">
        <div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ marginBottom: 16 }}><IconBook size={56} /></div>
          <h2 style={{ marginBottom: 8 }}>Noch nichts gespeichert</h2>
          <p>Starte deine erste Einheit und sie erscheint hier.</p>
        </div>
      </div>
    )
  }

  const totalDone = sessions.filter(s => s.completed).length
  const totalSkipped = sessions.filter(s => s.skipped).length
  const totalPause = symptomLog.filter(s => s.mood === 'pause').length

  return (
    <div className="screen">
      <div className="content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 6 }}>Verlauf</h1>
          <p>Jede Einheit zählt — auch Ruhe.</p>
        </div>

        {/* Summary */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#9B7FCC' }}>{totalDone}</div>
              <div style={{ fontSize: 11, color: '#A8937F' }}>Abgeschlossen</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#5A9E7A' }}>{totalPause}</div>
              <div style={{ fontSize: 11, color: '#A8937F' }}>Ruhetage</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#D4876A' }}>{totalSkipped}</div>
              <div style={{ fontSize: 11, color: '#A8937F' }}>Übersprungen</div>
            </div>
          </div>
        </div>

        {/* Entries */}
        {entries.map(entry => {
          const d = new Date(entry.date)
          const dateStr = d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
          return (
            <div key={entry.date} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3D2E26' }}>{dateStr}</span>
                {entry.symptom && (
                  <span style={{ fontSize: 12, color: '#A8937F' }}>{MOOD_LABELS[entry.symptom.mood] || entry.symptom.mood}</span>
                )}
              </div>
              {entry.sessions.length === 0 && entry.symptom?.mood === 'pause' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconMoon size={18} />
                  <span style={{ fontSize: 13, color: '#5A9E7A', fontWeight: 500 }}>Ruhetag — Teil des Plans</span>
                </div>
              )}
              {entry.sessions.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #EBE0D4' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: s.completed ? '#9B7FCC' : s.skipped ? '#5A9E7A' : '#EBE0D4',
                  }}/>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: '#3D2E26' }}>{s.title || TYPE_LABELS[s.type] || s.type}</span>
                    {s.durationMin && <span style={{ fontSize: 11, color: '#A8937F', marginLeft: 8 }}>{s.durationMin} Min</span>}
                  </div>
                  <span style={{ fontSize: 11, color: s.skipped ? '#5A9E7A' : '#9B7FCC', fontWeight: 500 }}>
                    {s.skipped ? 'Pause' : s.completed ? 'Fertig' : '–'}
                  </span>
                </div>
              ))}
            </div>
          )
        })}

        <p style={{ fontSize: 11, color: '#C4B4A4', textAlign: 'center', padding: '8px 0 20px' }}>
          Ruhetage und übersprungene Einheiten sind gleichwertige Planteile.
        </p>
      </div>
    </div>
  )
}
