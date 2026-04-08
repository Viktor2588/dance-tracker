import { useState, useRef, useEffect, useCallback } from 'react';
import {
  TRAINING_STATUS,
  TRAINING_STATUS_LABELS,
  STATUS,
  STATUS_LABELS,
  updateVideoStatus,
  updateVideoTrainingPlan,
  getTrainingPlanVideos,
  getStreak,
  getYoutubeThumbnail,
} from '../data';

const SECTION_PLAN = 'plan';
const SECTION_KALENDER = 'kalender';
const SECTION_ZAEHLER = 'zaehler';

const COUNT_SPEEDS = [0.25, 0.5, 0.75, 1.0];
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
  const streak = getStreak(data);
  const trainingVideos = getTrainingPlanVideos(data);

  const nextVideo = trainingVideos.find((v) => v.status === STATUS.NICHT_BEGONNEN);

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 16px 0' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Dein Training
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Training
        </h1>
      </div>

      {/* Top Section: Streak + Nächste Übung */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Streak */}
        {streak > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
            borderRadius: 'var(--border-radius-md)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: 'var(--shadow-card)',
          }}>
            <span style={{ fontSize: '2rem' }}>🔥</span>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400E' }}>
                {streak} {streak === 1 ? 'Tag' : 'Tage'} in Folge trainiert
              </p>
              <p style={{ fontSize: '0.78rem', color: '#B45309', marginTop: 2, fontWeight: 500 }}>
                Weiter so! 💪
              </p>
            </div>
          </div>
        )}

        {/* Nächste Übung */}
        {nextVideo && (
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                Nächste Übung
              </p>
              <span style={{ fontSize: '0.7rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>
                Als nächstes
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px 14px' }}>
              <div style={{ width: 64, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#EFF6FF' }}>
                <img
                  src={getYoutubeThumbnail(nextVideo.videoId !== 'placeholder' ? nextVideo.videoId : nextVideo.projectDemoVideoId)}
                  alt={nextVideo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nextVideo.title}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {nextVideo.projectTitle}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '20px 16px 16px', overflowX: 'auto' }}>
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
        <TrainingsplanSection
          trainingVideos={trainingVideos}
          exercises={exercises}
          onDataChange={onDataChange}
        />
      )}
      {section === SECTION_KALENDER && (
        <KalenderSection exercises={exercises} />
      )}
      {section === SECTION_ZAEHLER && (
        <ZaehlerSection />
      )}
    </div>
  );
}

/* ─── Trainingsplan ─────────────────────────────────────────────────── */

function TrainingsplanSection({ trainingVideos, exercises, onDataChange }) {
  const nextVideos = trainingVideos.filter((v) => v.status === STATUS.NICHT_BEGONNEN);
  const inProgressVideos = trainingVideos.filter((v) => v.status === STATUS.IN_UEBUNG);
  const doneVideos = trainingVideos.filter((v) => v.status === STATUS.SICHER);

  return (
    <div style={{ padding: '0 16px' }}>
      {trainingVideos.length === 0 && exercises.length === 0 ? (
        <EmptyTraining />
      ) : (
        <>
          <TrainingSection
            title="Als nächstes üben"
            emoji="📋"
            videos={nextVideos}
            onDataChange={onDataChange}
            emptyText="Keine Videos in der Warteschlange"
          />
          <TrainingSection
            title="In Arbeit"
            emoji="💪"
            videos={inProgressVideos}
            onDataChange={onDataChange}
            emptyText="Keine Videos in Bearbeitung"
          />
          <TrainingSection
            title="Abgeschlossen"
            emoji="✅"
            videos={doneVideos}
            onDataChange={onDataChange}
            emptyText="Noch keine Videos abgeschlossen"
          />
        </>
      )}
    </div>
  );
}

function TrainingSection({ title, emoji, videos, onDataChange, emptyText }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1rem' }}>{emoji}</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-surface-raised)', borderRadius: 10, padding: '2px 8px' }}>
            {videos.length}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)"
          strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {videos.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', padding: '12px 0', textAlign: 'center' }}>{emptyText}</p>
          ) : (
            videos.map((video) => (
              <TrainingVideoCard
                key={video.id}
                video={video}
                onDataChange={onDataChange}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TrainingVideoCard({ video, onDataChange }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const thumbnailId = video.videoId !== 'placeholder' ? video.videoId : video.projectDemoVideoId;

  const handleStatusChange = (status) => {
    const next = updateVideoStatus(video.id, status);
    onDataChange(next);
    setShowStatusMenu(false);
  };

  const handleRemoveFromPlan = () => {
    const next = updateVideoTrainingPlan(video.id, false);
    onDataChange(next);
  };

  const statusColors = {
    [STATUS.NICHT_BEGONNEN]: { bg: 'var(--color-surface-raised)', text: 'var(--color-text-muted)' },
    [STATUS.IN_UEBUNG]: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)' },
    [STATUS.SICHER]: { bg: '#DCFCE7', text: '#15803D' },
  };
  const sc = statusColors[video.status] || statusColors[STATUS.NICHT_BEGONNEN];

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
        {/* Thumbnail */}
        <div style={{ width: 72, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#EFF6FF', position: 'relative' }}>
          <img
            src={getYoutubeThumbnail(thumbnailId)}
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {video.title}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {video.projectTitle || video.category}
          </p>
        </div>

        {/* Status badge */}
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, background: sc.bg, color: sc.text, border: 'none', cursor: 'pointer' }}
        >
          {STATUS_LABELS[video.status]}
        </button>
      </div>

      {/* Status menu */}
      {showStatusMenu && (
        <div style={{ background: 'var(--color-surface-raised)', borderRadius: 10, margin: '0 14px 12px', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              style={{
                textAlign: 'left', padding: '7px 12px', borderRadius: 8,
                fontSize: '0.83rem', fontWeight: video.status === key ? 600 : 400,
                background: video.status === key ? 'var(--color-primary-light)' : 'transparent',
                color: 'var(--color-text)', border: 'none', cursor: 'pointer',
              }}
            >{label}</button>
          ))}
          <div style={{ height: 1, background: 'var(--color-surface)', margin: '4px 0' }} />
          <button
            onClick={handleRemoveFromPlan}
            style={{ textAlign: 'left', padding: '7px 12px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 400, color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Aus Trainingsplan entfernen
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyTraining() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>📋</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Trainingsplan leer</p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
        Beim Hinzufügen eines Übungsvideos aktiviere &quot;Zum Trainingsplan hinzufügen&quot;.
      </p>
    </div>
  );
}

/* ─── Kalender ──────────────────────────────────────────────────────── */

function KalenderSection({ exercises }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7;

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const todayStr = today.toISOString().split('T')[0];

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {weekDays.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
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

/* ─── Zähler ────────────────────────────────────────────────────────── */

function ZaehlerSection() {
  const [bpm, setBpm] = useState(90);
  const [countSpeed, setCountSpeed] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const intervalRef = useRef(null);

  const beatsPerBar = 8;
  const msPerBeat = Math.round((60 / bpm) * 1000 / countSpeed);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setBeat((prev) => (prev + 1) % beatsPerBar);
      }, msPerBeat);
    } else {
      clearInterval(intervalRef.current);
      setBeat(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, msPerBeat]);

  const handleTap = useCallback(() => {
    setBeat((prev) => (prev + 1) % beatsPerBar);
  }, []);

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Takt-Zähler
        </p>

        {/* Beat display */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {Array.from({ length: beatsPerBar }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: beat === i && isRunning ? 'var(--color-primary)' : i % 4 === 0 ? 'var(--color-primary-light)' : 'var(--color-surface-raised)',
                border: i % 4 === 0 ? '2px solid var(--color-primary)' : 'none',
                transition: 'background 0.1s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
                color: beat === i && isRunning ? '#fff' : 'var(--color-text-muted)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* BPM control */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tempo</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{bpm} BPM</span>
          </div>
          <input
            type="range"
            min={TEMPO_LANGSAM}
            max={TEMPO_SCHNELL}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Langsam</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Schnell</span>
          </div>
        </div>

        {/* Speed multiplier */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Zähl-Geschwindigkeit</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {COUNT_SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setCountSpeed(s)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: countSpeed === s ? 'var(--color-primary)' : 'var(--color-surface-raised)',
                  color: countSpeed === s ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {s === 1.0 ? '×1' : `×${s}`}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              flex: 2, padding: '14px 0', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              background: isRunning ? '#DC2626' : 'var(--color-primary)',
              color: '#fff', boxShadow: isRunning ? '0 4px 14px rgba(220,38,38,0.35)' : '0 4px 14px rgba(37,99,235,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {isRunning ? '⏹ Stopp' : '▶ Start'}
          </button>
          <button
            onClick={handleTap}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              background: 'var(--color-surface-raised)', color: 'var(--color-text)',
              transition: 'transform 0.08s',
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Tap
          </button>
        </div>
      </div>
    </div>
  );
}
