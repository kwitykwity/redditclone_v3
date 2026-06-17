import { SidebarAd } from './AdUnits.jsx'
import styles from './Sidebar.module.css'

const RULES = [
  "No completely fake posts",
  "No AI or Bot post and comments",
  "No karma farming",
  "Be civil in comments",
  "No doxxing or personal info",
]

export default function Sidebar({ sidebarAdVisible }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.communityCard}>
        <div className={styles.cardTitle}>AITAH</div>
        <p className={styles.desc}>
          A place to ask if you were, in fact, the asshole in a particular situation. AITAH is a judgment sub, not one to ask for opinions or advice. Relationship conflicts and hypotheticals are allowed. Do not use AI in any form.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>2M</div>
            <div className={styles.statLabel}>Weekly visitors</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>80K</div>
            <div className={styles.statLabel}>Weekly contributions</div>
          </div>
        </div>
        <div className={styles.meta}>
          <span>📅 Created Mar 17, 2021</span>
          <span>🌐 Public</span>
        </div>
        <button className={styles.guideBtn}>📋 Community Guide</button>
        <button className={styles.joinBtn}>Join</button>
        <button className={styles.createBtn}>＋ Create Post</button>
      </div>

      <div className={styles.rulesCard}>
        <div className={styles.rulesTitle}>R/AITAH RULES</div>
        {RULES.map((rule, i) => (
          <div key={i} className={styles.rule}>
            <span className={styles.ruleNum}>{i + 1}</span>
            <span className={styles.ruleText}>{rule}</span>
            <span className={styles.ruleChevron}>∨</span>
          </div>
        ))}
      </div>

      <SidebarAd visible={sidebarAdVisible} />

      <div className={styles.legendCard}>
        <div className={styles.legendTitle}>Ad types in this feed</div>
        {[
          { color: '#ff4500', label: 'Takeover / Announcement' },
          { color: '#0079d3', label: 'Banner Display (728×90)' },
          { color: '#46d160', label: 'Native / In-Feed' },
          { color: '#4fbdba', label: 'Video Pre-Roll' },
          { color: '#0a66c2', label: 'Promoted Post' },
          { color: '#0f3460', label: 'Sidebar Display (300×250)' },
        ].map(item => (
          <div key={item.label} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
