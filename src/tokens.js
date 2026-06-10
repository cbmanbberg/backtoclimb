// tokens.js — design tokens, direct ES-module conversion from prototype tokens.jsx

export function mix(a, pct, b) {
  return `color-mix(in oklab, ${a} ${pct}%, ${b})`
}

export const ACCENTS = {
  lavendel: { label: 'Lavendel', light: 'oklch(0.52 0.105 295)', dark: 'oklch(0.74 0.10 293)' },
  teal:     { label: 'Teal',     light: 'oklch(0.52 0.085 200)', dark: 'oklch(0.70 0.09 197)' },
  petrol:   { label: 'Petrol',   light: 'oklch(0.47 0.075 232)', dark: 'oklch(0.68 0.082 230)' },
  pinie:    { label: 'Pinie',    light: 'oklch(0.50 0.072 158)', dark: 'oklch(0.70 0.078 158)' },
  schiefer: { label: 'Schiefer', light: 'oklch(0.50 0.032 236)', dark: 'oklch(0.70 0.034 236)' },
}

export function getSpace(density) {
  const mul = density === 'kompakt' ? 0.84 : density === 'luftig' ? 1.18 : 1
  const s = (n) => Math.round(n * mul)
  s.mul = mul
  return s
}

export function getTheme(dark, accentKey) {
  const acc = ACCENTS[accentKey] || ACCENTS.teal
  const primary = dark ? acc.dark : acc.light
  const terracotta = dark ? 'oklch(0.71 0.115 47)' : 'oklch(0.605 0.13 42)'

  if (!dark) {
    const bg = 'oklch(0.969 0.011 76)'
    const surface = 'oklch(0.995 0.006 84)'
    const surface2 = 'oklch(0.948 0.013 74)'
    return {
      dark: false, accentKey,
      page: 'oklch(0.93 0.012 74)',
      bg, surface, surface2,
      ink: 'oklch(0.255 0.018 58)',
      inkSoft: 'oklch(0.44 0.016 60)',
      inkMute: 'oklch(0.59 0.013 62)',
      line: 'oklch(0.905 0.011 72)',
      lineStrong: 'oklch(0.86 0.012 70)',
      primary,
      primarySoft: mix(primary, 13, surface),
      primaryTint: mix(primary, 8, surface),
      primaryRing: mix(primary, 16, surface2),
      onPrimary: 'oklch(0.985 0.008 90)',
      primaryInk: mix(primary, 78, 'oklch(0.3 0.02 200)'),
      terracotta,
      terracottaSoft: mix(terracotta, 12, surface),
      terracottaTint: mix(terracotta, 7, surface),
      terracottaInk: 'oklch(0.46 0.11 40)',
      gold: 'oklch(0.66 0.085 72)',
      shadow: '0 1px 2px rgba(40,30,20,.05), 0 4px 16px rgba(40,30,20,.05)',
      shadowLg: '0 2px 6px rgba(40,30,20,.07), 0 18px 50px rgba(40,30,20,.14)',
      shadowPhone: '0 8px 24px rgba(40,30,20,.10), 0 40px 90px rgba(40,30,20,.18)',
    }
  }
  const bg = 'oklch(0.205 0.013 62)'
  const surface = 'oklch(0.248 0.015 62)'
  const surface2 = 'oklch(0.295 0.016 62)'
  return {
    dark: true, accentKey,
    page: 'oklch(0.16 0.011 62)',
    bg, surface, surface2,
    ink: 'oklch(0.955 0.009 80)',
    inkSoft: 'oklch(0.79 0.012 76)',
    inkMute: 'oklch(0.63 0.012 70)',
    line: 'oklch(0.33 0.013 62)',
    lineStrong: 'oklch(0.40 0.014 62)',
    primary,
    primarySoft: mix(primary, 22, surface),
    primaryTint: mix(primary, 14, surface),
    primaryRing: mix(primary, 28, surface2),
    onPrimary: 'oklch(0.18 0.02 200)',
    primaryInk: mix(primary, 82, 'oklch(0.9 0.02 200)'),
    terracotta,
    terracottaSoft: mix(terracotta, 22, surface),
    terracottaTint: mix(terracotta, 14, surface),
    terracottaInk: 'oklch(0.8 0.1 50)',
    gold: 'oklch(0.74 0.08 74)',
    shadow: '0 1px 2px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.3)',
    shadowLg: '0 2px 6px rgba(0,0,0,.4), 0 18px 50px rgba(0,0,0,.5)',
    shadowPhone: '0 8px 30px rgba(0,0,0,.5), 0 40px 100px rgba(0,0,0,.6)',
  }
}

export const FONTS = {
  serif: '"Newsreader", Georgia, "Times New Roman", serif',
  sans: '"Hanken Grotesk", system-ui, -apple-system, sans-serif',
  mono: '"Spline Sans Mono", ui-monospace, "SF Mono", Menlo, monospace',
}
