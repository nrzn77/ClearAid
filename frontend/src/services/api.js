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
   * @returns {Promise<Array>} Promise containing users
   */
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          ...getAuthHeader()
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Fetch all posts
   * @returns {Promise<Array>} Promise containing posts
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
   * @param {string} id Post ID
   * @returns {Promise<Object>} Promise containing post
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
   * @param {Object} postData Post data
   * @returns {Promise<Object>} Promise containing created post
   */
  createPost: async (postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
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
   * Search posts by title
   * @param {string} title Title to search for
   * @returns {Promise<Array>} Promise containing matching posts
   */
  searchPostsByTitle: async (title) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/search?title=${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials User credentials
   * @returns {Promise<Object>} Promise containing auth response with token
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} Promise containing registration response
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
};

export default ApiService;
