import { getStreak } from '../data';
import ProjectCard from './ProjectCard';

export default function Projekte({ data, onOpenProject }) {
  const streak = getStreak(data);

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 20px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Bachata Training
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
            Start
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

      {/* Project Cards */}
      <div>
        {data.projects.length === 0 ? (
          <EmptyState />
        ) : (
          data.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onOpenProject(project.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>💃</div>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        Noch keine Projekte
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        Tippe auf das Kamera-Symbol unten, um ein neues Projekt zu erstellen.
      </p>
    </div>
  );
}
