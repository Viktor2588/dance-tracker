import { getYoutubeThumbnail } from '../data';

function getProgress(project) {
  const videos = project.practiceVideos;
  if (!videos.length) return 0;
  const total = videos.reduce((acc, v) => acc + v.trainedDates.length, 0);
  // Cap at 10 sessions per video as "fully practiced"
  const maxExpected = videos.length * 10;
  return Math.min(100, Math.round((total / maxExpected) * 100));
}

export default function ProjectCard({ project, onClick }) {
  const thumbnail = getYoutubeThumbnail(project.demoVideoId);
  const progress = getProgress(project);
  const totalSessions = project.practiceVideos.reduce(
    (acc, v) => acc + v.trainedDates.length,
    0
  );

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        marginBottom: 20,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Progress bar (top) */}
      <div style={{ height: 4, background: 'var(--color-surface-raised)', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            borderRadius: '0 2px 2px 0',
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#E8F5E9', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={project.title}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
        {/* Play overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.12)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-primary)" style={{ marginLeft: 3 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>

        {/* Video count badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          {project.practiceVideos.length} Videos
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          {project.category}
        </p>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, marginBottom: 10 }}>
          {project.title}
        </h2>

        {/* Progress row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 120, height: 6, background: 'var(--color-surface-raised)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                borderRadius: 3,
                transition: 'width 0.6s',
              }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{progress}%</span>
          </div>
          {totalSessions > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              {totalSessions}× trainiert
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
