import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Topbar.module.css'

const AD_TYPES = [
  { key: 'takeover',  label: 'Takeover' },
  { key: 'banner',    label: 'Banner' },
  { key: 'native',    label: 'Native' },
  { key: 'video',     label: 'Video' },
  { key: 'promoted',  label: 'Promoted' },
  { key: 'sidebar',   label: 'Sidebar' },
]

export default function Topbar({ theme, onToggle, ads, onToggleAd, searchQuery, onSearchChange }) {
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const location = useLocation()

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (location.pathname !== '/') navigate('/')
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      onSearchChange('')
      e.target.blur()
    }
  }

  function clearSearch() {
    onSearchChange('')
  }

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬤</span>
          <span className={styles.logoText}>reddit</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <div className={styles.searchTag}>
            <span className={styles.searchTagIcon}>⬤</span>
            r/AITAH
            <button className={styles.searchTagX} onClick={clearSearch} aria-label="Clear search">✕</button>
          </div>
          <input
            className={styles.searchInput}
            placeholder="Search in r/AITAH"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      <div className={styles.right}>
        {/* Ad toggles inline */}
        <div className={styles.adToggles}>
          {AD_TYPES.map(ad => (
            <div key={ad.key} className={styles.adToggleItem}>
              <span className={styles.adToggleLabel}>{ad.label}</span>
              <button
                className={`${styles.adToggle} ${ads[ad.key] ? styles.adToggleOn : styles.adToggleOff}`}
                onClick={() => onToggleAd(ad.key)}
                aria-label={`Toggle ${ad.label} ad`}
              >
                <div className={`${styles.adThumb} ${ads[ad.key] ? styles.adThumbOn : styles.adThumbOff}`} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* Light/dark toggle */}
        <div className={styles.toggleWrap} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span className={styles.toggleLabel}>{isDark ? '🌙' : '☀️'}</span>
          <button
            className={`${styles.toggle} ${isDark ? styles.toggleDark : styles.toggleLight}`}
            onClick={onToggle}
            aria-label="Toggle theme"
          >
            <div className={`${styles.toggleThumb} ${isDark ? styles.thumbDark : styles.thumbLight}`} />
          </button>
        </div>

        <button className={styles.iconBtn} title="Chat">💬</button>
        <button className={styles.iconBtn} title="Create">➕</button>
        <button className={styles.iconBtn} title="Notifications">🔔</button>
        <div className={styles.avatar}>🧑</div>
      </div>
    </header>
  )
}
