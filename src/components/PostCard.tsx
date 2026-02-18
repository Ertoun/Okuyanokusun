import MusicPlayer from "./MusicPlayer";
import styles from "./PostCard.module.css";

// Defining a local interface for the component props to avoid tight coupling with Mongoose document type on client side if possible, 
// but for simplicity I'll use a type compatible with the serialized IPost.
interface PostProps {
  _id: string;
  author: 'UserA' | 'UserB';
  content: string;
  media: { type: 'image' | 'video' | 'audio'; url: string }[];
  style: {
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  createdAt: string; // serialized date
}

export default function PostCard({ post }: { post: PostProps }) {
  return (
    <article
      className={styles.card}
      style={{
        backgroundColor: post.style.backgroundColor,
        color: post.style.textColor,
        fontFamily: post.style.fontFamily,
      }}
    >
      <header className={styles.header}>
        <h3 className={styles.author}>{post.author}</h3>
        <time className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</time>
      </header>
      
      <div className={styles.content}>
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
    </article>
  );
}
