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

function filterPosts(posts, query) {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter(p =>
    p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
  )
}

const AD_SLOTS = [
  { beforeIndex: 0, Component: TakeoverAd, adKey: 'takeover' },
  { beforeIndex: 1, Component: BannerAd, adKey: 'banner' },
  { beforeIndex: 2, Component: NativeAd, adKey: 'native' },
  { beforeIndex: 3, Component: VideoAd, adKey: 'video' },
  { beforeIndex: 4, Component: PromotedPostAd, adKey: 'promoted' },
  { beforeIndex: 5, Component: BannerAd, adKey: 'banner' },
  { beforeIndex: 6, Component: NativeAd, adKey: 'native' },
]

function renderFeedWithAds(posts, ads) {
  const elements = []
  posts.forEach((post, i) => {
    const slot = AD_SLOTS.find(s => s.beforeIndex === i)
    if (slot) {
      const { Component, adKey } = slot
      elements.push(<Component key={`ad-${adKey}-${i}`} visible={ads[adKey]} />)
    }
    elements.push(<PostCard key={post.id} post={post} />)
  })
  return elements
}

function Feed({ ads, searchQuery }) {
  const [sort, setSort] = useState('Best')
  const trimmedQuery = searchQuery.trim()
  const filteredPosts = filterPosts(POSTS, searchQuery)
  const sortedPosts = sortPosts(filteredPosts, sort)
  const isFiltering = trimmedQuery.length > 0

  return (
    <main className={styles.main}>
      <SubHeader />
      <div className={styles.content}>
        <div className={styles.feed}>
          {isFiltering && (
            <div className={styles.searchResultsBar}>
              {sortedPosts.length > 0
                ? `${sortedPosts.length} result${sortedPosts.length === 1 ? '' : 's'} for "${trimmedQuery}"`
                : `No results for "${trimmedQuery}"`}
            </div>
          )}

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

          {!isFiltering && (
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
          )}

          {isFiltering ? (
            sortedPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            renderFeedWithAds(sortedPosts, ads)
          )}
        </div>
        <Sidebar sidebarAdVisible={ads.sidebar} />
      </div>
    </main>
  )
}

function AppLayout({ theme, toggleTheme, ads, toggleAd, searchQuery, onSearchChange, children }) {
  return (
    <div className={styles.app}>
      <Topbar
        theme={theme}
        onToggle={toggleTheme}
        ads={ads}
        onToggleAd={toggleAd}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
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
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }
  function toggleAd(key) { setAds(prev => ({ ...prev, [key]: !prev[key] })) }

  return (
    <BrowserRouter>
      <AppLayout
        theme={theme}
        toggleTheme={toggleTheme}
        ads={ads}
        toggleAd={toggleAd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <Routes>
          <Route path="/" element={<Feed ads={ads} searchQuery={searchQuery} />} />
          <Route path="/post/:postId" element={<ThreadView />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
