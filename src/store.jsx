import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'anna_v1'

// ── Date helpers ─────────────────────────────────────────────────────────────
const DAY = 86400000
export const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d })()
export const parseD = (s) => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d) }
export const isoDay = (d) => {
  const z = new Date(d); z.setHours(0,0,0,0)
  return `${z.getFullYear()}-${String(z.getMonth()+1).padStart(2,'0')}-${String(z.getDate()).padStart(2,'0')}`
}
export const addDays = (d, n) => new Date(d.getTime() + n * DAY)
export const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth()+n); return x }
export const fmtDate = (d) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
export const fmtShort = (d) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
export const weekdayLetter = (d) => ['S','M','D','M','D','F','S'][d.getDay()]
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const weeksSince = (d) => Math.floor((TODAY - startOfDay(d)) / (7 * DAY))
export const monthsSince = (d) => {
  const a = startOfDay(d)
  let m = (TODAY.getFullYear()-a.getFullYear())*12+(TODAY.getMonth()-a.getMonth())
  if (TODAY.getDate() < a.getDate()) m--
  return Math.max(0, m)
}

// ── Program data ──────────────────────────────────────────────────────────────
export const PHASES = [
  { n: 1, name: 'Grundlage', tag: 'Reconnect', weeks: 'Woche 0–6',
    blurb: 'Atmung, Beckenboden, tiefe Rumpfverbindung. Den Körper wieder lesen lernen.' },
  { n: 2, name: 'Aufbau', tag: 'Load', weeks: 'Woche 6–12+',
    blurb: 'Belastung dosiert steigern. Sehnen und Beckenboden auf Zug vorbereiten.' },
  { n: 3, name: 'Zurück an die Wand', tag: 'Return', weeks: 'ab Monat 3',
    blurb: 'Fingerboard, Boulder, erste echte Züge. Crimp kommt erst ab Monat 8.' },
]

const ST = (name, dur, cue, pulse) => ({ name, dur, cue, ...(pulse && { pulse }) })
export const WORKOUTS = [
  { id: 'w0', phases: [1], name: 'Tiefenspannung & Atem', focus: 'Beckenboden · Rumpf', kind: 'Aufbau',
    dur: '~9 Min', steps: [
      ST('Aktives Hängen', 60, 'Greife die Stange schulterbreit, Handflächen von dir weg. Ziehe beide Schulterblätter aktiv nach unten, als wolltest du sie in die Hosentaschen stecken. Ellbogen minimal gebeugt, Becken neutral. Halte die Verbindung zwischen Schulter und Rumpf bewusst, ruhig atmen.'),
      ST('Seitstütz auf Knien', 90, 'Auf dem Unterarm seitlich, Ellbogen direkt unter der Schulter, Knie gebeugt. Hebe die Hüfte, bis Knie, Hüfte und Schulter eine gerade Linie bilden. Bauchnabel leicht nach innen, untere Seite aktiv halten. Etwa 45 Sekunden je Seite, dabei ruhig weiteratmen.'),
      ST('Ankommen', 60, 'Leg dich auf den Rücken, Knie angestellt, Füße hüftbreit. Lass dein Gewicht vollständig in den Boden sinken. Eine Hand auf den Bauch, eine auf die Brust. Beobachte, wo sich die Atmung ausbreitet, ohne sie zu verändern.'),
      ST('Beckenboden wecken', 90, 'Mit der Ausatmung den Beckenboden sanft nach oben und innen heben, als würdest du eine Blaubeere aufnehmen. Nicht pressen, nur heben. Fünf Sekunden halten, dann vollständig loslassen und drei Sekunden entspannen. Das Lösen ist genauso wichtig wie das Anspannen.', { hold: 5, release: 5 }),
      ST('Dead Bug', 120, 'Rückenlage, Arme senkrecht zur Decke, Hüften und Knie 90 Grad gebeugt. Senke gleichzeitig den rechten Arm über den Kopf und das linke Bein zum Boden, ohne dass der untere Rücken den Kontakt zum Boden verliert. Langsam zurück, dann Seite wechseln. Rippen bleiben unten, kein Hohlkreuz, ruhig weiteratmen.'),
      ST('Atempause', 45, 'Lass alles los. Arme seitlich, Beine ausgestreckt oder Knie gebeugt, wie es sich besser anfühlt. Drei lange Atemzüge, bei jedem Ausatmen etwas tiefer ins Loslassen sinken.'),
      ST('Ausklang', 60, 'Komm in die Kindshaltung: Knie breit, Hüfte Richtung Fersen, Stirn auf dem Boden, Arme nach vorne gestreckt. Atme in den Rücken, spüre die Dehnung zwischen den Schulterblättern. Du baust auf, nichts geht verloren.'),
    ]},
  { id: 'w0b', phases: [1], name: 'Beckenboden & Becken', focus: 'Tiefe Schicht · sanft', kind: 'Aufbau',
    dur: '~8 Min', steps: [
      ST('Ankommen', 60, 'Rückenlage, Knie angestellt, Füße flach. Hände auf dem Bauch, Augen geschlossen. Beobachte, wie sich der Bauch beim Einatmen hebt und beim Ausatmen sinkt. Drei bewusste Atemzüge, dann gehts los.'),
      ST('Beckenboden kurz', 90, 'Beim Ausatmen den Beckenboden sanft anspannen, als würdest du den Harnstrahl kurz unterbrechen und gleichzeitig leicht nach innen ziehen. Zwei Sekunden halten, dann komplett loslassen und drei Sekunden warten. Das vollständige Lösen ist entscheidend, trainiere beides gleich bewusst.', { hold: 2, release: 3 }),
      ST('Beckenboden lang', 90, 'Dieselbe sanfte Anspannung, jetzt acht Sekunden halten. Atme dabei ruhig weiter, die Spannung soll beim Einatmen nicht zusammenbrechen. Vollständig lösen und sechs Sekunden Pause. Falls acht Sekunden zu lang sind, kürze auf fünf, das ist kein Rückschritt.', { hold: 8, release: 6 }),
      ST('Heel Slides', 90, 'Ein Bein langsam ausstrecken, Ferse gleitet am Boden entlang, dann zurück. Das Becken bleibt vollständig ruhig, kein Hohlkreuz, Rippen unten. Mit jeder Ausatmung ein Gleiten. Abwechselnd links und rechts.'),
      ST('Sanfte Brücke', 90, 'Füße flach, hüftbreit. Beim Ausatmen Wirbel für Wirbel das Becken heben: zuerst Steißbein, dann Lendenwirbel, dann Mitte. Oben kurz halten. Beim Einatmen langsam abrollen. Nicht das Gesäß pressen, die Bewegung kommt aus den hinteren Oberschenkeln und der tiefen Körpermitte.'),
      ST('Ausklang', 60, 'Lass die Knie locker zur Seite fallen, so weit wie es sich angenehm anfühlt. Arme neben dem Körper, Handflächen nach oben. Atme tief ein und beim Ausatmen lass jede Spannung los. Spüre, was sich verändert hat.'),
    ]},
  { id: 'w1', phases: [2], name: 'Zugkraft & Schulter', focus: 'Antagonist · Pull', kind: 'Aufbau',
    dur: '~12 Min', steps: [
      ST('Mobilisieren', 75, 'Schultern in großen Kreisen vorwärts und rückwärts, dann die Brustwirbelsäule öffnen: Hände im Nacken, Ellbogen weit aufmachen und sanft nach hinten. Handgelenke locker ausschütteln. Atme in die Weite zwischen den Schulterblättern.'),
      ST('Skapula-Pulls', 90, 'Im Hang mit gestreckten Armen, schulterbreit. Nur die Schulterblätter nach unten ziehen, Arme bleiben gestreckt, kein Ellbogenbeugen. Klein, kontrolliert. Mit der Ausatmung anziehen, Beckenboden leicht mitnehmen.'),
      ST('Negatives Hängen', 60, 'Beginne oben im aktiven Hang. Senke dich so langsam wie möglich ab, mindestens vier bis fünf Sekunden für den Weg nach unten. Kontrolliere jeden Zentimeter, lass dich nicht fallen. Der Bremsweg ist der Aufbau.'),
      ST('Atempause', 45, 'Arme ausschütteln, locker stehen. Drei tiefe Atemzüge, bei jedem Ausatmen die Schultern bewusst loslassen.'),
      ST('Ruderzug Band', 120, 'Widerstandsband auf Brusthöhe. Ellbogen eng am Körper nach hinten führen, Schulterblätter zusammenziehen. Ausatmen beim Ziehen, Beckenboden sanft mitnehmen. Rumpf aufrecht, kein Schwung aus dem Rücken.'),
      ST('Außenrotation', 90, 'Oberarm am Körper, Unterarm waagerecht. Mit Band oder leichtem Gewicht den Unterarm nach außen führen, Ellbogen bleibt am Körper. Langsam und kontrolliert. Das ist der Gegenspieler für gesunde Schultern an der Wand.'),
      ST('Ausklang', 60, 'Brustöffner: Arm gestreckt an die Wand, Körper wegdrehen bis zur sanften Dehnung in der Brust. Beide Seiten, dabei lange ausatmen.'),
    ]},
  { id: 'w1b', phases: [2], name: 'Beine & Becken', focus: 'Unterkörper · Stabilität', kind: 'Aufbau',
    dur: '~11 Min', steps: [
      ST('Aufwärmen', 75, 'Lockeres Gehen auf der Stelle, dann Hüftkreisen in beide Richtungen. Knie leicht heben, Arme mitschwingen. Atme tief in die Flanken, werde warm.'),
      ST('Kniebeugen', 120, 'Füße hüftbreit, Zehen leicht nach außen. Langsam absenken, als würdest du auf einen Stuhl sitzen, Gewicht auf der ganzen Sohle, Knie über den Zehen. Rumpf aufrecht. Mit der Ausatmung hochkommen, Beckenboden sanft mitnehmen.'),
      ST('Ausfallschritte', 120, 'Einen Schritt nach hinten setzen, Knie kontrolliert zum Boden senken. Rumpf aufrecht, Vorderknie über dem Fuß. Beide Seiten gleich. Das ist schon die Stabilität, die du an der Wand brauchst.'),
      ST('Atempause', 45, 'Kurz ausschütteln, drei ruhige Atemzüge. Beine lockern, Gewicht abwechselnd verlagern.'),
      ST('Seitstütz', 90, 'Auf dem Unterarm, Ellbogen unter der Schulter. Gern auf den Knien, wenn nötig. Hüfte heben, lange Linie vom Knie bis zum Kopf. Körpermitte aktiv, ruhige Atmung. Beide Seiten.'),
      ST('Glute Bridge', 90, 'Rückenlage, Füße flach hüftbreit. Beim Ausatmen das Becken heben, drei Sekunden oben halten, Hüfte und Knie bilden eine Linie. Beim Einatmen langsam absenken. Der Beckenboden fließt mit der Bewegung.'),
      ST('Ausklang', 60, 'Hüftbeuger dehnen: ein Knie auf dem Boden, der andere Fuß vor dem Körper. Becken leicht nach vorne unten drücken, Oberkörper aufrecht. Beide Seiten, lange ausatmen.'),
    ]},
  { id: 'w2', phases: [1, 2], name: 'Atem & Mobilität', focus: 'Regeneration', kind: 'Reset', light: true,
    dur: '~6 Min', steps: [
      ST('Ankommen', 60, 'Sitz oder leg dich bequem hin. Schließe die Augen und folge dem natürlichen Atemrhythmus für ein paar Züge. Nichts verändern, nichts müssen. Lass Gedanken einfach da sein.'),
      ST('Beckenkippen', 90, 'Im Sitzen oder in Rückenlage das Becken sanft vor und zurück kippen: Lendenwirbelsäule abflachen, dann leicht einrollen. Kleine Bewegung, großes Bewusstsein. Spüre, wie die Bewegung mit dem Atem zusammenspielt.'),
      ST('4-6 Atmung', 90, 'Vier Zähler gleichmäßig einatmen, sechs Zähler langsam ausatmen. Die verlängerte Ausatmung aktiviert das parasympathische System und beruhigt Körper und Geist. Falls sechs zu lang ist, probiere vier und fünf.'),
      ST('Hüftöffner', 90, 'Rückenlage: den rechten Knöchel auf das linke Knie legen, Beine leicht anheben. Sanft Druck durch den rechten Ellbogen gegen den Oberschenkel. Atme in die Spannung, kein Ziehen. Nach 40 Sekunden Seite wechseln.'),
      ST('Nachspüren', 60, 'Komplett loslassen, Beine ausgestreckt, Arme neben dem Körper, Handflächen oben. Lass dich vollständig in den Boden sinken. Spüre, was sich nach der Einheit anders anfühlt.'),
    ]},
]

export const MOODS = [
  { id: 'gut',    label: 'Gut',    note: null },
  { id: 'mittel', label: 'Mittel', note: 'Heute bewusst auf 70 %. Qualität vor Intensität.' },
  { id: 'muede',  label: 'Müde',   note: 'Heute lieber die sanfte Einheit. Erholen ist auch Aufbau.' },
  { id: 'pause',  label: 'Pause',  note: 'Ruhetag. Ein Spaziergang ist willkommen, sonst nichts.' },
]

export const READINESS = [
  'Keine Symptome bei Alltagsbelastung (kein Druck oder Schweregefühl)',
  'Schmerzfreies aktives Hängen über 30 Sekunden',
  'Beckenboden: 10× kontrollierte Kontraktion ohne Ermüdung',
  'Kein Spalt der geraden Bauchmuskeln über zwei Finger',
  'Drei Aufbau-Sessions pro Woche über drei Wochen gehalten',
]

export const SYMPTOMS = {
  keine:    { label: 'Keine Symptome', short: 'Keine',    sev: 0 },
  leicht:   { label: 'Leichter Druck', short: 'Leicht',   sev: 1 },
  deutlich: { label: 'Deutlich',       short: 'Deutlich', sev: 2 },
}

// ── Context ───────────────────────────────────────────────────────────────────
export const BtcContext = createContext(null)
export function useBtc() { return useContext(BtcContext) }

// ── Persistence helpers ───────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  name: 'Anna',
  childBirth: isoDay(addDays(TODAY, -49)),
  goal: 'Zurück an den Fels, 7a bouldern',
  breastfeeding: true, cSection: false, physioCleared: false,
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

// ── Store ─────────────────────────────────────────────────────────────────────
export function createBtcStore() {
  const saved = loadSaved()

  const [started, setStarted] = useState(saved?.started ?? false)
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...(saved?.profile ?? {}) })
  const [phase, setPhase] = useState(saved?.phase ?? 1)
  // mood persists for the current day only
  const [mood, setMood] = useState(saved?.moodDay === isoDay(TODAY) ? saved.mood : null)
  const [workoutIdx, setWorkoutIdx] = useState(saved?.workoutIdx ?? 0)
  const [readiness, setReadiness] = useState(saved?.readiness ?? [false,false,false,false,false])
  const [sessions, setSessions] = useState(saved?.sessions ?? [])
  const [rests, setRests] = useState(saved?.rests ?? [])
  const [advancedAt, setAdvancedAt] = useState(saved?.advancedAt ?? null)

  // persist on change
  useEffect(() => {
    save({ started, profile, phase, mood, moodDay: isoDay(TODAY), readiness, sessions, rests, advancedAt, workoutIdx })
  }, [started, profile, phase, mood, readiness, sessions, rests, advancedAt])

  // derived
  const birth = parseD(profile.childBirth)
  const weeksPP = weeksSince(birth)
  const monthsPP = monthsSince(birth)
  const crimpUnlock = addMonths(birth, 8)
  const crimpUnlocked = TODAY >= startOfDay(crimpUnlock)
  const climbingUnlocked = phase >= 3

  const deutlich7d = sessions.filter(s =>
    (TODAY - parseD(s.date)) <= 7 * DAY && s.symptom === 'deutlich').length
  const symptomBlock = deutlich7d >= 2
  const readinessMet = readiness.every(Boolean)
  const physioGate = profile.physioCleared
  // phase 1→2: time + symptom gate (c-section needs 8 weeks); phase 2→3: readiness + physio gate
  const p2MinWeeks = profile.cSection ? 8 : 6
  const p2TimeMet = weeksPP >= p2MinWeeks
  const canAdvance = phase === 1
    ? (p2TimeMet && !symptomBlock)
    : phase === 2
    ? (readinessMet && physioGate && !symptomBlock)
    : false

  // workouts available in the current phase (phase 3 keeps the phase-2 strength base)
  const phaseKey = Math.min(phase, 2)
  const phaseWorkouts = WORKOUTS.filter(w => w.phases.includes(phaseKey))
  const lightIdx = phaseWorkouts.findIndex(w => w.light)

  const sessDays = new Set(sessions.map(s => s.date))
  let streak = 0
  for (let i = sessDays.has(isoDay(TODAY)) ? 0 : 1; i < 60; i++) {
    if (sessDays.has(isoDay(addDays(TODAY, -i)))) streak++
    else if (i > 0) break
  }

  const activeDays = new Set([...sessions.map(s => s.date), ...rests])
  let serie = 0
  for (let i = activeDays.has(isoDay(TODAY)) ? 0 : 1; i < 120; i++) {
    if (activeDays.has(isoDay(addDays(TODAY, -i)))) serie++
    else if (i > 0) break
  }

  const MILESTONES = [3, 7, 14, 21, 30, 50]
  const nextMilestone = MILESTONES.find(m => m > serie) || null
  const earnedMilestones = MILESTONES.filter(m => serie >= m)
  const lastEarned = earnedMilestones[earnedMilestones.length - 1] || null
  const restToday = rests.includes(isoDay(TODAY))
  const moodObj = MOODS.find(m => m.id === mood) || null
  const restDay = mood === 'pause'

  const actions = {
    setMood: (m) => {
      setMood(m)
      if (m === 'muede' || m === 'pause') setWorkoutIdx(lightIdx >= 0 ? lightIdx : 0)
      else if (workoutIdx === lightIdx) setWorkoutIdx(0)
      setRests(r => m === 'pause'
        ? Array.from(new Set([...r, isoDay(TODAY)]))
        : r.filter(d => d !== isoDay(TODAY)))
    },
    swapWorkout: () => setWorkoutIdx(i => (i + 1) % phaseWorkouts.length),
    toggleReadiness: (i) => setReadiness(r => r.map((v, j) => j === i ? !v : v)),
    setProfile,
    completeSession: (workout, symptom) => {
      setSessions(s => [
        { date: isoDay(TODAY), workout: workout.name, symptom },
        ...s.filter(x => x.date !== isoDay(TODAY)),
      ])
      setRests(r => r.filter(d => d !== isoDay(TODAY)))
    },
    advancePhase: () => {
      if (!canAdvance) return
      if (phase === 1) { setPhase(2); setWorkoutIdx(0) }
      else { setPhase(3); setAdvancedAt(isoDay(TODAY)) }
    },
    startProgram: (childBirth, name) => {
      setProfile({ ...DEFAULT_PROFILE, childBirth, name: name || DEFAULT_PROFILE.name })
      setPhase(1)
      setStarted(true)
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY)
      setStarted(false); setPhase(1); setMood(null); setWorkoutIdx(0); setRests([])
      setReadiness([false,false,false,false,false]); setSessions([]); setAdvancedAt(null)
      setProfile({ ...DEFAULT_PROFILE })
    },
  }

  return {
    started, profile, phase, mood, moodObj, restDay, restToday, workoutIdx,
    readiness, sessions, rests, advancedAt,
    birth, weeksPP, monthsPP, crimpUnlock, crimpUnlocked, climbingUnlocked,
    deutlich7d, symptomBlock, readinessMet, physioGate, canAdvance, p2TimeMet, p2MinWeeks, streak,
    serie, milestones: {
      list: MILESTONES, next: nextMilestone, earned: earnedMilestones,
      last: lastEarned, justHit: MILESTONES.includes(serie) && activeDays.has(isoDay(TODAY)),
    },
    workout: phaseWorkouts[workoutIdx % phaseWorkouts.length], actions,
  }
}
