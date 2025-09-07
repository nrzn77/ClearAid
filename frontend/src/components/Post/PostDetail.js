import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch post. It may have been removed or you may not have permission to view it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  const isAuthor = currentUser && currentUser.id === post.authorId;

  return (
    <div className="post-detail-container">
      <div className="post-navigation">
        <Link to="/" className="back-link">← Back to Posts</Link>
      </div>
      
      <article className="post-content">
        <header>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">By: {post.authorName || 'Anonymous'}</span>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>
        
        <div className="post-body">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {isAuthor && (
          <div className="post-actions">
            <Link to={`/posts/${post.id}/edit`} className="edit-button">
              Edit Post
            </Link>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;