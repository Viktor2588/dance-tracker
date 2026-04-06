import { useState } from 'react';
import { addPracticeVideo, addProject, CATEGORIES } from '../data';

export default function AddVideoModal({ data, onClose, onDataChange }) {
  const [mode, setMode] = useState('practice'); // 'practice' | 'project'
  const [projectId, setProjectId] = useState(data.projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [notes, setNotes] = useState('');

  // For new project
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState(CATEGORIES[0]);
  const [projDemoVideoId, setProjDemoVideoId] = useState('');
  const [projDemoNotes, setProjDemoNotes] = useState('');

  const [error, setError] = useState('');

  function extractYoutubeId(input) {
    if (!input) return '';
    // Already an ID (no slashes or dots)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
    // URL
    try {
      const url = new URL(input);
      return url.searchParams.get('v') || url.pathname.split('/').pop() || '';
    } catch {
      return input.trim();
    }
  }

  function handleSubmit() {
    setError('');
    if (mode === 'practice') {
      if (!title.trim()) { setError('Titel eingeben'); return; }
      if (!videoId.trim()) { setError('YouTube-URL oder Video-ID eingeben'); return; }
      if (!projectId) { setError('Projekt auswählen'); return; }
      const id = extractYoutubeId(videoId);
      const next = addPracticeVideo(projectId, { title: title.trim(), videoId: id, notes });
      onDataChange(next);
      onClose();
    } else {
      if (!projTitle.trim()) { setError('Projekttitel eingeben'); return; }
      if (!projDemoVideoId.trim()) { setError('Demo-Video-URL eingeben'); return; }
      const id = extractYoutubeId(projDemoVideoId);
      const next = addProject({ title: projTitle.trim(), category: projCategory, demoVideoId: id, demoNotes: projDemoNotes });
      onDataChange(next);
      onClose();
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />

      {/* Sheet */}
      <div
        style={{
          position: 'relative',
          background: 'var(--color-surface)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px',
          paddingBottom: 'calc(24px + var(--safe-bottom))',
          maxHeight: '90dvh',
          overflowY: 'auto',
          zIndex: 201,
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--color-surface-raised)', margin: '0 auto 20px' }} />

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Hinzufügen</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--color-surface-raised)', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
          {[['practice', 'Übungsvideo'], ['project', 'Neues Projekt']].map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                background: mode === m ? 'var(--color-surface)' : 'transparent',
                color: mode === m ? 'var(--color-primary)' : 'var(--color-text-muted)',
                border: 'none', cursor: 'pointer',
                boxShadow: mode === m ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >{label}</button>
          ))}
        </div>

        {mode === 'practice' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Projekt">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={selectStyle}
              >
                {data.projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Titel">
              <input
                placeholder="z. B. Training vom 05.04."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="YouTube-URL oder Video-ID">
              <input
                placeholder="https://youtube.com/watch?v=... oder xHl2-5_-OGE"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                style={inputStyle}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </Field>
            <Field label="Notizen (optional)">
              <textarea
                placeholder="Eigene Beobachtungen..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </Field>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Projekttitel">
              <input
                placeholder="z. B. Bachata Sensual Flow"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Kategorie">
              <select value={projCategory} onChange={(e) => setProjCategory(e.target.value)} style={selectStyle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Demo-Video (YouTube-URL)">
              <input
                placeholder="https://youtube.com/watch?v=..."
                value={projDemoVideoId}
                onChange={(e) => setProjDemoVideoId(e.target.value)}
                style={inputStyle}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </Field>
            <Field label="Notizen zum Demo (optional)">
              <textarea
                placeholder="Anmerkungen des Lehrers..."
                value={projDemoNotes}
                onChange={(e) => setProjDemoNotes(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </Field>
          </div>
        )}

        {error && (
          <p style={{ color: '#DC2626', fontSize: '0.82rem', marginTop: 12, fontWeight: 500 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '14px 0',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#fff',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(22,163,74,0.30)',
          }}
        >
          {mode === 'practice' ? 'Video hinzufügen' : 'Projekt erstellen'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid var(--color-surface-raised)',
  background: 'var(--color-surface-raised)',
  fontSize: '0.95rem',
  color: 'var(--color-text)',
  outline: 'none',
  fontFamily: 'inherit',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
  cursor: 'pointer',
};
