import { useState, useEffect } from "react";
import Timeline from "@/components/Timeline";
import ComposeModal from "@/components/ComposeModal";
import styles from "./App.module.css";
import { Plus } from "lucide-react";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<"UserA" | "UserB">("UserA");
  const [loading, setLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async (newPostData: any) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPostData),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update or re-fetch
        setPosts((prev) => [data.data, ...prev]);
        fetchPosts(); // to ensure consistency
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Okuyan okusun</h1>
        <div className={styles.controls}>
          <select 
            value={currentUser} 
            onChange={(e) => setCurrentUser(e.target.value as "UserA" | "UserB")}
            className={styles.userSelect}
          >
            <option value="UserA">UserA</option>
            <option value="UserB">UserB</option>
          </select>
          <button onClick={() => setIsModalOpen(true)} className={styles.composeBtn}>
            <Plus size={20} />
            Write
          </button>
        </div>
      </header>

      <Timeline posts={posts} />
      
      <ComposeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={currentUser}
        onSubmit={handleNewPost}
      />
    </main>
  );
}
