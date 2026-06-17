# redditclone_v3 — r/AITAH

A pixel-accurate React clone of Reddit's r/AITAH community, built as part of the Pursuit Fellowship. v3 builds directly on the v2 codebase, adding a rich comment composer, community verdict tracking, sort tabs, and full keyboard accessibility.

**Live:** https://redditclone-v3.vercel.app

## What's in v3

This version layers four major features on top of v2's existing feed, ad system, dark mode, and Contextual Targeter:

- **Rich comment composer** — formatting toolbar (bold, italic, strikethrough, link), image upload, and GIF search, used for both top-level comments and nested replies
- **Verdict tally bars** — a color-coded NTA / YTA / ESH / NAH percentage bar on every post and thread page, so the community's verdict is visible without reading the comments
- **Sort tabs** — Hot, New, and Top sorting on the feed, with a decay-based hot-ranking formula
- **Full keyboard accessibility** — every interactive element (vote buttons, sort tabs, ad toggles, toolbar buttons, the GIF picker) is reachable by Tab and operable by Enter/Space, with visible focus states throughout

## Tech stack

- React 19 + Vite
- React Router for the feed / thread-detail routes
- CSS Modules (no Tailwind, no component library)
- Vercel serverless functions for the GIF search proxy
- [KLIPY](https://klipy.com/developers) for GIF search (Tenor's official migration path — Tenor's API shuts down June 30, 2026)

No backend or database. All post and comment data is static (`src/data.js`); votes, new comments, and attachments live in component state for the session only.

## Running locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

```bash
npm run build    # production build to /dist
npm run lint     # eslint
```

## GIF search setup

The GIF picker calls `/api/gif-search`, a Vercel serverless function that proxies KLIPY's search API. Without a key, the picker still works for typing and formatting — it just shows a message explaining how to enable GIF results, instead of throwing an error.

To enable it:

1. Get a free test API key at [klipy.com/developers](https://klipy.com/developers) (100 calls/hour on the free tier)
2. In your Vercel project, go to **Settings → Environment Variables** and add:
   - `KLIPY_API_KEY` — your key
   - `KLIPY_CUSTOMER_ID` — optional, any stable string (defaults to `redditclone_v3` if omitted)
3. Redeploy — Vercel only picks up new environment variables on a fresh deployment

To debug the integration directly, visit `/api/gif-search?q=cat&debug=1` on your deployment. This returns KLIPY's raw, unprocessed response instead of the parsed result, which is useful if results ever come back empty despite a working key.

## Project structure

```
src/
├── main.jsx              # entry point, router setup
├── App.jsx                # top-level layout, theme provider
├── Topbar.jsx              # search bar, dark mode toggle, ad format toggles
├── LeftSidebar.jsx          # nav (Home, Popular, communities)
├── Sidebar.jsx              # right-rail subreddit info card
├── SubHeader.jsx            # subreddit banner + sort tabs
├── PostCard.jsx             # feed post card (title, votes, verdict bar)
├── ThreadView.jsx            # post detail page, nested comments, Contextual Targeter
├── CommentComposer.jsx        # shared rich composer (toolbar, image upload, GIF picker)
├── VerdictBar.jsx            # NTA/YTA/ESH/NAH percentage bar, used in feed + thread
├── AdUnits.jsx              # six ad format components
└── data.js                 # static posts, comments, ad copy, verdict percentages

api/
└── gif-search.js           # Vercel serverless proxy for KLIPY GIF search
```

## Version history

- **v1** — pixel-accurate static feed, six Reddit ad formats, 5-level nested comments, voting
- **v2** — dark mode, ad format toggle switches, Contextual Targeter (keyword-based ad relevance), Best/New/Top/Rising sort
- **v3** (this version) — rich comment composer with GIF/image/formatting, verdict tally bars, Hot/New/Top sort with decay ranking, full keyboard accessibility

## Known limitations

- No backend — votes, comments, and attachments reset on page refresh
- Markdown syntax (`**bold**`) is written into the comment but not rendered as formatted HTML in the posted comment display
- Browser back/forward navigation discards any unsaved comment or reply text with no warning
