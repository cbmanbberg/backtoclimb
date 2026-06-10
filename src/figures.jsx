// Minimal line-art pose pictograms, one per exercise position.
// Same visual system as the icon set: round strokes, currentColor, 64×48 canvas.

const floor = <path key="f" d="M7 44h50" opacity=".22" strokeWidth="2" />
const head = (cx, cy, r = 3.2) => <circle key="h" cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />

const POSES = {
  // Rückenlage, Knie angestellt
  supine: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.6" />,
    <path key="2" d="M33 40.6 41 29.5 46.5 43" />,
  ],
  // Rückenlage mit Atembögen
  supineBreath: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.6" />,
    <path key="2" d="M33 40.6 41 29.5 46.5 43" />,
    <path key="3" d="M23 32.5q3.5-3.5 7 0" opacity=".55" strokeWidth="2.2" />,
    <path key="4" d="M25 27.5q2.5-2.5 5 0" opacity=".35" strokeWidth="2.2" />,
  ],
  // Beckenboden in Rückenlage (Pfeil nach oben)
  pelvic: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.6" />,
    <path key="2" d="M33 40.6 41 29.5 46.5 43" />,
    <path key="3" d="M27 34v-8" />,
    <path key="4" d="M24 29l3-3 3 3" />,
  ],
  // Dead Bug
  deadbug: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.4" />,
    <path key="2" d="M21 40 20 25" />,
    <path key="3" d="M33 40.4 37.5 28 45.5 29.5" />,
    <path key="4" d="M33 40.4 51 36.5" opacity=".45" />,
  ],
  // Seitstütz auf dem Unterarm
  sideplank: [
    floor, head(23.5, 26.8),
    <path key="1" d="M12 43.2h11.5" />,
    <path key="2" d="M16.5 43 21.5 31.5" />,
    <path key="3" d="M21.5 31.5 41.5 41.5" />,
    <path key="4" d="M41.5 41.5 51 43.2" />,
  ],
  // Brücke / Glute Bridge
  bridge: [
    floor, head(10.5, 40.5),
    <path key="1" d="M15.5 42.2 31.5 28.5 38 27.5 43 43.2" />,
  ],
  // Heel Slide (ein Bein gleitet aus)
  heelslide: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.5" />,
    <path key="2" d="M33 40.5 39.5 29.5 44.5 43" />,
    <path key="3" d="M33 40.5 52 41.5" />,
    <path key="4" d="M49 36.5h7" opacity=".7" strokeWidth="2.2" />,
    <path key="5" d="M53.5 33.8 56.5 36.5 53.5 39.2" opacity=".7" strokeWidth="2.2" />,
  ],
  // Kindshaltung
  childpose: [
    floor, head(43.8, 37.6),
    <path key="1" d="M13.5 43.2h11" />,
    <path key="2" d="M24 43 17 33.5" />,
    <path key="3" d="M17 33.5Q28.5 24.5 41 35.5" />,
    <path key="4" d="M46.5 40.5 56.5 43.2" />,
  ],
  // Hang an der Stange
  hang: [
    head(32, 13.5),
    <path key="1" d="M16 6.5h32" />,
    <path key="2" d="M24 6.5 29 16.5" />,
    <path key="3" d="M40 6.5 35 16.5" />,
    <path key="4" d="M32 17.5v15" />,
    <path key="5" d="M32 32.5 28.5 45" />,
    <path key="6" d="M32 32.5 35.5 45" />,
  ],
  // Hang am Fingerboard
  board: [
    head(32, 16.5),
    <path key="1" d="M20 6h24" strokeWidth="5" />,
    <path key="2" d="M25 9.5 29 19.5" />,
    <path key="3" d="M39 9.5 35 19.5" />,
    <path key="4" d="M32 20.5v12.5" />,
    <path key="5" d="M32 33 28.5 45" />,
    <path key="6" d="M32 33 35.5 45" />,
  ],
  // Ruderzug mit Band
  row: [
    floor, head(23.5, 10.8),
    <path key="1" d="M24.5 14.5 25.5 31" />,
    <path key="2" d="M25.5 31 21.5 44.5" />,
    <path key="3" d="M25.5 31 29.5 44.5" />,
    <path key="4" d="M24.8 17 32.5 23.5 36.5 21" />,
    <path key="5" d="M37.5 20.5 53 15.8" strokeWidth="2.2" strokeDasharray="2.5 3" opacity=".6" />,
    <path key="6" d="M54.5 11v9" />,
  ],
  // Außenrotation der Schulter
  rotation: [
    floor, head(30, 9.8),
    <path key="1" d="M30 13.5v17.5" />,
    <path key="2" d="M30 31 26 44.5" />,
    <path key="3" d="M30 31 34 44.5" />,
    <path key="4" d="M30 16.5 37 23" />,
    <path key="5" d="M37 23 45.5 18.5" />,
    <path key="6" d="M46.5 27.5Q51.5 23.5 48.5 16.5" opacity=".55" strokeWidth="2.2" />,
    <path key="7" d="M45.8 18.8 48.5 16.2 51 19.3" opacity=".55" strokeWidth="2.2" />,
  ],
  // Kniebeuge
  squat: [
    floor, head(27, 12.8),
    <path key="1" d="M26.5 16.5 22.5 30" />,
    <path key="2" d="M22.5 30 34 31.5" />,
    <path key="3" d="M34 31.5 33 44.5" />,
    <path key="4" d="M26 19 39.5 23" />,
  ],
  // Ausfallschritt
  lunge: [
    floor, head(31, 9.5),
    <path key="1" d="M31 13 29.5 27.5" />,
    <path key="2" d="M29.5 27.5 40 30 40 44.5" />,
    <path key="3" d="M29.5 27.5 15.5 44.5" />,
  ],
  // Stehen, Mobilisieren
  stand: [
    floor, head(32, 9.3),
    <path key="1" d="M32 13v17" />,
    <path key="2" d="M32 30 27.5 44.5" />,
    <path key="3" d="M32 30 36.5 44.5" />,
    <path key="4" d="M32 16.5 24 24.5" />,
    <path key="5" d="M32 16.5 40 24.5" />,
    <path key="6" d="M18.5 13.5Q14.5 19 18 24.5" opacity=".4" strokeWidth="2.2" />,
    <path key="7" d="M45.5 13.5Q49.5 19 46 24.5" opacity=".4" strokeWidth="2.2" />,
  ],
  // Beckenboden im Stehen (Pfeil nach oben)
  pelvicStand: [
    floor, head(28, 9.3),
    <path key="1" d="M28 13v17" />,
    <path key="2" d="M28 30 24 44.5" />,
    <path key="3" d="M28 30 32 44.5" />,
    <path key="4" d="M28 16.5 23.5 26" />,
    <path key="5" d="M28 16.5 32.5 26" />,
    <path key="6" d="M40 33v-8" />,
    <path key="7" d="M37 28l3-3 3 3" />,
  ],
  // Brustöffner an der Wand
  chest: [
    head(25.5, 11.3),
    <path key="f" d="M7 44h45.5" opacity=".22" strokeWidth="2" />,
    <path key="1" d="M52.5 7v37" />,
    <path key="2" d="M26 15 28 31" />,
    <path key="3" d="M28 31 24 44.5" />,
    <path key="4" d="M28 31 32 44.5" />,
    <path key="5" d="M26.5 17 52.5 13.5" />,
  ],
  // Sitzen, Atmen
  sit: [
    head(32, 11.8, 3.4),
    <path key="1" d="M32 15.5v15" />,
    <path key="2" d="M32 30.5 19 39.5" />,
    <path key="3" d="M32 30.5 45 39.5" />,
    <path key="4" d="M19 39.5Q32 45 45 39.5" />,
    <path key="5" d="M41.5 19q3.5-3.5 7 0" opacity=".5" strokeWidth="2.2" />,
    <path key="6" d="M43.5 14q2.5-2.5 5 0" opacity=".3" strokeWidth="2.2" />,
  ],
  // Beckenkippen (Wippen)
  pelvictilt: [
    floor, head(12, 38.7),
    <path key="1" d="M17 40.2 33 40.6" />,
    <path key="2" d="M33 40.6 41 29.5 46.5 43" />,
    <path key="3" d="M20 30Q26 24 32 30" strokeWidth="2.2" />,
    <path key="4" d="M23.3 30.8 20 30 20.8 26.7" strokeWidth="2.2" />,
    <path key="5" d="M28.7 30.8 32 30 31.2 26.7" strokeWidth="2.2" />,
  ],
  // Hüftöffner (Knöchel auf Knie)
  hipopener: [
    floor, head(11.5, 38.7),
    <path key="1" d="M16.5 40 30 40.3" />,
    <path key="2" d="M30 40.3 36.5 27.5" />,
    <path key="3" d="M36.5 27.5 45 32.5" />,
    <path key="4" d="M30 32 37 35.5" />,
  ],
  // Hüftbeuger-Dehnung im Kniestand
  hipflexor: [
    floor, head(29.3, 10.5),
    <path key="1" d="M9.5 43.5 20 43.8" />,
    <path key="2" d="M20 43.8 27 30" />,
    <path key="3" d="M27 30 29 13.5" />,
    <path key="4" d="M27 30 39.5 31.5 42 44.5" />,
  ],
  // Ausschütteln / Pause
  shake: [
    floor, head(32, 9.3),
    <path key="1" d="M32 13v17" />,
    <path key="2" d="M32 30 27.5 44.5" />,
    <path key="3" d="M32 30 36.5 44.5" />,
    <path key="4" d="M32 16.5 26 27.5" />,
    <path key="5" d="M32 16.5 38 27.5" />,
    <path key="6" d="M22.5 29.5q-2 1.8 0 3.6t0 3.6" opacity=".45" strokeWidth="2" />,
    <path key="7" d="M41.5 29.5q2 1.8 0 3.6t0 3.6" opacity=".45" strokeWidth="2" />,
  ],
  // An der Wand klettern
  climbWall: [
    head(27.5, 11.5),
    <path key="1" d="M13 4.5v39.5" />,
    <path key="2" d="M13 11.5h3.5" strokeWidth="2.2" opacity=".7" />,
    <path key="3" d="M13 24h3.5" strokeWidth="2.2" opacity=".7" />,
    <path key="4" d="M13 36.5h3.5" strokeWidth="2.2" opacity=".7" />,
    <path key="5" d="M28 15.5 30 30" />,
    <path key="6" d="M27.8 17 16.5 11" />,
    <path key="7" d="M30 30 17 35.5" />,
    <path key="8" d="M30 30 25.5 43.5" />,
  ],
  // Unterarm dehnen
  stretchArm: [
    floor, head(20, 10.3),
    <path key="1" d="M20 14v16" />,
    <path key="2" d="M20 30 16 44.5" />,
    <path key="3" d="M20 30 24 44.5" />,
    <path key="4" d="M20 17 39 22" />,
    <path key="5" d="M39 22 43.5 14" />,
    <path key="6" d="M41 11.5 47 16" opacity=".75" />,
  ],
}

export function Figure({ pose, size = 64, color = 'currentColor', style }) {
  const d = POSES[pose]
  if (!d) return null
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 64 48" fill="none"
      stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ color, ...style }} aria-hidden="true">
      {d}
    </svg>
  )
}
