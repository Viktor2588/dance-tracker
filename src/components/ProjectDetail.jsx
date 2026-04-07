import { useState, useRef, useCallback } from 'react';
import {
  getYoutubeThumbnail,
  formatDate,
  STATUS_LABELS,
  addTrainingToday,
  updateVideoStatus,
  updateProjectHashtags,
  updateProjectDemoNotes,
  updatePracticeVideoNotes,
} from '../data';
import StatusBadge from './StatusBadge';
import SpeedControl from './SpeedControl';
import { sendSpeedToYoutube } from '../youtubeUtils';

export default function ProjectDetail({ project, onBack, onDataChange }) {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [trainedToday, setTrainedToday] = useState({});
  const [demoSpeed, setDemoSpeed] = useState(1.0);
  const demoIframeRef = useRef(null);

  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState(project.demoHashtags || []);
  const [demoNotes, setDemoNotes] = useState(project.demoNotes || '');

  const sortedVideos = [...project.practiceVideos].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleTrainedToday = (videoId) => {
    const next = addTrainingToday(videoId);
    setTrainedToday((prev) => ({ ...prev, [videoId]: true }));
    onDataChange(next);
  };

  const handleStatusChange = (videoId, status) => {
    const next = updateVideoStatus(videoId, status);
    onDataChange(next);
  };

  const handleDemoNotesBlur = () => {
    const next = updateProjectDemoNotes(project.id, demoNotes);
    onDataChange(next);
  };

  const handleAddHashtag = () => {
    let tag = hashtagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = `#${tag}`;
    if (!hashtags.includes(tag)) {
      const nextTags = [...hashtags, tag];
      setHashtags(nextTags);
      const next = updateProjectHashtags(project.id, nextTags);
      onDataChange(next);
    }
    setHashtagInput('');
  };

  const handleRemoveHashtag = useCallback((tag) => {
    const nextTags = hashtags.filter((t) => t !== tag);
    setHashtags(nextTags);
    const next = updateProjectHashtags(project.id, nextTags);
    onDataChange(next);
  }, [hashtags, project.id, onDataChange]);

  const handleHashtagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddHashtag(); }
  };

  const isTodayTrained = (video) => {
    const today = new Date().toISOString().split('T')[0];
    return trainedToday[video.id] || video.trainedDates.includes(today);
  };

  const handleDemoIframeLoad = () => {
    setTimeout(() => sendSpeedToYoutube(demoIframeRef.current, demoSpeed), 600);
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Back Button */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--color-text-muted)', fontSize: '0.9rem',
            fontWeight: 500, background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px 0',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Zurück
        </button>
      </div>

      {/* Category + Title */}
      <div style={{ padding: '12px 16px 20px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 4 }}>
          {project.category}
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          {project.title}
        </h1>
      </div>

      {/* 1. Referenzvideo */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', position: 'relative', background: '#000' }}>
          {activeVideoId === 'demo' ? (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                ref={demoIframeRef}
                src={`https://www.youtube.com/embed/${project.demoVideoId}?autoplay=1&enablejsapi=1`}
                title={project.title}
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope"
                allowFullScreen
                onLoad={handleDemoIframeLoad}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div
              onClick={() => setActiveVideoId('demo')}
              style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', background: '#EFF6FF', overflow: 'hidden' }}
            >
              <img
                src={getYoutubeThumbnail(project.demoVideoId)}
                alt="Referenzvideo"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.22)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 4 }}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
              <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Referenz
              </div>
            </div>
          )}
        </div>
        {activeVideoId === 'demo' && (
          <SpeedControl iframeRef={demoIframeRef} speed={demoSpeed} onSpeedChange={setDemoSpeed} />
        )}
      </div>

      {/* 2. Hashtags */}
      <div style={{ margin: '16px 16px 0', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Hashtags
        </p>
        {hashtags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {hashtags.map((tag) => (
              <div
                key={tag}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-primary-light)', borderRadius: 20, padding: '5px 12px' }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{tag}</span>
                <button
                  onClick={() => handleRemoveHashtag(tag)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', padding: '0 0 0 2px', lineHeight: 1, display: 'flex' }}
                  aria-label={`${tag} entfernen`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="#Hiproll, #Promenade …"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            style={{
              flex: 1, padding: '9px 12px', borderRadius: 10,
              border: '1.5px solid var(--color-surface-raised)',
              background: 'var(--color-surface-raised)', fontSize: '0.88rem',
              color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleAddHashtag}
            style={{ padding: '9px 18px', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700, background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
      </div>

      {/* 3. Notizen zum Referenzvideo */}
      <div style={{ margin: '12px 16px 0', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10 }}>
          Notizen
        </p>
        <textarea
          value={demoNotes}
          onChange={(e) => setDemoNotes(e.target.value)}
          onBlur={handleDemoNotesBlur}
          placeholder="Eigene Notizen zum Referenzvideo …"
          rows={4}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid var(--color-surface-raised)',
            background: 'var(--color-surface-raised)', fontSize: '0.93rem',
            color: 'var(--color-text)', lineHeight: 1.6,
            outline: 'none', resize: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* 4. Eigene Übungsvideos */}
      <div style={{ padding: '24px 16px 0' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Eigene Übungsvideos
        </p>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
          {sortedVideos.length} {sortedVideos.length === 1 ? 'Video' : 'Videos'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sortedVideos.map((video) => (
            <PracticeVideoCard
              key={video.id}
              video={video}
              isPlaying={activeVideoId === video.id}
              onPlay={() => setActiveVideoId(activeVideoId === video.id ? null : video.id)}
              isTodayTrained={isTodayTrained(video)}
              onTrainedToday={() => handleTrainedToday(video.id)}
              onStatusChange={(status) => handleStatusChange(video.id, status)}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticeVideoCard({ video, isPlaying, onPlay, isTodayTrained, onTrainedToday, onStatusChange, onDataChange }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [notes, setNotes] = useState(video.notes || '');
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    setTimeout(() => sendSpeedToYoutube(iframeRef.current, speed), 600);
  };

  const handleNotesBlur = () => {
    const next = updatePracticeVideoNotes(video.id, notes);
    onDataChange(next);
  };

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      {/* Video Thumbnail / Player */}
      <div style={{ position: 'relative', background: '#EFF6FF', overflow: 'hidden' }}>
        {isPlaying ? (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&enablejsapi=1`}
              title={video.title}
              frameBorder="0"
              allow="autoplay; encrypted-media; gyroscope"
              allowFullScreen
              onLoad={handleIframeLoad}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div
            onClick={onPlay}
            style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', overflow: 'hidden' }}
          >
            <img
              src={getYoutubeThumbnail(video.videoId)}
              alt={video.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.16)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 3 }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {formatDate(video.date)}
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3, marginBottom: 3 }}>
              {video.title}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {formatDate(video.date)}
            </p>
          </div>
          <button onClick={() => setShowStatusMenu(!showStatusMenu)} style={{ flexShrink: 0, marginLeft: 12, marginTop: 2 }}>
            <StatusBadge status={video.status} />
          </button>
        </div>

        {/* Speed control (shown when playing) */}
        {isPlaying && (
          <SpeedControl iframeRef={iframeRef} speed={speed} onSpeedChange={setSpeed} />
        )}

        {/* Status Menu */}
        {showStatusMenu && (
          <div style={{ background: 'var(--color-surface-raised)', borderRadius: 'var(--border-radius-sm)', padding: 8, marginTop: 8, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { onStatusChange(key); setShowStatusMenu(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                  fontSize: '0.85rem', fontWeight: video.status === key ? 600 : 400,
                  color: 'var(--color-text)',
                  background: video.status === key ? 'var(--color-primary-light)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {video.trainedDates.length > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '8px 0 4px' }}>
            {video.trainedDates.length}× trainiert
          </p>
        )}

        {/* 5. Expandable Notes */}
        <button
          onClick={() => setNotesExpanded(!notesExpanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            textAlign: 'left', padding: '8px 0', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.82rem', fontWeight: 600,
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: notesExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>
            Notizen
            {notes && !notesExpanded && (
              <span style={{ color: 'var(--color-primary)', fontWeight: 400, marginLeft: 4 }}>
                {notes.substring(0, 32)}{notes.length > 32 ? '…' : ''}
              </span>
            )}
          </span>
        </button>

        {notesExpanded && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Notizen zu diesem Übungsvideo …"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: '1.5px solid var(--color-surface-raised)',
              background: 'var(--color-surface-raised)', fontSize: '0.88rem',
              color: 'var(--color-text)', lineHeight: 1.5,
              outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 10,
            }}
          />
        )}

        {/* "Heute geübt" Button */}
        <button
          onClick={() => !isTodayTrained && onTrainedToday()}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em',
            border: isTodayTrained ? 'none' : '1.5px solid var(--color-primary)',
            background: isTodayTrained
              ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
              : 'transparent',
            color: isTodayTrained ? '#fff' : 'var(--color-primary)',
            cursor: isTodayTrained ? 'default' : 'pointer',
            transition: 'all 0.25s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isTodayTrained ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Heute trainiert
            </>
          ) : 'Heute geübt'}
        </button>
      </div>
    </div>
  );
}

