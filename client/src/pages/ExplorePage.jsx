import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarLeft } from '../components/common/SidebarLeft';
import { SidebarRight } from '../components/common/SidebarRight';
import { PostCard } from '../components/posts/PostCard';
import { postService } from '../services/postService';
import { useToast } from '../context/ToastContext';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Tech', 'Design', 'Coding', 'Life', 'Announcements'];

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory !== 'All') params.category = selectedCategory;

        const data = await postService.getAllPosts(params);
        if (data && data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplorePosts();
  }, [searchQuery, selectedCategory, showToast]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  return (
    <main className="main-layout">
      <SidebarLeft />

      <section className="center-feed">
        {/* Search Header Banner */}
        <div className="sidebar-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Explore & Discover</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Find community posts, discover top creators, and search trending technologies.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, padding: '0.75rem 1rem' }}
              placeholder="Search by keywords, tags, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="nav-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
              >
                Clear
              </button>
            )}
            <button type="submit" className="nav-btn nav-btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLoading
            ? 'Searching community posts...'
            : `Showing ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}${
                searchQuery ? ` for "${searchQuery}"` : ''
              }`}
        </div>

        {/* Results List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem' }}>🔍</div>
            <p style={{ marginTop: '0.5rem' }}>Searching...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="create-post-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🔎</span>
            <h3 style={{ marginTop: '0.5rem' }}>No results matched your search</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Try searching with different keywords or exploring popular tags like #reactjs or #nodejs.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              onPostUpdated={(updated) =>
                setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
              }
              onTagClick={(tag) => setSearchQuery(tag)}
            />
          ))
        )}
      </section>

      <SidebarRight onSelectTag={(tag) => setSearchQuery(tag)} />
    </main>
  );
};
