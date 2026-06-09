import React, { useState } from 'react'
import { getDayPostpartum, getWeekPostpartum, getPhaseColor, getPhaseLabel, DEFAULT_STATE } from '../store'

function EditRow({ label, value, onSave, type = 'text', inputProps = {} }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(value)

  const save = () => { onSave(input); setEditing(false) }
  const cancel = () => { setInput(value); setEditing(false) }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(155,127,232,0.15)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, color: '#9E8FC0', marginBottom: 2 }}>{label}</p>
        {editing ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <input
              type={type}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 600,
                border: '1.5px solid #9B7FCC', borderRadius: 10,
                padding: '6px 10px', color: '#F0EAFF', background: 'rgba(255,255,255,0.06)',
              }}
              {...inputProps}
            />
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={save}>OK</button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={cancel}>✕</button>
          </div>
        ) : (
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F0EAFF' }}>{value}</p>
        )}
      </div>
      {!editing && (
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 11, marginLeft: 12 }} onClick={() => setEditing(true)}>
          Ändern
        </button>
      )}
    </div>
  )
}

function Toggle({ label, sub, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(155,127,232,0.15)' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#F0EAFF', marginBottom: 2 }}>{label}</p>
        {sub && <p style={{ fontSize: 11 }}>{sub}</p>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 50, height: 28, borderRadius: 14,
          background: value ? color : 'rgba(155,127,232,0.15)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0,
        }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 24 : 3,
          width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s',
        }}/>
      </button>
    </div>
  )
}

export default function ProfileTab({ state, updateState, setShowReadiness }) {
  const { profile, currentPhase, phaseUnlocks, readinessChecks, benchmarks } = state
  const [showReset, setShowReset] = useState(false)

  const dayPP = getDayPostpartum(profile.birthDate)
  const weekPP = getWeekPostpartum(profile.birthDate)
  const phaseColor = getPhaseColor(currentPhase)

  const update = (key, val) => updateState(prev => ({ ...prev, profile: { ...prev.profile, [key]: val } }))

  const formatDate = iso => new Date(iso).toLocaleDateString('de-DE')

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
            <span style={{ fontSize: 12, color: '#9E8FC0' }}>Tag {dayPP} · Woche {weekPP} postpartal</span>
          </div>
        </div>

        {/* Editierbare Felder */}
        <div className="card" style={{ marginBottom: 10 }}>
          <h3 style={{ marginBottom: 4 }}>Angaben</h3>
          <EditRow
            label="Dein Name"
            value={profile.name}
            onSave={val => update('name', val)}
          />
          <EditRow
            label="Geburtsdatum des Kindes"
            value={profile.birthDate}
            type="date"
            onSave={val => val && update('birthDate', val)}
          />
          <EditRow
            label="Kletterziel"
            value={profile.goalGrade}
            onSave={val => val && update('goalGrade', val)}
            inputProps={{ placeholder: 'z.B. 7a' }}
          />
        </div>

        {/* Toggles */}
        <div className="card" style={{ marginBottom: 10 }}>
          <h3 style={{ marginBottom: 4 }}>Einstellungen</h3>
          <Toggle
            label="Stillen"
            sub="Aktiviert Hydrations- und Energiehinweise"
            value={profile.breastfeeding}
            onChange={() => update('breastfeeding', !profile.breastfeeding)}
            color="#5A9E7A"
          />
          {/* Kaiserschnitt nur wenn relevant — verlängert Phase 1 */}
          <Toggle
            label="Kaiserschnitt"
            sub="Verlängert Erholungszeit — beeinflusst Phase-1-Empfehlungen"
            value={profile.deliveryType === 'caesarean'}
            onChange={() => update('deliveryType', profile.deliveryType === 'caesarean' ? 'vaginal' : 'caesarean')}
            color="#D4876A"
          />
          <Toggle
            label="Physio-Freigabe erhalten"
            sub="Pflicht-Gate für Phase 2"
            value={profile.physioCleared}
            onChange={() => update('physioCleared', !profile.physioCleared)}
            color="#9B7FCC"
          />
        </div>

        {/* Phasen-Status */}
        <div className="card" style={{ marginBottom: 10 }}>
          <h3 style={{ marginBottom: 12 }}>Phasen</h3>
          {[
            ['Phase 2 freigeschaltet', phaseUnlocks.phase2 ? formatDate(phaseUnlocks.phase2) : '–'],
            ['Phase 3 freigeschaltet', phaseUnlocks.phase3 ? formatDate(phaseUnlocks.phase3) : '–'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(155,127,232,0.15)' }}>
              <span style={{ fontSize: 13, color: '#9E8FC0' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#F0EAFF' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Readiness checks history */}
        {readinessChecks.length > 0 && (
          <div className="card" style={{ marginBottom: 10 }}>
            <h3 style={{ marginBottom: 12 }}>Readiness-Checks</h3>
            {readinessChecks.slice(-3).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(155,127,232,0.15)' }}>
                <span style={{ fontSize: 13, color: '#9E8FC0' }}>
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
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(155,127,232,0.15)' }}>
                <span style={{ fontSize: 13, color: '#9E8FC0' }}>
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
            style={{ width: '100%', marginBottom: 24, color: '#C4B4A4', borderColor: 'rgba(155,127,232,0.15)' }}
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
