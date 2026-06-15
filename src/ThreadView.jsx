import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { POSTS, COMMENTS, FLAIRS } from './data.js'
import VerdictBar from './VerdictBar.jsx'
import CommentComposer from './CommentComposer.jsx'
import styles from './ThreadView.module.css'

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

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

function ConversationAd() {
  return (
    <div className={styles.convAdWrap}>
      <div className={styles.convAd}>
        <div className={styles.convAdLeft}>
          <div className={styles.convAdIcon}>💊</div>
          <div>
            <div className={styles.convAdHeadline}>Hims & Hers — Talk to someone today</div>
            <div className={styles.convAdSub}>Licensed therapists available 24/7. First month 50% off.</div>
          </div>
        </div>
        <button className={styles.convAdCta}>Learn more</button>
      </div>
      <AdLabel
        type="Conversation Ad (Anchor Slot)"
        pricing="Premium CPM — pinned below post body"
        description="This ad appears immediately below the post and above the first comment — the highest-visibility slot in a thread. Every user who clicks into the post sees it. Priced at premium CPM rates because of guaranteed placement and high intent audience."
      />
    </div>
  )
}

function PromotedComment() {
  return (
    <div className={styles.promotedCommentWrap}>
      <div className={styles.promotedComment}>
        <div className={styles.commentVote}>
          <button className={styles.voteBtn}>↑</button>
          <span className={styles.voteCount}>—</span>
          <button className={styles.voteBtn}>↓</button>
        </div>
        <div className={styles.commentBody}>
          <div className={styles.commentMeta}>
            <div className={styles.commentAvatar} style={{ background: '#0a66c2', color: 'white', fontSize: 11, fontWeight: 700 }}>in</div>
            <span className={styles.commentAuthor}>u/LinkedIn</span>
            <span className={styles.promoted}>Promoted</span>
          </div>
          <p className={styles.commentText}>Struggling with how to handle awkward money conversations at work? LinkedIn Learning has a free course on navigating difficult workplace dynamics. Thousands of professionals have used it to set clearer boundaries.</p>
          <div className={styles.commentActions}>
            <button className={styles.commentActionBtn} style={{ background: '#0a66c2', color: 'white', borderRadius: 20, padding: '4px 12px' }}>View course →</button>
            <button className={styles.commentActionBtn}>💬 Reply</button>
            <button className={styles.commentActionBtn}>↗ Share</button>
          </div>
        </div>
      </div>
      <AdLabel
        type="In-Thread Promoted Post (Interleaver Slot)"
        pricing="CPC or CPM — real-time auction"
        description="Injected between the 2nd and 3rd top-level comments. Styled exactly like a user reply but labeled 'Promoted.' This placement reaches users who are already deeply engaged — they clicked into the thread and are reading comments. Higher intent = higher CPM. Sold via real-time auction."
      />
    </div>
  )
}

function AttachmentDisplay({ attachments }) {
  if (!attachments || attachments.length === 0) return null
  return (
    <div className={styles.commentAttachments}>
      {attachments.map(att => (
        <div key={att.id} className={styles.commentAttachment}>
          <img src={att.url} alt={att.name || 'attachment'} />
          {att.type === 'gif' && <span className={styles.commentAttachmentBadge}>GIF</span>}
        </div>
      ))}
    </div>
  )
}

function Comment({ comment, depth = 0 }) {
  const [votes, setVotes] = useState(comment.votes)
  const [voted, setVoted] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState(comment.replies || [])

  function vote(dir) {
    if (voted === dir) { setVoted(null); setVotes(comment.votes) }
    else {
      const prev = voted ? (voted === 'up' ? -1 : 1) : 0
      setVoted(dir)
      setVotes(comment.votes + prev + (dir === 'up' ? 1 : -1))
    }
  }

  function submitReply(attachments) {
    if (!replyText.trim() && (!attachments || attachments.length === 0)) return
    const newReply = {
      id: `r_${Date.now()}`,
      author: 'you',
      avatar: '🧑',
      votes: 1,
      timeAgo: 'just now',
      text: replyText.trim(),
      attachments: attachments || [],
      replies: []
    }
    setReplies(prev => [newReply, ...prev])
    setReplyText('')
    setReplying(false)
  }

  return (
    <div className={styles.commentWrap} style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      {depth > 0 && (
        <div className={styles.threadLine} onClick={() => setCollapsed(c => !c)} title="Click to collapse" />
      )}
      <div className={styles.commentInner}>
        <div className={styles.commentMeta}>
          <div className={styles.commentAvatar}>{comment.avatar}</div>
          <span className={styles.commentAuthor}>u/{comment.author}</span>
          <span className={styles.commentTime}>{comment.timeAgo}</span>
          {collapsed && <button className={styles.expandBtn} onClick={() => setCollapsed(false)}>▶ expand</button>}
        </div>

        {!collapsed && (
          <>
            <p className={styles.commentText}>{comment.text}</p>
            <AttachmentDisplay attachments={comment.attachments} />
            <div className={styles.commentActions}>
              <div className={styles.commentVoteRow}>
                <button className={`${styles.voteBtn} ${voted === 'up' ? styles.votedUp : ''}`} onClick={() => vote('up')}>↑</button>
                <span className={`${styles.voteCount} ${voted === 'up' ? styles.countUp : voted === 'down' ? styles.countDown : ''}`}>{fmtNum(votes)}</span>
                <button className={`${styles.voteBtn} ${styles.downBtn} ${voted === 'down' ? styles.votedDown : ''}`} onClick={() => vote('down')}>↓</button>
              </div>
              <button className={styles.commentActionBtn} onClick={() => setReplying(r => !r)}>💬 Reply</button>
              <button className={styles.commentActionBtn}>↗ Share</button>
              <button className={styles.commentActionBtn} onClick={() => setCollapsed(true)}>— Collapse</button>
            </div>

            {replying && (
              <div className={styles.replyBox}>
                <CommentComposer
                  value={replyText}
                  onChange={setReplyText}
                  onSubmit={submitReply}
                  placeholder={`Reply to u/${comment.author}...`}
                  submitLabel="Reply"
                  onCancel={() => { setReplying(false); setReplyText('') }}
                  autoFocus
                />
              </div>
            )}

            {replies.length > 0 && depth < 5 && (
              <div className={styles.replies}>
                {replies.map(reply => (
                  <Comment key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ThreadView() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const post = POSTS.find(p => p.id === parseInt(postId))
  const initialComments = COMMENTS[parseInt(postId)] || []
  const flair = post ? (FLAIRS[post.flair] || FLAIRS.INFO) : null
  const [votes, setVotes] = useState(post?.votes || 0)
  const [voted, setVoted] = useState(null)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(post?.comments || 0)
  const [keyword, setKeyword] = useState(null)
  const KEYWORDS = ['money', 'split', 'cheap', 'bill', 'friends', 'pay', 'dinner']

  function handleScroll(e) {
    const text = e.target.innerText?.toLowerCase() || ''
    const found = KEYWORDS.find(k => text.includes(k))
    if (found) setKeyword(found)
  }

  if (!post) return <div className={styles.notFound}>Post not found. <button onClick={() => navigate('/')}>← Back</button></div>

  function vote(dir) {
    if (voted === dir) { setVoted(null); setVotes(post.votes) }
    else {
      const prev = voted ? (voted === 'up' ? -1 : 1) : 0
      setVoted(dir)
      setVotes(post.votes + prev + (dir === 'up' ? 1 : -1))
    }
  }

  function submitComment(attachments) {
    if (!newComment.trim() && (!attachments || attachments.length === 0)) return
    const c = {
      id: `c_${Date.now()}`,
      author: 'you',
      avatar: '🧑',
      votes: 1,
      timeAgo: 'just now',
      text: newComment.trim(),
      attachments: attachments || [],
      replies: []
    }
    setComments(prev => [c, ...prev])
    setCommentCount(n => n + 1)
    setNewComment('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.main} onMouseOver={handleScroll}>

          <button className={styles.backBtn} onClick={() => navigate('/')}>← Back to r/AITAH</button>

          <div className={styles.postCard}>
            <div className={styles.postMeta}>
              <div className={styles.postAvatar}>{post.avatar}</div>
              <span className={styles.postAuthor}>u/{post.author}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.postTime}>{post.timeAgo}</span>
            </div>
            <div className={styles.flairWrap}>
              <span className={styles.flair} style={{ background: flair.bg, color: flair.color, borderColor: flair.border }}>
                {flair.label}
              </span>
            </div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <VerdictBar verdict={post.verdict} />
            <p className={styles.postBody}>{post.body}</p>
            <div className={styles.postActions}>
              <div className={styles.voteRow}>
                <button className={`${styles.voteBtn} ${voted === 'up' ? styles.votedUp : ''}`} onClick={() => vote('up')}>↑</button>
                <span className={`${styles.voteCount} ${voted === 'up' ? styles.countUp : voted === 'down' ? styles.countDown : ''}`}>{fmtNum(votes)}</span>
                <button className={`${styles.voteBtn} ${styles.downBtn} ${voted === 'down' ? styles.votedDown : ''}`} onClick={() => vote('down')}>↓</button>
              </div>
              <button className={styles.actionBtn}>💬 {fmtNum(commentCount)} Comments</button>
              <button className={styles.actionBtn}>↗ Share</button>
              <button className={styles.actionBtn}>🔖 Save</button>
            </div>
          </div>

          <ConversationAd />

          <div className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
              <span>{fmtNum(commentCount)} Comments</span>
              <select className={styles.sortSelect}>
                <option>Best</option>
                <option>Top</option>
                <option>New</option>
                <option>Controversial</option>
              </select>
            </div>

            {/* Comment input box */}
            <div className={styles.commentInputBox}>
              <div className={styles.commentInputMeta}>
                <div className={styles.commentInputAvatar}>🧑</div>
                <span className={styles.commentInputLabel}>Comment as <strong>u/you</strong></span>
              </div>
              <CommentComposer
                value={newComment}
                onChange={setNewComment}
                onSubmit={submitComment}
                placeholder="What are your thoughts?"
                submitLabel="Comment"
              />
            </div>

            {comments.map((comment, i) => (
              <>
                <Comment key={comment.id} comment={comment} depth={0} />
                {i === 1 && <PromotedComment key="promoted" />}
              </>
            ))}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.contextCard}>
            <div className={styles.contextTitle}>🎯 Contextual Targeter</div>
            <p className={styles.contextDesc}>
              This panel shows how Reddit's ad system detects keywords in comments and swaps ad creative in real time.
            </p>
            {keyword ? (
              <div className={styles.contextActive}>
                <div className={styles.contextDetected}>
                  Keyword detected: <strong>"{keyword}"</strong>
                </div>
                <div className={styles.contextAd}>
                  <div className={styles.contextAdIcon}>💳</div>
                  <div>
                    <div className={styles.contextAdTitle}>Splitwise — Split bills fairly</div>
                    <div className={styles.contextAdSub}>Never fight over the bill again.</div>
                    <button className={styles.contextAdBtn}>Try free →</button>
                  </div>
                </div>
                <div className={styles.contextExplain}>
                  Ad swapped because comments contain money-related keywords. Advertiser bid on this contextual signal via real-time auction.
                </div>
              </div>
            ) : (
              <div className={styles.contextIdle}>
                <div className={styles.contextIdleIcon}>👀</div>
                <p>Hover over comments to trigger keyword detection...</p>
              </div>
            )}
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>r/AITAH</div>
            <p className={styles.sidebarDesc}>A place to determine who is the a**hole in any given situation.</p>
            <div className={styles.sidebarStats}>
              <div><strong>4.2M</strong><span>Members</span></div>
              <div><strong>3,847</strong><span>Online</span></div>
            </div>
            <button className={styles.joinBtn}>Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}
