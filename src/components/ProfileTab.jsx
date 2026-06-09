import React, { useState } from 'react'
import { getDayPostpartum, getWeekPostpartum, getPhaseColor, getPhaseLabel, DEFAULT_STATE } from '../store'

export default function ProfileTab({ state, updateState, setShowReadiness }) {
  const { profile, currentPhase, phaseUnlocks, readinessChecks, benchmarks } = state
  const [editName, setEditName] = useState(false)
  const [nameInput, setNameInput] = useState(profile.name)
  const [showReset, setShowReset] = useState(false)

  const dayPP = getDayPostpartum(profile.birthDate)
  const weekPP = getWeekPostpartum(profile.birthDate)
  const phaseColor = getPhaseColor(currentPhase)

  const handleSaveName = () => {
    updateState(prev => ({ ...prev, profile: { ...prev.profile, name: nameInput } }))
    setEditName(false)
  }

  const handleTogglePhysio = () => {
    updateState(prev => ({ ...prev, profile: { ...prev.profile, physioCleared: !prev.profile.physioCleared } }))
  }

  const handleToggleBreastfeeding = () => {
    updateState(prev => ({ ...prev, profile: { ...prev.profile, breastfeeding: !prev.profile.breastfeeding } }))
  }

  const handleReset = () => {
    updateState(() => ({ ...DEFAULT_STATE, profile: { ...DEFAULT_STATE.profile, createdAt: new Date().toISOString() } }))
    setShowReset(false)
  }

  return (
    <div className="screen">
      <div className="content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 6 }}>Profil</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pill" style={{ background: `${phaseColor}20`, color: phaseColor }}>
              {getPhaseLabel(currentPhase)}
            </span>
            <span style={{ fontSize: 12, color: '#A8937F' }}>Tag {dayPP} · Woche {weekPP}</span>
          </div>
        </div>

        {/* Name */}
        <div className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: '#A8937F', marginBottom: 2 }}>Name</p>
              {editName ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    style={{
                      fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 600,
                      border: '1.5px solid #9B7FCC', borderRadius: 10,
                      padding: '6px 10px', color: '#3D2E26', background: 'white',
                    }}
                  />
                  <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={handleSaveName}>OK</button>
                </div>
              ) : (
                <h2>{profile.name}</h2>
              )}
            </div>
            {!editName && (
              <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => setEditName(true)}>
                Ändern
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="card" style={{ marginBottom: 10 }}>
          <h3 style={{ marginBottom: 12 }}>Übersicht</h3>
          {[
            ['Geburtsdatum', new Date(profile.birthDate).toLocaleDateString('de-DE')],
            ['Entbindungsart', profile.deliveryType === 'vaginal' ? 'Vaginal' : 'Kaiserschnitt'],
            ['Ziel-Grad', profile.goalGrade],
            ['Phase 2 freigeschaltet', phaseUnlocks.phase2 ? new Date(phaseUnlocks.phase2).toLocaleDateString('de-DE') : '–'],
            ['Phase 3 freigeschaltet', phaseUnlocks.phase3 ? new Date(phaseUnlocks.phase3).toLocaleDateString('de-DE') : '–'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE0D4' }}>
              <span style={{ fontSize: 13, color: '#A8937F' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#3D2E26' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Toggles */}
        <div className="card" style={{ marginBottom: 10 }}>
          <h3 style={{ marginBottom: 12 }}>Einstellungen</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EBE0D4' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#3D2E26', marginBottom: 2 }}>Stillen</p>
              <p style={{ fontSize: 11 }}>Aktiviert Hydrations- und Energiehinweise</p>
            </div>
            <button
              onClick={handleToggleBreastfeeding}
              style={{
                width: 50, height: 28, borderRadius: 14,
                background: profile.breastfeeding ? '#5A9E7A' : '#EBE0D4',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}>
              <div style={{
                position: 'absolute', top: 3, left: profile.breastfeeding ? 24 : 3,
                width: 22, height: 22, borderRadius: '50%', background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s',
              }}/>
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#3D2E26', marginBottom: 2 }}>Physio-Freigabe erhalten</p>
              <p style={{ fontSize: 11 }}>Pflicht-Gate für Phase 2</p>
            </div>
            <button
              onClick={handleTogglePhysio}
              style={{
                width: 50, height: 28, borderRadius: 14,
                background: profile.physioCleared ? '#9B7FCC' : '#EBE0D4',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}>
              <div style={{
                position: 'absolute', top: 3, left: profile.physioCleared ? 24 : 3,
                width: 22, height: 22, borderRadius: '50%', background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s',
              }}/>
            </button>
          </div>
        </div>

        {/* Readiness checks history */}
        {readinessChecks.length > 0 && (
          <div className="card" style={{ marginBottom: 10 }}>
            <h3 style={{ marginBottom: 12 }}>Readiness-Checks</h3>
            {readinessChecks.slice(-3).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE0D4' }}>
                <span style={{ fontSize: 13, color: '#A8937F' }}>
                  {new Date(c.date).toLocaleDateString('de-DE')} — Phase {c.forPhase}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: c.passed ? '#5A9E7A' : '#D4876A' }}>
                  {Object.values(c.criteria).filter(Boolean).length}/5
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Benchmarks */}
        {benchmarks.length > 0 && (
          <div className="card" style={{ marginBottom: 10 }}>
            <h3 style={{ marginBottom: 12 }}>Benchmarks</h3>
            {benchmarks.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBE0D4' }}>
                <span style={{ fontSize: 13, color: '#A8937F' }}>
                  {new Date(b.date).toLocaleDateString('de-DE')} — {b.metric}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{b.value} {b.unit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="card" style={{ background: 'rgba(168,147,127,0.08)', marginBottom: 16 }}>
          <p style={{ fontSize: 12, lineHeight: 1.6 }}>
            Diese App ersetzt keine individuelle Befundung durch Physiotherapeut:innen oder Ärzt:innen.
            Alle Empfehlungen sind evidenzbasiert, aber nicht personalisiert auf deinen Befund.
          </p>
        </div>

        {/* Reset */}
        {!showReset ? (
          <button
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: 24, color: '#C4B4A4', borderColor: '#EBE0D4' }}
            onClick={() => setShowReset(true)}
          >
            Alle Daten zurücksetzen
          </button>
        ) : (
          <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(212,135,106,0.4)' }}>
            <h3 style={{ marginBottom: 8, color: '#8A4F2E' }}>Wirklich zurücksetzen?</h3>
            <p style={{ marginBottom: 16, fontSize: 13 }}>Alle gespeicherten Daten werden gelöscht.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowReset(false)}>Abbrechen</button>
              <button className="btn" style={{ flex: 1, background: '#D4876A', color: 'white' }} onClick={handleReset}>Zurücksetzen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
