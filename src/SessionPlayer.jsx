import { useState, useEffect, useRef } from 'react'
import { FONTS, mix } from './tokens'
import { useUI, Icon, CircleTimer, Sheet, useGuidedTimer } from './ui'
import { setSoundEnabled, primeSound, tickOn, tickOff, stepEndChime } from './sound'

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

export default function SessionPlayer({ workout, onClose, onComplete }) {
  const { theme, s } = useUI()
  const t = useGuidedTimer(workout.steps, {
    onStepEnd: () => stepEndChime(),
    onComplete: () => stepEndChime(),
  })
  const [picked, setPicked] = useState(null)
  const [sound, setSound] = useState(() => {
    try { return localStorage.getItem('anna_sound') !== '0' } catch { return true }
  })

  useEffect(() => {
    setSoundEnabled(sound)
    try { localStorage.setItem('anna_sound', sound ? '1' : '0') } catch {}
  }, [sound])

  // Contraction pacer: derive the current hold / release phase from elapsed time.
  const pulse = t.step?.pulse
  let pulseActive = false, pulsePhase = null, pulseScale = 0, pulseLabel = null
  if (pulse && t.playing && !t.done) {
    pulseActive = true
    const period = pulse.hold + pulse.release
    const tc = t.elapsed % period
    if (tc < pulse.hold) {
      pulsePhase = 'on'
      pulseScale = easeInOut(Math.min(1, tc / pulse.hold))
      pulseLabel = pulse.on || 'Anspannen'
    } else {
      pulsePhase = 'off'
      pulseScale = 1 - easeInOut(Math.min(1, (tc - pulse.hold) / pulse.release))
      pulseLabel = pulse.off || 'Lösen'
    }
  }

  const lastPhaseRef = useRef(null)
  useEffect(() => {
    if (!pulseActive) { lastPhaseRef.current = null; return }
    if (pulsePhase !== lastPhaseRef.current) {
      if (pulsePhase === 'on') tickOn()
      else if (pulsePhase === 'off') tickOff()
      lastPhaseRef.current = pulsePhase
    }
  }, [pulseActive, pulsePhase])

  const cSec = Math.ceil(t.rem)
  const mmss = `${Math.floor(cSec / 60)}:${String(cSec % 60).padStart(2, '0')}`

  const ghostBtn = {
    width: s(54), height: s(54), borderRadius: '50%',
    border: `1.5px solid ${theme.line}`, background: theme.surface,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }

  const log = (sym) => {
    if (sym === 'deutlich') setPicked('deutlich')
    else onComplete(sym)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: theme.bg,
      display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${s(14)}px ${s(20)}px ${s(6)}px` }}>
        <button onClick={onClose} style={{ ...ghostBtn, width: s(40), height: s(40),
          border: 'none', background: theme.surface2 }}>
          <Icon name="close" size={20} color={theme.inkSoft} stroke={2.2} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: theme.inkMute }}>{workout.kind || 'Session'}</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.ink, marginTop: 2 }}>
            {workout.name}
          </div>
        </div>
        <button onClick={() => { primeSound(); setSound(v => !v) }}
          aria-label={sound ? 'Ton aus' : 'Ton an'}
          style={{ ...ghostBtn, width: s(40), height: s(40), border: 'none', background: theme.surface2 }}>
          <Icon name={sound ? 'sound' : 'mute'} size={19}
            color={sound ? theme.inkSoft : theme.inkMute} stroke={2} />
        </button>
      </div>

      {/* step rail */}
      <div style={{ display: 'flex', gap: s(5), padding: `${s(14)}px ${s(22)}px ${s(4)}px` }}>
        {workout.steps.map((_, i) => {
          const fill = i < t.i ? 1 : i === t.i ? (t.done ? 1 : t.progress) : 0
          return (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: theme.surface2,
              overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%`, height: '100%',
                background: theme.primary, borderRadius: 999, transition: 'width .25s linear' }} />
            </div>
          )
        })}
      </div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, color: theme.inkMute,
        textAlign: 'center', padding: `${s(8)}px 0 0` }}>
        Schritt {t.i + 1} von {t.n}
      </div>

      {/* timer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: s(4), minHeight: 0 }}>
        <CircleTimer size={s(236)} stroke={s(13)} progress={t.done ? 0 : t.remainingFraction}
          color={theme.primary} track={theme.primaryRing} smooth={!t.playing}>
          {pulseActive && (
            <div style={{
              position: 'absolute', left: '50%', top: '50%', zIndex: 0,
              width: s(168), height: s(168), borderRadius: '50%',
              background: theme.primary,
              opacity: 0.05 + pulseScale * 0.20,
              transform: `translate(-50%,-50%) scale(${0.6 + pulseScale * 0.4})`,
              pointerEvents: 'none',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex',
            flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(52), fontWeight: 500, color: theme.ink,
              letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {mmss}
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: pulseActive ? 14 : 12.5,
              fontWeight: 700, marginTop: s(6),
              letterSpacing: pulseActive ? '.04em' : 0,
              color: pulseActive
                ? (pulsePhase === 'on' ? theme.primary : theme.inkMute)
                : theme.inkMute }}>
              {pulseActive ? pulseLabel : (t.playing ? 'läuft' : t.done ? 'fertig' : 'pausiert')}
            </div>
          </div>
        </CircleTimer>
      </div>

      {/* cue card */}
      <div style={{ padding: `0 ${s(22)}px` }}>
        <div style={{ background: theme.primaryTint, borderRadius: s(18), padding: s(18),
          borderLeft: `3px solid ${theme.primary}` }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: '.04em',
            textTransform: 'uppercase', color: theme.primary, marginBottom: s(7) }}>
            {t.step.name}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.5, color: theme.ink }}>
            {t.step.cue}
          </div>
        </div>
      </div>

      {/* controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(22),
        padding: `${s(22)}px 0 ${s(28)}px` }}>
        <button onClick={t.prev} style={ghostBtn}>
          <Icon name="prev" size={22} color={theme.inkSoft} />
        </button>
        <button onClick={() => { primeSound(); t.toggle() }} style={{
          width: s(78), height: s(78), borderRadius: '50%', border: 'none',
          background: theme.primary, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: theme.shadowLg, paddingLeft: t.playing ? 0 : s(4),
        }}>
          <Icon name={t.playing ? 'pause' : 'play'} size={s(32)} color={theme.onPrimary} />
        </button>
        <button onClick={t.next} style={ghostBtn}>
          <Icon name="next" size={22} color={theme.inkSoft} />
        </button>
      </div>

      {/* completion sheet — simplified for micro-sessions */}
      {t.done && workout.micro && (
        <Sheet onClose={() => {}} align="center">
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: s(48), height: s(48), borderRadius: '50%', margin: '0 auto',
              background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={26} color={theme.primary} stroke={2.4} />
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(22), fontWeight: 500, color: theme.ink,
              marginTop: s(12), letterSpacing: '-.01em' }}>Gut gemacht.</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, marginTop: s(6),
              lineHeight: 1.5 }}>
              2–3 Checks täglich stärken den Beckenboden nachhaltig. Beim nächsten Stillen einfach wieder.
            </div>
          </div>
          <button onClick={() => onComplete('micro')} style={{
            marginTop: s(20), width: '100%', border: 'none', cursor: 'pointer',
            background: theme.primary, color: theme.onPrimary, borderRadius: s(13),
            padding: `${s(14)}px 0`, fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700,
          }}>
            Fertig
          </button>
        </Sheet>
      )}

      {/* symptom log — full sessions only */}
      {t.done && !workout.micro && (
        <Sheet onClose={() => {}} align="center">
          <div style={{ textAlign: 'center', marginBottom: s(6) }}>
            <div style={{ width: s(48), height: s(48), borderRadius: '50%', margin: '0 auto',
              background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={26} color={theme.primary} stroke={2.4} />
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(22), fontWeight: 500, color: theme.ink,
              marginTop: s(12), letterSpacing: '-.01em' }}>Geschafft.</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, marginTop: s(6) }}>
              Wie hat sich das angefühlt?
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(9), marginTop: s(16) }}>
            {[
              ['keine',    'Keine Symptome', theme.primary],
              ['leicht',   'Leichter Druck', theme.gold],
              ['deutlich', 'Deutlich',        theme.terracotta],
            ].map(([id, label, col]) => {
              const on = picked === id
              return (
                <button key={id} onClick={() => log(id)} style={{
                  display: 'flex', alignItems: 'center', gap: s(12),
                  border: `1.5px solid ${on ? col : theme.line}`, cursor: 'pointer',
                  background: on ? mix(col, theme.dark ? 20 : 11, theme.surface) : theme.surface,
                  borderRadius: s(14), padding: `${s(14)}px ${s(16)}px`, textAlign: 'left',
                  transition: 'all .15s',
                }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: col, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700,
                    color: theme.ink }}>{label}</span>
                  <Icon name="chevron" size={16} color={theme.inkMute} />
                </button>
              )
            })}
          </div>
          {picked === 'deutlich' && (
            <>
              <div style={{ display: 'flex', gap: s(10), alignItems: 'flex-start', marginTop: s(13),
                background: theme.terracottaSoft, borderRadius: s(13), padding: `${s(12)}px ${s(13)}px` }}>
                <Icon name="info" size={18} color={theme.terracotta} stroke={2} />
                <div style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.45, color: theme.terracottaInk }}>
                  Danke fürs Ehrlichsein. Sprich kurz mit deiner Physio, bevor du weitermachst. Das ernst nehmen gehört zum Training.
                </div>
              </div>
              <button onClick={() => onComplete('deutlich')} style={{
                marginTop: s(12), width: '100%', border: 'none', cursor: 'pointer',
                background: theme.terracotta, color: theme.onPrimary, borderRadius: s(13),
                padding: `${s(14)}px 0`, fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700,
              }}>
                Alles klar, speichern
              </button>
            </>
          )}
        </Sheet>
      )}

    </div>
  )
}
