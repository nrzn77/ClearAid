import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchPosts();
      return;
    }
    
    try {
      setLoading(true);
      const results = await ApiService.searchPostsByTitle(searchTerm);
      setPosts(results);
      setError(null);
    } catch (err) {
      setError('Failed to search posts. Please try again later.');
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div className="post-list-container">
      <h2>Posts</h2>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {posts.length === 0 ? (
        <div className="no-posts">No posts found.</div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">
                {post.content.length > 150 
                  ? `${post.content.substring(0, 150)}...` 
                  : post.content}
              </p>
              <div className="post-footer">
                <span className="post-author">By: {post.authorName || 'Anonymous'}</span>
                <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;