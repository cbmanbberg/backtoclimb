export const WORKOUTS = [
  // Phase 1
  {
    id: 'p1_pelvic_basic',
    phase: 1,
    type: 'pelvic',
    title: 'Beckenboden-Aktivierung',
    subtitle: 'Basis-Aktivierung & 360°-Atmung',
    durationMin: 15,
    icon: '🌸',
    reference: 'Bø et al. 2015 — Pelvic floor muscle training',
    steps: [
      { label: 'Ankommen', duration: 60, cue: 'Lege dich bequem auf den Rücken. Füße hüftbreit, Knie angewinkelt. Atme tief ein und aus.' },
      { label: '360°-Atmung', duration: 120, cue: 'Stell dir vor, dein Beckenboden ist eine Uhr. Atme ein — Beckenboden senkt sich. Atme aus — Beckenboden hebt sich sanft.' },
      { label: 'Slow Hold ×5', duration: 150, cue: 'Spanne den Beckenboden langsam an (10 Sek.), halte, löse langsam (10 Sek.). 5 Wiederholungen.' },
      { label: 'Quick Flicks ×10', duration: 120, cue: 'Kurze, schnelle Anspannungen des Beckenbodens. 1 Sek. an, 1 Sek. los. 10 Mal.' },
      { label: 'Entspannung', duration: 60, cue: 'Atme tief durch den Bauch. Lass alles los. Spüre nach.' },
    ],
  },
  {
    id: 'p1_breath',
    phase: 1,
    type: 'breath',
    title: 'IAP-Atemtraining',
    subtitle: 'Intraabdominaler Druckausgleich',
    durationMin: 10,
    icon: '💨',
    reference: 'Lee & Hodges 2016 — Intra-abdominal pressure',
    steps: [
      { label: 'Startposition', duration: 60, cue: 'Vierfüßler oder auf dem Rücken. Entspanne den Bauch vollständig.' },
      { label: 'Exhale-Bracing ×8', duration: 180, cue: 'Atme aus und ziehe gleichzeitig Beckenboden sanft nach oben. Halte 5 Sek. Dann einatmen und loslassen. 8 Mal.' },
      { label: 'Heben mit IAP', duration: 180, cue: 'Atme aus, aktiviere Beckenboden, hebe dann langsam ein Knie zur Brust — Beckenboden bleibt aktiv.' },
      { label: 'Nachspüren', duration: 60, cue: 'Atme tief und natürlich. Wie fühlt sich dein Zentrum an?' },
    ],
  },
  {
    id: 'p1_walk',
    phase: 1,
    type: 'cardio',
    title: 'Progressives Gehen',
    subtitle: 'Low-Impact-Cardio, symptomgeführt',
    durationMin: 20,
    icon: '🚶‍♀️',
    reference: 'Goom, Donnelly & Brockwell 2019',
    steps: [
      { label: 'Warm-up', duration: 120, cue: 'Gehe langsam los. Achte auf deinen Beckenboden — kein Druck, kein Schweregefühl.' },
      { label: 'Hauptteil', duration: 900, cue: 'Gleichmäßiges Tempo. Bei Symptomen (Druck, Auslaufen) sofort pausieren.' },
      { label: 'Cool-down', duration: 120, cue: 'Verlangsame das Tempo. Bodenscan: Wie fühlst du dich?' },
    ],
  },
  // Phase 2
  {
    id: 'p2_strength',
    phase: 2,
    type: 'strength',
    title: 'Rumpf & Schultern',
    subtitle: 'Körpergewicht, progressiv',
    durationMin: 30,
    icon: '💪',
    reference: 'Christopher et al. 2024 (BJSM Delphi)',
    steps: [
      { label: 'Warm-up', duration: 180, cue: 'Beckenboden aktivieren, 360°-Atmung, Schulterkreisen.' },
      { label: 'Dead Bug ×10', duration: 180, cue: 'Auf dem Rücken. Rücken bleibt am Boden. Abwechselnd Arm/Bein strecken. Beckenboden aktiv.' },
      { label: 'Bird Dog ×10', duration: 180, cue: 'Vierfüßler. Abwechselnd Arm/Bein parallel zum Boden strecken. Hüfte stabil.' },
      { label: 'Glute Bridge ×12', duration: 180, cue: 'Auf dem Rücken, Knie angewinkelt. Hüfte heben, Gesäß anspannen, 2 Sek. halten.' },
      { label: 'Schulter-Antagonisten', duration: 180, cue: 'Band-Außenrotation, Reverse Flyes. 3×12. Wichtig für klettergerechte Schulter.' },
      { label: 'Cool-down', duration: 120, cue: 'Dehnen, Nachspüren. Keine Symptome?' },
    ],
  },
  {
    id: 'p2_tendon',
    phase: 2,
    type: 'climb',
    title: 'Finger-Sehnen Vorbereitung',
    subtitle: 'Open-Hand only, kein Crimp',
    durationMin: 20,
    icon: '🖐️',
    reference: 'Michailov et al. 2022 — Finger tendon loading',
    steps: [
      { label: 'Warm-up', duration: 120, cue: 'Hände ausschütteln, Handgelenke kreisen. Finger einzeln strecken und beugen.' },
      { label: 'Isometric Open-Hand', duration: 240, cue: 'Open-Hand Griff an einer Edge. 7 Sek. halten, 3 Sek. Pause. 6 Mal. Kein Schmerz!' },
      { label: 'Wrist Extensor Stretch', duration: 120, cue: 'Arm ausstrecken, Hand nach unten biegen. 30 Sek. pro Seite. 2 Mal.' },
      { label: 'Rice Bucket', duration: 120, cue: 'Hände in Reisbehälter, alle Bewegungsrichtungen. Sehnenaufbau.' },
    ],
  },
  // Phase 3
  {
    id: 'p3_fingerboard',
    phase: 3,
    type: 'climb',
    title: 'Fingerboard-Protokoll',
    subtitle: 'Open-Hand Repeaters',
    durationMin: 35,
    icon: '🧗',
    reference: 'Giles et al. 2014 — Hangboard training',
    steps: [
      { label: 'Warm-up', duration: 300, cue: 'Cardio 5 Min., dann Fingererwärmung, Schultern, Rumpf aktivieren.' },
      { label: 'Set 1 — Open-Hand', duration: 420, cue: '7 Sek. hängen, 3 Sek. Pause, 6 Wiederholungen. 2–3 Min. Pause zwischen Sets.' },
      { label: 'Set 2 — Open-Hand', duration: 420, cue: 'Gleiche Struktur. Intensität leicht erhöhen wenn symptomfrei.' },
      { label: 'Set 3 — Open-Hand', duration: 420, cue: 'Letztes Set. Qualität vor Intensität.' },
      { label: 'Cool-down', duration: 180, cue: 'Dehnen, Hände ausschütteln, Nachspüren. Crimp erst ab Monat 8–9.' },
    ],
  },
  {
    id: 'p3_boulder',
    phase: 3,
    type: 'climb',
    title: 'Boulder-Technik',
    subtitle: 'Footwork & Körperposition',
    durationMin: 60,
    icon: '🪨',
    reference: 'Gilmore et al. 2024',
    steps: [
      { label: 'Warm-up', duration: 600, cue: 'Leichte Routen, Körper ankommen lassen. Beckenboden im Blick behalten.' },
      { label: 'Footwork-Fokus', duration: 1200, cue: 'Präzises Treten. Stille Füße. Routen zweimal: einmal langsam, einmal flüssig.' },
      { label: 'Körperposition', duration: 900, cue: 'Hip Rotation, Flagging, Drop Knee. Technik vor Kraft.' },
      { label: 'Cool-down', duration: 300, cue: 'Stretchen, Schultern, Hüfte. Bodyscan.' },
    ],
  },
]

export function getTodayWorkouts(phase) {
  const phaseWorkouts = WORKOUTS.filter(w => w.phase === phase)
  if (phaseWorkouts.length === 0) return []
  const day = new Date().getDay()
  if (phase === 1) {
    if (day === 0 || day === 3) return []
    if (day === 1 || day === 4) return [phaseWorkouts.find(w => w.id === 'p1_pelvic_basic')]
    if (day === 2 || day === 5) return [phaseWorkouts.find(w => w.id === 'p1_walk')]
    return [phaseWorkouts.find(w => w.id === 'p1_breath')]
  }
  if (phase === 2) {
    if (day === 0 || day === 3) return []
    if (day === 1 || day === 4) return [phaseWorkouts.find(w => w.id === 'p2_strength')]
    return [phaseWorkouts.find(w => w.id === 'p2_tendon')]
  }
  if (phase === 3) {
    if (day === 0) return []
    if (day === 1 || day === 4) return [phaseWorkouts.find(w => w.id === 'p3_fingerboard')]
    return [phaseWorkouts.find(w => w.id === 'p3_boulder')]
  }
  return []
}

export function getDayMessage(weekPP, mood) {
  if (mood === 'pause') return 'Ruhe ist Training. Dein Körper baut in der Erholung auf.'
  if (mood === 'tired') return 'Müdigkeit mit einem Baby ist normal. Höre auf deinen Körper heute.'
  if (weekPP < 2) return 'Willkommen in den ersten Tagen. Nur Ruhe und sanfte Atemübungen.'
  if (weekPP < 6) return 'Sanft und symptomgeführt — dein Beckenboden erholt sich gerade.'
  if (weekPP < 12) return 'Du machst das wunderbar. Jeder Tag zählt, auch Ruhetage.'
  if (weekPP < 24) return 'Phase 2 — dein Körper wird stärker. Bleib geduldig mit dir.'
  return 'Du bist auf dem Weg zurück ans Fels. Schritt für Schritt.'
}
