import { useState } from 'react'
import styles from './AdUnits.module.css'

function AdLabel({ type, pricing, description }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.adMeta}>
      <div className={styles.adMetaRow}>
        <span className={styles.adPill}>AD</span>
        <span className={styles.adType}>{type}</span>
        <span className={styles.adPrice}>{pricing}</span>
        <button className={styles.howBtn} onClick={() => setOpen(o => !o)}>
          {open ? '▲ hide' : '▼ how this works'}
        </button>
      </div>
      {open && <p className={styles.adDesc}>{description}</p>}
    </div>
  )
}

export function TakeoverAd({ visible }) {
  const [dismissed, setDismissed] = useState(false)
  if (!visible || dismissed) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.takeover}>
        <div className={styles.takeoverInner}>
          <span className={styles.sponsoredTag}>SPONSORED</span>
          <span className={styles.takeoverText}>
            <strong>BetterHelp</strong> — Talk to a licensed therapist today. First week free.
          </span>
        </div>
        <div className={styles.takeoverRight}>
          <a
            className={styles.takeoverCta}
            href="https://www.betterhelp.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Try now →
          </a>
          <button className={styles.dismissX} onClick={() => setDismissed(true)}>✕</button>
        </div>
      </div>
      <AdLabel
        type="Takeover / Announcement Ad"
        pricing="Premium CPM — paid per 1,000 views"
        description="Appears at the very top of the feed before any posts. Maximum visibility — every user sees it first. Sold at premium CPM rates ($20–$50+). Brands use this for major product launches and time-sensitive campaigns. Users can dismiss it, but most see it before scrolling."
      />
    </div>
  )
}

export function BannerAd({ visible }) {
  if (!visible) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIcon}>💳</div>
          <div>
            <div className={styles.bannerHeadline}>Credit Karma — Build credit while you spend</div>
            <div className={styles.bannerSub}>No annual fee. Apply in 2 minutes. No credit check required.</div>
          </div>
        </div>
        <a
          className={styles.bannerCta}
          href="https://www.creditkarma.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Apply Now
        </a>
      </div>
      <AdLabel
        type="Banner / Display Ad"
        pricing="CPM — $5–$15 per 1,000 impressions"
        description="The classic horizontal leaderboard banner. Charged per impression (CPM) — the advertiser pays every time 1,000 people see it, whether or not anyone clicks. Click-through rate is low (~0.1%) but reach is very high. Best for brand awareness campaigns."
      />
    </div>
  )
}

export function NativeAd({ visible }) {
  if (!visible) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.nativeCard}>
        <div className={styles.nativeMeta}>
          <div className={styles.nativeAvatar}>🎓</div>
          <span className={styles.nativeAuthor}>u/Coursera_Official</span>
          <span className={styles.dot}>•</span>
          <span className={styles.nativePromoted}>Sponsored</span>
          <button className={styles.moreBtn}>•••</button>
        </div>
        <div className={styles.nativeBody}>
          <h3 className={styles.nativeTitle}>We helped 2M people switch careers into tech. Here's what they all started with.</h3>
          <p className={styles.nativeText}>Thousands of learners have landed jobs in AI, data science, and software engineering — starting from zero. Most began with one free course. See what made the difference.</p>
        </div>
        <div className={styles.nativeActions}>
          <a
            className={styles.nativeCta}
            href="https://www.coursera.org"
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Start free trial →
          </a>
          <button className={styles.actionBtn}>💬 243</button>
          <button className={styles.actionBtn}>↗ Share</button>
        </div>
      </div>
      <AdLabel
        type="Native / In-Feed Ad"
        pricing="CPC — paid per click ($0.50–$3.00/click)"
        description="Looks almost identical to an organic post. Appears naturally in the feed. Charged per click (CPC) — advertiser pays only when someone clicks through. Native ads get 3–5× higher engagement than banners because they match the surrounding content. Reddit's most popular ad format."
      />
    </div>
  )
}

export function VideoAd({ visible }) {
  const [playing, setPlaying] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const [countdown, setCountdown] = useState(5)

  if (!visible) return null

  function handlePlay() {
    setPlaying(true)
    let c = 5
    const t = setInterval(() => {
      c--
      setCountdown(c)
      if (c <= 0) clearInterval(t)
    }, 1000)
  }

  if (skipped) return (
    <div className={styles.wrap}>
      <div className={styles.videoSkipped}>Ad skipped — in a real platform, the next post loads here.</div>
      <AdLabel
        type="Video Pre-Roll / In-Feed Video Ad"
        pricing="CPV — $15–$40+ per 1,000 completed views"
        description="Video ads auto-play silently as you scroll. You can skip after 5 seconds. Charged per completed view (CPV). Highest CPM of any format. The skip option actually helps advertisers — it filters for users genuinely interested in the product."
      />
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.videoCard}>
        <div className={styles.videoMeta}>
          <div className={styles.nativeAvatar}>💊</div>
          <span className={styles.nativeAuthor}>u/HimsAndHers_Official</span>
          <span className={styles.dot}>•</span>
          <span className={styles.nativePromoted}>Sponsored</span>
        </div>
        <div className={styles.videoPlayer} onClick={!playing ? handlePlay : undefined}>
          {!playing ? (
            <div className={styles.videoThumb}>
              <div className={styles.playBtn}>▶</div>
              <p className={styles.videoLabel}>Hims & Hers — Feel like yourself again</p>
            </div>
          ) : (
            <div className={styles.videoPlaying}>
              <div className={styles.videoTopBar}>
                <span className={styles.adChip}>AD</span>
                {countdown > 0
                  ? <span className={styles.skipInfo}>Skip in {countdown}s</span>
                  : <button className={styles.skipNow} onClick={() => setSkipped(true)}>Skip Ad ›</button>
                }
              </div>
              <div className={styles.videoContent}>
                <span style={{ fontSize: 40 }}>💊</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 15, margin: 0 }}>Personalized care, delivered to your door.</p>
                  <a
                    href="https://www.hims.com"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={styles.videoLearnMore}
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        {playing && countdown <= 0 && (
          <div className={styles.videoFooter}>
            <button className={styles.skipFull} onClick={() => setSkipped(true)}>Skip Ad →</button>
          </div>
        )}
      </div>
      <AdLabel
        type="Video Pre-Roll / In-Feed Video Ad"
        pricing="CPV — $15–$40+ per 1,000 completed views"
        description="Video ads auto-play silently as you scroll. You can skip after 5 seconds. Charged per completed view (CPV). Highest CPM of any format. The skip option actually helps advertisers — it filters for users genuinely interested in the product."
      />
    </div>
  )
}

export function PromotedPostAd({ visible }) {
  if (!visible) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.nativeCard}>
        <div className={styles.nativeMeta}>
          <div className={styles.linkedInAvatar}>in</div>
          <span className={styles.nativeAuthor}>u/LinkedIn</span>
          <span className={styles.dot}>•</span>
          <span className={styles.nativePromoted}>Promoted</span>
          <button className={styles.moreBtn}>•••</button>
        </div>
        <div className={styles.nativeBody}>
          <h3 className={styles.nativeTitle}>500,000 people landed new jobs through LinkedIn in 2024. Here's the one thing they all did first.</h3>
          <p className={styles.nativeText}>Turns out it wasn't updating their resume or applying to hundreds of jobs. The single biggest factor? Building a strong LinkedIn presence before they needed it.</p>
        </div>
        <div className={styles.nativeActions}>
          <a
            className={styles.nativeCta}
            style={{background:'#0a66c2'}}
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            See how →
          </a>
          <button className={styles.actionBtn}>💬 412</button>
          <button className={styles.actionBtn}>↗ Share</button>
        </div>
      </div>
      <AdLabel
        type="Promoted Post"
        pricing="CPC or CPM — real-time auction bidding"
        description="Reddit's flagship ad product. Promoted posts appear in the feed with a 'Promoted' label. Advertisers bid in real-time auctions. The price changes based on how many brands are competing for the same audience at the same moment."
      />
    </div>
  )
}

export function SidebarAd({ visible }) {
  if (!visible) return null
  return (
    <div className={styles.sidebarAdWrap}>
      <div className={styles.sidebarAdLabel}>Sponsored</div>
      <div className={styles.sidebarAd}>
        <div className={styles.sidebarImg}>
          <span style={{ fontSize: 32 }}>🔒</span>
          <span style={{ fontSize: 11, color: '#7dd3d0', marginTop: 4 }}>NordVPN</span>
        </div>
        <div className={styles.sidebarHeadline}>Stay private online</div>
        <div className={styles.sidebarSub}>68% off + 3 months free. Limited time offer.</div>
        <a
          className={styles.sidebarBtn}
          href="https://nordvpn.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Get the deal
        </a>
      </div>
      <div className={styles.sidebarAdMeta}>
        <span className={styles.adPill}>AD</span>
        <span className={styles.adType}>Sidebar Display (300×250)</span>
        <span className={styles.adPrice}>CPM</span>
      </div>
    </div>
  )
}
