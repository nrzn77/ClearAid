/**
 * API service for communicating with the Spring Boot backend
 */

const API_BASE_URL = 'http://localhost:8097/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ApiService = {
  /**
   * Fetch all users (admin only)
   */
  getAllUsers: async (token) => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : getAuthHeader();

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Update an existing post
   */
  updatePost: async (id, postData, token) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : getAuthHeader())
      };

      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(postData)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a post
   */
  deletePost: async (id, token) => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : getAuthHeader();

      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetch all posts
   */
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  /**
   * Fetch a post by ID
   */
  getPostById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new post
   */
  createPost: async (postData, token) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : getAuthHeader())
      };
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postData)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

    /**
     * Search posts by title with pagination
     */
    searchPostsByTitle: async (title, page = 0, size = 10, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/search?keyword=${encodeURIComponent(title)}&page=${page}&size=${size}`, {
                signal: options.signal
            });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json(); // backend returns JSON with token
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Register new user (uses /auth/signup instead of /auth/register)
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.text(); // backend returns String ("User registered successfully!")
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
};

export default ApiService;
