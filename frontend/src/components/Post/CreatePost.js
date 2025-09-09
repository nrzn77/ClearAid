import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authId: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { token, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch users if admin
  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const userData = await ApiService.getAllUsers(token);
          setUsers(userData);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to load users. Admin features may be limited.');
        }
      };
      
      fetchUsers();
    }
  }, [isAdmin, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    // Prepare post data
    const postData = {
      title: formData.title,
      post: formData.content,
      money: 0
    };
    
    // If admin and authId is selected, add it to the post data
    if (isAdmin && formData.authId) {
      postData.authId = parseInt(formData.authId);
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await ApiService.createPost(postData, token);
      navigate('/');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            disabled={loading}
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;