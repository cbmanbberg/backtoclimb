import { useState, useEffect } from 'react'
import { BtcContext, createBtcStore, isoDay, TODAY } from './store'
import { getTheme, getSpace, FONTS } from './tokens'
import { ThemeCtx, useUI, StatusBar, ScreenHead, TabBar, MilestoneCelebration } from './ui'
import ScreenToday from './screens/ScreenToday'
import ScreenPlan from './screens/ScreenPlan'
import ScreenHistory from './screens/ScreenHistory'
import ScreenClimb from './screens/ScreenClimb'
import ScreenProfile from './screens/ScreenProfile'
import SessionPlayer from './SessionPlayer'

// AppShell: called after ThemeCtx and BtcContext are both available
function AppShell({ onGoHistory }) {
  const { theme, s } = useUI()
  const store = createBtcStore()

  const [tab, setTab] = useState('today')
  const [session, setSession] = useState(null)
  const [toast, setToast] = useState(null)
  const [celebrate, setCelebrate] = useState(null)

  const startSession = (w) => setSession(w)

  const completeSession = (sym) => {
    const todayActive = store.restToday || store.sessions.some(x => x.date === isoDay(TODAY))
    const newSerie = todayActive ? store.serie : store.serie + 1
    const hitsMilestone = !todayActive && store.milestones.list.includes(newSerie)
    store.actions.completeSession(session, sym)
    setSession(null)
    const labels = { keine: 'Keine Symptome', leicht: 'Leichter Druck', deutlich: 'Deutlich' }
    if (hitsMilestone) {
      setCelebrate({ milestone: newSerie, serie: newSerie })
    } else {
      setToast(`Session gespeichert · ${labels[sym]}`)
      setTimeout(() => setToast(null), 2600)
    }
  }

  const HEADERS = {
    plan:    { kicker: 'Dein Weg', title: 'Plan' },
    history: { kicker: 'Rückblick', title: 'Verlauf' },
    climb:   { kicker: store.climbingUnlocked ? 'Phase 3 · offen' : 'Gesperrt', title: 'Klettern' },
    profile: { kicker: 'Konto', title: 'Profil' },
  }

  let screen = null
  if (tab === 'today')        screen = <ScreenToday onStart={startSession} />
  else if (tab === 'plan')    screen = <ScreenPlan onGoProfile={() => setTab('profile')} />
  else if (tab === 'history') screen = <ScreenHistory />
  else if (tab === 'climb')   screen = <ScreenClimb onStart={startSession} onGoPlan={() => setTab('plan')} />
  else if (tab === 'profile') screen = <ScreenProfile />

  return (
    <BtcContext.Provider value={store}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: theme.bg, position: 'relative', overflow: 'hidden',
        maxWidth: 430, margin: '0 auto', minHeight: '100dvh',
      }}>
        <StatusBar />
        <div style={{ flex: 1, position: 'relative', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {HEADERS[tab] && (
            <div style={{ flexShrink: 0, paddingTop: s(4) }}>
              <ScreenHead kicker={HEADERS[tab].kicker} title={HEADERS[tab].title} />
            </div>
          )}
          <div className="btc-scroll" key={tab}
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: s(20) }}>
            {screen}
          </div>
          <TabBar tab={tab} onTab={setTab} climbingUnlocked={store.climbingUnlocked} />

          {toast && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: s(78),
              display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 45 }}>
              <div style={{ background: theme.ink, color: theme.bg, fontFamily: FONTS.sans,
                fontSize: 13, fontWeight: 600, padding: `${s(10)}px ${s(16)}px`, borderRadius: 999,
                boxShadow: theme.shadowLg, animation: 'btcFade .3s ease' }}>
                {toast}
              </div>
            </div>
          )}

          {session && (
            <SessionPlayer workout={session} onClose={() => setSession(null)}
              onComplete={completeSession} />
          )}

          {celebrate && (
            <MilestoneCelebration
              milestone={celebrate.milestone}
              serie={celebrate.serie}
              onClose={() => { setCelebrate(null); setTab('history') }}
            />
          )}
        </div>
      </div>
    </BtcContext.Provider>
  )
}

export default function App() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const theme = getTheme(dark, 'teal')
  const s = getSpace('wohlig')

  useEffect(() => {
    document.body.style.background = theme.page
  }, [theme.page])

  return (
    <ThemeCtx.Provider value={{ theme, s, fonts: FONTS }}>
      <AppShell />
    </ThemeCtx.Provider>
  )
}
