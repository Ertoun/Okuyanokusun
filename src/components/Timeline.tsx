import { PostData, UserType } from "@/types/post";
import PostCard from "./PostCard";
import styles from "./Timeline.module.css";

interface TimelineProps {
  posts: PostData[];
  currentUser: UserType | null;
  onRespond: (postId: string, response: any) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onEdit: (post: PostData) => void;
  onReact: (postId: string, type: 'heart' | 'sad' | 'happy') => Promise<void>;
}

export default function Timeline({ posts, currentUser, onRespond, onDelete, onEdit, onReact }: TimelineProps) {
  return (
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.posts}>
        {posts.map((post) => (
          <div key={post._id} className={styles.postWrapper}>
            <div className={`${styles.dot} ${post.author === 'Sude' ? styles.dotLeft : styles.dotRight}`}></div>
            <PostCard
              post={post}
              currentUser={currentUser}
              onRespond={onRespond}
              onDelete={onDelete}
              onEdit={onEdit}
              onReact={onReact}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
