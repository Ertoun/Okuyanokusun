import MusicPlayer from "./MusicPlayer";
import styles from "./PostCard.module.css";
import { PostData, UserType } from "@/types/post";
import { useState } from "react";
import { MessageSquare, Music, Trash2, Edit2, Heart, Frown, Smile } from "lucide-react";

interface PostCardProps {
  post: PostData;
  currentUser: UserType | null;
  onRespond: (postId: string, response: any) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onEdit: (post: PostData) => void;
  onReact: (postId: string, type: 'heart' | 'sad' | 'happy') => Promise<void>;
}

export default function PostCard({ post, currentUser, onRespond, onDelete, onEdit, onReact }: PostCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseContent, setResponseContent] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);
  const [editResponseContent, setEditResponseContent] = useState("");
  const [editMusicUrl, setEditMusicUrl] = useState("");

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onRespond(post._id, {
        author: currentUser,
        content: responseContent,
        musicUrl: musicUrl || undefined,
      });
      setResponseContent("");
      setMusicUrl("");
      setIsResponding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!window.confirm("Delete this response?")) return;
    try {
      const res = await fetch(`/api/posts/${post._id}/responses/${responseId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        // We need App to re-fetch or update local state. 
        // For simplicity, let's assume we trigger a refresh via onRespond (effectively updating the post)
        // Actually, onRespond is type (postId, response) => Promise<void>. 
        // Let's call it with a special flag or just expect App to handle state.
        // Wait, I should probably pass onUpdatePost instead of onRespond being so specific.
        // But I'll use a hack of calling a re-fetch if I can or just let it be.
        // Better: let's add onRespond as a generic "onPostUpdate" or similar.
        // For now, I'll just window.location.reload() or similar if I don't have a cleaner way without changing App.tsx props.
        // Actually, let's change App.tsx to provide a generic onUpdatePost.
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateResponse = async (e: React.FormEvent, responseId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${post._id}/responses/${responseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editResponseContent, musicUrl: editMusicUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingResponseId(null);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditingResponse = (resp: any) => {
    setEditingResponseId(resp._id);
    setEditResponseContent(resp.content);
    setEditMusicUrl(resp.musicUrl || "");
  };

  const isAuthor = currentUser === post.author || 
                   (currentUser === 'Sude' && (post.author as any) === 'UserA') || 
                   (currentUser === 'Ertan' && (post.author as any) === 'UserB');

  return (
    <article
      className={styles.card}
      style={{
        backgroundColor: post.style.backgroundColor,
        color: post.style.textColor,
        fontFamily: post.style.fontFamily,
        backgroundImage: post.style.backgroundImage ? `url(${post.style.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className={styles.header}>
        <h3 className={styles.author}>{post.author}</h3>
        <div className={styles.headerRight}>
          <time className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</time>
          {isAuthor && (
            <>
              <button 
                className={styles.actionBtn} 
                onClick={() => onEdit(post)}
                title="Edit post"
              >
                <Edit2 size={16} />
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={() => onDelete(post._id)}
                title="Delete post"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </header>
      
      <div 
        className={styles.content}
        style={{ 
          backgroundColor: post.style.backgroundImage ? 'rgba(255,255,255,0.7)' : 'transparent',
          padding: post.style.backgroundImage ? '1rem' : '0',
          borderRadius: post.style.backgroundImage ? '8px' : '0',
          color: post.style.backgroundImage ? '#000' : 'inherit'
        }}
      >
        <p>{post.content}</p>
      </div>

      {post.media && post.media.length > 0 && (
        <div className={styles.mediaContainer}>
          {post.media.map((item, index) => (
            <div key={index} className={styles.mediaItem}>
              {item.type === "image" && (
                <div className={styles.imageWrapper}>
                   <img
                    src={item.url}
                    alt={`Attachment by ${post.author}`}
                    className={styles.image}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '400px' }}
                  />
                </div>
              )}
              {item.type === "video" && (
                <video src={item.url} controls className={styles.video} />
              )}
              {item.type === "audio" && <MusicPlayer src={item.url} />}
            </div>
          ))}
        </div>
      )}

      <div className={styles.reactionsBar}>
        <button onClick={() => onReact(post._id, 'heart')} className={styles.reactionBtn}>
          <Heart size={18} fill={post.reactions?.heart > 0 ? "#ff4d4f" : "none"} color={post.reactions?.heart > 0 ? "#ff4d4f" : "currentColor"} />
          <span>{post.reactions?.heart || 0}</span>
        </button>
        <button onClick={() => onReact(post._id, 'sad')} className={styles.reactionBtn}>
          <Frown size={18} />
          <span>{post.reactions?.sad || 0}</span>
        </button>
        <button onClick={() => onReact(post._id, 'happy')} className={styles.reactionBtn}>
          <Smile size={18} />
          <span>{post.reactions?.happy || 0}</span>
        </button>
      </div>

      {post.responses && post.responses.length > 0 && (
        <div className={styles.responsesSection}>
          <h4 className={styles.responsesTitle}>Responses</h4>
          {post.responses.map((resp, i) => (
            <div key={resp._id || i} className={styles.responseCard}>
              {editingResponseId === resp._id ? (
                <form onSubmit={(e) => handleUpdateResponse(e, resp._id)} className={styles.inlineEditForm}>
                  <textarea 
                    value={editResponseContent} 
                    onChange={(e) => setEditResponseContent(e.target.value)}
                    className={styles.responseInput}
                  />
                  <input 
                    type="text" 
                    value={editMusicUrl} 
                    onChange={(e) => setEditMusicUrl(e.target.value)}
                    placeholder="Update music URL"
                    className={styles.musicInput}
                    style={{ marginTop: '0.5rem', border: '1px solid var(--border)', padding: '0.25rem', borderRadius: '4px' }}
                  />
                  <div className={styles.formActions} style={{ marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setEditingResponseId(null)} className={styles.cancelBtn}>Cancel</button>
                    <button type="submit" className={styles.submitBtn}>Save</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.responseHeader}>
                    <div className={styles.responseHeaderLeft}>
                      <span className={styles.responseAuthor}>{resp.author}</span>
                      <span className={styles.responseDate}>{new Date(resp.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.responseHeaderActions}>
                      {currentUser === resp.author && (
                        <button onClick={() => startEditingResponse(resp)} className={styles.commentActionBtn} title="Edit comment">
                          <Edit2 size={12} />
                        </button>
                      )}
                      {isAuthor && (
                        <button onClick={() => handleDeleteResponse(resp._id)} className={styles.commentActionBtn} title="Delete comment">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={styles.responseContent}>{resp.content}</p>
                  {resp.musicUrl && (
                    <div className={styles.responseMusic}>
                      <MusicPlayer src={resp.musicUrl} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button 
          className={styles.respondTrigger} 
          onClick={() => {
            if (!currentUser) {
              alert("Please login to respond");
              return;
            }
            setIsResponding(!isResponding);
          }}
        >
          <MessageSquare size={18} />
          Respond
        </button>
      </div>

      {isResponding && (
        <form className={styles.responseForm} onSubmit={handleSubmitResponse}>
          <textarea
            className={styles.responseInput}
            placeholder="Add your thoughts..."
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            disabled={isSubmitting}
          />
          <div className={styles.musicInputGroup}>
            <Music size={16} />
            <input
              type="text"
              className={styles.musicInput}
              placeholder="Add music URL (optional commentary)"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={() => setIsResponding(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting || !responseContent.trim()}
            >
              {isSubmitting ? "Sending..." : "Post Response"}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
