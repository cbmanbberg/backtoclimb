import React from 'react'
import { getWeekPostpartum } from '../store'
import { WORKOUTS } from '../workouts'
import { IconSeedling, IconClimb, IconHand, IconWarning } from './Characters'

function LockedState({ weekPP, phase }) {
  const weeksLeft = phase === 1 ? Math.max(0, 24 - weekPP) : 0
  return (
    <div className="screen">
      <div className="content" style={{ textAlign: 'center' }}>
        <div style={{ marginTop: 40, marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}><IconSeedling size={72} /></div>
          <h1 style={{ marginBottom: 12 }}>Klettern folgt</h1>
          <p style={{ maxWidth: 300, margin: '0 auto', lineHeight: 1.7 }}>
            Klettertraining ist ab Phase 3 (ca. Monat 6) vorgesehen — wenn Beckenboden
            und Sehnen stabil sind.
          </p>
        </div>

        <div className="card" style={{ background: 'rgba(90,158,122,0.06)', border: '1px solid rgba(90,158,122,0.2)', textAlign: 'left', marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8, color: '#3D7A55' }}>Warum dieser Zeitplan?</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>
            Relaxin bleibt 12+ Wochen postpartal erhöht — bei Stillen noch länger.
            Das Hormon erhöht die Gelenk- und Sehnenlaxität, besonders in Fingern, Handgelenken
            und ISG. Frühes Fingertendon-Training erhöht das Verletzungsrisiko deutlich.
          </p>
          <p style={{ fontSize: 11, color: '#9E8FC0', marginTop: 8 }}>
            Yalçınkaya et al. 2025; Herman & Wallace — Becken-Rehabilitation
          </p>
        </div>

        <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Phasen-Timeline</h3>
          {[
            { phase: 'Phase 1', time: 'Woche 0–12', desc: 'Beckenboden, Atmung, Mobilität, Gehen', color: '#9B7FCC', active: phase === 1 },
            { phase: 'Phase 2', time: 'Woche 12–24', desc: 'Kraft, Low-Impact-Cardio, Sehnen-Einführung', color: '#5A9E7A', active: phase === 2 },
            { phase: 'Phase 3', time: 'Monat 6–12', desc: 'Fingerboard, Boulder-Technik, HIIT', color: '#D4876A', active: phase === 3 },
          ].map(item => (
            <div key={item.phase} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '10px 0',
              borderBottom: '1px solid rgba(155,127,232,0.15)',
              opacity: item.active || phase < ['Phase 1','Phase 2','Phase 3'].indexOf(item.phase) + 1 ? 1 : 0.5,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: item.active ? item.color : 'rgba(155,127,232,0.15)', marginTop: 4,
              }}/>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.phase}</span>
                  <span style={{ fontSize: 11, color: '#9E8FC0' }}>{item.time}</span>
                  {item.active && <span className="pill" style={{ background: `${item.color}20`, color: item.color, fontSize: 10, padding: '2px 8px' }}>Aktuell</span>}
                </div>
                <p style={{ fontSize: 12 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {phase === 2 && (
          <div className="card" style={{ background: 'rgba(155,127,204,0.06)', textAlign: 'left', marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>In Phase 2 verfügbar</h3>
            <p style={{ fontSize: 13 }}>Sehnen-Einführung (Open-Hand, kein Crimp) ist bereits in Phase 2 unter Kraft-Training zugänglich.</p>
          </div>
        )}

        <p style={{ fontSize: 11, color: '#C4B4A4', paddingBottom: 20 }}>
          Diese App ersetzt keine individuelle Befundung.
        </p>
      </div>
    </div>
  )
}

function ClimbCard({ workout, onStart }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(212,135,106,0.15), rgba(212,135,106,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {workout.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 2 }}>{workout.title}</h3>
          <p style={{ fontSize: 12, marginBottom: 4 }}>{workout.subtitle}</p>
          <span style={{ fontSize: 11, color: '#9E8FC0' }}>{workout.durationMin} Min</span>
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#9E8FC0', marginBottom: 14, fontStyle: 'italic' }}>
        {workout.reference}
      </p>
      <button className="btn btn-primary" style={{ width: '100%', background: '#D4876A', boxShadow: '0 4px 16px rgba(212,135,106,0.3)' }}
        onClick={() => onStart(workout)}>
        Einheit starten
      </button>
    </div>
  )
}

export default function ClimbTab({ state, startWorkout }) {
  const { currentPhase, profile } = state
  const weekPP = getWeekPostpartum(profile.birthDate)

  if (currentPhase < 3) {
    return <LockedState weekPP={weekPP} phase={currentPhase} />
  }

  const climbWorkouts = WORKOUTS.phase3

  return (
    <div className="screen">
      <div className="content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>Klettern <IconClimb size={28} /></h1>
          <p>Phase 3 — evidenzbasierter Wiedereinstieg</p>
        </div>

        {/* Pelvic floor warning */}
        <div className="card" style={{ background: 'rgba(212,135,106,0.08)', border: '1px solid rgba(212,135,106,0.25)', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <IconWarning size={22} />
            <div>
              <h3 style={{ marginBottom: 4, color: '#8A4F2E', fontSize: 14 }}>Beckenboden-Check vor jeder Einheit</h3>
              <p style={{ fontSize: 12 }}>Bei Druck, Schweregefühl oder Auslaufen: Intensität reduzieren oder pausieren.</p>
            </div>
          </div>
        </div>

        {/* Crimp note */}
        <div className="card" style={{ background: 'rgba(155,127,204,0.06)', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <IconHand size={22} />
            <div>
              <h3 style={{ marginBottom: 4, fontSize: 14 }}>Crimp frühestens Monat 8–9</h3>
              <p style={{ fontSize: 12 }}>Open-Hand bis dahin. Gilmore et al. 2024; Relaxin-Laxität normalisiert sich individuell.</p>
            </div>
          </div>
        </div>

        {/* Climb workouts */}
        {climbWorkouts.map(w => (
          <ClimbCard key={w.id} workout={w} onStart={startWorkout} />
        ))}

        <p style={{ fontSize: 11, color: '#C4B4A4', textAlign: 'center', padding: '8px 0 20px' }}>
          Diese App ersetzt keine individuelle Befundung.
        </p>
      </div>
    </div>
  )
}
