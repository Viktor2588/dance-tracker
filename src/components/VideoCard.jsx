import { getYoutubeThumbnail, formatDate } from '../data';
import StatusBadge from './StatusBadge';

export default function VideoCard({ video, onClick, compact = false }) {
  const thumbnail = getYoutubeThumbnail(video.videoId);

  if (compact) {
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
        onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '60%', background: '#EDE0D4', overflow: 'hidden' }}>
          <img
            src={thumbnail}
            alt={video.title}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ padding: '10px 12px 12px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </p>
          <StatusBadge status={video.status} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        transition: 'transform 0.15s',
      }}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: 110, flexShrink: 0, background: '#EDE0D4', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={video.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 2 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
          {video.title}
        </p>
        {video.projectTitle && (
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {video.projectTitle}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {formatDate(video.date)}
          </p>
          <StatusBadge status={video.status} />
        </div>
      </div>
    </div>
  );
}
