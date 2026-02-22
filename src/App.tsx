import { useState, useEffect } from "react";
import Timeline from "@/components/Timeline";
import ComposeModal from "@/components/ComposeModal";
import LoginModal from "@/components/LoginModal";
import MoodPicker from "@/components/MoodPicker";
import MoodBanner from "@/components/MoodBanner";
import Clock from "@/components/Clock";
import styles from "./App.module.css";
import { Plus, LogIn, LogOut, Feather } from "lucide-react";
import { UserType } from "@/types/post";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchMoods();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoods = async () => {
    try {
      const res = await fetch('/api/moods');
      const data = await res.json();
      if (data.success) setMoods(data.data);
    } catch (error) {
      console.error("Failed to fetch moods:", error);
    }
  };

  const handleMoodSelect = async (emoji: string, label: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/moods/${currentUser}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, label }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh moods from server
        fetchMoods();
      }
    } catch (error) {
      console.error("Failed to set mood:", error);
    }
  };

  const handlePostSubmit = async (postData: any) => {
    const isEditing = !!postData._id;
    const url = isEditing ? `/api/posts/${postData._id}` : '/api/posts';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.success) {
        if (isEditing) {
          setPosts((prev) => prev.map(p => p._id === postData._id ? data.data : p));
        } else {
          setPosts((prev) => [data.data, ...prev]);
        }
        setEditingPost(null);
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleResponse = async (postId: string, responseData: any) => {
    try {
      const res = await fetch(`/api/posts/${postId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => post._id === postId ? data.data : post)
        );
      }
    } catch (error) {
      console.error("Failed to respond to post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleReaction = async (postId: string, type: 'heart' | 'sad' | 'happy') => {
    try {
      const res = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => post._id === postId ? data.data : post)
        );
      }
    } catch (error) {
      console.error("Failed to react to post:", error);
    }
  };

  const currentUserMood = moods.find(m => m.user === currentUser);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Opening the diary...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          
          <h1 className={styles.title} onClick={() => window.location.href = '/'}>
            <img 
            src="/uploads/logo.jpg" 
            alt="Okuyan okusun logo" 
            className={styles.logo}
            onClick={() => window.location.href = '/'}
          />
          <span>Okuyan okusun</span>
          </h1>
        </div>
        <Clock />
        <div className={styles.controls}>
          {currentUser ? (
            <>
              <span className={styles.welcome}>Hi, {currentUser}</span>
              <button onClick={() => setCurrentUser(null)} className={styles.logoutBtn}>
                <LogOut size={18} />
              </button>
              <button
                onClick={() => setIsMoodPickerOpen(true)}
                className={styles.moodBtn}
                title="Set your mood"
              >
                {currentUserMood?.emoji || '😶'}
              </button>
              <button onClick={() => { setEditingPost(null); setIsModalOpen(true); }} className={styles.composeBtn}>
                <Feather size={20} />
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

      <MoodBanner moods={moods} />

      <Timeline
        posts={posts}
        currentUser={currentUser}
        onRespond={handleResponse}
        onDelete={handleDeletePost}
        onEdit={handleEditClick}
        onReact={handleReaction}
      />

      {currentUser && (
        <ComposeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingPost(null); }}
          currentUser={currentUser}
          onSubmit={handlePostSubmit}
          initialData={editingPost}
        />
      )}

      <MoodPicker
        isOpen={isMoodPickerOpen}
        onClose={() => setIsMoodPickerOpen(false)}
        onSelect={handleMoodSelect}
        currentEmoji={currentUserMood?.emoji}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(user) => setCurrentUser(user)}
      />
    </main>
  );
}
