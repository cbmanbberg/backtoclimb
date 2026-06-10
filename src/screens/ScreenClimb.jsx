import { useBtc, fmtDate, fmtShort } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon, SectionRule, DataTag, Card, Pill } from '../ui'

const ST = (name, dur, cue) => ({ name, dur, cue })

const CLIMB = {
  fingerboard: [
    { name: 'Fingerboard · Open Hand', focus: 'Sehnen · 7-3 Repeaters', dur: '~8 Min', kind: 'Fingerboard',
      steps: [
        ST('Aufwärmen', 90, 'Finger und Unterarme locker kreisen, dann zwei leichte Hänge. Sehnen mögen es warm.'),
        ST('Beckenboden-Set', 45, 'Kurzer Check: anspannen, halten, lösen. Nimm die Spannung mit in den Hang.'),
        ST('Repeater 1', 60, 'Offene Hand, große Leiste. 7 Sek. hängen, 3 Sek. lösen. Schultern aktiv, ausatmen beim Belasten.'),
        ST('Pause', 60, 'Komplett ausschütteln. Atme ruhig, lass die Unterarme entspannen.'),
        ST('Repeater 2', 60, 'Zweiter Satz, gleiche Qualität. Lieber sauber als hart — kein Crimp.'),
        ST('Ausklang', 60, 'Unterarme dehnen, Handgelenke mobilisieren.'),
      ]},
    { name: 'Aktiver Hang · Last', focus: 'Schulter · Rumpf', dur: '~7 Min', kind: 'Fingerboard',
      steps: [
        ST('Mobilisieren', 75, 'Schultern kreisen, Brustwirbelsäule öffnen.'),
        ST('Beckenboden-Set', 45, 'Anspannen, halten, lösen. Verbindung wachrufen.'),
        ST('Aktiver Hang', 75, 'Schulterblätter nach unten ziehen, lange Körperlinie. Becken neutral.'),
        ST('Pause', 45, 'Ausschütteln, tief atmen.'),
        ST('Negativ-Hang', 60, 'Langsam aus der Spannung absenken. Kontrolliert, nicht fallen lassen.'),
        ST('Ausklang', 45, 'Lockern, nachspüren.'),
      ]},
  ],
  boulder: [
    { name: 'Boulder · Vertikal', focus: 'Technik · leichte Züge', dur: '~15 Min', kind: 'Boulder',
      steps: [
        ST('Beckenboden-Set', 45, 'Vor dem ersten Zug: anspannen, halten, lösen. Hör auf deinen Körper.'),
        ST('Leichte Traverse', 120, 'Senkrecht, große Tritte. Füße präzise setzen, ruhig atmen, kein Pressen.'),
        ST('Easy Boulder', 150, 'Zwei, drei leichte Probleme. Bei Druck oder Schwere: Pause. Qualität vor Grad.'),
        ST('Pause', 60, 'Trinken, durchatmen, Schultern lockern.'),
        ST('Ausklang', 60, 'Lockere Bewegung, Unterarme dehnen.'),
      ]},
    { name: 'Spannung an der Platte', focus: 'Core · Füße', dur: '~12 Min', kind: 'Boulder',
      steps: [
        ST('Beckenboden-Set', 45, 'Anspannen, halten, lösen. Spannung aufbauen.'),
        ST('Fußtechnik', 120, 'An der Platte: Gewicht über die Füße, Hüfte nah zur Wand. Rumpf hält die Linie.'),
        ST('Spannungszüge', 120, 'Kontrollierte Züge mit aktivem Core. Ausatmen bei Belastung, Beckenboden mitnehmen.'),
        ST('Pause', 60, 'Ausschütteln, ruhig atmen.'),
        ST('Ausklang', 60, 'Mobilisieren, nachspüren.'),
      ]},
  ],
  crimp: [
    { name: 'Crimp-Belastung', focus: 'Geschlossener Griff' },
    { name: 'Maximalkraft Crimp', focus: 'Kleine Leisten' },
  ],
}

export default function ScreenClimb({ onStart, onGoPlan }) {
  const { theme, s } = useUI()
  const b = useBtc()

  if (!b.climbingUnlocked) {
    return (
      <div style={{ padding: `${s(4)}px ${s(22)}px ${s(8)}px` }}>
        <Card pad={s(24)} style={{ textAlign: 'center', marginBottom: s(18) }}>
          <div style={{ width: s(64), height: s(64), borderRadius: '50%', margin: '0 auto',
            background: theme.terracottaSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="lock" size={28} color={theme.terracotta} stroke={1.9} />
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: s(24), fontWeight: 500, color: theme.ink,
            letterSpacing: '-.01em', marginTop: s(16) }}>
            Klettern öffnet in Phase 3
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.55, color: theme.inkSoft,
            marginTop: s(10) }}>
            Sehnen und Beckenboden brauchen erst die Aufbau-Basis. Das ist kein Zeitplan, den man aussitzt — es ist ein Tor, das du durch Readiness öffnest.
          </div>
          <button onClick={onGoPlan} style={{
            marginTop: s(20), border: 'none', cursor: 'pointer',
            background: theme.primary, color: theme.onPrimary,
            borderRadius: s(13), padding: `${s(13)}px ${s(22)}px`,
            fontFamily: FONTS.sans, fontSize: 14.5, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: s(8),
          }}>
            Zum Readiness-Check
            <Icon name="arrow" size={17} color={theme.onPrimary} />
          </button>
        </Card>

        <SectionRule index={1} style={{ marginTop: s(2) }}>Was dich erwartet</SectionRule>
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(9) }}>
          {[...CLIMB.fingerboard, ...CLIMB.boulder].slice(0, 3).map((u, i) => (
            <Card key={i} pad={s(14)} soft style={{ display: 'flex', alignItems: 'center', gap: s(13), opacity: .6 }}>
              <div style={{ width: s(38), height: s(38), borderRadius: s(11), flexShrink: 0,
                background: theme.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="climb" size={19} color={theme.inkMute} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.inkSoft }}>
                  {u.name}
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: 1 }}>
                  {u.focus}
                </div>
              </div>
              <Icon name="lock" size={16} color={theme.inkMute} stroke={2} />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Phase 3 unlocked
  const crimpDate = fmtDate(b.crimpUnlock)

  return (
    <div style={{ padding: `${s(4)}px ${s(22)}px ${s(8)}px` }}>
      {/* pelvic-floor reminder */}
      <div style={{ display: 'flex', gap: s(11), alignItems: 'flex-start', background: theme.terracottaSoft,
        borderRadius: s(15), padding: `${s(13)}px ${s(15)}px`, marginBottom: s(4) }}>
        <Icon name="info" size={19} color={theme.terracotta} stroke={2} />
        <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 1.45, color: theme.terracottaInk }}>
          <b>Vor jeder Einheit:</b> Beckenboden-Check. Spürst du Druck, Schwere oder Nässe — brich ab und notiere es. Das ist Stärke, nicht Schwäche.
        </div>
      </div>

      <ClimbSection index={1} label="Fingerboard" units={CLIMB.fingerboard} onStart={onStart} />
      <ClimbSection index={2} label="Boulder" units={CLIMB.boulder} onStart={onStart} />

      {/* crimp gate */}
      <SectionRule index={3} style={{ marginTop: s(20) }}
        action={<DataTag tone="terracotta">GESPERRT</DataTag>}>
        Crimp
      </SectionRule>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(9) }}>
        {CLIMB.crimp.map((u, i) => (
          <Card key={i} pad={s(14)} soft style={{ display: 'flex', alignItems: 'center', gap: s(13) }}>
            <div style={{ width: s(38), height: s(38), borderRadius: s(11), flexShrink: 0,
              background: theme.terracottaSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="lock" size={18} color={theme.terracotta} stroke={2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 700, color: theme.inkSoft }}>
                {u.name}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkMute, marginTop: 1 }}>
                Frei ab {crimpDate}
              </div>
            </div>
          </Card>
        ))}
        <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: theme.inkMute, lineHeight: 1.5,
          padding: `${s(2)}px ${s(4)}px` }}>
          Geschlossene Crimps belasten die Ringbänder maximal. Die Sehnen brauchen bis Monat 8–9, um postpartal wieder voll belastbar zu sein — darum ein echtes Tor, kein Hinweis.
        </div>
      </div>
    </div>
  )
}

function ClimbSection({ index, label, units, onStart }) {
  const { theme, s } = useUI()
  return (
    <>
      <SectionRule index={index} style={{ marginTop: s(20) }}>{label}</SectionRule>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(10) }}>
        {units.map((u, i) => (
          <Card key={i} pad={s(16)}>
            <div style={{ display: 'flex', gap: s(7), marginBottom: s(9) }}>
              <Pill tone="primary">{u.kind}</Pill>
              <Pill>{u.dur}</Pill>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: s(19), fontWeight: 500, color: theme.ink }}>
              {u.name}
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkMute, marginTop: s(4) }}>
              {u.focus} · {u.steps.length} Schritte
            </div>
            <button onClick={() => onStart(u)} style={{
              marginTop: s(13), width: '100%', border: 'none', cursor: 'pointer',
              background: theme.primaryTint, color: theme.primary, borderRadius: s(12),
              padding: `${s(12)}px 0`, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(8),
            }}>
              <Icon name="play" size={15} color={theme.primary} />
              Einheit starten
            </button>
          </Card>
        ))}
      </div>
    </>
  )
}
