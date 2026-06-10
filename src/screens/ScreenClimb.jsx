import { useBtc, fmtDate, fmtShort } from '../store'
import { FONTS } from '../tokens'
import { useUI, Icon, SectionRule, DataTag, Card, Pill } from '../ui'
import { Figure } from '../figures'

const ST = (name, dur, cue, pulse, fig) => ({ name, dur, cue, ...(pulse && { pulse }), ...(fig && { fig }) })

const CLIMB = {
  fingerboard: [
    { name: 'Fingerboard · Open Hand', focus: 'Sehnen · 7-3 Repeaters', dur: '~8 Min', kind: 'Fingerboard', fig: 'board',
      steps: [
        ST('Aufwärmen', 90, 'Finger und Unterarme locker kreisen, dann Handgelenke in beide Richtungen. Zwei leichte Hänge mit komplett offener Hand, je 10 bis 15 Sekunden. Sehnen brauchen länger zum Aufwärmen als Muskeln.', null, 'shake'),
        ST('Beckenboden-Set', 45, 'Kurzer Check vor dem Hängen: einatmen, mit der Ausatmung Beckenboden anspannen, drei Sekunden halten, vollständig lösen. Zweimal wiederholen. Nimm dieses Bewusstsein mit in jeden Hang.', null, 'pelvicStand'),
        ST('Repeater 1', 60, 'Offene Hand, große Leiste oder Jugs. Schulterblätter aktiv nach unten, Ellbogen minimal gebeugt. Beim Belasten ausatmen, beim Lösen einatmen. Kein Crimp, kein halboffener Griff.', { hold: 7, release: 3, on: 'Hängen', off: 'Lösen' }, 'board'),
        ST('Pause', 60, 'Arme komplett ausschütteln, Hände öffnen und schließen. Atme ruhig, lass die Unterarme vollständig entspannen. Merke dir, wie die Finger sich anfühlen.', null, 'shake'),
        ST('Repeater 2', 60, 'Zweiter Satz, gleiche Qualität wie der erste. Wenn die Schulter nicht mehr stabil bleibt oder die Finger schlapp werden, kürze die Hangzeit auf fünf Sekunden. Lieber sauber als hart.', { hold: 7, release: 3, on: 'Hängen', off: 'Lösen' }, 'board'),
        ST('Ausklang', 60, 'Unterarme dehnen: Arm nach vorne strecken, Handfläche nach oben, mit der anderen Hand die Finger sanft nach unten ziehen. Dann Handfläche nach unten. Handgelenke kreisen. Beide Seiten.', null, 'stretchArm'),
      ]},
    { name: 'Aktiver Hang · Last', focus: 'Schulter · Rumpf', dur: '~7 Min', kind: 'Fingerboard', fig: 'hang',
      steps: [
        ST('Mobilisieren', 75, 'Schultern in großen Kreisen vorwärts und rückwärts. Brustwirbelsäule öffnen: Hände im Nacken, Ellbogen weit aufmachen, sanft nach hinten. Seitneigung der Halswirbelsäule links und rechts.', null, 'stand'),
        ST('Beckenboden-Set', 45, 'Ausatmen und Beckenboden anspannen, drei Sekunden halten, vollständig lösen. Zweimal. Verbindung von Rumpf und Beckenboden wachrufen, bevor du hängst.', null, 'pelvicStand'),
        ST('Aktiver Hang', 75, 'Schulterblätter nach unten und innen ziehen, als wolltest du sie in die Hosentaschen stecken. Kinn leicht eingezogen, Becken neutral, kein Hohlkreuz. Spüre die Körperlinie von den Händen bis zu den Füßen. Ruhig atmen.', null, 'hang'),
        ST('Pause', 45, 'Ausschütteln, tief atmen, kurz gehen. Lass den Schultergürtel vollständig los.', null, 'shake'),
        ST('Negativ-Hang', 60, 'Beginne oben in aktiver Zugposition. Senke dich so langsam ab, dass du mindestens fünf Sekunden brauchst. Der Widerstand kommt aus Kontrolle, nicht aus Kraft. Nicht fallen lassen.', null, 'hang'),
        ST('Ausklang', 45, 'Arme lockern, Schultern kreisen. Beide Unterarme an den Türrahmen, einen Schritt vor, Brust öffnen. Drei tiefe Atemzüge.', null, 'chest'),
      ]},
  ],
  boulder: [
    { name: 'Boulder · Vertikal', focus: 'Technik · leichte Züge', dur: '~15 Min', kind: 'Boulder', fig: 'climbWall',
      steps: [
        ST('Beckenboden-Set', 45, 'Vor dem ersten Zug innehalten. Mit der Ausatmung Beckenboden anspannen, halten, lösen. Hör auf deinen Körper: spürst du Druck oder Schwere? Dann heute nur Technik, kein Krafteinsatz.', null, 'pelvicStand'),
        ST('Leichte Traverse', 120, 'Senkrechte Wand, maximal 5a oder 5b. Große Tritte, Füße präzise setzen, Hüfte nah zur Wand. Ruhig atmen, kein Pressen in den Zügen. Bei Druck oder Schwere sofort Pause.', null, 'climbWall'),
        ST('Easy Boulder', 150, 'Zwei oder drei leichte Probleme, niedriger Grad. Lies jede Route vor dem Start. Bei Symptomen von Druck oder Erschöpfung im Beckenboden direkt abbrechen. Qualität vor Grad, immer.', null, 'climbWall'),
        ST('Pause', 60, 'Trinken, Schuhe lockern, Schultern ausschütteln. Bewerte kurz, wie sich der Beckenboden anfühlt, das ist dein Barometer.', null, 'shake'),
        ST('Ausklang', 60, 'Unterarme dehnen und Hüfte mobilisieren. Finger öffnen und schließen. Hole dir die Woche, nicht diesen einen Tag.', null, 'stretchArm'),
      ]},
    { name: 'Spannung an der Platte', focus: 'Core · Füße', dur: '~12 Min', kind: 'Boulder', fig: 'climbWall',
      steps: [
        ST('Beckenboden-Set', 45, 'Anspannen beim Ausatmen, halten, vollständig lösen. Spüre, wie mit der Anspannung auch das tiefe Bauchmuskelkorsett erwacht. Das ist die Körperspannung, die du gleich an der Platte brauchst.', null, 'pelvicStand'),
        ST('Fußtechnik', 120, 'An der Platte mit sanftem Winkel. Gewicht bewusst über die Füße bringen, Hüfte nah zur Wand, Rumpf hält die Linie. Kein Abrutschen durch Kontrolle verhindern, nicht durch Kraft. Beim Belasten ausatmen, Luft nicht anhalten.', null, 'climbWall'),
        ST('Spannungszüge', 120, 'Kontrollierte Züge mit aktivem Core und Beckenboden. Ausatmen beim Belasten, einatmen beim Strecken. Beckenboden mit jeder Lastphase sanft anspannen. Spürst du Druck nach unten, mach Pause.', null, 'climbWall'),
        ST('Pause', 60, 'Ausschütteln, Hüfte locker, trinken. Wie fühlt sich der Beckenboden jetzt an? Das ist dein ehrlichstes Feedback.', null, 'shake'),
        ST('Ausklang', 60, 'Hüfte in alle Richtungen kreisen, Brustwirbelsäule drehen, Arme ausschütteln. Steh kurz ruhig und spüre nach.', null, 'stand'),
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
            Sehnen und Beckenboden brauchen zuerst die Aufbau-Basis. Kein Zeitplan zum Aussitzen, sondern ein Tor, das du durch deinen Fortschritt öffnest.
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
          <b>Vor jeder Einheit:</b> kurz nach innen hören. Spürst du Druck, Schwere oder Nässe, brich ab und schreib es auf. Das gehört dazu.
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
          Crimps belasten die Ringbänder am stärksten. Postpartal brauchen die Sehnen bis Monat 8 oder 9, um das wieder zu vertragen. Deshalb kein Hinweis, sondern ein echtes Tor.
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
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: s(12) }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: s(19), fontWeight: 500, color: theme.ink }}>
                  {u.name}
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.inkMute, marginTop: s(4) }}>
                  {u.focus} · {u.steps.length} Schritte
                </div>
              </div>
              {u.fig && (
                <Figure pose={u.fig} size={s(54)} color={theme.primary}
                  style={{ flexShrink: 0, opacity: .85 }} />
              )}
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
