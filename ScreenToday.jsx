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
    blurb: 'Fingerboard und Boulder — kontrolliert. Crimp bleibt gesperrt bis Monat 8.' },
]

const ST = (name, dur, cue) => ({ name, dur, cue })
export const WORKOUTS = [
  { id: 'w0', name: 'Tiefenspannung & Atem', focus: 'Beckenboden · Rumpf', kind: 'Aufbau',
    dur: '~9 Min', steps: [
      ST('Ankommen', 60, 'Rücken am Boden, Knie gebeugt. Atme tief in den Bauch und spüre, wie sich die Rippen seitlich weiten.'),
      ST('Beckenboden wecken', 90, 'Mit der Ausatmung den Beckenboden langsam anspannen — als hebst du eine Blaubeere an. Halte 5 Sek., löse vollständig.'),
      ST('Dead Bug', 120, 'Gegengleich Arm und Bein absenken. Die Rippen bleiben unten, kein Hohlkreuz. Ruhig weiteratmen.'),
      ST('Atempause', 45, 'Lass alles los. Drei lange Atemzüge. Spüre nach, ohne zu bewerten.'),
      ST('Seitstütz (Knie)', 90, 'Auf dem Unterarm, Knie gebeugt. Hüfte heben, lange Linie von Knie zu Kopf. Schulter stabil halten.'),
      ST('Aktives Hängen', 60, 'An der Stange, Schultern aktiv nach unten ziehen. Spüre die Verbindung von Schulter zu Rumpf.'),
      ST('Ausklang', 60, 'Kindshaltung. Atme in den Rücken. Du hast Spannung aufgebaut — nicht verloren.'),
    ]},
  { id: 'w1', name: 'Zugkraft & Schulter', focus: 'Antagonist · Pull', kind: 'Aufbau',
    dur: '~12 Min', steps: [
      ST('Mobilisieren', 75, 'Schulterkreisen, Brustwirbelsäule öffnen. Atme in die Weite zwischen den Schulterblättern.'),
      ST('Skapula-Pulls', 90, 'Im Hang nur die Schulterblätter nach unten ziehen, Arme bleiben gestreckt. Klein, kontrolliert, beckenbodenbewusst.'),
      ST('Ruderzug Band', 120, 'Ellbogen eng am Körper nach hinten. Ausatmen beim Ziehen, Beckenboden leicht mitnehmen.'),
      ST('Atempause', 45, 'Schütteln, lockerlassen. Drei tiefe Atemzüge.'),
      ST('Außenrotation', 90, 'Oberarm am Körper, Unterarm nach außen führen. Antagonist für gesunde Schultern an der Wand.'),
      ST('Negatives Hängen', 60, 'Langsam aus dem aktiven Hang absenken. Spannung halten, nicht ins Gewebe fallen.'),
      ST('Ausklang', 60, 'Brustöffner an der Wand. Lange ausatmen.'),
    ]},
  { id: 'w2', name: 'Atem & Mobilität', focus: 'Regeneration', kind: 'Reset', light: true,
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
  { id: 'muede',  label: 'Müde',   note: 'Wir tauschen auf eine ruhige Einheit. Regeneration ist Aufbau.' },
  { id: 'pause',  label: 'Pause',  note: 'Ruhetag. Bewegung ist eingeladen, nichts ist Pflicht.' },
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
  goal: 'Zurück an den Fels — 7a bouldern',
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

  const [profile, setProfile] = useState(saved?.profile ?? DEFAULT_PROFILE)
  const [phase, setPhase] = useState(saved?.phase ?? 2)
  const [mood, setMood] = useState(null)
  const [workoutIdx, setWorkoutIdx] = useState(0)
  const [readiness, setReadiness] = useState(saved?.readiness ?? [false,false,false,false,false])
  const [sessions, setSessions] = useState(saved?.sessions ?? [])
  const [rests, setRests] = useState(saved?.rests ?? [])
  const [advancedAt, setAdvancedAt] = useState(saved?.advancedAt ?? null)

  // persist on change
  useEffect(() => {
    save({ profile, phase, readiness, sessions, rests, advancedAt })
  }, [profile, phase, readiness, sessions, rests, advancedAt])

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
  const canAdvance = phase < 3 && readinessMet && physioGate && !symptomBlock

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
      if (m === 'muede' || m === 'pause') setWorkoutIdx(2)
      else if (workoutIdx === 2) setWorkoutIdx(0)
      setRests(r => m === 'pause'
        ? Array.from(new Set([...r, isoDay(TODAY)]))
        : r.filter(d => d !== isoDay(TODAY)))
    },
    swapWorkout: () => setWorkoutIdx(i => (i + 1) % WORKOUTS.length),
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
      if (canAdvance) { setPhase(3); setAdvancedAt(isoDay(TODAY)) }
    },
    reset: () => {
      setPhase(2); setMood(null); setWorkoutIdx(0); setRests([])
      setReadiness([false,false,false,false,false]); setSessions([]); setAdvancedAt(null)
      setProfile(p => ({ ...p, physioCleared: false }))
      localStorage.removeItem(STORAGE_KEY)
    },
  }

  return {
    profile, phase, mood, moodObj, restDay, restToday, workoutIdx,
    readiness, sessions, rests, advancedAt,
    birth, weeksPP, monthsPP, crimpUnlock, crimpUnlocked, climbingUnlocked,
    deutlich7d, symptomBlock, readinessMet, physioGate, canAdvance, streak,
    serie, milestones: {
      list: MILESTONES, next: nextMilestone, earned: earnedMilestones,
      last: lastEarned, justHit: MILESTONES.includes(serie) && activeDays.has(isoDay(TODAY)),
    },
    workout: WORKOUTS[workoutIdx], actions,
  }
}
