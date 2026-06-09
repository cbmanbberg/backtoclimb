import React from 'react'

// Headspace-style blob characters — round, minimal, warm

function Blob({ size = 40, color, children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
      {/* organic blob shape */}
      <ellipse cx="20" cy="21" rx="17" ry="16" fill={color} />
      <ellipse cx="20" cy="20" rx="17" ry="16" fill={color} />
      {children}
    </svg>
  )
}

// ── Mood characters ──────────────────────────────────────

export function MoodHappy({ size = 32 }) {
  return (
    <Blob size={size} color="#F4A26A">
      {/* eyes */}
      <circle cx="14" cy="18" r="2.5" fill="#3D2E26" />
      <circle cx="26" cy="18" r="2.5" fill="#3D2E26" />
      {/* big smile */}
      <path d="M13 24 Q20 30 27 24" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* cheeks */}
      <ellipse cx="11" cy="22" rx="3" ry="2" fill="#E8875A" opacity="0.4"/>
      <ellipse cx="29" cy="22" rx="3" ry="2" fill="#E8875A" opacity="0.4"/>
    </Blob>
  )
}

export function MoodNeutral({ size = 32 }) {
  return (
    <Blob size={size} color="#F5C842">
      {/* eyes */}
      <circle cx="14" cy="18" r="2.5" fill="#3D2E26" />
      <circle cx="26" cy="18" r="2.5" fill="#3D2E26" />
      {/* flat mouth */}
      <line x1="14" y1="25" x2="26" y2="25" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round"/>
    </Blob>
  )
}

export function MoodTired({ size = 32 }) {
  return (
    <Blob size={size} color="#A89CC8">
      {/* droopy closed eyes */}
      <path d="M11 18 Q14 16 17 18" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M23 18 Q26 16 29 18" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* slight frown */}
      <path d="M14 25 Q20 23 26 25" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* zzz */}
      <text x="26" y="12" fontSize="7" fill="#3D2E26" opacity="0.5" fontWeight="bold">z</text>
    </Blob>
  )
}

export function MoodPause({ size = 32 }) {
  return (
    <Blob size={size} color="#6BBFA3">
      {/* peaceful closed eyes — curved up */}
      <path d="M11 18 Q14 21 17 18" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M23 18 Q26 21 29 18" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* soft smile */}
      <path d="M14 24 Q20 28 26 24" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* small moon */}
      <path d="M30 6 Q34 10 30 14 Q27 10 30 6Z" fill="#F5C842" opacity="0.9"/>
    </Blob>
  )
}

// ── Workout / activity icons ──────────────────────────────

export function IconPelvic({ size = 36 }) {
  // blob in lotus/meditation pose
  return (
    <Blob size={size} color="#C4A8E8">
      <circle cx="14" cy="17" r="2" fill="#3D2E26"/>
      <circle cx="26" cy="17" r="2" fill="#3D2E26"/>
      <path d="M14 23 Q20 27 26 23" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* lotus petals hint */}
      <ellipse cx="20" cy="33" rx="5" ry="3" fill="#E8D5F5" opacity="0.6"/>
      <ellipse cx="12" cy="31" rx="4" ry="2.5" fill="#E8D5F5" opacity="0.5"/>
      <ellipse cx="28" cy="31" rx="4" ry="2.5" fill="#E8D5F5" opacity="0.5"/>
    </Blob>
  )
}

export function IconBreath({ size = 36 }) {
  // blob blowing breath
  return (
    <Blob size={size} color="#89C4D8">
      <circle cx="14" cy="18" r="2" fill="#3D2E26"/>
      <circle cx="24" cy="18" r="2" fill="#3D2E26"/>
      {/* O-mouth */}
      <circle cx="19" cy="25" r="3" stroke="#3D2E26" strokeWidth="1.8" fill="none"/>
      {/* breath lines */}
      <path d="M24 24 Q28 22 32 24" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M24 27 Q29 27 33 26" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
    </Blob>
  )
}

export function IconWalk({ size = 36 }) {
  // blob with stride
  return (
    <Blob size={size} color="#7DC49A">
      <circle cx="15" cy="17" r="2" fill="#3D2E26"/>
      <circle cx="25" cy="17" r="2" fill="#3D2E26"/>
      <path d="M15 23 Q20 26 25 23" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* legs in stride */}
      <path d="M16 34 L18 28 L22 34" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M24 34 L22 28 L18 34" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
    </Blob>
  )
}

export function IconStrength({ size = 36 }) {
  // blob with arms up
  return (
    <Blob size={size} color="#F4A26A">
      <circle cx="15" cy="18" r="2" fill="#3D2E26"/>
      <circle cx="25" cy="18" r="2" fill="#3D2E26"/>
      <path d="M14 24 Q20 28 26 24" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* arms raised */}
      <path d="M8 15 Q5 10 8 7" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 15 Q35 10 32 7" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </Blob>
  )
}

export function IconHand({ size = 36 }) {
  // blob holding up open hand
  return (
    <Blob size={size} color="#B8A0D8">
      <circle cx="14" cy="18" r="2" fill="#3D2E26"/>
      <circle cx="26" cy="18" r="2" fill="#3D2E26"/>
      <path d="M14 24 Q20 27 26 24" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* open hand above head */}
      <rect x="16" y="4" width="8" height="6" rx="2" fill="#3D2E26" opacity="0.25"/>
      <line x1="17" y1="4" x2="17" y2="2" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="4" x2="20" y2="1" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="23" y1="4" x2="23" y2="2" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round"/>
    </Blob>
  )
}

export function IconClimb({ size = 36 }) {
  // blob reaching up on a wall
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* wall */}
      <rect x="28" y="2" width="8" height="36" rx="2" fill="#EBE0D4"/>
      <circle cx="30" cy="8" r="2.5" fill="#C4A8E8"/>
      <circle cx="33" cy="16" r="2.5" fill="#C4A8E8"/>
      <circle cx="30" cy="24" r="2.5" fill="#C4A8E8"/>
      {/* blob body */}
      <ellipse cx="18" cy="22" rx="13" ry="12" fill="#F4A26A"/>
      {/* eyes */}
      <circle cx="13" cy="20" r="2" fill="#3D2E26"/>
      <circle cx="22" cy="20" r="2" fill="#3D2E26"/>
      {/* smile */}
      <path d="M12 26 Q17 29 23 26" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* arm reaching */}
      <path d="M25 16 Q29 10 30 8" stroke="#3D2E26" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function IconBoulder({ size = 36 }) {
  // blob crouching at a boulder
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* boulder */}
      <ellipse cx="28" cy="30" rx="10" ry="8" fill="#C4B8A8"/>
      <ellipse cx="26" cy="28" rx="8" ry="6" fill="#D8CFC4"/>
      {/* blob */}
      <ellipse cx="16" cy="22" rx="12" ry="11" fill="#6BBFA3"/>
      <circle cx="12" cy="20" r="2" fill="#3D2E26"/>
      <circle cx="21" cy="20" r="2" fill="#3D2E26"/>
      <path d="M11 26 Q16 30 22 26" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* hand on rock */}
      <path d="M22 24 Q26 22 28 22" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

// ── UI / decorative characters ────────────────────────────

export function IconBook({ size = 48 }) {
  // blob reading a book
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="22" rx="16" ry="15" fill="#C4A8E8"/>
      <circle cx="19" cy="20" r="2.5" fill="#3D2E26"/>
      <circle cx="29" cy="20" r="2.5" fill="#3D2E26"/>
      <path d="M18 27 Q24 31 30 27" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* open book */}
      <rect x="12" y="34" width="24" height="11" rx="2" fill="#F5EFE6"/>
      <line x1="24" y1="34" x2="24" y2="45" stroke="#C4B8A8" strokeWidth="1.5"/>
      <line x1="15" y1="38" x2="22" y2="38" stroke="#C4B8A8" strokeWidth="1"/>
      <line x1="15" y1="41" x2="22" y2="41" stroke="#C4B8A8" strokeWidth="1"/>
      <line x1="26" y1="38" x2="33" y2="38" stroke="#C4B8A8" strokeWidth="1"/>
      <line x1="26" y1="41" x2="33" y2="41" stroke="#C4B8A8" strokeWidth="1"/>
    </svg>
  )
}

export function IconMoon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M15 10 Q18 14 14 18 Q8 20 4 16 Q0 12 2 6 Q6 2 10 4 Q6 7 6 11 Q6 16 11 17 Q14 17 15 14Z" fill="#F5C842"/>
    </svg>
  )
}

export function IconPlant({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="18" rx="12" ry="11" fill="#7DC49A"/>
      <circle cx="12" cy="16" r="2" fill="#3D2E26"/>
      <circle cx="20" cy="16" r="2" fill="#3D2E26"/>
      <path d="M12 22 Q16 26 20 22" stroke="#3D2E26" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* sprout on head */}
      <path d="M16 7 L16 4" stroke="#5A9E7A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 5 Q13 3 12 5" stroke="#5A9E7A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M16 5 Q19 3 20 5" stroke="#5A9E7A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function IconSeedling({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="20" ry="18" fill="#7DC49A"/>
      <circle cx="25" cy="33" r="3" fill="#3D2E26"/>
      <circle cx="39" cy="33" r="3" fill="#3D2E26"/>
      <path d="M25 43 Q32 48 39 43" stroke="#3D2E26" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* seedling on head */}
      <path d="M32 18 L32 10" stroke="#5A9E7A" strokeWidth="3" strokeLinecap="round"/>
      <path d="M32 13 Q25 8 22 12" stroke="#5A9E7A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 13 Q39 8 42 12" stroke="#5A9E7A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function IconSparkle({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="20" ry="18" fill="#F4A26A"/>
      <circle cx="25" cy="33" r="3" fill="#3D2E26"/>
      <circle cx="39" cy="33" r="3" fill="#3D2E26"/>
      <path d="M25 43 Q32 48 39 43" stroke="#3D2E26" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* sparkles */}
      <path d="M12 14 L13 10 L14 14 L18 15 L14 16 L13 20 L12 16 L8 15Z" fill="#F5C842"/>
      <path d="M46 8 L47 5 L48 8 L51 9 L48 10 L47 13 L46 10 L43 9Z" fill="#C4A8E8"/>
      <path d="M50 28 L51 26 L52 28 L54 29 L52 30 L51 32 L50 30 L48 29Z" fill="#89C4D8"/>
    </svg>
  )
}

export function IconWave({ size = 24 }) {
  // waving hand blob inline
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="9" fill="#F4A26A"/>
      <circle cx="9" cy="11" r="1.5" fill="#3D2E26"/>
      <circle cx="15" cy="11" r="1.5" fill="#3D2E26"/>
      <path d="M9 15 Q12 17 15 15" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* wave lines next to */}
      <path d="M20 8 Q22 10 20 12" stroke="#F4A26A" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function IconMedical({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="9" fill="#89C4D8"/>
      <circle cx="9" cy="10" r="1.5" fill="#3D2E26"/>
      <circle cx="15" cy="10" r="1.5" fill="#3D2E26"/>
      <path d="M9 14 Q12 16 15 14" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* stethoscope hint */}
      <path d="M14 16 Q18 17 18 20" stroke="#3D2E26" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="18" cy="21" r="1.5" stroke="#3D2E26" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

export function IconClipboard({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="16" rx="2" fill="#F5EFE6" stroke="#EBE0D4" strokeWidth="1.5"/>
      <rect x="8" y="4" width="8" height="4" rx="1" fill="#C4A8E8"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="#C4A8E8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="15" x2="14" y2="15" stroke="#EBE0D4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="18" x2="12" y2="18" stroke="#EBE0D4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconWater({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2 Q14 8 14 12 Q14 17 10 17 Q6 17 6 12 Q6 8 10 2Z" fill="#89C4D8"/>
      <ellipse cx="8.5" cy="11" rx="1.5" ry="2" fill="white" opacity="0.4"/>
    </svg>
  )
}

export function IconWarning({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2 L18 17 H2 Z" fill="#F5C842" stroke="#E8A020" strokeWidth="1"/>
      <line x1="10" y1="8" x2="10" y2="13" stroke="#3D2E26" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="15.5" r="1" fill="#3D2E26"/>
    </svg>
  )
}

export function IconCheck({ size = 16, color = '#5A9E7A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={color}/>
      <path d="M4 8 L7 11 L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// map for workout icons by id
export const WORKOUT_ICONS = {
  p1_pelvic_basic: IconPelvic,
  p1_breath: IconBreath,
  p1_walk: IconWalk,
  p2_strength: IconStrength,
  p2_tendon: IconHand,
  p3_fingerboard: IconClimb,
  p3_boulder: IconBoulder,
}
