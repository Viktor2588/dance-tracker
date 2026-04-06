import { useState } from 'react';
import { getAllVideos, STATUS } from '../data';
import VideoCard from './VideoCard';

const VIEW_TIMELINE = 'timeline';
const VIEW_KACHELN = 'kacheln';

export default function Sammlung({ data }) {
  const [view, setView] = useState(VIEW_TIMELINE);
  const [filterStatus, setFilterStatus] = useState('alle');

  const allVideos = getAllVideos(data);

  const filtered = filterStatus === 'alle'
    ? allVideos
    : allVideos.filter((v) => v.status === filterStatus);

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 20px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Alle Übungsvideos
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Sammlung
        </h1>
      </div>

      {/* Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 1 }}>
          {['alle', STATUS.NICHT_BEGONNEN, STATUS.IN_UEBUNG, STATUS.SICHER].map((s) => (
            <FilterChip
              key={s}
              label={s === 'alle' ? 'Alle' : s === STATUS.NICHT_BEGONNEN ? 'Nicht begonnen' : s === STATUS.IN_UEBUNG ? 'In Übung' : 'Sicher'}
              active={filterStatus === s}
              onClick={() => setFilterStatus(s)}
            />
          ))}
        </div>

        {/* View Switch */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface)', borderRadius: 10, padding: 4, boxShadow: 'var(--shadow-card)', flexShrink: 0 }}>
          <ViewButton active={view === VIEW_TIMELINE} onClick={() => setView(VIEW_TIMELINE)} title="Timeline">
            <ListIcon />
          </ViewButton>
          <ViewButton active={view === VIEW_KACHELN} onClick={() => setView(VIEW_KACHELN)} title="Kacheln">
            <GridIcon />
          </ViewButton>
        </div>
      </div>

      {/* Video Count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 16, fontWeight: 500 }}>
        {filtered.length} {filtered.length === 1 ? 'Video' : 'Videos'}
      </p>

      {/* Video List */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : view === VIEW_TIMELINE ? (
        <TimelineView videos={filtered} />
      ) : (
        <KachelnView videos={filtered} />
      )}
    </div>
  );
}

function TimelineView({ videos }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function KachelnView({ videos }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} compact />
      ))}
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: '0.78rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-text)' : 'var(--color-surface)',
        color: active ? '#fff' : 'var(--color-text-muted)',
        boxShadow: active ? 'none' : 'var(--shadow-card)',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

function ViewButton({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-accent)' : 'transparent',
        color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎬</div>
      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Keine Videos gefunden</p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Ändere den Filter oder füge neue Videos hinzu.</p>
    </div>
  );
}
