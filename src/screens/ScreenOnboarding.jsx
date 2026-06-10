import { useState } from 'react'
import { useBtc, PHASES, isoDay, addDays, TODAY } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon } from '../ui'

export default function ScreenOnboarding() {
  const { theme, s } = useUI()
  const b = useBtc()

  const defaultDate = isoDay(addDays(TODAY, -42))
  const [childBirth, setChildBirth] = useState(defaultDate)
  const [name, setName] = useState('')

  const canStart = !!childBirth

  const inputStyle = {
    display: 'block',
    border: `1.5px solid ${theme.line}`,
    borderRadius: s(10),
    background: theme.surface,
    fontFamily: FONTS.sans,
    fontSize: 15, fontWeight: 600,
    color: theme.ink,
    padding: `${s(12)}px ${s(14)}px`,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    height: s(46),
    outline: 'none',
    colorScheme: theme.dark ? 'dark' : 'light',
    boxSizing: 'border-box',
    // date inputs in WebKit keep an intrinsic width unless appearance is reset
    WebkitAppearance: 'none',
    appearance: 'none',
    margin: 0,
    textAlign: 'left',
  }

  const phaseColors = [theme.primary, theme.gold, theme.terracotta]

  return (
    <div className="btc-scroll" style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: '100dvh',
      padding: `${s(48)}px ${s(24)}px ${s(40)}px` }}>

      {/* Header */}
      <div style={{ marginBottom: s(36) }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: theme.primary, marginBottom: s(12) }}>
          Back to Climb
        </div>
        <div style={{ fontFamily: FONTS.serif, fontSize: s(40), fontWeight: 500,
          color: theme.ink, letterSpacing: '-.03em', lineHeight: 1.05,
          marginBottom: s(14) }}>
          Zurück an die Wand.
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 14.5, lineHeight: 1.65,
          color: theme.inkSoft }}>
          Dein Weg zurück an den Fels. Strukturiert, durchdacht, in deinem Tempo.
        </div>
      </div>

      {/* Phases */}
      <div style={{ marginBottom: s(36) }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, fontWeight: 500,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: theme.inkMute, marginBottom: s(14) }}>
          Das Programm · 3 Phasen
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(10) }}>
          {PHASES.map((p, i) => (
            <div key={p.n} style={{
              background: theme.surface,
              border: `1px solid ${theme.line}`,
              borderRadius: s(14),
              padding: `${s(14)}px ${s(16)}px`,
              display: 'flex', gap: s(14), alignItems: 'flex-start',
            }}>
              <div style={{
                width: s(32), height: s(32), borderRadius: '50%', flexShrink: 0,
                background: theme.primaryTint,
                border: `1.5px solid ${theme.primaryRing}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.serif, fontSize: s(16), fontWeight: 500,
                color: theme.primary,
              }}>
                {p.n}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: s(8),
                  marginBottom: s(4) }}>
                  <span style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
                    color: theme.ink }}>{p.name}</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 500,
                    color: theme.inkMute, letterSpacing: '.04em' }}>{p.weeks}</span>
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.5,
                  color: theme.inkSoft }}>{p.blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div style={{ marginBottom: s(28) }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, fontWeight: 500,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: theme.inkMute, marginBottom: s(14) }}>
          Deine Angaben
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 600,
              color: theme.inkSoft, marginBottom: s(7) }}>
              Geburt deines Kindes
            </div>
            <input
              type="date"
              value={childBirth}
              onChange={e => setChildBirth(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 600,
              color: theme.inkSoft, marginBottom: s(7) }}>
              Dein Name <span style={{ fontWeight: 400, color: theme.inkMute }}>(optional)</span>
            </div>
            <input
              type="text"
              placeholder="z.B. Anna"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputStyle, '::placeholder': { color: theme.inkMute } }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => b.actions.startProgram(childBirth, name)}
        disabled={!canStart}
        style={{
          width: '100%', border: 'none', cursor: canStart ? 'pointer' : 'not-allowed',
          background: canStart ? theme.primary : theme.surface2,
          color: canStart ? theme.onPrimary : theme.inkMute,
          borderRadius: s(14), padding: `${s(16)}px 0`,
          fontFamily: FONTS.sans, fontSize: 16, fontWeight: 700,
          letterSpacing: '.01em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(10),
          transition: 'background .2s',
        }}
      >
        <Icon name="play" size={17} color={canStart ? theme.onPrimary : theme.inkMute} />
        Programm starten
      </button>

      <div style={{ height: s(16) }} />
    </div>
  )
}
