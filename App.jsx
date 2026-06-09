import React from 'react'

const TABS = [
  { id: 'home', label: 'Heute', icon: HomeIcon },
  { id: 'plan', label: 'Plan', icon: PlanIcon },
  { id: 'history', label: 'Verlauf', icon: HistoryIcon },
  { id: 'climb', label: 'Klettern', icon: ClimbIcon },
  { id: 'profile', label: 'Profil', icon: ProfileIcon },
]

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}
function PlanIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 9H21M8 4V9M16 4V9" stroke={active ? 'white' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 13H10M7 16H13" stroke={active ? 'white' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function HistoryIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7V12L15 14" stroke={active ? 'white' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ClimbIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="5" r="2" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 7V13L6 19M9 13L13 16L15 19M13 10L16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20C4 17 7.6 15 12 15C16.4 15 20 17 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(253,246,239,0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #EBE0D4',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              padding: '10px 0',
              border: 'none', background: 'none', cursor: 'pointer',
              color: active ? '#9B7FCC' : '#A8937F',
              fontFamily: 'Nunito, sans-serif',
              fontSize: 10, fontWeight: active ? 600 : 400,
              transition: 'color 0.2s',
            }}
          >
            <Icon active={active} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
