import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Topbar from './Topbar.jsx'
import LeftSidebar from './LeftSidebar.jsx'
import SubHeader from './SubHeader.jsx'
import PostCard from './PostCard.jsx'
import Sidebar from './Sidebar.jsx'
import ThreadView from './ThreadView.jsx'
import { TakeoverAd, BannerAd, NativeAd, VideoAd, PromotedPostAd } from './AdUnits.jsx'
import { POSTS } from './data.js'
import styles from './App.module.css'

const PROMOTED_POST = {
  id: 99, author: 'Omvoh', avatar: '💬', flair: 'NTA',
  title: "Don't leave this message on read. Talk to your doctor and have the Omvoh Convo today.",
  body: "Starting a conversation about your health can feel awkward. Omvoh helps you find the words.",
  votes: 0, comments: 0,
}

const DEFAULT_ADS = {
  takeover: false, banner: false, native: false,
  video: false, promoted: false, sidebar: false,
}

const SORT_OPTIONS = ['Best', 'New', 'Top', 'Rising']

function sortPosts(posts, sort) {
  const sorted = [...posts]
  switch (sort) {
    case 'New':    return sorted.sort((a, b) => parseFloat(a.timeAgo) - parseFloat(b.timeAgo))
    case 'Top':    return sorted.sort((a, b) => b.votes - a.votes)
    case 'Rising': return sorted.sort((a, b) => a.comments - b.comments)
    default:       return sorted.sort((a, b) => b.votes - a.votes)
  }
}

function Feed({ ads }) {
  const [sort, setSort] = useState('Best')
  const sortedPosts = sortPosts(POSTS, sort)

  return (
    <main className={styles.main}>
      <SubHeader />
      <div className={styles.content}>
        <div className={styles.feed}>
          <div className={styles.sortBar}>
            {SORT_OPTIONS.map(s => (
              <button
                key={s}
                className={`${styles.sortBtn} ${sort === s ? styles.sortActive : ''}`}
                onClick={() => setSort(s)}
              >
                {s === 'Best' ? '🔥' : s === 'New' ? '✨' : s === 'Top' ? '📈' : '🚀'} {s}
              </button>
            ))}
            <button className={styles.viewBtn}>⊞ ∨</button>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlightsHeader}>
              <span>⚑</span> Community highlights
              <button className={styles.highlightToggle}>∧</button>
            </div>
            <div className={styles.highlightCards}>
              <div className={styles.highlightCard}>
                <div className={styles.hlTitle}>New rules: Account age and karma minimums</div>
                <div className={styles.hlMeta}>73 votes • 1 comment</div>
                <div className={styles.hlTag}>⚑ Announcement</div>
              </div>
              <div className={styles.highlightCard}>
                <div className={styles.hlTitle}>New rule: no political trolling</div>
                <div className={styles.hlMeta}>656 votes • 1 comment</div>
                <div className={styles.hlTag}>⚑ Announcement</div>
              </div>
            </div>
          </div>

          <TakeoverAd visible={ads.takeover} />
          <PostCard post={sortedPosts[0]} />
          <BannerAd visible={ads.banner} />
          <PostCard post={sortedPosts[1]} />
          <NativeAd visible={ads.native} />
          <PostCard post={sortedPosts[2]} />
          <VideoAd visible={ads.video} />
          <PostCard post={sortedPosts[3]} />
          {ads.promoted && <PostCard post={PROMOTED_POST} promoted />}
          <PostCard post={sortedPosts[4]} />
          <BannerAd visible={ads.banner} />
          <PostCard post={sortedPosts[5]} />
          <NativeAd visible={ads.native} />
          <PostCard post={sortedPosts[6]} />
          <PostCard post={sortedPosts[7]} />
        </div>
        <Sidebar />
      </div>
    </main>
  )
}

function AppLayout({ theme, toggleTheme, ads, toggleAd, children }) {
  return (
    <div className={styles.app}>
      <Topbar theme={theme} onToggle={toggleTheme} ads={ads} onToggleAd={toggleAd} />
      <div className={styles.layout}>
        <LeftSidebar />
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [ads, setAds] = useState(DEFAULT_ADS)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }
  function toggleAd(key) { setAds(prev => ({ ...prev, [key]: !prev[key] })) }

  return (
    <BrowserRouter>
      <AppLayout theme={theme} toggleTheme={toggleTheme} ads={ads} toggleAd={toggleAd}>
        <Routes>
          <Route path="/" element={<Feed ads={ads} />} />
          <Route path="/post/:postId" element={<ThreadView />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
