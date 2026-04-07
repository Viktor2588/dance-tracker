import { sendSpeedToYoutube } from '../youtubeUtils';

const SPEEDS = [0.25, 0.5, 0.75, 1.0];

export default function SpeedControl({ iframeRef, speed, onSpeedChange }) {
  const handleSelect = (s) => {
    onSpeedChange(s);
    if (iframeRef?.current) {
      sendSpeedToYoutube(iframeRef.current, s);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 0 4px',
      }}
    >
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        Geschwindigkeit
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            style={{
              padding: '4px 9px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: speed === s ? 'var(--color-primary)' : 'var(--color-surface-raised)',
              color: speed === s ? '#fff' : 'var(--color-text-muted)',
              transition: 'all 0.15s',
              letterSpacing: '0.01em',
            }}
          >
            {s === 1.0 ? '1×' : `${s}×`}
          </button>
        ))}
      </div>
    </div>
  );
}

