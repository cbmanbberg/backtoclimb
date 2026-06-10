import { useBtc, PHASES, READINESS } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon, SectionRule, DataTag, Card, Bar } from '../ui'

export default function ScreenPlan({ onGoProfile }) {
  const { theme, s } = useUI()
  const b = useBtc()
  const phase = PHASES[b.phase - 1]
  const prevPhase = b.phase > 1 ? PHASES[b.phase - 2] : null

  const advanceBlockReason = () => {
    if (b.symptomBlock) return 'Aufstieg pausiert — 2× Deutlich in 7 Tagen'
    if (!b.physioGate) return 'Physio-Freigabe fehlt (Profil → Status)'
    if (!b.readinessMet) return `${b.readiness.filter(Boolean).length}/5 Kriterien erfüllt`
    return null
  }
  const blockReason = advanceBlockReason()

  if (b.phase >= 3) {
    return (
      <div style={{ padding: `${s(4)}px ${s(22)}px ${s(8)}px` }}>
        {/* phase 3 success */}
        <Card pad={s(20)} style={{ textAlign: 'center', marginBottom: s(20) }}>
          <div style={{ width: s(52), height: s(52), borderRadius: '50%', margin: '0 auto',
            background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={26} color={theme.primary} stroke={2.4} />
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: s(22), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.01em', marginTop: s(14) }}>Phase 3 freigeschaltet.</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, marginTop: s(8),
            lineHeight: 1.5 }}>
            Du bist zurück an der Wand. Geh zum Klettern-Tab für deine Einheiten.
          </div>
        </Card>

        <SectionRule index={1}>Phasen-Verlauf</SectionRule>
        <PhasesTimeline phase={b.phase} />
      </div>
    )
  }

  return (
    <div style={{ padding: `${s(4)}px ${s(22)}px ${s(8)}px` }}>
      {/* current phase */}
      <SectionRule index={1} action={<DataTag tone="mute">{phase.weeks}</DataTag>}>
        Aktuelle Phase
      </SectionRule>
      <Card pad={s(20)} style={{ marginBottom: s(20) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: s(10), marginBottom: s(10) }}>
          <span style={{ fontFamily: FONTS.serif, fontSize: s(52), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.02em', lineHeight: .9 }}>{b.phase}</span>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(20), fontWeight: 500, color: theme.ink,
              letterSpacing: '-.01em' }}>{phase.name}</div>
            <div style={{ marginTop: s(4) }}>
              <DataTag tone="primary">{phase.tag.toUpperCase()} · {b.phase}/3</DataTag>
            </div>
          </div>
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.55, color: theme.inkSoft }}>
          {phase.blurb}
        </div>
      </Card>

      {/* readiness gate */}
      <SectionRule index={2}
        action={<DataTag tone="primary">{b.readiness.filter(Boolean).length}/5</DataTag>}>
        Readiness · Tor zu Phase 3
      </SectionRule>
      <Card pad={`${s(2)}px ${s(16)}px`} style={{ marginBottom: s(20) }}>
        {READINESS.map((text, i) => {
          const done = b.readiness[i]
          return (
            <button key={i} onClick={() => b.actions.toggleReadiness(i)} style={{
              display: 'flex', alignItems: 'flex-start', gap: s(14),
              padding: `${s(14)}px 0`,
              borderBottom: i < READINESS.length - 1 ? `1px solid ${theme.line}` : 'none',
              border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
            }}>
              <div style={{
                width: s(20), height: s(20), borderRadius: s(6), flexShrink: 0,
                background: done ? theme.primary : theme.surface2,
                border: `1.5px solid ${done ? theme.primary : theme.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s', marginTop: 1,
              }}>
                {done && <Icon name="check" size={12} color={theme.onPrimary} stroke={2.6} />}
              </div>
              <span style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.5,
                color: done ? theme.inkSoft : theme.ink, fontWeight: done ? 500 : 600,
                textDecoration: done ? 'line-through' : 'none',
                textDecorationColor: theme.line,
              }}>
                {text}
              </span>
            </button>
          )
        })}

        {/* physio gate */}
        <button onClick={onGoProfile} style={{
          display: 'flex', alignItems: 'center', gap: s(12),
          padding: `${s(14)}px 0`,
          borderTop: `1px solid ${theme.line}`,
          border: 'none', background: 'none', cursor: 'pointer', width: '100%',
        }}>
          <Icon name={b.physioGate ? 'unlock' : 'lock'} size={20}
            color={b.physioGate ? theme.primary : theme.terracotta} stroke={1.9} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
              color: b.physioGate ? theme.ink : theme.terracottaInk }}>
              Physio-Freigabe
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: 2 }}>
              {b.physioGate ? 'Erteilt' : 'Hartes Tor — im Profil aktivieren'}
            </div>
          </div>
          <Icon name="chevron" size={16} color={theme.inkMute} />
        </button>

        {/* symptom block warning */}
        {b.symptomBlock && (
          <div style={{
            display: 'flex', gap: s(10), alignItems: 'flex-start',
            background: theme.terracottaSoft, borderRadius: s(12),
            padding: `${s(12)}px ${s(13)}px`, margin: `${s(8)}px 0`,
          }}>
            <Icon name="info" size={18} color={theme.terracotta} stroke={2} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.45, color: theme.terracottaInk }}>
              Aufstieg pausiert — 2× „Deutlich" in den letzten 7 Tagen. Gib deinem Körper Zeit.
            </div>
          </div>
        )}

        {/* bar */}
        <div style={{ padding: `${s(14)}px 0 ${s(4)}px` }}>
          <Bar value={b.readiness.filter(Boolean).length / 5} />
        </div>

        {/* advance button */}
        <button onClick={b.actions.advancePhase} disabled={!!blockReason} style={{
          width: '100%', border: 'none', cursor: blockReason ? 'default' : 'pointer',
          background: blockReason ? theme.surface2 : theme.primary,
          color: blockReason ? theme.inkMute : theme.onPrimary,
          borderRadius: s(13), padding: `${s(14)}px 0`,
          fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700,
          marginTop: s(8), transition: 'all .15s',
        }}>
          {blockReason || 'Phase 3 freischalten'}
        </button>
      </Card>

      {/* phase timeline */}
      <SectionRule index={3}>Phasen-Verlauf</SectionRule>
      <PhasesTimeline phase={b.phase} />
    </div>
  )
}

function PhasesTimeline({ phase }) {
  const { theme, s } = useUI()
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PHASES.map((p, i) => {
        const done = phase > p.n
        const current = phase === p.n
        const locked = phase < p.n
        return (
          <div key={p.n} style={{ display: 'flex', gap: s(16), position: 'relative' }}>
            {/* connector line */}
            {i < PHASES.length - 1 && (
              <div style={{
                position: 'absolute', left: s(14), top: s(26), bottom: -s(6),
                width: 2, background: done ? theme.primary : theme.line,
              }} />
            )}
            {/* dot */}
            <div style={{
              width: s(28), height: s(28), borderRadius: '50%', flexShrink: 0, zIndex: 1,
              background: done ? theme.primary : current ? theme.primarySoft : theme.surface2,
              border: `2px solid ${done ? theme.primary : current ? theme.primary : theme.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: s(2),
            }}>
              {done && <Icon name="check" size={14} color={theme.onPrimary} stroke={2.4} />}
              {current && <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.primary }} />}
              {locked && <Icon name="lock" size={12} color={theme.inkMute} stroke={2} />}
            </div>
            {/* content */}
            <div style={{ flex: 1, paddingBottom: s(22) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(8), marginBottom: s(4) }}>
                <span style={{ fontFamily: FONTS.serif, fontSize: s(17), fontWeight: 500,
                  color: locked ? theme.inkMute : theme.ink }}>
                  Phase {p.n} · {p.name}
                </span>
                {current && (
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 500,
                    letterSpacing: '.06em', color: theme.primary }}>
                    JETZT
                  </span>
                )}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 1.5,
                color: locked ? theme.inkMute : theme.inkSoft }}>
                {p.blurb}
              </div>
              <DataTag tone="mute" style={{ marginTop: s(4), display: 'block' }}>{p.weeks}</DataTag>
            </div>
          </div>
        )
      })}
    </div>
  )
}
