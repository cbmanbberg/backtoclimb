import { useBtc, fmtDate, fmtShort, parseD } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon, SectionRule, Card, Toggle, Bar } from '../ui'

export default function ScreenProfile() {
  const { theme, s } = useUI()
  const b = useBtc()
  const set = (k, v) => b.actions.setProfile(p => ({ ...p, [k]: v }))
  const readyCount = b.readiness.filter(Boolean).length

  const Field = ({ label, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: s(12), padding: `${s(12)}px 0`, borderBottom: `1px solid ${theme.line}` }}>
      <span style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, fontWeight: 600,
        flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  )

  const inputStyle = {
    border: 'none', background: 'none', textAlign: 'right', outline: 'none',
    fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: theme.ink,
    maxWidth: '62%', minWidth: 0, flex: 1, padding: 0,
    colorScheme: theme.dark ? 'dark' : 'light',
  }

  const ToggleRow = ({ label, sub, on, onChange, gate }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: s(12), padding: `${s(13)}px 0`,
      borderBottom: `1px solid ${theme.line}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
          color: gate ? theme.terracottaInk : theme.ink }}>{label}</div>
        {sub && <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: 1 }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange} tone={gate ? 'terracotta' : 'primary'} />
    </div>
  )

  return (
    <div style={{ padding: `${s(4)}px ${s(22)}px ${s(8)}px` }}>
      {/* identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: s(15), marginBottom: s(20) }}>
        <div style={{ width: s(58), height: s(58), borderRadius: '50%', flexShrink: 0,
          background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONTS.serif, fontSize: s(26), fontWeight: 500, color: theme.primaryInk }}>
          {(b.profile.name || '?').trim().charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: FONTS.serif, fontSize: s(24), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.01em' }}>{b.profile.name}</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkMute, marginTop: 2 }}>
            {b.weeksPP} Wochen · {b.monthsPP} {b.monthsPP === 1 ? 'Monat' : 'Monate'} postpartum
          </div>
        </div>
      </div>

      {/* editable */}
      <SectionRule index={1}>Über dich</SectionRule>
      <Card pad={`${s(2)}px ${s(18)}px`} style={{ marginBottom: s(18) }}>
        <Field label="Name">
          <input value={b.profile.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Geburt des Kindes">
          <input type="date" value={b.profile.childBirth} onChange={e => set('childBirth', e.target.value)}
            style={{ ...inputStyle, maxWidth: 150 }} />
        </Field>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: s(12), padding: `${s(12)}px 0` }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, fontWeight: 600,
            flexShrink: 0 }}>Kletterziel</span>
          <input value={b.profile.goal} onChange={e => set('goal', e.target.value)}
            style={{ ...inputStyle, maxWidth: '64%' }} />
        </div>
      </Card>

      {/* toggles */}
      <SectionRule index={2}>Status</SectionRule>
      <Card pad={`${s(2)}px ${s(18)}px`} style={{ marginBottom: s(18) }}>
        <ToggleRow label="Stillen" sub="Beeinflusst Bindegewebe & Belastbarkeit"
          on={b.profile.breastfeeding} onChange={v => set('breastfeeding', v)} />
        <ToggleRow label="Kaiserschnitt" sub="Passt frühe Rumpf-Progression an"
          on={b.profile.cSection} onChange={v => set('cSection', v)} />
        <ToggleRow label="Physio-Freigabe" sub="Hartes Tor für Phase 3" gate
          on={b.profile.physioCleared} onChange={v => set('physioCleared', v)} />
      </Card>

      {/* unlocks */}
      <SectionRule index={3}>Freischaltungen</SectionRule>
      <Card pad={`${s(2)}px ${s(18)}px`} style={{ marginBottom: s(18) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(11), padding: `${s(13)}px 0`,
          borderBottom: `1px solid ${theme.line}` }}>
          <Icon name={b.climbingUnlocked ? 'unlock' : 'lock'} size={19}
            color={b.climbingUnlocked ? theme.primary : theme.inkMute} stroke={2} />
          <span style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 600, color: theme.ink }}>
            Klettern
          </span>
          <span style={{ fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 600,
            color: b.climbingUnlocked ? theme.primary : theme.inkMute }}>
            {b.climbingUnlocked ? 'Offen' : 'ab Phase 3'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(11), padding: `${s(13)}px 0` }}>
          <Icon name={b.crimpUnlocked ? 'unlock' : 'lock'} size={19}
            color={b.crimpUnlocked ? theme.primary : theme.terracotta} stroke={2} />
          <span style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 600, color: theme.ink }}>
            Crimp-Belastung
          </span>
          <span style={{ fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 600, color: theme.inkMute }}>
            {b.crimpUnlocked ? 'Offen' : fmtShort(b.crimpUnlock) + ' ' + b.crimpUnlock.getFullYear()}
          </span>
        </div>
      </Card>

      {/* readiness history */}
      <SectionRule index={4}>Readiness-Historie</SectionRule>
      <Card pad={s(16)} style={{ marginBottom: s(18) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: s(10) }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: theme.inkSoft, fontWeight: 600 }}>
            Kriterien erfüllt
          </span>
          <span style={{ fontFamily: FONTS.serif, fontSize: s(18), color: theme.ink, fontWeight: 500 }}>
            {readyCount} / 5
          </span>
        </div>
        <Bar value={readyCount / 5} />
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: s(11),
          lineHeight: 1.5 }}>
          {b.advancedAt
            ? `Phase 3 freigeschaltet am ${fmtDate(parseD(b.advancedAt))}.`
            : b.symptomBlock
            ? 'Aufstieg pausiert — 2× „Deutlich" in 7 Tagen.'
            : 'Physio-Freigabe ' + (b.physioGate ? 'erteilt' : 'noch offen') + '.'}
        </div>
      </Card>

      {/* reset */}
      <button onClick={b.actions.reset} style={{
        width: '100%', border: `1.5px solid ${theme.line}`,
        background: 'none', cursor: 'pointer', borderRadius: s(13), padding: `${s(13)}px 0`,
        fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700, color: theme.terracottaInk,
      }}>
        Fortschritt zurücksetzen
      </button>
      <div style={{ height: s(8) }} />
    </div>
  )
}
