import { getWeeklyActivity, getMonthlyActivity, getStreak, getAllVideos, STATUS_LABELS } from '../data';

export default function Statistik({ data }) {
  const weeklyActivity = getWeeklyActivity(data);
  const monthlyActivity = getMonthlyActivity(data);
  const streak = getStreak(data);
  const allVideos = getAllVideos(data);
  const totalTrainings = allVideos.reduce((acc, v) => acc + v.trainedDates.length, 0);
  const weekTotal = weeklyActivity.reduce((acc, d) => acc + d.count, 0);
  const maxWeek = Math.max(...weeklyActivity.map((d) => d.count), 1);
  const maxMonth = Math.max(...monthlyActivity.map((d) => d.count), 1);

  const statusCounts = allVideos.reduce(
    (acc, v) => ({ ...acc, [v.status]: (acc[v.status] || 0) + 1 }),
    {}
  );

  // Sort projects by total trainings
  const projectStats = data.projects
    .map((p) => ({
      id: p.id,
      title: p.title,
      total: p.practiceVideos.reduce((acc, v) => acc + v.trainedDates.length, 0),
      videos: p.practiceVideos.length,
    }))
    .sort((a, b) => b.total - a.total);

  const maxProjectTotal = Math.max(...projectStats.map((p) => p.total), 1);

  return (
    <div style={{ padding: '0 16px 32px' }}>
      {/* Header */}
      <div style={{ padding: '28px 0 24px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Dein Fortschritt
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Statistik
        </h1>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '20px 24px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>🔥</span>
          <div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{streak} {streak === 1 ? 'Tag' : 'Tage'}</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>in Folge trainiert</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard value={data.projects.length} label="Projekte" color="var(--color-primary)" />
        <StatCard value={weekTotal} label="Diese Woche" color="var(--color-secondary)" />
        <StatCard value={totalTrainings} label="Gesamt" color="var(--color-primary)" />
      </div>

      {/* Weekly Chart */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Letzte 7 Tage
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
          {weeklyActivity.map((day) => {
            const pct = maxWeek > 0 ? (day.count / maxWeek) : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(pct * 100, day.count > 0 ? 8 : 3)}%`,
                      minHeight: 3,
                      borderRadius: 4,
                      background: isToday
                        ? 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                        : day.count > 0
                          ? 'var(--color-primary-light)'
                          : 'var(--color-surface-raised)',
                      transition: 'height 0.4s ease',
                    }}
                  />
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  color: isToday ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Chart */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Letzte 30 Tage
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 48 }}>
          {monthlyActivity.map((day) => {
            const pct = maxMonth > 0 ? (day.count / maxMonth) : 0;
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.count}`}
                style={{
                  flex: 1,
                  height: `${Math.max(pct * 100, day.count > 0 ? 15 : 4)}%`,
                  minHeight: 3,
                  borderRadius: 2,
                  background: day.count > 0 ? 'var(--color-primary)' : 'var(--color-surface-raised)',
                  opacity: day.count > 0 ? 0.6 + pct * 0.4 : 1,
                }}
              />
            );
          })}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
          {monthlyActivity.filter(d => d.count > 0).length} aktive Tage
        </p>
      </div>

      {/* Status Overview */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Videofortschritt
        </p>
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = statusCounts[key] || 0;
          const pct = allVideos.length > 0 ? Math.round((count / allVideos.length) * 100) : 0;
          return (
            <ProgressRow key={key} label={label} count={count} pct={pct} statusKey={key} />
          );
        })}
      </div>

      {/* Per-project stats */}
      {projectStats.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Nach Projekt
          </p>
          {projectStats.map((p) => {
            const pct = maxProjectTotal > 0 ? Math.round((p.total / maxProjectTotal) * 100) : 0;
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{p.total}× trainiert</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--color-surface-raised)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 3,
                    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-md)',
      padding: '16px 12px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-card)',
    }}>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: color || 'var(--color-text)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 6, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

const statusBarColors = {
  'nicht-begonnen': 'var(--color-surface-raised)',
  'in-uebung': 'var(--color-secondary)',
  'sicher': 'var(--color-primary)',
};

function ProgressRow({ label, count, pct, statusKey }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{count} Videos</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--color-surface-raised)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: statusBarColors[statusKey] || '#ccc',
          transition: 'width 0.5s',
        }} />
      </div>
    </div>
  );
}
