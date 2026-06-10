import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useBtc, isoDay, addDays, TODAY } from './store'
import { FONTS } from './tokens'

// ── Theme context ─────────────────────────────────────────────────────────────
export const ThemeCtx = createContext(null)
export function useUI() { return useContext(ThemeCtx) }

// ── Icon ──────────────────────────────────────────────────────────────────────
const PATHS = {
  check:   'M4 12l5 5 9-10',
  close:   'M5 5l14 14M19 5L5 19',
  lock:    'M8 11V7a4 4 0 118 0v4M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z',
  unlock:  'M8 11V7a4 4 0 017.75-1.8M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z',
  climb:   'M12 3l2 5h5l-4 3 1.5 5L12 13l-4.5 3L9 11 5 8h5L12 3z',
  play:    'M6 4l14 8-14 8V4z',
  pause:   'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
  prev:    'M19 12H5M12 19l-7-7 7-7',
  next:    'M5 12h14M12 5l7 7-7 7',
  chevron: 'M9 18l6-6-6-6',
  arrow:   'M5 12h14M12 5l7 7-7 7',
  swap:    'M4 7h16M4 7l4-4M4 7l4 4M20 17H4M20 17l-4-4M20 17l-4 4',
  info:    'M12 8h.01M12 11v5M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z',
  home:    'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10',
  plan:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4',
  history: 'M12 8v4l3 3M3.05 11a9 9 0 1018 0A9 9 0 003.05 11z',
  profile: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  sound:   'M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14',
  mute:    'M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6',
}

export function Icon({ name, size = 20, color = 'currentColor', stroke = 1.9 }) {
  const d = PATHS[name] || ''
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}>
      <path d={d} />
    </svg>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, pad, soft, style, ...rest }) {
  const { theme, s } = useUI()
  const padding = typeof pad === 'number' ? pad : (pad ?? s(16))
  return (
    <div style={{
      background: soft ? theme.surface2 : theme.surface,
      borderRadius: s(15),
      border: `1px solid ${theme.line}`,
      padding,
      boxShadow: soft ? 'none' : theme.shadow,
      ...style,
    }} {...rest}>
      {children}
    </div>
  )
}

// ── Pill ──────────────────────────────────────────────────────────────────────
export function Pill({ children, tone = 'soft' }) {
  const { theme } = useUI()
  const colors = {
    primary: { bg: theme.primarySoft, color: theme.primaryInk },
    terracotta: { bg: theme.terracottaSoft, color: theme.terracottaInk },
    soft: { bg: theme.surface2, color: theme.inkMute },
  }
  const c = colors[tone] || colors.soft
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: c.bg, color: c.color,
      fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700,
      letterSpacing: '.04em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 999,
    }}>
      {children}
    </span>
  )
}

// ── SectionRule ───────────────────────────────────────────────────────────────
export function SectionRule({ children, action, style }) {
  const { theme } = useUI()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 12, ...style,
    }}>
      <span style={{
        fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700,
        letterSpacing: '.16em', textTransform: 'uppercase',
        color: theme.inkMute, flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: theme.line }} />
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

// ── DataTag ───────────────────────────────────────────────────────────────────
export function DataTag({ children, tone = 'mute', style }) {
  const { theme } = useUI()
  const colorMap = {
    primary:    theme.primaryInk,
    terracotta: theme.terracottaInk,
    mute:       theme.inkMute,
    soft:       theme.inkSoft,
  }
  return (
    <span style={{
      fontFamily: FONTS.mono, fontSize: 10.5, fontWeight: 500,
      letterSpacing: '.04em', color: colorMap[tone] || theme.inkMute,
      ...style,
    }}>
      {children}
    </span>
  )
}

// ── Bar ───────────────────────────────────────────────────────────────────────
export function Bar({ value }) {
  const { theme, s } = useUI()
  return (
    <div style={{ width: '100%', height: s(6), borderRadius: 999, background: theme.surface2, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(0, Math.min(1, value)) * 100}%`,
        height: '100%', background: theme.primary, borderRadius: 999,
        transition: 'width .4s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ on, onChange, tone = 'primary' }) {
  const { theme, s } = useUI()
  const bg = on
    ? (tone === 'terracotta' ? theme.terracotta : theme.primary)
    : theme.surface2
  return (
    <button onClick={() => onChange(!on)} style={{
      width: s(46), height: s(26), borderRadius: 999, border: 'none',
      background: bg, cursor: 'pointer', padding: 3, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background .2s',
    }}>
      <div style={{
        width: s(20), height: s(20), borderRadius: '50%',
        background: on ? theme.onPrimary : theme.inkMute,
        transition: 'background .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  )
}

// ── CircleTimer ───────────────────────────────────────────────────────────────
export function CircleTimer({ size, stroke, progress, color, track, children, smooth }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)))
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: smooth ? 'stroke-dashoffset .3s ease' : 'none' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── useGuidedTimer ────────────────────────────────────────────────────────────
export function useGuidedTimer(steps, opts = {}) {
  const [i, setI] = useState(0)
  const [rem, setRem] = useState(steps[0]?.dur ?? 0)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const remRef = useRef(rem)
  const iRef = useRef(i)
  const optsRef = useRef(opts)
  remRef.current = rem
  iRef.current = i
  optsRef.current = opts

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx))
    setI(clamped)
    setRem(steps[clamped].dur)
    setDone(false)
    iRef.current = clamped
    remRef.current = steps[clamped].dur
  }

  useEffect(() => {
    if (!playing || done) { cancelAnimationFrame(rafRef.current); return }
    const tick = (now) => {
      if (!lastRef.current) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      const next = remRef.current - dt
      if (next <= 0) {
        const nextI = iRef.current + 1
        if (nextI >= steps.length) {
          setRem(0); setPlaying(false); setDone(true)
          optsRef.current.onComplete?.()
        } else {
          optsRef.current.onStepEnd?.(iRef.current)
          goTo(nextI)
          lastRef.current = null
        }
      } else {
        remRef.current = next
        setRem(next)
      }
      if (!done) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, done])

  const toggle = () => {
    if (done) return
    lastRef.current = null
    setPlaying(p => !p)
  }

  const dur = steps[i]?.dur || 1
  return {
    i, n: steps.length,
    rem, progress: 1 - rem / dur,
    remainingFraction: Math.max(0, Math.min(1, rem / dur)),
    elapsed: dur - rem,
    playing, done,
    step: steps[i] || steps[0],
    toggle,
    prev: () => { if (i > 0) { lastRef.current = null; goTo(i - 1) } },
    next: () => { if (i < steps.length - 1) { lastRef.current = null; goTo(i + 1) } },
  }
}

// ── SerieLedger ───────────────────────────────────────────────────────────────
const MILESTONE_META = {
  3:  { title: 'Drei Tage.',          body: 'Du hast angefangen. Das zählt.' },
  7:  { title: 'Eine ganze Woche.',   body: 'Sieben Tage. Jeden einzeln entschieden.' },
  14: { title: 'Zwei Wochen.',        body: 'Eine Gewohnheit braucht Wiederholung. Du hast sie.' },
  21: { title: 'Drei Wochen.',        body: 'Nach drei Wochen sitzt das. Wirklich.' },
  30: { title: 'Ein ganzer Monat.',   body: 'Dreißig Tage am Stück. Du weißt jetzt, was du kannst.' },
  50: { title: 'Fünfzig Tage.',       body: 'Fünfzig Tage. Das ist kein Zufall mehr.' },
}

// Maps the serie onto the evenly spaced milestone rail: the fill line always
// ends exactly between the two milestones the serie currently sits between.
function serieFraction(serie, list) {
  const n = list.length
  if (serie >= list[n - 1]) return 1
  if (serie < list[0]) return 0
  let k = 0
  while (serie >= list[k + 1]) k++
  return (k + (serie - list[k]) / (list[k + 1] - list[k])) / (n - 1)
}

export function SerieLedger({ compact }) {
  const { theme, s } = useUI()
  const b = useBtc()
  const ml = b.milestones

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1px solid ${theme.line}`, borderRadius: s(14),
        padding: `${s(14)}px ${s(16)}px`, background: theme.surface,
        boxShadow: theme.shadow,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: s(6) }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: s(44), fontWeight: 500, color: theme.ink,
              letterSpacing: '-.02em', lineHeight: 1 }}>{b.serie}</span>
            <span style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, color: theme.inkMute }}>
              TAGE</span>
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: s(3) }}>
            {ml.last ? `${ml.last}-Tage-Meilenstein erreicht` : 'Serie im Aufbau'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: s(6), alignItems: 'center' }}>
          {ml.list.slice(0, 5).map(m => {
            const done = b.serie >= m
            return (
              <div key={m} style={{
                width: s(7), height: s(7), borderRadius: '50%',
                background: done ? theme.primary : theme.surface2,
                border: `1.5px solid ${done ? theme.primary : theme.line}`,
                transition: 'background .3s',
              }} />
            )
          })}
        </div>
      </div>
    )
  }

  // Full version
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: s(15),
      padding: s(20), boxShadow: theme.shadow }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: s(10), marginBottom: s(18) }}>
        <span style={{ fontFamily: FONTS.serif, fontSize: s(56), fontWeight: 500, color: theme.ink,
          letterSpacing: '-.02em', lineHeight: .9 }}>{b.serie}</span>
        <div style={{ paddingBottom: s(4) }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 700, color: theme.inkSoft }}>
            TAGE IN FOLGE</div>
          {ml.next && (
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: 2 }}>
              Noch {ml.next - b.serie} bis zum nächsten</div>
          )}
        </div>
      </div>

      <div style={{ padding: `0 ${s(11)}px` }}>
        <div style={{ position: 'relative', height: s(22) }}>
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: 0, right: 0, height: 2, background: theme.surface2 }} />
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: 0, height: 2, width: `${serieFraction(b.serie, ml.list) * 100}%`,
            background: theme.primary,
            transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
          {ml.list.map((m, idx) => {
            const earned = b.serie >= m
            return (
              <div key={m} style={{
                position: 'absolute', top: '50%', left: `${idx / (ml.list.length - 1) * 100}%`,
                transform: 'translate(-50%,-50%)',
                width: s(22), height: s(22), borderRadius: '50%',
                background: earned ? theme.primary : theme.surface,
                border: `2px solid ${earned ? theme.primary : theme.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .3s',
              }}>
                {earned && <Icon name="check" size={11} color={theme.onPrimary} stroke={2.6} />}
              </div>
            )
          })}
        </div>
        <div style={{ position: 'relative', height: s(13), marginTop: s(6) }}>
          {ml.list.map((m, idx) => (
            <span key={m} style={{
              position: 'absolute', left: `${idx / (ml.list.length - 1) * 100}%`,
              transform: 'translateX(-50%)',
              fontFamily: FONTS.mono, fontSize: 9.5, fontWeight: 500,
              color: b.serie >= m ? theme.primary : theme.inkMute,
            }}>{m}</span>
          ))}
        </div>
      </div>

      {ml.last && MILESTONE_META[ml.last] && (
        <div style={{ marginTop: s(16), paddingTop: s(14), borderTop: `1px solid ${theme.line}` }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: s(16), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.01em' }}>{MILESTONE_META[ml.last].title}</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkSoft, marginTop: s(4) }}>
            {MILESTONE_META[ml.last].body}</div>
        </div>
      )}
    </div>
  )
}

// ── MilestoneCelebration ──────────────────────────────────────────────────────
export function MilestoneCelebration({ milestone, serie, onClose }) {
  const { theme, s } = useUI()
  const meta = MILESTONE_META[milestone] || { title: `${milestone} Tage.`, body: 'Weiter so.' }
  const size = s(160)
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: theme.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: s(32),
      backgroundImage: `radial-gradient(circle at 50% 40%, ${theme.primaryTint} 0%, transparent 70%)`,
      animation: 'btcCelebrate .4s ease',
    }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.14em',
        textTransform: 'uppercase', color: theme.primary, marginBottom: s(28) }}>
        Meilenstein erreicht
      </div>

      <div style={{ position: 'relative', width: size, height: size, marginBottom: s(28) }}>
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.primaryRing} strokeWidth={3} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.primary} strokeWidth={3}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={0} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: FONTS.serif, fontSize: s(76), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.03em', lineHeight: 1 }}>
            {milestone}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 280 }}>
        <div style={{ fontFamily: FONTS.serif, fontSize: s(28), fontWeight: 500, color: theme.ink,
          letterSpacing: '-.01em', marginBottom: s(10) }}>
          {meta.title}
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 14, lineHeight: 1.6, color: theme.inkSoft }}>
          {meta.body}
        </div>
      </div>

      <button onClick={onClose} style={{
        marginTop: s(36), border: 'none', cursor: 'pointer',
        background: theme.primary, color: theme.onPrimary,
        borderRadius: s(14), padding: `${s(14)}px ${s(32)}px`,
        fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
        letterSpacing: '.01em',
      }}>
        Weiter
      </button>
    </div>
  )
}

// ── Sheet ─────────────────────────────────────────────────────────────────────
export function Sheet({ children, onClose, align = 'bottom' }) {
  const { theme, s } = useUI()
  const centered = align === 'center'
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,.4)',
      display: 'flex', alignItems: centered ? 'center' : 'flex-end',
      justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget && onClose) onClose() }}>
      <div style={{
        width: '100%', maxWidth: centered ? 420 : '100%',
        background: theme.surface,
        borderRadius: centered ? s(20) : `${s(24)}px ${s(24)}px 0 0`,
        padding: `${s(24)}px ${s(22)}px ${centered ? s(24) : s(32)}px`,
        boxShadow: theme.shadowLg,
        animation: 'btcSheet .25s ease',
        maxHeight: '90%', overflowY: 'auto',
      }}>
        {!centered && (
          <div style={{ width: 36, height: 4, borderRadius: 999, background: theme.line,
            margin: `0 auto ${s(20)}px` }} />
        )}
        {children}
      </div>
    </div>
  )
}

// ── StatusBar ─────────────────────────────────────────────────────────────────
export function StatusBar() {
  const { theme } = useUI()
  const [time, setTime] = useState(() => {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`
  })
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`)
    }, 10000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px 4px',
      fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: theme.inkSoft,
    }}>
      <span>{time}</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* signal bars */}
        {[5,7,9].map((h,i) => (
          <div key={i} style={{ width: 3, height: h, borderRadius: 1.5,
            background: i < 2 ? theme.inkSoft : theme.line }} />
        ))}
        {/* wifi */}
        <svg width={15} height={11} viewBox="0 0 15 11" fill="none" stroke={theme.inkSoft} strokeWidth={1.6} strokeLinecap="round">
          <path d="M1 3.5C3.5 1 6 0 7.5 0S11.5 1 14 3.5" opacity=".4" />
          <path d="M3 6C4.5 4.5 6 3.5 7.5 3.5S10.5 4.5 12 6" opacity=".7" />
          <path d="M5 8.5C6 7.5 6.8 7 7.5 7S9 7.5 10 8.5" />
          <circle cx="7.5" cy="10.5" r="1" fill={theme.inkSoft} stroke="none" />
        </svg>
        {/* battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 20, height: 11, borderRadius: 3, border: `1.5px solid ${theme.inkSoft}`,
            display: 'flex', alignItems: 'center', padding: '1.5px' }}>
            <div style={{ width: '75%', height: '100%', background: theme.inkSoft, borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, borderRadius: '0 1px 1px 0', background: theme.inkSoft }} />
        </div>
      </div>
    </div>
  )
}

// ── ScreenHead ────────────────────────────────────────────────────────────────
export function ScreenHead({ kicker, title }) {
  const { theme, s } = useUI()
  return (
    <div style={{ padding: `${s(12)}px ${s(22)}px ${s(4)}px` }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.06em',
        textTransform: 'uppercase', color: theme.primary, marginBottom: s(6) }}>
        {kicker}
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: s(36), fontWeight: 500, color: theme.ink,
        letterSpacing: '-.03em', lineHeight: 1.05 }}>
        {title}
      </div>
    </div>
  )
}

// ── TabBar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'today',   label: 'Heute',   icon: 'home'    },
  { id: 'plan',    label: 'Plan',    icon: 'plan'    },
  { id: 'history', label: 'Verlauf', icon: 'history' },
  { id: 'climb',   label: 'Klettern',icon: 'climb'   },
  { id: 'profile', label: 'Profil',  icon: 'profile' },
]

export function TabBar({ tab, onTab, climbingUnlocked }) {
  const { theme, s } = useUI()
  return (
    <div style={{
      display: 'flex', borderTop: `1px solid ${theme.line}`,
      background: theme.surface,
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>
      {TABS.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            flex: 1, border: 'none', background: 'none', cursor: 'pointer',
            padding: `${s(8)}px 0 ${s(10)}px`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(4),
          }}>
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} size={22}
                color={active ? theme.primary : theme.inkMute}
                stroke={active ? 2 : 1.7} />
              {t.id === 'climb' && !climbingUnlocked && (
                <div style={{
                  position: 'absolute', top: -2, right: -3,
                  width: 8, height: 8, borderRadius: '50%',
                  background: theme.terracotta,
                  border: `1.5px solid ${theme.surface}`,
                }} />
              )}
            </div>
            <span style={{
              fontFamily: FONTS.sans, fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? theme.primary : theme.inkMute,
              letterSpacing: '.01em',
            }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
