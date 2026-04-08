import { useState } from 'react';
import { addPracticeVideo, addProject, CATEGORIES } from '../data';

const SUGGESTED_HASHTAGS = [
  '#bodywave', '#hiproll', '#sensualbasic', '#promenade',
  '#footwork', '#timing', '#drehung', '#grundschritt',
  '#improvisation', '#bachata', '#salsa', '#flow',
];

export default function AddVideoModal({ data, onClose, onDataChange }) {
  // step: 'record' | 'metadata'
  const [step, setStep] = useState('record');
  const [mode, setMode] = useState('referenz'); // 'referenz' | 'uebung'

  // Metadata fields
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [notes, setNotes] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [projectId, setProjectId] = useState(data.projects[0]?.id || '');
  const [inTrainingPlan, setInTrainingPlan] = useState(false);

  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  function extractYoutubeId(input) {
    if (!input) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
    try {
      const url = new URL(input);
      return url.searchParams.get('v') || url.pathname.split('/').pop() || '';
    } catch {
      return input.trim();
    }
  }

  function handleAddHashtag(raw) {
    let tag = (raw || hashtagInput).trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = `#${tag}`;
    if (!hashtags.includes(tag)) setHashtags((prev) => [...prev, tag]);
    setHashtagInput('');
  }

  function handleRemoveHashtag(tag) {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  }

  function handleHashtagKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); handleAddHashtag(); }
  }

  function handleSubmit() {
    if (mode === 'uebung') {
      const id = extractYoutubeId(youtubeUrl);
      const videoTitle = title.trim() || `Übung ${new Date().toLocaleDateString('de-DE')}`;
      if (id && projectId) {
        const next = addPracticeVideo(projectId, { title: videoTitle, videoId: id, notes, hashtags, category, location, inTrainingPlan });
        onDataChange(next);
      } else if (projectId) {
        // No video URL – still save metadata entry (empty videoId allowed)
        const next = addPracticeVideo(projectId, { title: videoTitle, videoId: id || 'placeholder', notes, hashtags, category, location, inTrainingPlan });
        onDataChange(next);
      }
    } else {
      const id = extractYoutubeId(youtubeUrl);
      const projTitle = title.trim() || `Referenz ${new Date().toLocaleDateString('de-DE')}`;
      if (id) {
        const next = addProject({ title: projTitle, category, demoVideoId: id, demoNotes: notes, location });
        onDataChange(next);
      } else if (projTitle) {
        const next = addProject({ title: projTitle, category, demoVideoId: 'placeholder', demoNotes: notes, location });
        onDataChange(next);
      }
    }
    onClose();
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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} onClick={onClose} />

      {step === 'record' ? (
        /* ── STEP 1: Recording Placeholder ── */
        <div
          style={{
            position: 'relative',
            background: '#0F172A',
            borderRadius: '24px 24px 0 0',
            paddingBottom: 'calc(32px + var(--safe-bottom))',
            maxHeight: '90dvh',
            zIndex: 201,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Handle */}
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '16px auto 0' }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            aria-label="Schließen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Camera Viewfinder */}
          <div style={{
            width: 'calc(100% - 40px)', paddingTop: '60%', position: 'relative',
            background: '#1E293B', borderRadius: 16, margin: '24px 20px 0',
          }}>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Video Aufnahme läuft…
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>REC</span>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, margin: '20px 20px 0', gap: 4, width: 'calc(100% - 40px)' }}>
            {[['referenz', '🎬 Referenzvideo'], ['uebung', '💪 Übungsvideo']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600,
                  background: mode === m ? 'var(--color-primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >{label}</button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, margin: '20px 20px 0', width: 'calc(100% - 40px)' }}>
            <button
              onClick={() => setStep('metadata')}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.95rem', fontWeight: 700,
                background: 'var(--color-primary)', color: '#fff',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              }}
            >
              Aufnahme stoppen →
            </button>
          </div>
        </div>
      ) : (
        /* ── STEP 2: Metadata Screen ── */
        <div
          style={{
            position: 'relative',
            background: 'var(--color-surface)',
            borderRadius: '24px 24px 0 0',
            padding: '24px 20px',
            paddingBottom: 'calc(24px + var(--safe-bottom))',
            maxHeight: '92dvh',
            overflowY: 'auto',
            zIndex: 201,
          }}
        >
          {/* Handle */}
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--color-surface-raised)', margin: '0 auto 20px' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setStep('record')}
                style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
                aria-label="Zurück"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>Video bearbeiten</h2>
            </div>
            <button onClick={onClose} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Type indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--color-primary-light)', borderRadius: 12,
            padding: '10px 14px', marginBottom: 20,
          }}>
            <span style={{ fontSize: '1rem' }}>{mode === 'referenz' ? '🎬' : '💪'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              {mode === 'referenz' ? 'Neues Referenzvideo (Lehrervideo)' : 'Neues Übungsvideo'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Projekt auswählen (nur für Übungsvideo) */}
            {mode === 'uebung' && data.projects.length > 0 && (
              <Field label="Referenzvideo (Projekt)">
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
            )}

            {/* Kategorie */}
            <Field label="Kategorie (optional)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(category === c ? '' : c)}
                    style={{
                      padding: '6px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      background: category === c ? 'var(--color-primary)' : 'var(--color-surface-raised)',
                      color: category === c ? '#fff' : 'var(--color-text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >{c}</button>
                ))}
              </div>
            </Field>

            {/* Titel */}
            <Field label="Titel (optional)">
              <input
                placeholder={mode === 'referenz' ? 'z. B. Bachata Sensual Flow' : 'z. B. Training vom 05.04.'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </Field>

            {/* Datum */}
            <Field label="Datum">
              <div style={{ ...inputStyle, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span style={{ fontSize: '0.9rem' }}>{today}</span>
              </div>
            </Field>

            {/* Ort */}
            <Field label="Ort (optional)">
              <input
                placeholder="z. B. Tanzstudio, Festival Berlin…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
            </Field>

            {/* YouTube URL */}
            <Field label={mode === 'referenz' ? 'YouTube-URL (optional)' : 'YouTube-URL oder Video-ID (optional)'}>
              <input
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={inputStyle}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </Field>

            {/* Hashtags */}
            <Field label="Hashtags">
              {hashtags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {hashtags.map((tag) => (
                    <div
                      key={tag}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-primary-light)', borderRadius: 20, padding: '4px 10px' }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{tag}</span>
                      <button
                        onClick={() => handleRemoveHashtag(tag)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', padding: '0 0 0 2px', lineHeight: 1, display: 'flex' }}
                        aria-label={`${tag} entfernen`}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder="#bodywave, #hiproll …"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={() => handleAddHashtag()}
                  style={{ padding: '10px 16px', borderRadius: 10, fontSize: '1rem', fontWeight: 700, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                >+</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {SUGGESTED_HASHTAGS.filter((s) => !hashtags.includes(s)).slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAddHashtag(s)}
                    style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 500,
                      border: '1.5px dashed var(--color-primary-light)',
                      background: 'transparent', color: 'var(--color-primary)',
                      cursor: 'pointer',
                    }}
                  >{s}</button>
                ))}
              </div>
            </Field>

            {/* Zum Trainingsplan hinzufügen (only for Übungsvideo) */}
            {mode === 'uebung' && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: inTrainingPlan ? 'var(--color-primary-light)' : 'var(--color-surface-raised)',
                  borderRadius: 12, padding: '14px 16px',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onClick={() => setInTrainingPlan(!inTrainingPlan)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: inTrainingPlan ? 'var(--color-primary-dark)' : 'var(--color-text)' }}>
                      Zum Trainingsplan hinzufügen
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 1 }}>
                      Erscheint unter &quot;Als nächstes üben&quot;
                    </p>
                  </div>
                </div>
                <div style={{
                  width: 44, height: 26, borderRadius: 13,
                  background: inTrainingPlan ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: inTrainingPlan ? 21 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </div>
            )}

            {/* Notizen */}
            <Field label="Notizen (optional)">
              <textarea
                placeholder="Eigene Beobachtungen, Hinweise des Lehrers …"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </Field>
          </div>

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
              background: 'var(--color-primary)',
              color: '#fff',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
            }}
          >
            {mode === 'referenz' ? 'Referenzvideo erstellen' : 'Übungsvideo hinzufügen'}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
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

