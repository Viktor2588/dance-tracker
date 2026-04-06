import { getYoutubeThumbnail } from '../data';

export default function ProjectCard({ project, onClick }) {
  const thumbnail = getYoutubeThumbnail(project.demoVideoId);

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
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#EDE0D4', overflow: 'hidden' }}>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 3 }}>
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
            background: 'rgba(255,255,255,0.9)',
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
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
          {project.title}
        </h2>
      </div>
    </div>
  );
}
