// GIF search proxy using KLIPY (Tenor's recommended replacement -- the Tenor
// API stopped accepting new integrations on Jan 13, 2026 and shuts down
// entirely on Jun 30, 2026: https://docs.klipy.com/migrate-from-tenor).
//
// Get a free test API key from the KLIPY Partner Panel (klipy.com/developers),
// then set KLIPY_API_KEY as an environment variable in your Vercel project
// settings. KLIPY also requires a "customer_id" string for their
// recent-items/personalization features -- any stable per-app string works
// (e.g. your project name); this proxy doesn't use that feature directly.
//
// Confirmed endpoint shape (from KLIPY's GIF Search API docs):
//   GET api/v1/{app_key}/gifs/search?page={page}&per_page={per_page}&q={q}&customer_id={customer_id}
//
// NOTE: The exact response object field names (the "Media Object" shape)
// weren't directly viewable while building this -- this proxy normalizes a
// few plausible shapes. If results come back empty despite a 200 response,
// re-run the same request with &debug=1 to inspect the raw response and
// adjust the field-mapping below if needed.

export default async function handler(req, res) {
  const { q, debug } = req.query

  if (!q || !q.trim()) {
    return res.status(200).json({ results: [] })
  }

  const apiKey = process.env.KLIPY_API_KEY
  const customerId = process.env.KLIPY_CUSTOMER_ID || 'redditclone_v3'

  if (!apiKey) {
    return res.status(200).json({
      results: [],
      message: 'GIF search is not configured yet. Get a free test key at klipy.com/developers and add it as KLIPY_API_KEY in your Vercel project settings.',
    })
  }

  try {
    const url = `https://api.klipy.com/api/v1/${apiKey}/gifs/search?page=1&per_page=12&q=${encodeURIComponent(q)}&customer_id=${encodeURIComponent(customerId)}`
    const klipyRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; redditclone_v3)' },
    })

    if (!klipyRes.ok) {
      return res.status(200).json({ results: [], message: `GIF search request failed (${klipyRes.status}).` })
    }

    const data = await klipyRes.json()

    if (debug) {
      return res.status(200).json({ raw: data })
    }

    const items = data?.data?.data || data?.data || data?.results || (Array.isArray(data) ? data : []) || []

    const results = items.map(item => {
      const formats = item.file || item.media_formats || item.formats || {}
      const gifUrl =
        formats.gif?.url || formats.original?.url ||
        formats.md?.gif?.url || formats.hd?.gif?.url ||
        item.url
      const previewUrl =
        formats.tiny?.url || formats.xs?.gif?.url ||
        formats.preview?.url || formats.thumbnail?.url ||
        gifUrl

      return {
        id: item.id || item.slug || gifUrl,
        title: item.title || item.alt_text || item.content_description || '',
        url: gifUrl,
        previewUrl,
      }
    }).filter(g => g.url)

    if (results.length === 0) {
      return res.status(200).json({
        results: [],
        message: 'No GIFs found, or the KLIPY response shape changed -- try the same request with &debug=1 to inspect the raw response.',
      })
    }

    return res.status(200).json({ results })
  } catch {
    return res.status(200).json({ results: [], message: 'GIF search is temporarily unavailable.' })
  }
}
