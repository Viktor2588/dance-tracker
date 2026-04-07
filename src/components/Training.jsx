import { useState, useRef, useEffect, useCallback } from 'react';
import {
  CATEGORIES,
  TRAINING_STATUS,
  TRAINING_STATUS_LABELS,
  addTrainingExercise,
  updateTrainingExercise,
  deleteTrainingExercise,
  formatDate,
} from '../data';

const SECTION_PLAN = 'plan';
const SECTION_KALENDER = 'kalender';
const SECTION_ZAEHLER = 'zaehler';

const COUNT_SPEEDS = [0.25, 0.5, 0.75, 1.0];

// BPM bases: langsam ~ 60, schnell ~ 120
const TEMPO_LANGSAM = 60;
const TEMPO_SCHNELL = 120;

const STATUS_COLOR = {
  [TRAINING_STATUS.NICHT_BEGONNEN]: { bg: 'var(--color-surface-raised)', text: 'var(--color-text-muted)' },
  [TRAINING_STATUS.IN_BEARBEITUNG]: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)' },
  [TRAINING_STATUS.ABGESCHLOSSEN]: { bg: '#DCFCE7', text: '#15803D' },
};

export default function Training({ data, onDataChange }) {
  const [section, setSection] = useState(SECTION_PLAN);
  const exercises = data.trainingExercises || [];

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 16px 16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Dein Training
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Training
        </h1>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '0 16px 20px', overflowX: 'auto' }}>
        {[
          { id: SECTION_PLAN, label: 'Trainingsplan' },
          { id: SECTION_KALENDER, label: 'Kalender' },
          { id: SECTION_ZAEHLER, label: 'Zähler' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              flex: '0 0 auto',
              padding: '9px 18px',
              borderRadius: 20,
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: section === s.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: section === s.id ? '#fff' : 'var(--color-text-muted)',
              boxShadow: section === s.id ? '0 2px 10px rgba(37,99,235,0.28)' : 'var(--shadow-card)',
              transition: 'all 0.2s',
              marginRight: 8,
              whiteSpace: 'nowrap',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {section === SECTION_PLAN && (
        <TrainingsplanSection exercises={exercises} onDataChange={onDataChange} />
      )}
      {section === SECTION_KALENDER && (
        <KalenderSection exercises={exercises} onDataChange={onDataChange} />
      )}
      {section === SECTION_ZAEHLER && (
        <ZaehlerSection />
      )}
    </div>
  );
}

/* ─── Trainingsplan ─────────────────────────────────────────────────── */

function TrainingsplanSection({ exercises, onDataChange }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (fields) => {
    const next = addTrainingExercise(fields);
    onDataChange(next);
    setShowAddForm(false);
  };

  const handleUpdate = (id, updates) => {
    const next = updateTrainingExercise(id, updates);
    onDataChange(next);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const next = deleteTrainingExercise(id);
    onDataChange(next);
  };

  const sortedExercises = [...exercises].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Progress overview */}
      <ProgressOverview exercises={exercises} />

      {/* Add button */}
      <button
        onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
        style={{
          width: '100%', padding: '13px 0', borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.92rem', fontWeight: 700, border: '1.5px solid var(--color-primary)',
          background: showAddForm ? 'var(--color-primary)' : 'transparent',
          color: showAddForm ? '#fff' : 'var(--color-primary)',
          cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Übung hinzufügen
      </button>

      {showAddForm && (
        <ExerciseForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Exercise list */}
      {sortedExercises.length === 0 && !showAddForm ? (
        <EmptyExercises />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedExercises.map((ex) =>
            editingId === ex.id ? (
              <ExerciseForm
                key={ex.id}
                initial={ex}
                onSubmit={(fields) => handleUpdate(ex.id, fields)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onEdit={() => setEditingId(ex.id)}
                onDelete={() => handleDelete(ex.id)}
                onStatusChange={(status) => handleUpdate(ex.id, { status })}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function ProgressOverview({ exercises }) {
  if (exercises.length === 0) return null;
  const counts = {
    [TRAINING_STATUS.NICHT_BEGONNEN]: 0,
    [TRAINING_STATUS.IN_BEARBEITUNG]: 0,
    [TRAINING_STATUS.ABGESCHLOSSEN]: 0,
  };
  exercises.forEach((e) => { counts[e.status] = (counts[e.status] || 0) + 1; });
  const total = exercises.length;
  const done = counts[TRAINING_STATUS.ABGESCHLOSSEN];
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fortschritt</p>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{done}/{total}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'var(--color-surface-raised)', overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)', transition: 'width 0.5s' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(TRAINING_STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[key]?.text || '#ccc' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{counts[key]} {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, onEdit, onDelete, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const sc = STATUS_COLOR[exercise.status] || STATUS_COLOR[TRAINING_STATUS.NICHT_BEGONNEN];

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 3, lineHeight: 1.3 }}>{exercise.title}</p>
            {exercise.scheduledDates.length > 0 && (
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                📅 {exercise.scheduledDates.slice(0, 2).map((d) => formatDate(d)).join(', ')}{exercise.scheduledDates.length > 2 ? ` +${exercise.scheduledDates.length - 2}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: sc.bg, color: sc.text, border: 'none', cursor: 'pointer' }}
          >
            {TRAINING_STATUS_LABELS[exercise.status]}
          </button>
        </div>

        {showStatusMenu && (
          <div style={{ background: 'var(--color-surface-raised)', borderRadius: 10, padding: 8, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(TRAINING_STATUS_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { onStatusChange(key); setShowStatusMenu(false); }}
                style={{
                  textAlign: 'left', padding: '7px 12px', borderRadius: 8,
                  fontSize: '0.83rem', fontWeight: exercise.status === key ? 600 : 400,
                  background: exercise.status === key ? 'var(--color-primary-light)' : 'transparent',
                  color: 'var(--color-text)', border: 'none', cursor: 'pointer',
                }}
              >{label}</button>
            ))}
          </div>
        )}

        {/* Tags */}
        {exercise.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {exercise.tags.map((t) => (
              <span key={t} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>{t}</span>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        {(exercise.description || exercise.category) && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 600 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {expanded ? 'Weniger' : 'Mehr'}
          </button>
        )}

        {expanded && (
          <div style={{ marginTop: 10 }}>
            {exercise.category && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                Kategorie: <strong style={{ color: 'var(--color-text)' }}>{exercise.category}</strong>
              </p>
            )}
            {exercise.description && (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.6 }}>{exercise.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--color-surface-raised)' }}>
        <button
          onClick={onEdit}
          style={{ flex: 1, padding: '10px 0', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Bearbeiten
        </button>
        <div style={{ width: 1, background: 'var(--color-surface-raised)' }} />
        <button
          onClick={onDelete}
          style={{ flex: 1, padding: '10px 0', fontSize: '0.82rem', fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function ExerciseForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(initial?.tags || []);
  const [dateInput, setDateInput] = useState('');
  const [scheduledDates, setScheduledDates] = useState(initial?.scheduledDates || []);
  const [error, setError] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const addDate = () => {
    const d = dateInput.trim();
    if (d && !scheduledDates.includes(d)) setScheduledDates([...scheduledDates, d]);
    setDateInput('');
  };

  const handleSubmit = () => {
    if (!title.trim()) { setError('Titel eingeben'); return; }
    onSubmit({ title: title.trim(), description, category, tags, scheduledDates });
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1.5px solid var(--color-surface-raised)',
    background: 'var(--color-surface-raised)', fontSize: '0.9rem',
    color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 14 }}>
        {initial ? 'Übung bearbeiten' : 'Neue Übung'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormField label="Titel *">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Hiproll üben" style={inputStyle} />
        </FormField>

        <FormField label="Beschreibung">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Was soll geübt werden?" rows={2} style={{ ...inputStyle, resize: 'none' }} />
        </FormField>

        <FormField label="Kategorie">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 32 }}>
            <option value="">– Keine –</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>

        <FormField label="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {tags.map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', padding: 0, lineHeight: 1, display: 'flex' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Tag hinzufügen" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addTag} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>
        </FormField>

        <FormField label="Geplante Termine">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {scheduledDates.map((d) => (
              <span key={d} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)' }}>
                {formatDate(d)}
                <button onClick={() => setScheduledDates(scheduledDates.filter((x) => x !== d))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, lineHeight: 1, display: 'flex' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addDate} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>
        </FormField>
      </div>

      {error && <p style={{ color: '#DC2626', fontSize: '0.82rem', marginTop: 10 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          onClick={handleSubmit}
          style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {initial ? 'Speichern' : 'Hinzufügen'}
        </button>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
      {children}
    </div>
  );
}

function EmptyExercises() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🏋️</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Keine Übungen</p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Erstelle deine erste Trainingsübung.</p>
    </div>
  );
}

/* ─── Kalender ──────────────────────────────────────────────────────── */

function KalenderSection({ exercises }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDayOfWeek + 6) % 7; // Mon=0

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const todayStr = today.toISOString().split('T')[0];

  // Map date → exercises
  const dateMap = {};
  exercises.forEach((ex) => {
    ex.scheduledDates.forEach((d) => {
      if (!dateMap[d]) dateMap[d] = [];
      dateMap[d].push(ex);
    });
  });

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const selectedExercises = dateMap[selectedDate] || [];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Month navigation */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={prevMonth} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface-raised)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'capitalize' }}>{monthLabel}</p>
          <button onClick={nextMonth} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface-raised)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {weekDays.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {/* Empty cells for offset */}
          {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const hasExercises = !!dateMap[dateStr];

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  position: 'relative',
                  height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'var(--color-primary)' : isToday ? 'var(--color-primary-light)' : 'transparent',
                  color: isSelected ? '#fff' : isToday ? 'var(--color-primary-dark)' : 'var(--color-text)',
                  fontWeight: isSelected || isToday ? 700 : 400,
                  fontSize: '0.85rem',
                  transition: 'all 0.15s',
                }}
              >
                {day}
                {hasExercises && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)', position: 'absolute', bottom: 4 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date exercises */}
      <div>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {selectedExercises.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Keine Übungen geplant</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedExercises.map((ex) => {
              const sc = STATUS_COLOR[ex.status] || STATUS_COLOR[TRAINING_STATUS.NICHT_BEGONNEN];
              return (
                <div key={ex.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '14px 16px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{ex.title}</p>
                    {ex.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{ex.description}</p>}
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: sc.bg, color: sc.text, flexShrink: 0 }}>
                    {TRAINING_STATUS_LABELS[ex.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Zähler (Practice Counter) ─────────────────────────────────────── */

function ZaehlerSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCount, setCurrentCount] = useState(null);
  const [tempo, setTempo] = useState('langsam'); // 'langsam' | 'schnell'
  const [speed, setSpeed] = useState(1.0);
  const intervalRef = useRef(null);
  const countRef = useRef(0);

  // BPM based on tempo + speed
  const baseBpm = tempo === 'langsam' ? TEMPO_LANGSAM : TEMPO_SCHNELL;
  const effectiveBpm = baseBpm * speed;
  const intervalMs = Math.round(60000 / effectiveBpm);

  const speakNumber = useCallback((num) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(String(num));
    utt.lang = 'de-DE';
    utt.rate = Math.min(Math.max(speed * 1.2, 0.1), 10);
    utt.volume = 1;
    window.speechSynthesis.speak(utt);
  }, [speed]);

  const stopCounting = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setCurrentCount(null);
    countRef.current = 0;
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopCounting();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // start immediately
      countRef.current = 1;
      setCurrentCount(1);
      speakNumber(1);
      intervalRef.current = setInterval(() => {
        countRef.current = (countRef.current % 8) + 1;
        const n = countRef.current;
        setCurrentCount(n);
        speakNumber(n);
      }, intervalMs);
    }
  };

  // Restart if playing and settings change
  useEffect(() => {
    if (isPlaying) {
      stopCounting();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempo, speed]);

  // Cleanup on unmount
  useEffect(() => () => stopCounting(), [stopCounting]);

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', padding: '24px 20px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Zählhilfe
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
          Lass dir die Takte 1–8 vorsprechen.
        </p>

        {/* Count display */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%', margin: '0 auto 24px',
          background: isPlaying ? 'var(--color-primary)' : 'var(--color-surface-raised)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isPlaying ? '0 8px 32px rgba(37,99,235,0.35)' : 'none',
          transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: '3.5rem', fontWeight: 800, color: isPlaying ? '#fff' : 'var(--color-text-muted)', lineHeight: 1 }}>
            {currentCount || '–'}
          </span>
        </div>

        {/* Tempo buttons */}
        <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
          Tempo
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          {[
            { id: 'langsam', label: 'Langsam', bpm: TEMPO_LANGSAM },
            { id: 'schnell', label: 'Schnell', bpm: TEMPO_SCHNELL },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTempo(t.id)}
              style={{
                padding: '10px 24px', borderRadius: 20, fontSize: '0.9rem', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: tempo === t.id ? 'var(--color-primary)' : 'var(--color-surface-raised)',
                color: tempo === t.id ? '#fff' : 'var(--color-text-muted)',
                boxShadow: tempo === t.id ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
              <span style={{ fontSize: '0.72rem', fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>
                {Math.round(t.bpm * speed)} BPM
              </span>
            </button>
          ))}
        </div>

        {/* Speed selector */}
        <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
          Geschwindigkeit
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {COUNT_SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: speed === s ? 'var(--color-primary-light)' : 'var(--color-surface-raised)',
                color: speed === s ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {s === 1.0 ? '1×' : `${s}×`}
            </button>
          ))}
        </div>

        {/* Play / Stop button */}
        <button
          onClick={togglePlay}
          style={{
            width: '100%', maxWidth: 280, padding: '16px 0', borderRadius: 'var(--border-radius-sm)',
            fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer',
            background: isPlaying
              ? '#DC2626'
              : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#fff',
            boxShadow: isPlaying ? '0 4px 16px rgba(220,38,38,0.35)' : '0 4px 16px rgba(37,99,235,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '0 auto',
            transition: 'all 0.2s',
          }}
        >
          {isPlaying ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Stopp
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Zählen starten
            </>
          )}
        </button>

        {/* Info note */}
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 20, lineHeight: 1.5 }}>
          Sprachausgabe nutzt die Text-to-Speech-Funktion deines Geräts.
        </p>
      </div>
    </div>
  );
}
