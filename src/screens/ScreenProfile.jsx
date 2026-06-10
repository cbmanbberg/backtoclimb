import { useState, useRef } from 'react'
import { useBtc, fmtDate, fmtShort, parseD, isoDay, TODAY } from '../store'
import { FONTS, ACCENTS } from '../tokens'
import { useUI, Icon, SectionRule, Card, Toggle, Bar } from '../ui'

const BACKUP_KEYS = ['anna_v1', 'anna_ui_v1']

export default function ScreenProfile() {
  const { theme, s, appearance } = useUI()
  const b = useBtc()
  const set = (k, v) => b.actions.setProfile(p => ({ ...p, [k]: v }))
  const readyCount = b.readiness.filter(Boolean).length
  const [confirmReset, setConfirmReset] = useState(false)
  const [backupMsg, setBackupMsg] = useState(null)
  const fileRef = useRef(null)

  const exportBackup = () => {
    const data = { app: 'backtoclimb', v: 1, exported: new Date().toISOString() }
    for (const k of BACKUP_KEYS) {
      try { data[k] = JSON.parse(localStorage.getItem(k)) } catch { data[k] = null }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backtoclimb-backup-${isoDay(TODAY)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setBackupMsg('Backup heruntergeladen — am besten in der Cloud (z.B. iCloud/Drive) ablegen.')
  }

  const importBackup = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (data?.app !== 'backtoclimb' || !data.anna_v1) throw new Error('invalid')
        for (const k of BACKUP_KEYS) {
          if (data[k]) localStorage.setItem(k, JSON.stringify(data[k]))
        }
        location.reload()
      } catch {
        setBackupMsg('Datei konnte nicht gelesen werden — ist das ein BackToClimb-Backup?')
      }
    }
    reader.readAsText(file)
  }

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

      {/* appearance */}
      <SectionRule>Darstellung</SectionRule>
      <Card pad={`${s(2)}px ${s(18)}px`} style={{ marginBottom: s(18) }}>
        <ToggleRow label="Dunkelmodus" sub="Helles oder dunkles Design"
          on={appearance.dark} onChange={appearance.setDarkMode} />
        <div style={{ padding: `${s(13)}px 0` }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
            color: theme.ink, marginBottom: s(3) }}>Akzentfarbe</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute,
            marginBottom: s(12) }}>
            {ACCENTS[appearance.accent]?.label || 'Lavendel'}
          </div>
          <div style={{ display: 'flex', gap: s(12) }}>
            {Object.entries(ACCENTS).map(([key, a]) => {
              const on = appearance.accent === key
              const col = theme.dark ? a.dark : a.light
              return (
                <button key={key} onClick={() => appearance.setAccent(key)} style={{
                  width: s(34), height: s(34), borderRadius: '50%', cursor: 'pointer',
                  background: col, padding: 0,
                  border: on ? `2.5px solid ${theme.ink}` : `2px solid ${theme.line}`,
                  boxShadow: on ? `inset 0 0 0 2.5px ${theme.surface}` : 'none',
                  transition: 'all .15s',
                }} aria-label={a.label} />
              )
            })}
          </div>
        </div>
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

      {/* backup */}
      <SectionRule>Deine Daten</SectionRule>
      <Card pad={`${s(4)}px ${s(18)}px`} style={{ marginBottom: s(18) }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkSoft,
          lineHeight: 1.55, padding: `${s(12)}px 0` }}>
          Alles wird lokal auf diesem Gerät gespeichert. Lade dir regelmäßig ein Backup
          herunter, damit dein Fortschritt auch bei Gerätewechsel oder Browser-Putzaktionen
          sicher ist.
        </div>
        <div style={{ display: 'flex', gap: s(10), paddingBottom: s(14) }}>
          <button onClick={exportBackup} style={{
            flex: 1, border: 'none', background: theme.primaryTint, cursor: 'pointer',
            borderRadius: s(11), padding: `${s(12)}px 0`,
            fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.primary,
          }}>
            Backup exportieren
          </button>
          <button onClick={() => fileRef.current?.click()} style={{
            flex: 1, border: `1.5px solid ${theme.line}`, background: theme.surface,
            cursor: 'pointer', borderRadius: s(11), padding: `${s(12)}px 0`,
            fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.inkSoft,
          }}>
            Wiederherstellen
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) importBackup(e.target.files[0]); e.target.value = '' }} />
        </div>
        {backupMsg && (
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute,
            lineHeight: 1.5, paddingBottom: s(12) }}>
            {backupMsg}
          </div>
        )}
      </Card>

      {/* reset */}
      {!confirmReset ? (
        <button onClick={() => setConfirmReset(true)} style={{
          width: '100%', border: `1.5px solid ${theme.line}`,
          background: 'none', cursor: 'pointer', borderRadius: s(13), padding: `${s(13)}px 0`,
          fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700, color: theme.terracottaInk,
        }}>
          Fortschritt zurücksetzen
        </button>
      ) : (
        <div style={{ border: `1.5px solid ${theme.terracotta}`, borderRadius: s(13),
          padding: `${s(16)}px ${s(18)}px`, background: theme.terracottaSoft }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700,
            color: theme.terracottaInk, marginBottom: s(6) }}>
            Alles löschen?
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.terracottaInk,
            lineHeight: 1.5, marginBottom: s(14) }}>
            Sessions, Serie und alle Einstellungen werden unwiderruflich gelöscht.
          </div>
          <div style={{ display: 'flex', gap: s(10) }}>
            <button onClick={() => setConfirmReset(false)} style={{
              flex: 1, border: `1.5px solid ${theme.line}`, background: theme.surface,
              cursor: 'pointer', borderRadius: s(11), padding: `${s(11)}px 0`,
              fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.inkSoft,
            }}>
              Abbrechen
            </button>
            <button onClick={() => { b.actions.reset(); setConfirmReset(false) }} style={{
              flex: 1, border: 'none', background: theme.terracotta,
              cursor: 'pointer', borderRadius: s(11), padding: `${s(11)}px 0`,
              fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.onPrimary,
            }}>
              Ja, löschen
            </button>
          </div>
        </div>
      )}
      <div style={{ height: s(8) }} />
    </div>
  )
}
