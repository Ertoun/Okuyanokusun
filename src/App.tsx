import { useState, useEffect } from "react";
import Timeline from "@/components/Timeline";
import ComposeModal from "@/components/ComposeModal";
import LoginModal from "@/components/LoginModal";
import styles from "./App.module.css";
import { Plus, LogIn, LogOut } from "lucide-react";
import { UserType } from "@/types/post";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
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
        setPosts((prev) => [data.data, ...prev]);
        fetchPosts(); 
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
              <span className={styles.welcome}>Hi, {currentUser}</span>
              <button onClick={() => setCurrentUser(null)} className={styles.logoutBtn}>
                <LogOut size={18} />
              </button>
              <button onClick={() => setIsModalOpen(true)} className={styles.composeBtn}>
                <Plus size={20} />
                <span>Write</span>
              </button>
            </>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className={styles.loginBtn}>
              <LogIn size={20} />
              <span>Login</span>
            </button>
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={(user) => setCurrentUser(user)}
      />
    </main>
  );
}
