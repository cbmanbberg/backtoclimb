const STORAGE_KEY = 'anna_v1'

export const DEFAULT_PROFILE = {
  name: 'Anna',
  birthDate: '2026-04-23',
  deliveryType: 'vaginal',
  breastfeeding: true,
  physioCleared: false,
  goalGrade: '7a',
  createdAt: new Date().toISOString(),
}

export const DEFAULT_STATE = {
  profile: DEFAULT_PROFILE,
  currentPhase: 1,
  phaseUnlocks: { phase2: null, phase3: null },
  sessions: [],
  symptomLog: [],
  readinessChecks: [],
  benchmarks: [],
  settings: { theme: 'warm', reminders: false, physioReminderDate: null },
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const saved = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...saved, profile: { ...DEFAULT_PROFILE, ...saved.profile } }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function getDayPostpartum(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()
  const diff = Math.floor((now - birth) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export function getWeekPostpartum(birthDate) {
  return Math.floor(getDayPostpartum(birthDate) / 7)
}

export function canUnlockPhase2(state) {
  const latest = [...state.readinessChecks]
    .filter(r => r.forPhase === 2)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  if (!latest) return false
  const allCriteria = Object.values(latest.criteria).every(Boolean)
  return allCriteria && state.profile.physioCleared
}

export function canUnlockPhase3(state) {
  const latest = [...state.readinessChecks]
    .filter(r => r.forPhase === 3)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  if (!latest) return false
  return Object.values(latest.criteria).every(Boolean)
}

export function unlockPhase(state, phase) {
  if (phase === 2 && !canUnlockPhase2(state)) return state
  if (phase === 3 && !canUnlockPhase3(state)) return state
  if (state.currentPhase >= phase) return state
  return {
    ...state,
    currentPhase: phase,
    phaseUnlocks: { ...state.phaseUnlocks, [`phase${phase}`]: new Date().toISOString() },
  }
}

export function logSession(state, session) {
  const id = `s_${Date.now()}`
  return {
    ...state,
    sessions: [...state.sessions, { id, ...session }],
  }
}

export function logSymptom(state, entry) {
  const today = new Date().toISOString().split('T')[0]
  const filtered = state.symptomLog.filter(s => s.date !== today)
  return { ...state, symptomLog: [...filtered, { date: today, ...entry }] }
}

export function saveReadinessCheck(state, check) {
  return { ...state, readinessChecks: [...state.readinessChecks, check] }
}

export function getTodaySymptom(state) {
  const today = new Date().toISOString().split('T')[0]
  return state.symptomLog.find(s => s.date === today) || null
}

export function getWeekSessions(state) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const session = state.sessions.find(s => s.date === dateStr)
    const symptom = state.symptomLog.find(s => s.date === dateStr)
    days.push({ date: dateStr, session, symptom, isToday: i === 0 })
  }
  return days
}

export function getPhaseLabel(phase) {
  return { 1: 'Phase 1', 2: 'Phase 2', 3: 'Phase 3' }[phase] || 'Phase 1'
}

export function getPhaseColor(phase) {
  return { 1: '#9B7FCC', 2: '#5A9E7A', 3: '#D4876A' }[phase] || '#9B7FCC'
}
