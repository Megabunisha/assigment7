import React, { useState, useEffect, useCallback } from 'react';
import { SidebarLeft } from '../components/common/SidebarLeft';
import { SidebarRight } from '../components/common/SidebarRight';
import { CreatePostCard } from '../components/posts/CreatePostCard';
import { PostCard } from '../components/posts/PostCard';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const FeedPage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [activeFeed, setActiveFeed] = useState('all'); // 'all' or 'following'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Tech', 'Design', 'Coding', 'Life', 'Announcements'];

  // Fetch posts from backend API
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (activeFeed === 'following') params.feed = 'following';
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;

      const data = await postService.getAllPosts(params);
      if (data && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeFeed, selectedCategory, selectedTag, showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle post created
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Handle post deleted
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  // Handle post updated
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handleScrollToCreate = () => {
    const el = document.getElementById('create-post-box');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="main-layout">
      {/* Left Sidebar */}
      <SidebarLeft onOpenCreatePost={handleScrollToCreate} />

      {/* Center Feed */}
      <section className="center-feed">
        {/* Create Post Component */}
        <CreatePostCard onPostCreated={handlePostCreated} />

        {/* Feed Filter Tabs */}
        <div className="feed-tabs">
          <button
            className={`feed-tab ${activeFeed === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveFeed('all');
              setSelectedTag('');
            }}
          >
            🔥 For You (All Posts)
          </button>
          <button
            className={`feed-tab ${activeFeed === 'following' ? 'active' : ''}`}
            onClick={() => {
              if (!isAuthenticated) {
                showToast('Please login to view posts from creators you follow!', 'info');
                return;
              }
              setActiveFeed('following');
              setSelectedTag('');
            }}
          >
            👥 Following
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedTag('');
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Tag Clear Banner */}
        {selectedTag && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--border-active)'
            }}
          >
            <span>
              Showing posts tagged with <strong style={{ color: 'var(--primary-400)' }}>#{selectedTag}</strong>
            </span>
            <button
              style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
              onClick={() => setSelectedTag('')}
            >
              Clear tag ✕
            </button>
          </div>
        )}

        {/* Posts Feed Stream */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>⚡</div>
            <p style={{ marginTop: '0.75rem' }}>Loading posts feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div
            className="create-post-card"
            style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}
          >
            <span style={{ fontSize: '2.5rem' }}>📭</span>
            <h3 style={{ marginTop: '0.75rem', color: 'var(--text-primary)' }}>No posts found</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {activeFeed === 'following'
                ? "You haven't followed any creators yet, or they haven't posted."
                : 'Be the first to share an update with the community!'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
              onTagClick={(tag) => setSelectedTag(tag)}
            />
          ))
        )}
      </section>

      {/* Right Sidebar */}
      <SidebarRight onSelectTag={(tag) => setSelectedTag(tag)} />
    </main>
  );
};
