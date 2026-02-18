"use client";

import PostCard from "./PostCard";
import styles from "./Timeline.module.css";
// Importing the interface from PostCard or redefining it. Ideally should be in a shared type file.
// For now, redefining to match PostCard's expected prop.
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
  createdAt: string;
}

interface TimelineProps {
  posts: PostProps[];
}

export default function Timeline({ posts }: TimelineProps) {
  return (
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.posts}>
        {posts.map((post) => (
          <div key={post._id} className={styles.postWrapper}>
            <div className={`${styles.dot} ${post.author === 'UserA' ? styles.dotLeft : styles.dotRight}`}></div>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
