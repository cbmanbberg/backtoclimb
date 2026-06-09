import React, { useState } from 'react'
import { canUnlockPhase2, saveReadinessCheck, unlockPhase } from '../store'
import { IconPlant, IconMedical, IconCheck, MoodNeutral } from './Characters'

const CRITERIA_PHASE2 = [
  {
    id: 'walk30min',
    label: '30 Min. Gehen',
    detail: 'Ohne Symptome: kein Druck, kein Schweregefühl, kein Auslaufen.',
  },
  {
    id: 'singleLegBalance10s',
    label: '10 Sek. Einbeinstand',
    detail: 'Pro Seite. Stabil, ohne Symptome.',
  },
  {
    id: 'singleLegSquat10',
    label: '10 einbeinige Kniebeugen',
    detail: 'Pro Seite. Kontrolliert, ohne Symptome.',
  },
  {
    id: 'forwardBounds10',
    label: '10 Vorwärtssprünge',
    detail: 'Kontrollierte Landung. Kein Beckenbodendruck.',
  },
  {
    id: 'jogInPlace1min',
    label: '1 Min. Joggen auf der Stelle',
    detail: 'Ohne Symptome bis zum Schluss.',
  },
]

export default function ReadinessCheck({ state, updateState, onBack }) {
  const [criteria, setCriteria] = useState({
    walk30min: false,
    singleLegBalance10s: false,
    singleLegSquat10: false,
    forwardBounds10: false,
    jogInPlace1min: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const passedCount = Object.values(criteria).filter(Boolean).length
  const allPassed = passedCount === 5
  const physioClear = state.profile.physioCleared
  const canUnlock = allPassed && physioClear

  const handleToggle = (id) => {
    setCriteria(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = () => {
    const check = {
      date: new Date().toISOString().split('T')[0],
      forPhase: 2,
      passed: allPassed && physioClear,
      criteria,
    }
    updateState(prev => saveReadinessCheck(prev, check))
    setSubmitted(true)
  }

  const handleUnlock = () => {
    updateState(prev => unlockPhase(prev, 2))
    onBack()
  }

  const handleSetPhysioCleared = () => {
    updateState(prev => ({
      ...prev,
      profile: { ...prev.profile, physioCleared: true },
    }))
  }

  if (submitted) {
    return (
      <div className="screen">
        <div className="content" style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            {allPassed && physioClear
              ? <IconPlant size={64} />
              : <MoodNeutral size={64} />}
          </div>
          <h1 style={{ marginBottom: 12 }}>
            {allPassed && physioClear ? 'Bereit für Phase 2!' : `${passedCount} von 5 erreicht`}
          </h1>
          <p style={{ marginBottom: 32, maxWidth: 300, margin: '0 auto 32px' }}>
            {allPassed && physioClear
              ? 'Alle Kriterien erfüllt und Physiotherapie-Freigabe vorhanden.'
              : 'Noch nicht alle Kriterien erfüllt — kein Grund zur Eile. Der Körper gibt das Tempo vor.'}
          </p>
          {canUnlock && (
            <button className="btn btn-green" style={{ width: '100%', marginBottom: 12 }} onClick={handleUnlock}>
              Phase 2 freischalten
            </button>
          )}
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onBack}>
            Zurück
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid rgba(155,127,232,0.15)', background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18,
          }}>←</button>
          <div>
            <h2>Readiness-Check</h2>
            <p style={{ fontSize: 12 }}>Phase 2 — Goom, Donnelly & Brockwell 2019</p>
          </div>
        </div>

        {/* Intro */}
        <div className="card" style={{ background: 'rgba(155,127,204,0.06)', marginBottom: 20 }}>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>
            Alle fünf Tests müssen <strong>symptomfrei</strong> gelingen — kein Druck, kein Schweregefühl,
            kein Auslaufen. Teste erst nach Woche 12 postpartal.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            flex: 1, height: 6, borderRadius: 3,
            background: 'rgba(155,127,232,0.15)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${(passedCount / 5) * 100}%`,
              background: passedCount === 5 ? '#5A9E7A' : '#9B7FCC',
              transition: 'width 0.4s ease',
            }}/>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#9E8FC0', flexShrink: 0 }}>
            {passedCount} / 5
          </span>
        </div>

        {/* Criteria list */}
        {CRITERIA_PHASE2.map(c => {
          const checked = criteria[c.id]
          return (
            <div
              key={c.id}
              className="card"
              onClick={() => handleToggle(c.id)}
              style={{
                cursor: 'pointer',
                borderColor: checked ? '#5A9E7A' : 'rgba(155,127,232,0.15)',
                background: checked ? 'rgba(90,158,122,0.10)' : 'var(--card-bg)',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                transition: 'all 0.2s',
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${checked ? '#5A9E7A' : 'rgba(155,127,232,0.15)'}`,
                background: checked ? '#5A9E7A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'white',
                transition: 'all 0.2s',
              }}>
                {checked ? <IconCheck size={16} /> : ''}
              </div>
              <div>
                <h3 style={{ marginBottom: 4, color: checked ? '#7DD9AA' : 'var(--text)' }}>{c.label}</h3>
                <p style={{ fontSize: 12 }}>{c.detail}</p>
              </div>
            </div>
          )
        })}

        {/* Physio gate */}
        <div className="card" style={{
          background: physioClear ? 'rgba(90,158,122,0.06)' : 'rgba(212,135,106,0.06)',
          border: `1px solid ${physioClear ? 'rgba(90,158,122,0.25)' : 'rgba(212,135,106,0.25)'}`,
          marginTop: 8,
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div>{physioClear ? <IconCheck size={28} /> : <IconMedical size={28} />}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: 4, color: physioClear ? '#3D7A55' : '#8A4F2E' }}>
                Beckenbodenphysiotherapie
              </h3>
              <p style={{ fontSize: 13 }}>
                {physioClear
                  ? 'Physiotherapeutische Freigabe vorhanden.'
                  : 'Pflicht-Gate vor Phase 2. Physiotherapeutin aufsuchen und Befund einholen.'}
              </p>
              {!physioClear && (
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 12, fontSize: 13, padding: '10px 18px' }}
                  onClick={handleSetPhysioCleared}
                >
                  Freigabe erhalten ✓
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        {!allPassed && (
          <p style={{ fontSize: 12, color: '#9E8FC0', textAlign: 'center', margin: '16px 0', fontStyle: 'italic' }}>
            Noch nicht alle Kriterien erreicht — das ist kein Rückstand.
          </p>
        )}

        {/* Save button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          onClick={handleSave}
        >
          Ergebnis speichern
        </button>

        <p style={{ fontSize: 11, color: '#7A6D9A', textAlign: 'center', paddingBottom: 20 }}>
          Goom, Donnelly & Brockwell (2019) — Returning to running postnatal
        </p>
      </div>
    </div>
  )
}
