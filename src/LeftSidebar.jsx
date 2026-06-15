import styles from './LeftSidebar.module.css'

const MAIN_NAV = [
  { icon: '🏠', name: 'Home' },
  { icon: '📈', name: 'Popular' },
  { icon: '📰', name: 'News' },
  { icon: '🔭', name: 'Explore' },
  { icon: '➕', name: 'Start a community' },
]

const GAMES = [
  { icon: '🔵', name: 'LETTERSET', sub: 'Make every letter cou...', badge: 'NEW', players: '169K monthly players' },
  { icon: '⚔️', name: 'Slingblade' },
  { icon: '🚜', name: 'Farm Merge Valley' },
  { icon: '🧩', name: 'Color Puzzle' },
  { icon: '🔍', name: 'Discover More' },
]

const RECENT = [
  { icon: '⬤', name: 'r/AITAH', color: '#ff4500', active: true },
  { icon: '😤', name: 'r/AmIOverreacting', color: '#7193ff' },
]

const CUSTOM_FEEDS = []

export default function LeftSidebar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.section}>
        {MAIN_NAV.map(item => (
          <div key={item.name} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          GAMES ON REDDIT
          <button className={styles.collapseBtn}>∧</button>
        </div>

        <div className={styles.gameCard}>
          <div className={styles.gameIcon}>L</div>
          <div className={styles.gameInfo}>
            <div className={styles.gameName}>LETTERSET <span className={styles.newBadge}>NEW</span></div>
            <div className={styles.gameSub}>Make every letter cou...</div>
            <div className={styles.gamePlayers}>169K monthly players</div>
          </div>
        </div>

        {GAMES.slice(1).map(item => (
          <div key={item.name} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          CUSTOM FEEDS
          <button className={styles.collapseBtn}>∧</button>
        </div>
        <div className={styles.item}>
          <span className={styles.plus}>＋</span>
          <span>Create Custom Feed</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          RECENT
          <button className={styles.collapseBtn}>∧</button>
        </div>
        {RECENT.map(item => (
          <div key={item.name} className={`${styles.item} ${item.active ? styles.active : ''}`}>
            <span className={styles.icon} style={{ color: item.color || 'var(--text2)' }}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

