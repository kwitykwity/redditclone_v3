import styles from './VerdictBar.module.css'

export default function VerdictBar({ verdict }) {
  if (!verdict) return null

  const segments = [
    { key: 'nta', label: 'NTA', value: verdict.nta },
    { key: 'yta', label: 'YTA', value: verdict.yta },
    { key: 'esh', label: 'ESH', value: verdict.esh },
    { key: 'nah', label: 'NAH', value: verdict.nah },
  ]

  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0)
  // Normalize bar widths to always sum to 100, even if the source data
  // doesn't add up exactly (e.g. due to rounding when the data was authored).
  // The displayed percentage labels still show the original source values,
  // so the bar's proportions stay visually correct without silently
  // rewriting the underlying numbers shown to the user.
  const scale = total > 0 ? 100 / total : 0

  return (
    <div className={styles.wrap}>
      <div
        className={styles.bar}
        role="img"
        aria-label={segments.map(s => `${s.label} ${s.value} percent`).join(', ')}
      >
        {segments.map(s => (
          <div
            key={s.key}
            className={`${styles.seg} ${styles[s.key]}`}
            style={{ width: `${(s.value || 0) * scale}%` }}
          />
        ))}
      </div>
      <div className={styles.labels}>
        {segments.map(s => (
          <span key={s.key}>
            <span className={`${styles.dot} ${styles[s.key]}`} />
            {s.label} {s.value}%
          </span>
        ))}
      </div>
    </div>
  )
}
