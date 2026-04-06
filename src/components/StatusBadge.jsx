import { STATUS, STATUS_LABELS } from '../data';

const styles = {
  [STATUS.NICHT_BEGONNEN]: {
    background: 'var(--badge-none-bg)',
    color: 'var(--badge-none-text)',
  },
  [STATUS.IN_UEBUNG]: {
    background: 'var(--badge-progress-bg)',
    color: 'var(--badge-progress-text)',
  },
  [STATUS.SICHER]: {
    background: 'var(--badge-safe-bg)',
    color: 'var(--badge-safe-text)',
  },
};

export default function StatusBadge({ status }) {
  const style = styles[status] || styles[STATUS.NICHT_BEGONNEN];
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        padding: '3px 10px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABELS[status] || 'Unbekannt'}
    </span>
  );
}
