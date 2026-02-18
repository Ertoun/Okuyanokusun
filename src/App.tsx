import { useState, useEffect } from "react";
import Timeline from "@/components/Timeline";
import ComposeModal from "@/components/ComposeModal";
import styles from "./App.module.css";
import { Plus } from "lucide-react";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<"UserA" | "UserB" | null>(null);
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

  const handleResponse = async (postId: string, responseData: any) => {
    try {
      const res = await fetch(`/api/posts/${postId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });
      const data = await res.json();
      if (data.success) {
        // Update the posts locally to show the new response
        setPosts((prevPosts) => 
          prevPosts.map((post) => 
            post._id === postId ? data.data : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to respond to post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
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
          {currentUser ? (
            <>
              <span className={styles.welcome}>Welcome, {currentUser}</span>
              <button onClick={() => setCurrentUser(null)} className={styles.logoutBtn}>Logout</button>
              <button onClick={() => setIsModalOpen(true)} className={styles.composeBtn}>
                <Plus size={20} />
                Write
              </button>
            </>
          ) : (
            <div className={styles.loginGroup}>
              <select 
                onChange={(e) => {
                  const user = e.target.value as "UserA" | "UserB";
                  const pass = prompt(`Enter PIN for ${user}:`);
                  // Simple hardcoded check for demo - in reality use .env/db
                  if (pass === "1234") { 
                    setCurrentUser(user);
                  } else {
                    alert("Wrong PIN");
                  }
                }}
                className={styles.userSelect}
                value=""
              >
                <option value="" disabled>Login as...</option>
                <option value="UserA">UserA</option>
                <option value="UserB">UserB</option>
              </select>
            </div>
          )}
        </div>
      </header>

      <Timeline 
        posts={posts} 
        currentUser={currentUser} 
        onRespond={handleResponse}
        onDelete={handleDeletePost}
      />
      
      {currentUser && (
        <ComposeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          currentUser={currentUser}
          onSubmit={handleNewPost}
        />
      )}
    </main>
  );
}
