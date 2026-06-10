// Tiny Web-Audio helper: gentle, synthesized cues. No audio files needed.
let ctx = null
let enabled = true

export function setSoundEnabled(v) { enabled = v }
export function isSoundEnabled() { return enabled }

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    try { ctx = new AC() } catch { return null }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

// Call from a user gesture (e.g. the play button) to unlock audio on iOS.
export function primeSound() { getCtx() }

function blip(freq, dur, peak) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  osc.connect(g)
  g.connect(c.destination)
  const t = c.currentTime
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

// Soft pacing ticks for the contract / release rhythm.
export function tickOn()  { blip(528, 0.12, 0.045) }
export function tickOff() { blip(392, 0.12, 0.035) }

// Restrained two-note chime when a timer reaches its end.
export function stepEndChime() {
  blip(587.33, 0.45, 0.06)                       // D5
  setTimeout(() => blip(880, 0.5, 0.045), 95)    // A5
}
