import { useState } from 'react';
import { CATEGORIES, getStreak, getYoutubeThumbnail } from '../data';

const VIEW_KACHELN = 'kacheln';
const VIEW_LISTE = 'liste';
const GROUP_NONE = 'none';
const GROUP_KATEGORIE = 'kategorie';

export default function Bibliothek({ data, onOpenProject }) {
  const [view, setView] = useState(VIEW_KACHELN);
  const [groupBy, setGroupBy] = useState(GROUP_NONE);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const streak = getStreak(data);

  const projects = data.projects;

  const filtered = projects.filter((p) => {
    if (filterCategory && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inCategory = (p.category || '').toLowerCase().includes(q);
      const inHashtags = (p.demoHashtags || []).some((h) => h.toLowerCase().includes(q));
      const inVideos = p.practiceVideos.some((v) =>
        v.title.toLowerCase().includes(q) ||
        (v.hashtags || []).some((h) => h.toLowerCase().includes(q))
      );
      if (!inTitle && !inCategory && !inHashtags && !inVideos) return false;
    }
    return true;
  });

  const toggleGroup = (cat) => {
    setExpandedGroups((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group by category
  const grouped = {};
  if (groupBy === GROUP_KATEGORIE) {
    CATEGORIES.forEach((cat) => {
      const items = filtered.filter((p) => p.category === cat);
      if (items.length > 0) grouped[cat] = items;
    });
    // Uncategorized
    const uncategorized = filtered.filter((p) => !CATEGORIES.includes(p.category));
    if (uncategorized.length > 0) grouped['Sonstige'] = uncategorized;
  }

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Bachata Training
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
            Bibliothek
          </h1>
          {streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--color-primary-light)',
              borderRadius: 20,
              padding: '6px 14px',
            }}>
              <span style={{ fontSize: '1rem' }}>🔥</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                {streak} {streak === 1 ? 'Tag' : 'Tage'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none', display: 'flex' }}>
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Titel, Hashtag oder Kategorie..."
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {/* Kategorie filter */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 32px 8px 12px',
              borderRadius: 10,
              border: 'none',
              background: filterCategory ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: filterCategory ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="">Alle Kategorien</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Group toggle */}
        <button
          onClick={() => setGroupBy(groupBy === GROUP_KATEGORIE ? GROUP_NONE : GROUP_KATEGORIE)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: '0.82rem', fontWeight: 600,
            border: 'none', cursor: 'pointer',
            background: groupBy === GROUP_KATEGORIE ? 'var(--color-primary-light)' : 'var(--color-surface)',
            color: groupBy === GROUP_KATEGORIE ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
            boxShadow: 'var(--shadow-card)',
            flexShrink: 0,
          }}
        >
          <GroupIcon />
          Gruppieren
        </button>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface)', borderRadius: 10, padding: 4, boxShadow: 'var(--shadow-card)', flexShrink: 0 }}>
          <ViewButton active={view === VIEW_KACHELN} onClick={() => setView(VIEW_KACHELN)} title="Kacheln">
            <GridIcon />
          </ViewButton>
          <ViewButton active={view === VIEW_LISTE} onClick={() => setView(VIEW_LISTE)} title="Liste">
            <ListIcon />
          </ViewButton>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 16, fontWeight: 500 }}>
        {filtered.length} {filtered.length === 1 ? 'Projekt' : 'Projekte'}
      </p>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : groupBy === GROUP_KATEGORIE ? (
        <GroupedView
          grouped={grouped}
          view={view}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          onOpenProject={onOpenProject}
        />
      ) : view === VIEW_KACHELN ? (
        <KachelnView projects={filtered} onOpenProject={onOpenProject} />
      ) : (
        <ListeView projects={filtered} onOpenProject={onOpenProject} />
      )}
    </div>
  );
}

function GroupedView({ grouped, view, expandedGroups, onToggleGroup, onOpenProject }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(grouped).map(([cat, projects]) => {
        const isExpanded = expandedGroups[cat] !== false; // default expanded
        return (
          <div key={cat} style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <button
              onClick={() => onToggleGroup(cat)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{cat}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-surface-raised)', borderRadius: 10, padding: '2px 8px' }}>
                  {projects.length}
                </span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)"
                strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {isExpanded && (
              <div style={{ padding: '0 12px 12px' }}>
                {view === VIEW_KACHELN ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {projects.map((p) => (
                      <ProjectThumbnail key={p.id} project={p} onClick={() => onOpenProject(p.id)} compact />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {projects.map((p) => (
                      <ProjectRow key={p.id} project={p} onClick={() => onOpenProject(p.id)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function KachelnView({ projects, onOpenProject }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {projects.map((p) => (
        <ProjectThumbnail key={p.id} project={p} onClick={() => onOpenProject(p.id)} />
      ))}
    </div>
  );
}

function ListeView({ projects, onOpenProject }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {projects.map((p) => (
        <ProjectRow key={p.id} project={p} onClick={() => onOpenProject(p.id)} />
      ))}
    </div>
  );
}

function ProjectThumbnail({ project, onClick, compact }) {
  const thumbnail = getYoutubeThumbnail(project.demoVideoId);
  const videoCount = project.practiceVideos.length;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ position: 'relative', paddingTop: '62%', background: '#EFF6FF', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={project.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.16)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-primary)" style={{ marginLeft: 2 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
        {videoCount > 0 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: '2px 7px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {videoCount} Videos
          </div>
        )}
      </div>
      <div style={{ padding: compact ? '10px 10px 12px' : '12px 12px 14px' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
          {project.category}
        </p>
        <p style={{ fontSize: compact ? '0.82rem' : '0.9rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
          {project.title}
        </p>
      </div>
    </div>
  );
}

function ProjectRow({ project, onClick }) {
  const thumbnail = getYoutubeThumbnail(project.demoVideoId);
  const videoCount = project.practiceVideos.length;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 12,
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ width: 72, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#EFF6FF', position: 'relative' }}>
        <img src={thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
          {project.category}
        </p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.title}
        </p>
        {videoCount > 0 && (
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{videoCount} Übungsvideos</p>
        )}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

function ViewButton({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
        background: active ? 'var(--color-primary-light)' : 'transparent',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>💃</div>
      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Noch keine Videos</p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Tippe auf Kamera, um ein neues Video hinzuzufügen.</p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="4" rx="1" />
      <rect x="2" y="10" width="20" height="4" rx="1" />
      <rect x="2" y="17" width="20" height="4" rx="1" />
    </svg>
  );
}
