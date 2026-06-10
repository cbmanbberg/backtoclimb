import { useBtc, SYMPTOMS, TODAY, addDays, isoDay, weekdayLetter } from '../store'
import { FONTS } from '../tokens'
import { useUI, SectionRule, DataTag, SerieLedger } from '../ui'

export default function ScreenHistory() {
  const { theme, s } = useUI()
  const b = useBtc()

  const sevColor = (sym) =>
    sym === 'deutlich' ? theme.terracotta : sym === 'leicht' ? theme.gold : theme.primary

  const week = Array.from({ length: 7 }, (_, k) => {
    const date = addDays(TODAY, -(6 - k))
    const sess = b.sessions.find(x => x.date === isoDay(date))
    return { date, sym: sess?.symptom, isToday: isoDay(date) === isoDay(TODAY) }
  })
  const weekCount = week.filter(d => d.sym).length
  const heightFor = (sym) => sym === 'deutlich' ? 1 : sym === 'leicht' ? 0.6 : sym ? 0.3 : 0

  return (
    <div style={{ padding: `${s(2)}px ${s(22)}px ${s(8)}px` }}>
      {/* serie */}
      <SectionRule index={1}>Kontinuität</SectionRule>
      <div style={{ marginBottom: s(24) }}>
        <SerieLedger />
      </div>

      {/* symptom trend */}
      <SectionRule index={2} action={<DataTag tone="mute">{weekCount}/7 AKTIV</DataTag>}>
        Symptom-Trend
      </SectionRule>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        height: s(104), gap: s(8), paddingBottom: s(2),
        borderBottom: `1px solid ${theme.lineStrong}`,
      }}>
        {week.map((d, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: s(8),
          }}>
            <div style={{
              width: '100%', maxWidth: 30,
              height: `${Math.max(heightFor(d.sym) * 100, 2)}%`,
              minHeight: d.sym ? 8 : 2,
              background: d.sym ? sevColor(d.sym) : theme.lineStrong,
              transition: 'height .4s',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{
                fontFamily: FONTS.mono, fontSize: 10,
                fontWeight: d.isToday ? 600 : 400,
                color: d.isToday ? theme.primary : theme.inkMute,
              }}>
                {weekdayLetter(d.date)}
              </span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: theme.inkMute }}>
                {d.date.getDate()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: s(18), marginTop: s(14), marginBottom: s(24) }}>
        {[['keine','Keine'],['leicht','Leicht'],['deutlich','Deutlich']].map(([k, l]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: s(7) }}>
            <div style={{ width: 9, height: 9, background: sevColor(k) }} />
            <DataTag tone="mute">{l.toUpperCase()}</DataTag>
          </div>
        ))}
      </div>

      {/* session ledger */}
      <SectionRule index={3} action={
        <DataTag tone="mute">{String(b.sessions.length).padStart(2,'0')}</DataTag>
      }>
        Sessions
      </SectionRule>
      <div style={{ borderTop: `1px solid ${theme.line}` }}>
        {b.sessions.length === 0 && (
          <div style={{ padding: `${s(24)}px 0`, textAlign: 'center',
            fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkMute }}>
            Noch keine Sessions. Die erste kommt nach deiner ersten Einheit.
          </div>
        )}
        {b.sessions.map((sess, i) => {
          const date = new Date(sess.date + 'T00:00:00')
          const sym = SYMPTOMS[sess.symptom]
          const col = sevColor(sess.symptom)
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: s(15),
              padding: `${s(14)}px 0`, borderBottom: `1px solid ${theme.line}`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: s(34), flexShrink: 0 }}>
                <span style={{ fontFamily: FONTS.serif, fontSize: s(22), fontWeight: 500,
                  color: theme.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {date.getDate()}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 9.5, color: theme.inkMute,
                  marginTop: 3, textTransform: 'uppercase' }}>
                  {date.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')}
                </span>
              </div>
              <div style={{ width: 1, height: s(30), background: theme.line, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700, color: theme.ink,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sess.workout}
                </div>
                <DataTag tone="mute" style={{ marginTop: 3, display: 'block' }}>
                  {date.toLocaleDateString('de-DE', { weekday: 'long' })}
                </DataTag>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: s(7), flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />
                <DataTag style={{ color: col }}>{sym?.short?.toUpperCase()}</DataTag>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
