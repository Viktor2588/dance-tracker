
export default function TabBar({ activeTab, onTabChange, onCameraClick }) {
  const tabs = [
    { id: 'start', label: 'Start', icon: <HomeIcon /> },
    { id: 'sammlung', label: 'Sammlung', icon: <CollectionIcon /> },
    { id: 'training', label: 'Training', icon: <TrainingIcon /> },
    { id: 'statistik', label: 'Statistik', icon: <ChartIcon /> },
    { id: 'profil', label: 'Profil', icon: <ProfileIcon /> },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--tab-height) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => <TabButton key={tab.id} tab={tab} active={tab.id === activeTab} onTabChange={onTabChange} />)}

      {/* Floating camera button */}
      <button
        onClick={onCameraClick}
        aria-label="Video hinzufügen"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,99,235,0.40)',
          position: 'fixed',
          bottom: 'calc(var(--tab-height) + var(--safe-bottom) + 12px)',
          right: 16,
          transition: 'transform 0.15s, box-shadow 0.15s',
          zIndex: 101,
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <CameraIcon />
      </button>
    </nav>
  );
}

function TabButton({ tab, active, onTabChange }) {
  return (
    <button
      onClick={() => onTabChange(tab.id)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
        transition: 'color 0.2s',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 10,
          background: active ? 'var(--color-primary-light)' : 'transparent',
          transition: 'background 0.2s',
        }}
      >
        {tab.icon}
      </span>
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: active ? 600 : 400,
          letterSpacing: '0.01em',
        }}
      >
        {tab.label}
      </span>
    </button>
  );
}

function TrainingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 11H5M19 6H5M19 16H5M19 21H5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
