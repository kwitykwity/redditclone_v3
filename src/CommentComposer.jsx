import { useState, useRef } from 'react'
import styles from './CommentComposer.module.css'

const EMPTY_GIF_RESULTS = []

function wrapSelection(textarea, before, after = before) {
  const { selectionStart, selectionEnd, value } = textarea
  const selected = value.slice(selectionStart, selectionEnd)
  const newValue =
    value.slice(0, selectionStart) +
    before + selected + after +
    value.slice(selectionEnd)
  return {
    value: newValue,
    selStart: selectionStart + before.length,
    selEnd: selectionStart + before.length + selected.length,
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
  const [attachments, setAttachments] = useState([])
  const [gifPickerOpen, setGifPickerOpen] = useState(false)
  const [gifQuery, setGifQuery] = useState('')
  const [gifResults, setGifResults] = useState(EMPTY_GIF_RESULTS)
  const [gifLoading, setGifLoading] = useState(false)
  const [gifError, setGifError] = useState(null)

  function applyFormat(beforeChar, afterChar = beforeChar) {
    const textarea = textareaRef.current
    if (!textarea) return
    const { value: newValue, selStart, selEnd } = wrapSelection(textarea, beforeChar, afterChar)
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

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      setAttachments(prev => [...prev, { type: 'image', url, name: file.name, id: `img_${Date.now()}_${Math.random()}` }])
    })
    e.target.value = ''
  }

  function removeAttachment(id) {
    setAttachments(prev => {
      const att = prev.find(a => a.id === id)
      if (att && att.type === 'image') URL.revokeObjectURL(att.url)
      return prev.filter(a => a.id !== id)
    })
  }

  async function searchGifs(query) {
    setGifQuery(query)
    if (!query.trim()) {
      setGifResults(EMPTY_GIF_RESULTS)
      setGifError(null)
      return
    }
    setGifLoading(true)
    setGifError(null)
    try {
      const res = await fetch(`/api/gif-search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setGifResults(data.results || [])
      if (!data.results || data.results.length === 0) {
        setGifError(data.message || 'No GIFs found')
      }
    } catch {
      setGifError('GIF search is unavailable. Add a KLIPY_API_KEY in your Vercel project settings to enable this.')
      setGifResults(EMPTY_GIF_RESULTS)
    } finally {
      setGifLoading(false)
    }
  }

  function selectGif(gif) {
    setAttachments(prev => [...prev, { type: 'gif', url: gif.url, name: gif.title || 'GIF', id: `gif_${Date.now()}_${Math.random()}` }])
    setGifPickerOpen(false)
    setGifQuery('')
    setGifResults(EMPTY_GIF_RESULTS)
  }

  function handleSubmit() {
    if (!value.trim() && attachments.length === 0) return
    onSubmit(attachments)
    setAttachments([])
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
          type="button"
          className={`${styles.toolBtn} ${gifPickerOpen ? styles.toolBtnActive : ''}`}
          onClick={() => setGifPickerOpen(o => !o)}
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
