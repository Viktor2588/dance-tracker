import { getAllVideos, STATUS_LABELS } from '../data';

export default function Profil({ data }) {
  const allVideos = getAllVideos(data);
  const totalTrainings = allVideos.reduce((acc, v) => acc + v.trainedDates.length, 0);

  const statusCounts = allVideos.reduce(
    (acc, v) => ({ ...acc, [v.status]: (acc[v.status] || 0) + 1 }),
    {}
  );

  return (
    <div style={{ padding: '0 16px 32px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 28px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Mein DanceLog
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Profil
        </h1>
      </div>

      {/* Avatar Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-rose) 100%)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '28px 24px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
          flexShrink: 0,
        }}>
          💃
        </div>
        <div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Bachata Tänzer</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Bachata · Sensual · Moderna</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard value={data.projects.length} label="Projekte" />
        <StatCard value={allVideos.length} label="Videos" />
        <StatCard value={totalTrainings} label="Trainings" />
      </div>

      {/* Status Overview */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Fortschritt
        </p>
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = statusCounts[key] || 0;
          const pct = allVideos.length > 0 ? Math.round((count / allVideos.length) * 100) : 0;
          return (
            <ProgressRow key={key} label={label} count={count} pct={pct} statusKey={key} />
          );
        })}
      </div>

      {/* About */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Über DanceLog
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
          DanceLog ist dein persönliches Tanz-Journal für Bachata. Behalte den Überblick über deine Projekte, verfolge deinen Fortschritt und trainiere mit deinen Lieblingsvideos.
        </p>
        <p style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Version 1.0 · Bachata Training App</p>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-md)',
      padding: '16px 12px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-card)',
    }}>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 6, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

const statusBarFillColors = {
  'nicht-begonnen': '#CCCCCC',
  'in-uebung': '#C8813C',
  'sicher': 'var(--color-gold)',
};

function ProgressRow({ label, count, pct, statusKey }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{count} Videos</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--color-surface-raised)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: statusBarFillColors[statusKey] || '#ccc',
          transition: 'width 0.5s',
        }} />
      </div>
    </div>
  );
}
