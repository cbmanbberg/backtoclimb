import { useBtc, MOODS, MICRO_SESSION, TODAY, addDays, isoDay, weekdayLetter } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon, SectionRule, DataTag, SerieLedger, Card } from '../ui'

export default function ScreenToday({ onStart, onGoPlan, onGoClimb }) {
  const { theme, s } = useUI()
  const b = useBtc()

  // only surface "next up" when there is something actionable
  const nextUp = b.phase === 3
    ? { title: 'Klettern ist offen', sub: 'Wähl deine Einheit im Klettern-Tab', go: onGoClimb }
    : b.phase === 2
    ? { title: b.canAdvance ? 'Phase 3 wartet auf dich' : 'Readiness-Check',
        sub: b.canAdvance ? 'Alle Kriterien erfüllt. Bereit für Phase 3.'
          : `${b.readiness.filter(Boolean).length}/5 Kriterien für Phase 3 erfüllt`, go: onGoPlan }
    : b.canAdvance
    ? { title: 'Phase 2 wartet auf dich', sub: 'Kriterien erfüllt. Los geht Phase 2.', go: onGoPlan }
    : null

  const days = Array.from({ length: 7 }, (_, k) => {
    const date = addDays(TODAY, -(6 - k))
    const iso = isoDay(date)
    const sess = b.sessions.find(x => x.date === iso)
    const rest = b.rests.includes(iso)
    const walk = b.walks.includes(iso)
    const isToday = iso === isoDay(TODAY)
    return { date, iso, done: !!sess, rest, walk, symptom: sess?.symptom, isToday }
  })

  const w = b.workout
  const optional = b.restDay
  const todayLong = TODAY.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ padding: `0 0 ${s(8)}px` }}>
      {/* masthead */}
      <div style={{ padding: `${s(8)}px ${s(22)}px ${s(20)}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: s(18) }}>
          <DataTag tone="mute">{todayLong}</DataTag>
          <DataTag tone="primary">W{String(b.programWeek).padStart(2,'0')} · PH{b.phase}</DataTag>
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.04em',
          textTransform: 'uppercase', color: theme.inkMute, marginBottom: s(12) }}>
          Guten Morgen, {b.profile.name}
        </div>
        <div style={{ fontFamily: FONTS.serif, fontSize: s(44), fontWeight: 500, color: theme.ink,
          letterSpacing: '-.035em', lineHeight: .94 }}>
          Woche {b.programWeek}.<br />
          <span style={{ fontStyle: 'italic', color: theme.primary }}>Bleib dran.</span>
        </div>
      </div>

      {/* mood register */}
      <div style={{ padding: `0 ${s(22)}px` }}>
        <SectionRule index={1}>Wie fühlst du dich</SectionRule>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          border: `1px solid ${theme.line}`, borderRadius: s(13), overflow: 'hidden' }}>
          {MOODS.map((m, i) => {
            const on = b.mood === m.id
            return (
              <button key={m.id} onClick={() => b.actions.setMood(m.id)} style={{
                border: 'none', borderLeft: i ? `1px solid ${theme.line}` : 'none',
                cursor: 'pointer',
                background: on ? theme.primary : theme.surface,
                padding: `${s(15)}px 0`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s',
              }}>
                <span style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: on ? 700 : 600,
                  color: on ? theme.onPrimary : theme.inkSoft }}>
                  {m.label}
                </span>
              </button>
            )
          })}
        </div>
        {b.moodObj?.note && (
          <div style={{ marginTop: s(11), display: 'flex', gap: s(11), alignItems: 'flex-start',
            paddingLeft: s(2) }}>
            <span style={{ marginTop: s(5), width: s(18), height: 1, flexShrink: 0,
              background: optional ? theme.terracotta : theme.primary }} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.5,
              color: theme.inkSoft }}>{b.moodObj.note}</div>
          </div>
        )}
        {b.symptomBlock && (
          <div style={{ display: 'flex', gap: s(10), alignItems: 'flex-start', marginTop: s(12),
            background: theme.terracottaSoft, borderRadius: s(13), padding: `${s(12)}px ${s(13)}px` }}>
            <Icon name="info" size={18} color={theme.terracotta} stroke={2} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.45, color: theme.terracottaInk }}>
              Zweimal deutliche Symptome diese Woche. Kürzer treten ist jetzt genau das Richtige.
            </div>
          </div>
        )}
      </div>

      {/* today's session — primary action, right after mood */}
      <div style={{ padding: `${s(24)}px ${s(22)}px 0` }}>
        <SectionRule index={2}
          action={
            <button onClick={b.actions.swapWorkout} style={{
              display: 'inline-flex', alignItems: 'center', gap: s(5),
              border: 'none', background: 'none', cursor: 'pointer', padding: 0,
              color: theme.primary, fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700,
              letterSpacing: '.04em',
            }}>
              <Icon name="swap" size={14} color={theme.primary} stroke={2} />
              TAUSCHEN
            </button>
          }>
          {optional ? 'Heute · optional' : 'Heutige Einheit'}
        </SectionRule>
        <div style={{ border: `1px solid ${theme.line}`, borderRadius: s(15), overflow: 'hidden',
          background: theme.surface, boxShadow: theme.shadow }}>
          <div style={{ padding: s(20), paddingBottom: s(18) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: s(10), marginBottom: s(13) }}>
              <DataTag tone={w.light ? 'terracotta' : 'primary'}>{w.kind.toUpperCase()}</DataTag>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: theme.inkMute }} />
              <DataTag tone="mute">{w.dur.replace('~','')}</DataTag>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: theme.inkMute }} />
              <DataTag tone="mute">{String(w.steps.length).padStart(2,'0')} ÜBUNGEN</DataTag>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(28), fontWeight: 500, color: theme.ink,
              letterSpacing: '-.02em', lineHeight: 1.05 }}>{w.name}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkMute, marginTop: s(7) }}>
              {w.focus}
            </div>
          </div>
          <button onClick={() => onStart(w)} style={{
            width: '100%', border: 'none', borderTop: `1px solid ${theme.line}`,
            cursor: 'pointer', background: theme.primary, color: theme.onPrimary,
            padding: `${s(16)}px 0`, fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
            letterSpacing: '.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(9),
          }}>
            <Icon name="play" size={16} color={theme.onPrimary} />
            {optional ? 'Trotzdem starten' : 'Session starten'}
          </button>
        </div>
        {/* weekly sessions progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: s(10), marginTop: s(11), paddingLeft: s(2) }}>
          <div style={{ display: 'flex', gap: s(5) }}>
            {Array.from({ length: b.recPerWeek }, (_, i) => (
              <div key={i} style={{
                width: s(16), height: s(5), borderRadius: 999,
                background: i < b.sessionsThisWeek ? theme.primary : theme.surface2,
              }} />
            ))}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute }}>
            {b.sessionsThisWeek}/{b.recPerWeek} Einheiten diese Woche
          </div>
        </div>

        {/* micro + walk, side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(10), marginTop: s(12) }}>
          <button onClick={() => onStart(MICRO_SESSION)} style={{
            border: `1px solid ${theme.line}`, borderRadius: s(13), background: theme.surface,
            cursor: 'pointer', padding: `${s(13)}px ${s(14)}px`, textAlign: 'left',
            display: 'flex', flexDirection: 'column', gap: s(4),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: s(7) }}>
              <Icon name="play" size={12} color={theme.primary} />
              <DataTag tone="mute">3 MIN</DataTag>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.ink }}>
              Beckenboden-Check
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: theme.inkMute }}>
              2–3× täglich · auch beim Stillen
            </div>
          </button>
          <button onClick={b.actions.toggleWalk} style={{
            border: `1px solid ${b.walkToday ? theme.primary : theme.line}`, borderRadius: s(13),
            background: b.walkToday ? theme.primaryTint : theme.surface,
            cursor: 'pointer', padding: `${s(13)}px ${s(14)}px`, textAlign: 'left',
            display: 'flex', flexDirection: 'column', gap: s(4), transition: 'all .15s',
          }}>
            <div style={{
              width: s(18), height: s(18), borderRadius: '50%',
              background: b.walkToday ? theme.primary : theme.surface2,
              border: `1.5px solid ${b.walkToday ? theme.primary : theme.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}>
              {b.walkToday && <Icon name="check" size={11} color={theme.onPrimary} stroke={2.6} />}
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700,
              color: b.walkToday ? theme.primary : theme.ink }}>
              Spaziergang
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: theme.inkMute }}>
              {b.walkToday ? 'Erledigt · zählt zur Serie'
                : b.phase === 1 ? 'So lange er gut tut' : '20–30 Min · zählt zur Serie'}
            </div>
          </button>
        </div>

        {b.profile.breastfeeding && b.phase >= 2 && (
          <div style={{ display: 'flex', gap: s(9), alignItems: 'flex-start', marginTop: s(10),
            paddingLeft: s(2) }}>
            <span style={{ marginTop: s(5), width: s(14), height: 1, flexShrink: 0,
              background: theme.gold }} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 1.5,
              color: theme.inkMute }}>
              Relaxin durch Stillen: Finger, Handgelenke und Schultern heute etwas schonen.
            </div>
          </div>
        )}
      </div>

      {/* week register + serie, one section */}
      <div style={{ padding: `${s(24)}px ${s(22)}px 0` }}>
        <SectionRule index={3} action={<DataTag tone="mute">7 TAGE</DataTag>}>Woche & Serie</SectionRule>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {days.map((d, i) => {
            const sevCol = d.symptom === 'deutlich' ? theme.terracotta
              : d.symptom === 'leicht' ? theme.gold : theme.primary
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(8) }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 500,
                  color: d.isToday ? theme.primary : theme.inkMute }}>
                  {weekdayLetter(d.date)}
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: d.done ? sevCol : 'transparent',
                  border: d.isToday
                    ? `2px solid ${theme.primary}`
                    : d.done ? 'none'
                    : `1.5px solid ${d.rest ? theme.lineStrong : theme.line}`,
                }}>
                  {d.done && <Icon name="check" size={15} color={theme.onPrimary} stroke={2.6} />}
                  {!d.done && d.rest && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', border: `1.5px solid ${theme.inkMute}` }} />
                  )}
                  {!d.done && !d.rest && d.walk && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.primarySoft,
                      border: `1.5px solid ${theme.primary}` }} />
                  )}
                  {d.isToday && !d.done && !d.rest && !d.walk && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary }} />
                  )}
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.inkMute }}>
                  {d.date.getDate()}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: s(16) }}>
          <SerieLedger compact />
        </div>
      </div>

      {/* up next — only when something is actionable */}
      {nextUp && (
        <div style={{ padding: `${s(22)}px ${s(22)}px 0` }}>
          <SectionRule index={4}>Als nächstes</SectionRule>
          <button onClick={nextUp.go} style={{
            display: 'flex', alignItems: 'center', gap: s(14), padding: `${s(4)}px ${s(2)}px`,
            width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <DataTag tone="mute" style={{ fontSize: 13 }}>→</DataTag>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700, color: theme.ink }}>
                {nextUp.title}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkMute, marginTop: 2 }}>
                {nextUp.sub}
              </div>
            </div>
            <Icon name="chevron" size={17} color={theme.inkMute} />
          </button>
        </div>
      )}
    </div>
  )
}
