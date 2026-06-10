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

const ST = (name, dur, cue) => ({ name, dur, cue })
export const WORKOUTS = [
  { id: 'w0', phases: [1], name: 'Tiefenspannung & Atem', focus: 'Beckenboden · Rumpf', kind: 'Aufbau',
    dur: '~9 Min', steps: [
      ST('Ankommen', 60, 'Rücken am Boden, Knie gebeugt. Atme tief in den Bauch und spüre, wie sich die Rippen seitlich weiten.'),
      ST('Beckenboden wecken', 90, 'Mit der Ausatmung den Beckenboden langsam anspannen, als würdest du eine Blaubeere anheben. Fünf Sekunden, dann vollständig lösen.'),
      ST('Dead Bug', 120, 'Gegengleich Arm und Bein absenken. Die Rippen bleiben unten, kein Hohlkreuz. Ruhig weiteratmen.'),
      ST('Atempause', 45, 'Lass alles los. Drei lange Atemzüge. Spüre nach, ohne zu bewerten.'),
      ST('Seitstütz (Knie)', 90, 'Auf dem Unterarm, Knie gebeugt. Hüfte heben, lange Linie von Knie zu Kopf. Schulter stabil halten.'),
      ST('Aktives Hängen', 60, 'An der Stange, Schultern aktiv nach unten ziehen. Spüre die Verbindung von Schulter zu Rumpf.'),
      ST('Ausklang', 60, 'Kindshaltung. Atme in den Rücken. Du baust auf, nichts geht verloren.'),
    ]},
  { id: 'w0b', phases: [1], name: 'Beckenboden & Becken', focus: 'Tiefe Schicht · sanft', kind: 'Aufbau',
    dur: '~8 Min', steps: [
      ST('Ankommen', 60, 'Rückenlage, Hände auf den Bauch. Spüre die Atmung, ohne etwas zu verändern.'),
      ST('Beckenboden kurz', 90, 'Mit der Ausatmung anspannen, 2 Sek. halten, vollständig lösen. Das Lösen ist so wichtig wie das Anspannen.'),
      ST('Beckenboden lang', 90, 'Sanft anspannen und 8 Sek. halten, dabei weiteratmen. Volle Pause zwischen den Wiederholungen.'),
      ST('Heel Slides', 90, 'Ein Bein langsam ausstrecken und zurückziehen. Becken bleibt ruhig, Rippen unten.'),
      ST('Sanfte Brücke', 90, 'Becken Wirbel für Wirbel heben und senken. Ausatmen beim Hochrollen.'),
      ST('Ausklang', 60, 'Knie zur Seite fallen lassen, nachspüren. Gut gemacht.'),
    ]},
  { id: 'w1', phases: [2], name: 'Zugkraft & Schulter', focus: 'Antagonist · Pull', kind: 'Aufbau',
    dur: '~12 Min', steps: [
      ST('Mobilisieren', 75, 'Schulterkreisen, Brustwirbelsäule öffnen. Atme in die Weite zwischen den Schulterblättern.'),
      ST('Skapula-Pulls', 90, 'Im Hang nur die Schulterblätter nach unten ziehen, Arme bleiben gestreckt. Klein, kontrolliert, beckenbodenbewusst.'),
      ST('Ruderzug Band', 120, 'Ellbogen eng am Körper nach hinten. Ausatmen beim Ziehen, Beckenboden leicht mitnehmen.'),
      ST('Atempause', 45, 'Schütteln, lockerlassen. Drei tiefe Atemzüge.'),
      ST('Außenrotation', 90, 'Oberarm am Körper, Unterarm nach außen führen. Antagonist für gesunde Schultern an der Wand.'),
      ST('Negatives Hängen', 60, 'Langsam aus dem aktiven Hang absenken. Spannung halten, nicht ins Gewebe fallen.'),
      ST('Ausklang', 60, 'Brustöffner an der Wand. Lange ausatmen.'),
    ]},
  { id: 'w1b', phases: [2], name: 'Beine & Becken', focus: 'Unterkörper · Stabilität', kind: 'Aufbau',
    dur: '~11 Min', steps: [
      ST('Aufwärmen', 75, 'Lockeres Gehen auf der Stelle, Hüftkreisen. Atme tief in die Flanken.'),
      ST('Glute Bridge', 90, 'Becken heben, oben 3 Sek. halten. Ausatmen beim Heben, Beckenboden sanft mitnehmen.'),
      ST('Kniebeugen', 120, 'Langsam und kontrolliert, wie auf einen Stuhl setzen. Gewicht auf der ganzen Sohle.'),
      ST('Atempause', 45, 'Ausschütteln, drei ruhige Atemzüge.'),
      ST('Ausfallschritte', 120, 'Kontrolliert nach hinten absteigen. Rumpf aufrecht. Das ist schon deine Wandstabilität.'),
      ST('Seitstütz', 90, 'Auf dem Unterarm, gern auf den Knien. Lange Linie, ruhige Atmung.'),
      ST('Ausklang', 60, 'Hüftbeuger dehnen, beide Seiten. Lange ausatmen.'),
    ]},
  { id: 'w2', phases: [1, 2], name: 'Atem & Mobilität', focus: 'Regeneration', kind: 'Reset', light: true,
    dur: '~6 Min', steps: [
      ST('Ankommen', 60, 'Setz oder leg dich bequem hin. Nichts müssen. Folge dem Atem für ein paar Züge.'),
      ST('4·6 Atmung', 90, 'Vier Zähler ein, sechs Zähler aus. Die lange Ausatmung beruhigt das System.'),
      ST('Beckenkippen', 90, 'Becken sanft vor und zurück kippen. Spüre die Beweglichkeit der unteren Wirbelsäule.'),
      ST('Hüftöffner', 90, 'Sanfte Dehnung, kein Ziehen. Atme in jede Spannung hinein.'),
      ST('Nachspüren', 60, 'Komplett loslassen. Du hast deinem Körper heute genau das Richtige gegeben.'),
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
