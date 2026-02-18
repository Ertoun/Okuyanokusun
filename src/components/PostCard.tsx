import MusicPlayer from "./MusicPlayer";
import styles from "./PostCard.module.css";
import { PostData, UserType } from "@/types/post";
import { useState } from "react";
import { MessageSquare, Music, Trash2, Edit2 } from "lucide-react";

interface PostCardProps {
  post: PostData;
  currentUser: UserType | null;
  onRespond: (postId: string, response: any) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onEdit: (post: PostData) => void;
}

export default function PostCard({ post, currentUser, onRespond, onDelete, onEdit }: PostCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseContent, setResponseContent] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          {currentUser === post.author && (
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
      {post.responses && post.responses.length > 0 && (
        <div className={styles.responsesSection}>
          <h4 className={styles.responsesTitle}>Responses</h4>
          {post.responses.map((resp, i) => (
            <div key={i} className={styles.responseCard}>
              <div className={styles.responseHeader}>
                <span className={styles.responseAuthor}>{resp.author}</span>
                <span className={styles.responseDate}>{new Date(resp.createdAt).toLocaleDateString()}</span>
              </div>
              <p className={styles.responseContent}>{resp.content}</p>
              {resp.musicUrl && (
                <div className={styles.responseMusic}>
                  <MusicPlayer src={resp.musicUrl} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {currentUser && (
        <div className={styles.footer}>
          <button 
            className={styles.respondTrigger} 
            onClick={() => setIsResponding(!isResponding)}
          >
            <MessageSquare size={18} />
            Respond
          </button>
        </div>
      )}

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
