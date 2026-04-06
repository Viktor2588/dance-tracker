import { useState } from 'react';
import { getYoutubeThumbnail, formatDate, STATUS_LABELS, addTrainingToday, updateVideoStatus } from '../data';
import StatusBadge from './StatusBadge';

export default function ProjectDetail({ project, onBack, onDataChange }) {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [trainedToday, setTrainedToday] = useState({});

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

  const isTodayTrained = (video) => {
    const today = new Date().toISOString().split('T')[0];
    return trainedToday[video.id] || video.trainedDates.includes(today);
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Back Button */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 0',
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

      {/* Demo Video */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', position: 'relative', background: '#000' }}>
          {activeVideoId === 'demo' ? (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${project.demoVideoId}?autoplay=1`}
                title={project.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div
              onClick={() => setActiveVideoId('demo')}
              style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', background: '#EDE0D4', overflow: 'hidden' }}
            >
              <img
                src={getYoutubeThumbnail(project.demoVideoId)}
                alt="Demo Video"
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
                Demo
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Notes */}
      {project.demoNotes && (
        <div style={{ margin: '20px 16px 0', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10 }}>
            Notizen
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
            {project.demoNotes}
          </p>
        </div>
      )}

      {/* Practice Videos */}
      <div style={{ padding: '28px 16px 0' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Übungsvideos
        </p>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
          {sortedVideos.length} Videos
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticeVideoCard({ video, isPlaying, onPlay, isTodayTrained, onTrainedToday, onStatusChange }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Video Thumbnail / Player */}
      <div style={{ position: 'relative', background: '#EDE0D4', overflow: 'hidden' }}>
        {isPlaying ? (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
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
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3, marginBottom: 4 }}>
              {video.title}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {formatDate(video.date)}
            </p>
          </div>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{ flexShrink: 0, marginLeft: 12, marginTop: 2 }}
          >
            <StatusBadge status={video.status} />
          </button>
        </div>

        {/* Status Menu */}
        {showStatusMenu && (
          <div style={{ background: 'var(--color-surface-raised)', borderRadius: 'var(--border-radius-sm)', padding: 8, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { onStatusChange(key); setShowStatusMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: video.status === key ? 600 : 400,
                  color: 'var(--color-text)',
                  background: video.status === key ? 'var(--color-accent)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Training count */}
        {video.trainedDates.length > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
            {video.trainedDates.length}× trainiert
          </p>
        )}

        {/* "Heute geübt" Button */}
        <button
          onClick={() => !isTodayTrained && onTrainedToday()}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            border: isTodayTrained ? 'none' : '1.5px solid var(--color-accent-dark)',
            background: isTodayTrained ? 'var(--color-accent)' : 'transparent',
            color: isTodayTrained ? 'var(--color-text)' : 'var(--color-text)',
            cursor: isTodayTrained ? 'default' : 'pointer',
            transition: 'all 0.25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isTodayTrained ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Heute trainiert
            </>
          ) : (
            'Heute geübt'
          )}
        </button>
      </div>
    </div>
  );
}
