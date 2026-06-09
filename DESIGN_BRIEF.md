# BackToClimb — Design Brief für Design Agent

## Produkt

**BackToClimb** ist eine postpartale Return-to-Sport App für Kletterinnen.
Tech Stack: React 18 + Vite, Inline CSS + globaler CSS-String in `App.jsx`, Google Fonts via `<link>` in `index.html`, LocalStorage State.

---

## Inhaltlicher Kern

**2/3 Sicher zurück ans Klettern**
Der primäre Job der App ist es, eine Athletin nach der Geburt evidenzbasiert und sicher zurück zum Klettern zu führen. Das bedeutet:
- Strukturierter 3-Phasen-Plan (Phase 1: Wochen 0–12 Beckenboden/Atmung, Phase 2: Wochen 12–24 Kraft/Sehnen, Phase 3: Monat 6–12 Fingerboard/Bouldern)
- Harte programmatische Gates zwischen den Phasen — nicht nur Zeitablauf, sondern Symptomfreiheit + Readiness-Kriterien
- Tendon- und Beckenbodenlogik sind verknüpft: Klettern erst wenn beides grün ist
- Crimp-Gate: Open-Hand erst ab Phase 3, Crimp frühestens Monat 8–9 — kein Texthinweis, sondern echtes Gate

**1/3 Tägliche Begleitung**
- Mood-Check beim Öffnen mit Konsequenz (beeinflusst Empfehlung des Tages)
- Symptom-Log nach jeder Session (Druck? Auslaufen? Schmerz?) — kurz, max. 3 Sekunden
- Wöchentlicher Symptom-Trend sichtbar ("diese Woche: 0 Symptome")
- Motivierende aber nicht infantilisierende Begleitung

**Was die App nicht ist:**
Keine allgemeine Fitness-App, kein Mama-Wellbeing-Tool, keine medizinische Diagnose-App.
Die Nutzerin ist Athletin — sie will zurück an die Wand, nicht betüttelt werden.

---

## Tonalität & Designprinzipien

- **Warm und behaglich, aber fokussiert** — wie eine gute Trainerin, nicht wie eine Hebammen-Broschüre
- **Contemporary minimalistisch** — großzügiger Whitespace ist das Designmittel
- **Confident** — die Nutzerin ist Athletin, nicht Patientin
- Kein Pink-Washing, kein Pastell, keine generischen Women's Health Ästhetiken
- Serifen-Headlines für editoriale Autorität, Sans-Serif für UI-Klarheit

---

## Design System

### Farben

| Rolle | Name | Hex |
|---|---|---|
| Background | Chalk White | `#F7F5F2` |
| Card Surface | White | `#FFFFFF` |
| Alt Surface | Warm Stone | `#F0EDE8` |
| Primary | Slate Teal | `#2D6A65` |
| Primary Dark | Deep Teal | `#1F4F4B` |
| Primary Tint | Sage Mist | `#EAF2F1` |
| Primary Tint Border | — | `#C2DFDC` |
| Secondary | Terracotta | `#C4704A` |
| Secondary Tint | Warm Blush | `#FAF0EB` |
| Secondary Tint Border | — | `#EDCAB8` |
| Text Heading | Warm Black | `#1A1714` |
| Text Body | Warm Brown | `#3D3834` |
| Text Muted | — | `#7A736C` |
| Text Disabled | — | `#B8B2AC` |
| Border | — | `#E8E4DF` |
| Border Strong | — | `#DDD8D2` |

### Typografie

Google Fonts Import:
```
Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600
```

| Element | Font | Größe | Gewicht | Line-Height | Letter-Spacing |
|---|---|---|---|---|---|
| H1 | Playfair Display | 40px | 700 | 1.15 | -0.5px |
| H2 | Playfair Display | 28px | 500 | 1.25 | -0.3px |
| H3 | DM Sans | 20px | 600 | 1.35 | -0.1px |
| Body | DM Sans | 16px | 400 | 1.65 | 0 |
| Body S | DM Sans | 14px | 400 | 1.60 | 0 |
| Label/Caps | DM Sans | 12px | 500 | 1.4 | 0.8px + uppercase |
| Fine Print | DM Sans | 11px | 400 | 1.5 | 0.2px |

H1 und H2 = Playfair Display (Italic für emotionale Akzente, z.B. *zurück ans Fels.*)
H3 und alles darunter = DM Sans

### Karten & Surfaces

```
Standard Card:
  background: #FFFFFF
  border: 1px solid #E8E4DF
  border-radius: 12px
  box-shadow: 0 1px 3px rgba(26,23,20,0.06), 0 4px 12px rgba(26,23,20,0.04)
  padding: 24px

Elevated Card (Modals, Gates):
  border-radius: 16px
  box-shadow: 0 4px 16px rgba(26,23,20,0.10), 0 1px 4px rgba(26,23,20,0.06)

Flat / Inset (Hinweise, sekundäre Infos):
  background: #F0EDE8
  border: none
  border-radius: 8px
  box-shadow: none
  padding: 16px

Highlight Teal (Erfolg, Freischaltung):
  background: #EAF2F1
  border: 1px solid #C2DFDC

Highlight Terra (Warnung, Beckenboden-Check):
  background: #FAF0EB
  border: 1px solid #EDCAB8
```

### Buttons

Alle Buttons: `font-family: DM Sans`, `font-weight: 500`, `border-radius: 6px`, `transition: all 150ms ease`, `letter-spacing: 0.1px`

```
Primary:
  background: #2D6A65 → hover: #1F4F4B
  color: #F7F5F2
  box-shadow: 0 1px 3px rgba(45,106,101,0.30)
  padding: 12px 24px / Large: 14px 32px (font-weight 600) / Small: 8px 16px

Secondary:
  background: #FFFFFF → hover: #EAF2F1
  color: #2D6A65
  border: 1.5px solid #2D6A65

Ghost:
  background: transparent → hover: #F0EDE8
  color: #3D3834
  border: none

Terracotta (Meilensteine, Warnungen):
  background: #C4704A
  color: #FAF0EB
  box-shadow: 0 1px 3px rgba(196,112,74,0.30)

Disabled: background #B8B2AC, color #F7F5F2, cursor not-allowed
```

### Spacing

`4 · 8 · 16 · 24 · 32 · 48 · 64px`

### Border Radius

`6px` (Buttons, Inputs) · `12px` (Cards) · `20px` (Feature Cards) · `9999px` (Pills, Avatare)

---

## App-Struktur (5 Tabs)

### Tab 1 — Heute (Home)
- Persönliche Begrüßung mit Serife und Wochenzahl ("Woche 7 — *bleib dran.*")
- Mood-Check: 4 Optionen (Gut / Mittel / Müde / Pause) — beeinflusst Tagesempfehlung
- Wochenstreifen: 7 Tage, aktueller Tag hervorgehoben, vergangene als Done/Skipped
- Heutiges Workout als Card mit Start-Button
- "Als nächstes" — nächste geplante Einheit in der Woche
- Workout tauschbar (Tap auf heutigen Tag öffnet Picker)

### Tab 2 — Plan
- Phasen-Übersicht mit aktuellem Status
- Readiness-Check Gate (Checkliste mit 5 Kriterien, Physio-Freigabe als Hard Gate)
- Phasen-Timeline mit Lock/Unlock-Status

### Tab 3 — Verlauf
- Kalenderansicht oder Liste vergangener Sessions
- Symptom-Trend der Woche (neu: wird nach jeder Session geloggt)
- Streak / Konsistenz-Anzeige

### Tab 4 — Klettern
- Locked bis Phase 3 (mit Begründung warum + Timeline)
- In Phase 3: Fingerboard-Protokoll und Boulder-Technik Sessions
- Crimp-Gate: programmatisch gesperrt bis Monat 8–9
- Beckenboden-Check-Hinweis vor jeder Einheit (Terracotta Card)

### Tab 5 — Profil
- Editierbare Felder: Name, Geburtsdatum Kind, Kletterziel
- Toggles: Stillen (aktiviert Hydrations-Hinweise), Kaiserschnitt (verlängert Phase 1), Physio-Freigabe
- Phasen-Unlock-Daten
- Readiness-Check History
- Disclaimer + Reset

### Timer Screen (Modal über Tabs)
- Workout-Titel (H3 DM Sans) + Untertitel
- Animierter Kreis-Timer (Teal Stroke)
- Cue-Text in Teal-Highlight-Card
- Schritt-Dots
- Play/Pause (großer Teal-Button), Vor/Zurück (kleine Ghost-Buttons)
- **Neu nach Abschluss:** Kurzes Symptom-Log (3 Tap-Buttons: Keine · Leicht · Deutlich)

---

## Symptom-Tracking (neu zu implementieren)

Nach jeder abgeschlossenen Session erscheint ein kurzes Overlay:

```
"Wie war dein Beckenboden?"

[ Keine Symptome ]   [ Leichter Druck ]   [ Deutlich ]

→ Tippen speichert in sessions[].symptom = 'none' | 'mild' | 'strong'
→ Bei 'strong': sanfter Hinweis "Sprich mit deiner Physio"
→ Wöchentlicher Trend in Verlauf-Tab sichtbar
```

Gate-Logik: Wenn in den letzten 7 Tagen 2× 'strong' → Phase-Aufstieg wird temporär geblockt mit Erklärung.

---

## Was bereits existiert (nicht neu bauen)

- `src/store.js` — State-Management, LocalStorage, Phase-Funktionen inkl. `logSymptom()`
- `src/workouts.js` — Alle Workout-Daten, `getWeekSchedule()`, `getTodayWorkouts()`
- `src/components/Characters.jsx` — SVG Blob-Charaktere (Headspace-Stil) für Moods und Workout-Icons
- Alle 5 Tab-Komponenten + TimerScreen + ReadinessCheck existieren

---

## Implementierungs-Priorität

1. Design System vollständig in `App.jsx` (CSS Custom Properties) + `index.html` (Fonts)
2. Alle Komponenten auf neue Tokens umstellen (Playfair Display für alle H1/H2)
3. Symptom-Log nach Sessions aktivieren
4. Phase-Gates härter machen (Symptom-History als Bedingung)
5. Crimp-Gate programmatisch
