import { useState } from 'react';
import { getAllVideos, STATUS, CATEGORIES, STYLE_TAGS } from '../data';
import VideoCard from './VideoCard';

const VIEW_TIMELINE = 'timeline';
const VIEW_KACHELN = 'kacheln';

export default function Sammlung({ data }) {
  const [view, setView] = useState(VIEW_TIMELINE);
  const [filterStatus, setFilterStatus] = useState('alle');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStyleTag, setFilterStyleTag] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allVideos = getAllVideos(data);

  const filtered = allVideos.filter((v) => {
    if (filterStatus !== 'alle' && v.status !== filterStatus) return false;
    if (filterCategory && v.category !== filterCategory) return false;
    if (filterStyleTag && !(v.style_tags || []).includes(filterStyleTag)) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const inTitle = v.title.toLowerCase().includes(q);
      const inTags = (v.tags || []).some((t) => t.toLowerCase().includes(q));
      const inProject = (v.projectTitle || '').toLowerCase().includes(q);
      if (!inTitle && !inTags && !inProject) return false;
    }
    return true;
  });

  const activeFilterCount = [
    filterStatus !== 'alle',
    !!filterCategory,
    !!filterStyleTag,
  ].filter(Boolean).length;

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Alle Übungsvideos
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Sammlung
        </h1>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none', display: 'flex' }}>
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Suchen nach Titel oder Tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 14px 11px 38px',
            borderRadius: 12,
            border: '1.5px solid var(--color-surface-raised)',
            background: 'var(--color-surface)',
            fontSize: '0.9rem',
            color: 'var(--color-text)',
            outline: 'none',
            fontFamily: 'inherit',
            boxShadow: 'var(--shadow-card)',
          }}
        />
      </div>

      {/* Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: '0.82rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: activeFilterCount > 0 ? 'var(--color-primary-light)' : 'var(--color-surface)',
            color: activeFilterCount > 0 ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
            boxShadow: 'var(--shadow-card)',
            transition: 'all 0.2s',
          }}
        >
          <FilterIcon />
          Filter
          {activeFilterCount > 0 && (
            <span style={{
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: 18, height: 18,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface)', borderRadius: 10, padding: 4, boxShadow: 'var(--shadow-card)', flexShrink: 0 }}>
          <ViewButton active={view === VIEW_TIMELINE} onClick={() => setView(VIEW_TIMELINE)} title="Timeline">
            <ListIcon />
          </ViewButton>
          <ViewButton active={view === VIEW_KACHELN} onClick={() => setView(VIEW_KACHELN)} title="Kacheln">
            <GridIcon />
          </ViewButton>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          {/* Status */}
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Status</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {['alle', STATUS.NICHT_BEGONNEN, STATUS.IN_UEBUNG, STATUS.SICHER].map((s) => (
              <FilterChip
                key={s}
                label={s === 'alle' ? 'Alle' : s === STATUS.NICHT_BEGONNEN ? 'Nicht begonnen' : s === STATUS.IN_UEBUNG ? 'In Übung' : 'Sicher'}
                active={filterStatus === s}
                onClick={() => setFilterStatus(s)}
              />
            ))}
          </div>

          {/* Category */}
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Kategorie</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            <FilterChip label="Alle" active={!filterCategory} onClick={() => setFilterCategory('')} />
            {CATEGORIES.map((c) => (
              <FilterChip key={c} label={c} active={filterCategory === c} onClick={() => setFilterCategory(filterCategory === c ? '' : c)} />
            ))}
          </div>

          {/* Style Tags */}
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Style</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <FilterChip label="Alle" active={!filterStyleTag} onClick={() => setFilterStyleTag('')} />
            {STYLE_TAGS.map((t) => (
              <FilterChip key={t} label={t} active={filterStyleTag === t} onClick={() => setFilterStyleTag(filterStyleTag === t ? '' : t)} />
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setFilterStatus('alle'); setFilterCategory(''); setFilterStyleTag(''); }}
              style={{ marginTop: 14, width: '100%', padding: '8px 0', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)' }}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

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
        padding: '6px 12px',
        borderRadius: 20,
        fontSize: '0.78rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-primary)' : 'var(--color-surface-raised)',
        color: active ? '#fff' : 'var(--color-text-muted)',
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
        background: active ? 'var(--color-primary-light)' : 'transparent',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
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
