import React from 'react'
import { getWeekPostpartum, getPhaseColor } from '../store'
import { WORKOUTS } from '../workouts'

const PHASE_INFO = {
  1: {
    title: 'Phase 1 — Regeneration & Beckenboden',
    weeks: 'Woche 0–12',
    color: '#F0C38E',
    goal: 'Beckenboden aktivieren, Körper erholen, Bewegung sanft aufbauen.',
    focus: [
      'Beckenbodenaktivierung täglich',
      '360°-Atemtraining (IAP)',
      'Progressives Gehen ab Woche 2–3',
      'Kein Impact, kein Laufen, kein Springen',
      'Diastase-Check Woche 6–8',
      'Low-Impact-Cardio (Gehen, Schwimmen) ab Woche 6',
    ],
    note: 'Kein Impact vor Woche 12. (Goom, Donnelly & Brockwell 2019)',
  },
  2: {
    title: 'Phase 2 — Kraft & Low-Impact-Cardio',
    weeks: 'Woche 12–24',
    color: '#5A9E7A',
    goal: 'Kraftaufbau, Rumpf, Schultern, erste Sehnen-Arbeit — symptomgeführt.',
    focus: [
      'Progressives Krafttraining (Körpergewicht, Band)',
      'Radfahren, Schwimmen',
      'Rumpfrotation & Schulter-Antagonisten',
      'Finger-Sehnen: Open-Hand nur, kein Crimp',
      'Hüftmobilität',
    ],
    note: 'Einstieg nur nach bestandenem Readiness-Check + Physio-Freigabe.',
  },
  3: {
    title: 'Phase 3 — Kletterperformance',
    weeks: 'Monat 6–12',
    color: '#D4876A',
    goal: 'Rückkehr ans Fels und Board, schrittweise bis 7a/7b.',
    focus: [
      'Fingerboard-Protokolle (Open-Hand, dann Crimp ab Monat 8–9)',
      'Boulder-Technik & Footwork',
      'Zugkette (Klimmzüge)',
      'HIIT nach symptomfreiem Impact-Test',
      'Monatliche Benchmarks',
    ],
    note: 'Crimp frühestens Monat 8–9. (Gilmore et al. 2024)',
  },
}

function PhaseCard({ phaseNum, info, current, unlocked }) {
  const isActive = phaseNum === current
  const isFuture = phaseNum > current

  return (
    <div className="card" style={{
      borderColor: isActive ? info.color : 'rgba(240,195,142,0.15)',
      background: isActive ? `${info.color}08` : 'white',
      opacity: isFuture ? 0.65 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span className="pill" style={{ background: `${info.color}20`, color: info.color }}>
          Phase {phaseNum}
        </span>
        <span style={{ fontSize: 12, color: '#9E8FC0' }}>{info.weeks}</span>
        {isActive && <span className="pill" style={{ background: `${info.color}30`, color: info.color, marginLeft: 'auto' }}>Aktuell</span>}
        {unlocked && !isActive && <span style={{ fontSize: 12, color: '#5A9E7A', marginLeft: 'auto' }}>✓ Abgeschlossen</span>}
      </div>
      <h3 style={{ marginBottom: 6 }}>{info.title.split(' — ')[1]}</h3>
      <p style={{ fontSize: 13, marginBottom: 12 }}>{info.goal}</p>
      <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
        {info.focus.map(f => (
          <li key={f} style={{ fontSize: 12, color: '#5A4E45', marginBottom: 4, lineHeight: 1.5 }}>{f}</li>
        ))}
      </ul>
      <p style={{ fontSize: 11, color: '#9E8FC0', fontStyle: 'italic' }}>{info.note}</p>
    </div>
  )
}

export default function PlanTab({ state, startWorkout, setShowReadiness }) {
  const { currentPhase, profile, phaseUnlocks } = state
  const weekPP = getWeekPostpartum(profile.birthDate)

  return (
    <div className="screen">
      <div className="content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 6 }}>Trainingsplan</h1>
          <p>Evidenzbasiert, symptomgeführt — nie zeitplangesteuert.</p>
          <p style={{ fontSize: 11, color: '#7A6D9A', marginTop: 4 }}>
            Christopher et al. 2024 (BJSM Delphi)
          </p>
        </div>

        {[1, 2, 3].map(p => (
          <PhaseCard
            key={p}
            phaseNum={p}
            info={PHASE_INFO[p]}
            current={currentPhase}
            unlocked={phaseUnlocks[`phase${p}`] !== null && phaseUnlocks[`phase${p}`] !== undefined}
          />
        ))}

        {currentPhase === 1 && weekPP >= 10 && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, marginBottom: 16 }}
            onClick={() => setShowReadiness(true)}
          >
            Readiness-Check Phase 2
          </button>
        )}

        <div className="card" style={{ background: 'rgba(90,158,122,0.06)', border: '1px solid rgba(90,158,122,0.2)' }}>
          <h3 style={{ marginBottom: 8, color: '#3D7A55' }}>Dein Ziel</h3>
          <p style={{ fontSize: 14 }}>7a / 7b Bouldern — in deinem Tempo.</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Fortschritt wird in Funktion gemessen, nicht in Gewicht oder Pace.</p>
        </div>

        <p style={{ fontSize: 11, color: '#7A6D9A', textAlign: 'center', padding: '16px 0 20px' }}>
          Diese App ersetzt keine individuelle Befundung.
        </p>
      </div>
    </div>
  )
}
