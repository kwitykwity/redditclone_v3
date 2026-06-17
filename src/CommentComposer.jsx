import { useState, useRef, useEffect } from 'react'
import styles from './CommentComposer.module.css'

const EMPTY_GIF_RESULTS = []
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function wrapSelection(textarea, before, after = before, placeholder = '') {
  const { selectionStart, selectionEnd, value } = textarea
  const selected = value.slice(selectionStart, selectionEnd)
  const content = selected || placeholder
  const newValue =
    value.slice(0, selectionStart) +
    before + content + after +
    value.slice(selectionEnd)
  return {
    value: newValue,
    selStart: selectionStart + before.length,
    selEnd: selectionStart + before.length + content.length,
  }
}

export default function CommentComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "What are your thoughts?",
  submitLabel = "Comment",
  onCancel,
  autoFocus = false,
}) {
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const gifButtonRef = useRef(null)
  const gifDebounceRef = useRef(null)
  const gifRequestIdRef = useRef(0)
  const [attachments, setAttachments] = useState([])
  const [gifPickerOpen, setGifPickerOpen] = useState(false)
  const [gifQuery, setGifQuery] = useState('')
  const [gifResults, setGifResults] = useState(EMPTY_GIF_RESULTS)
  const [gifLoading, setGifLoading] = useState(false)
  const [gifError, setGifError] = useState(null)
  const [fileError, setFileError] = useState(null)

  useEffect(() => {
    return () => {
      if (gifDebounceRef.current) clearTimeout(gifDebounceRef.current)
    }
  }, [])

  function applyFormat(beforeChar, afterChar = beforeChar, placeholder = 'text') {
    const textarea = textareaRef.current
    if (!textarea) return
    const { value: newValue, selStart, selEnd } = wrapSelection(textarea, beforeChar, afterChar, placeholder)
    onChange(newValue)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(selStart, selEnd)
    })
  }

  function applyLink() {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd, value: val } = textarea
    const selected = val.slice(selectionStart, selectionEnd) || 'link text'
    const markdown = `[${selected}](https://)`
    const newValue = val.slice(0, selectionStart) + markdown + val.slice(selectionEnd)
    onChange(newValue)
    requestAnimationFrame(() => {
      textarea.focus()
      const urlStart = selectionStart + selected.length + 3
      textarea.setSelectionRange(urlStart, urlStart + 8)
    })
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault()
      applyFormat('**')
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault()
      applyFormat('*')
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    return `${Math.round(bytes / 1024)}KB`
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || [])
    const rejected = []

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        rejected.push(`"${file.name}" isn't an image file`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`"${file.name}" is ${formatFileSize(file.size)} — max size is 5MB`)
        return
      }
      const url = URL.createObjectURL(file)
      setAttachments(prev => [...prev, { type: 'image', url, name: file.name, id: `img_${Date.now()}_${Math.random()}` }])
    })

    setFileError(rejected.length > 0 ? rejected.join('. ') : null)
    e.target.value = ''
  }

  function removeAttachment(id) {
    setAttachments(prev => {
      const att = prev.find(a => a.id === id)
      if (att && att.type === 'image') URL.revokeObjectURL(att.url)
      return prev.filter(a => a.id !== id)
    })
  }

  async function runGifSearch(query) {
    const requestId = ++gifRequestIdRef.current
    setGifLoading(true)
    setGifError(null)
    try {
      const res = await fetch(`/api/gif-search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      if (requestId !== gifRequestIdRef.current) return // a newer search superseded this one
      setGifResults(data.results || [])
      if (!data.results || data.results.length === 0) {
        setGifError(data.message || 'No GIFs found')
      }
    } catch {
      if (requestId !== gifRequestIdRef.current) return
      setGifError('GIF search is unavailable. Add a KLIPY_API_KEY in your Vercel project settings to enable this.')
      setGifResults(EMPTY_GIF_RESULTS)
    } finally {
      if (requestId === gifRequestIdRef.current) setGifLoading(false)
    }
  }

  function searchGifs(query) {
    setGifQuery(query)

    if (gifDebounceRef.current) clearTimeout(gifDebounceRef.current)

    if (!query.trim()) {
      gifRequestIdRef.current++ // invalidate any in-flight request
      setGifResults(EMPTY_GIF_RESULTS)
      setGifError(null)
      setGifLoading(false)
      return
    }

    gifDebounceRef.current = setTimeout(() => {
      runGifSearch(query)
    }, 400)
  }

  function closeGifPicker() {
    if (gifDebounceRef.current) clearTimeout(gifDebounceRef.current)
    gifRequestIdRef.current++ // invalidate any in-flight search
    setGifPickerOpen(false)
  }

  function toggleGifPicker() {
    setGifPickerOpen(open => {
      const next = !open
      if (!next) {
        if (gifDebounceRef.current) clearTimeout(gifDebounceRef.current)
        gifRequestIdRef.current++ // invalidate any in-flight search
      }
      return next
    })
  }

  function handleGifSearchKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeGifPicker()
      gifButtonRef.current?.focus()
    }
  }

  function selectGif(gif) {
    setAttachments(prev => [...prev, { type: 'gif', url: gif.url, name: gif.title || 'GIF', id: `gif_${Date.now()}_${Math.random()}` }])
    closeGifPicker()
    setGifQuery('')
    setGifResults(EMPTY_GIF_RESULTS)
  }

  function handleSubmit() {
    if (!value.trim() && attachments.length === 0) return
    if (value.includes('](https://)')) {
      setFileError('Looks like a link is missing its URL — replace "https://" with the real address before posting.')
      return
    }
    onSubmit(attachments)
    setAttachments([])
    setFileError(null)
  }

  const canSubmit = value.trim().length > 0 || attachments.length > 0

  return (
    <div className={styles.composer}>
      <div className={styles.toolbar} role="toolbar" aria-label="Comment formatting">
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyFormat('**')}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyFormat('*')}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
        >
          <em>i</em>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyFormat('~~')}
          aria-label="Strikethrough"
          title="Strikethrough"
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={applyLink}
          aria-label="Insert link"
          title="Link"
        >
          🔗
        </button>
        <div className={styles.toolDivider} />
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image"
          title="Upload image"
        >
          🖼️
        </button>
        <button
          ref={gifButtonRef}
          type="button"
          className={`${styles.toolBtn} ${gifPickerOpen ? styles.toolBtnActive : ''}`}
          onClick={toggleGifPicker}
          aria-label="Add GIF"
          aria-expanded={gifPickerOpen}
          title="Add GIF"
        >
          GIF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className={styles.hiddenInput}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {gifPickerOpen && (
        <div className={styles.gifPicker}>
          <input
            type="text"
            className={styles.gifSearchInput}
            placeholder="Search for GIFs..."
            value={gifQuery}
            onChange={e => searchGifs(e.target.value)}
            onKeyDown={handleGifSearchKeyDown}
            autoFocus
          />
          {gifLoading && <div className={styles.gifStatus}>Searching...</div>}
          {gifError && <div className={styles.gifStatus}>{gifError}</div>}
          {!gifLoading && !gifError && gifResults.length > 0 && (
            <div className={styles.gifGrid}>
              {gifResults.map(gif => (
                <button
                  key={gif.id}
                  type="button"
                  className={styles.gifResult}
                  onClick={() => selectGif(gif)}
                  aria-label={`Select GIF: ${gif.title || 'untitled'}`}
                >
                  <img src={gif.previewUrl || gif.url} alt={gif.title || ''} loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {!gifLoading && !gifError && gifQuery && gifResults.length === 0 && (
            <div className={styles.gifStatus}>No results yet — keep typing</div>
          )}
        </div>
      )}

      {fileError && (
        <div className={styles.fileErrorBanner} role="alert">
          {fileError}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        autoFocus={autoFocus}
      />

      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map(att => (
            <div key={att.id} className={styles.attachment}>
              <img src={att.url} alt={att.name} />
              <button
                type="button"
                className={styles.removeAttachment}
                onClick={() => removeAttachment(att.id)}
                aria-label={`Remove ${att.name}`}
              >
                ✕
              </button>
              {att.type === 'gif' && <span className={styles.attachmentBadge}>GIF</span>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <span className={styles.hint}>
          <strong>**bold**</strong> · <em>*italic*</em> · Ctrl+Enter to submit
        </span>
        <div className={styles.actionBtns}>
          {onCancel && (
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
