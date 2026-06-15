import styles from './VerdictBar.module.css'

export default function VerdictBar({ verdict }) {
  if (!verdict) return null

  const segments = [
    { key: 'nta', label: 'NTA', value: verdict.nta },
    { key: 'yta', label: 'YTA', value: verdict.yta },
    { key: 'esh', label: 'ESH', value: verdict.esh },
    { key: 'nah', label: 'NAH', value: verdict.nah },
  ]

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
            style={{ width: `${s.value}%` }}
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
